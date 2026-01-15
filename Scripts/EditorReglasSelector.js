/**
 * EditorReglasSelector.js
 * Editor de Reglas con Selectores (sin Drag & Drop)
 *
 * Soporta:
 * - CRUD de Variables
 * - 8 funciones: Minimo, Maximo, Suma, Promedio, Conteo, ConteoCaracteres, ExpresionRegular, SiEntonces, CalcularEdad
 * - Anidacion de funciones
 * - Expresion logica para combinar variables
 * - Visualizacion con pills de colores
 */

// =============================================
// ESTADO GLOBAL
// =============================================
const editorState = {
    variables: {},            // { varId: { name, components: [] } }
    variableCounter: 0,       // Contador para IDs de variables
    componentCounter: 0,      // Contador para IDs de componentes
    activeVariableId: null,   // Variable actualmente seleccionada
    campos: [],               // Campos disponibles del sistema

    // Expresion logica
    logicComponents: [],

    // NUEVO: Sistema de navegacion multinivel (reemplaza functionConfig.nestedStack)
    navigationStack: {
        levels: [],           // Array de ConfigLevel objects
        currentLevel: -1      // Indice del nivel actual (-1 = sin config activa)
    },

    // NUEVO: Componentes de mini-builders por builderId
    miniBuilderComponents: {},  // { builderId: [components] }

    // NUEVO: Variable actual con configuracion abierta
    currentConfigVarId: null,

    // NUEVO: Contador para builders
    paramBuilderCounter: 0,

    // Estado de configuracion de funcion (LEGACY - se mantiene para compatibilidad)
    functionConfig: {
        active: false,
        functionName: null,
        targetVariableId: null,
        editingComponentId: null,
        nestedLevel: 0,
        nestedStack: [],
        paramValues: {}
    }
};

// =============================================
// CONSTANTES
// =============================================
const MAX_NESTING_LEVELS = 3;  // Maximo 3 niveles de anidacion

// =============================================
// FUNCIONES DE NIVEL DE CONFIGURACION
// =============================================

/**
 * Crea un nuevo nivel de configuracion para el navigation stack
 * @param {string} functionName - Nombre de la funcion
 * @param {string} parentBuilderId - ID del mini-builder padre (null para nivel raiz)
 * @param {string} functionId - ID unico de esta instancia de funcion
 * @param {number} varId - ID de la variable propietaria
 * @returns {Object} ConfigLevel object
 */
function createConfigLevel(functionName, parentBuilderId, functionId, varId) {
    return {
        functionName: functionName,
        parentBuilderId: parentBuilderId,
        functionId: functionId,
        varId: varId,
        savedHTML: null,          // HTML cacheado para restauracion
        miniBuilderStates: {}     // { builderId: [components] } de este nivel
    };
}

// =============================================
// SISTEMA DE MINI-BUILDERS (Sin Drag & Drop)
// =============================================

/**
 * Genera un mini-builder con selectores para un parametro
 * @param {string} paramId - ID del parametro (ej: 'param1')
 * @param {string} label - Etiqueta del parametro
 * @param {number} varId - ID de la variable
 * @returns {string} HTML del mini-builder
 */
function generateSelectorMiniBuilder(paramId, label, varId) {
    const levelId = editorState.navigationStack.currentLevel >= 0
        ? editorState.navigationStack.currentLevel : 0;
    const safeVarId = varId || window.currentConfigVarId || 'default';
    const builderId = `miniBuilder_var${safeVarId}_level${levelId}_${paramId}`;

    // Inicializar array de componentes si no existe
    if (!editorState.miniBuilderComponents[builderId]) {
        editorState.miniBuilderComponents[builderId] = [];
    }

    return `
        <div class="mini-builder-container" data-builder-id="${builderId}">
            <label class="mini-builder-label">${label} <span class="required">*</span></label>

            <!-- Fila de Selectores -->
            <div class="mini-builder-selectors">
                <select class="form-select form-select-sm" id="${builderId}_type"
                        onchange="onMiniBuilderTypeChange('${builderId}')">
                    <option value="field">Campo</option>
                    <option value="value">Valor</option>
                    <option value="operator">Operador</option>
                    <option value="function">Funcion</option>
                </select>
                <select class="form-select form-select-sm" id="${builderId}_item">
                    <option value="">-- Seleccione --</option>
                    ${generarOpcionesCampos()}
                </select>
                <input type="text" class="form-control form-control-sm" id="${builderId}_input"
                       placeholder="Valor..." style="display: none;">
                <button type="button" class="btn btn-primary btn-sm"
                        onclick="addToMiniBuilder('${builderId}', ${varId})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <!-- Zona de Visualizacion de Componentes -->
            <div class="mini-builder-zone" id="${builderId}">
                <div class="empty-placeholder">
                    <i class="fas fa-plus-circle"></i>
                    Agregue campos, valores o funciones
                </div>
                <div class="expression-components"></div>
            </div>
        </div>
    `;
}

/**
 * Maneja el cambio de tipo en el selector del mini-builder
 * @param {string} builderId - ID del mini-builder
 */
function onMiniBuilderTypeChange(builderId) {
    const typeSelect = document.getElementById(`${builderId}_type`);
    const itemSelect = document.getElementById(`${builderId}_item`);
    const inputField = document.getElementById(`${builderId}_input`);

    if (!typeSelect || !itemSelect) return;

    const type = typeSelect.value;

    // Limpiar opciones
    itemSelect.innerHTML = '<option value="">-- Seleccione --</option>';

    // Mostrar/ocultar input vs select
    if (type === 'value') {
        itemSelect.style.display = 'none';
        inputField.style.display = 'block';
        inputField.value = '';
        inputField.placeholder = 'Ingrese un valor...';
    } else {
        itemSelect.style.display = 'block';
        inputField.style.display = 'none';

        if (type === 'field') {
            editorState.campos.forEach(c => {
                const option = document.createElement('option');
                option.value = c.value;
                option.textContent = c.text;
                itemSelect.appendChild(option);
            });
        } else if (type === 'operator') {
            operadores.forEach(o => {
                const option = document.createElement('option');
                option.value = o.value;
                option.textContent = o.text;
                itemSelect.appendChild(option);
            });
        } else if (type === 'function') {
            funciones.forEach(f => {
                const option = document.createElement('option');
                option.value = f.value;
                option.textContent = f.text;
                itemSelect.appendChild(option);
            });
        }
    }
}

/**
 * Agrega un componente al mini-builder
 * @param {string} builderId - ID del mini-builder
 * @param {number} varId - ID de la variable
 */
function addToMiniBuilder(builderId, varId) {
    const typeSelect = document.getElementById(`${builderId}_type`);
    const itemSelect = document.getElementById(`${builderId}_item`);
    const inputField = document.getElementById(`${builderId}_input`);

    if (!typeSelect) return;

    const type = typeSelect.value;
    let value = '';

    // Obtener valor segun tipo
    if (type === 'value') {
        value = inputField.value.trim();
        if (!value) {
            alert('Por favor ingrese un valor');
            return;
        }
    } else {
        value = itemSelect.value;
        if (!value) {
            alert('Por favor seleccione un item');
            return;
        }
    }

    // Inicializar array si no existe
    if (!editorState.miniBuilderComponents[builderId]) {
        editorState.miniBuilderComponents[builderId] = [];
    }

    // Manejar tipo funcion - abre configuracion anidada
    if (type === 'function') {
        const functionId = 'func_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // Agregar componente placeholder
        editorState.miniBuilderComponents[builderId].push({
            type: 'function',
            value: value,
            functionId: functionId,
            configured: false,
            fullExpression: null,
            params: [],
            html: `<i class="fas fa-magic"></i><span class="expr-value">${value}(...)</span>`
        });

        renderMiniBuilder(builderId);

        // Abrir configuracion anidada despues de un pequeno delay
        setTimeout(() => {
            openNestedFunctionConfig(value, builderId, functionId, varId);
        }, 100);

        // Resetear selector
        itemSelect.value = '';
        return;
    }

    // Crear componente normal
    const component = createComponentFromSelection(type, value);
    editorState.miniBuilderComponents[builderId].push(component);

    renderMiniBuilder(builderId);
    updateCurrentLevelPreview();

    // Resetear selectores
    if (type === 'value') {
        inputField.value = '';
    } else {
        itemSelect.value = '';
    }
}

/**
 * Crea un objeto componente desde la seleccion
 * @param {string} type - Tipo de componente
 * @param {string} value - Valor seleccionado
 * @returns {Object} Componente
 */
function createComponentFromSelection(type, value) {
    switch (type) {
        case 'field':
            const fieldName = value.replace(/[\[\]]/g, '');
            return {
                type: 'field',
                value: value.startsWith('[') ? value : `[${value}]`,
                html: `<i class="fas fa-database"></i><span class="expr-value">${fieldName}</span>`
            };
        case 'value':
            // Determinar si es numero o texto
            const isNumber = /^-?\d+(\.\d+)?$/.test(value);
            const displayValue = isNumber ? value : `"${value}"`;
            return {
                type: 'value',
                value: displayValue,
                html: `<span class="expr-value">${escapeHtml(displayValue)}</span>`
            };
        case 'operator':
            return {
                type: 'operator',
                value: value,
                html: `<span class="expr-value">${escapeHtml(value)}</span>`
            };
        default:
            return { type: 'unknown', value: value, html: escapeHtml(value) };
    }
}

/**
 * Renderiza los componentes del mini-builder
 * @param {string} builderId - ID del mini-builder
 */
function renderMiniBuilder(builderId) {
    const builder = document.getElementById(builderId);
    if (!builder) return;

    const components = editorState.miniBuilderComponents[builderId] || [];

    // Toggle placeholder vacio
    const emptyDiv = builder.querySelector('.empty-placeholder');
    if (emptyDiv) {
        emptyDiv.style.display = components.length > 0 ? 'none' : 'flex';
    }

    // Obtener o crear contenedor de componentes
    let container = builder.querySelector('.expression-components');
    if (!container) {
        container = document.createElement('div');
        container.className = 'expression-components';
        builder.appendChild(container);
    }

    // Renderizar pills de componentes
    container.innerHTML = components.map((comp, index) => {
        let pillHtml = `<div class="mini-component pill pill-${comp.type}">`;
        pillHtml += comp.html;

        // Boton de configurar para funciones
        if (comp.type === 'function') {
            const configIcon = comp.configured ? 'fa-check-circle' : 'fa-cog';
            const configColor = comp.configured ? '#10b981' : '#f59e0b';

            pillHtml += `
                <button type="button" class="btn-mini-config"
                        onclick="event.stopPropagation(); editNestedFunction('${builderId}', ${index})"
                        title="${comp.configured ? 'Reconfigurar' : 'Configurar'}"
                        style="color: ${configColor};">
                    <i class="fas ${configIcon}"></i>
                </button>
            `;
        }

        // Boton de eliminar
        pillHtml += `
            <button type="button" class="btn-mini-delete"
                    onclick="event.stopPropagation(); removeMiniBuilderComponent('${builderId}', ${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>`;

        return pillHtml;
    }).join('');

    // Agregar clase si tiene componentes
    builder.classList.toggle('has-components', components.length > 0);

    updateCurrentLevelPreview();
}

/**
 * Elimina un componente del mini-builder con limpieza de niveles anidados
 * @param {string} builderId - ID del mini-builder
 * @param {number} index - Indice del componente
 */
function removeMiniBuilderComponent(builderId, index) {
    const components = editorState.miniBuilderComponents[builderId];
    if (!components || index < 0 || index >= components.length) return;

    const component = components[index];

    // Si es una funcion, limpiar su nivel anidado
    if (component.type === 'function' && component.functionId) {
        const levelIndex = editorState.navigationStack.levels.findIndex(
            level => level.functionId === component.functionId && level.parentBuilderId === builderId
        );

        if (levelIndex !== -1) {
            // Limpiar mini-builders del nivel anidado
            const levelToDelete = editorState.navigationStack.levels[levelIndex];
            Object.keys(levelToDelete.miniBuilderStates).forEach(nestedBuilderId => {
                delete editorState.miniBuilderComponents[nestedBuilderId];
            });

            // Eliminar nivel del stack
            editorState.navigationStack.levels.splice(levelIndex, 1);

            // Ajustar nivel actual si es necesario
            if (editorState.navigationStack.currentLevel >= levelIndex) {
                editorState.navigationStack.currentLevel = Math.max(0, editorState.navigationStack.currentLevel - 1);
            }

            // Actualizar breadcrumb
            const currentLevel = editorState.navigationStack.levels[editorState.navigationStack.currentLevel];
            if (currentLevel) {
                const breadcrumb = document.getElementById(`functionBreadcrumb_${currentLevel.varId}`);
                if (breadcrumb) {
                    updateNavigationBreadcrumb(breadcrumb, currentLevel.varId);
                }
            }
        }
    }

    // Eliminar componente
    components.splice(index, 1);

    // Re-renderizar
    renderMiniBuilder(builderId);
}

/**
 * Edita una funcion anidada existente
 * @param {string} builderId - ID del mini-builder
 * @param {number} index - Indice del componente
 */
function editNestedFunction(builderId, index) {
    const components = editorState.miniBuilderComponents[builderId];
    if (!components || !components[index]) return;

    const component = components[index];
    if (component.type !== 'function') return;

    const varId = editorState.currentConfigVarId;
    openNestedFunctionConfig(component.value, builderId, component.functionId, varId);
}

// =============================================
// SISTEMA DE NAVEGACION MULTINIVEL
// =============================================

/**
 * Abre la configuracion de una funcion anidada
 * @param {string} functionName - Nombre de la funcion
 * @param {string} parentBuilderId - ID del mini-builder padre
 * @param {string} functionId - ID unico de la funcion
 * @param {number} varId - ID de la variable
 */
function openNestedFunctionConfig(functionName, parentBuilderId, functionId, varId) {
    console.log('Abriendo configuracion anidada:', functionName, 'nivel actual:', editorState.navigationStack.currentLevel);

    const targetVarId = varId || editorState.currentConfigVarId;
    if (!targetVarId) {
        console.error('No hay variable de destino');
        return;
    }

    // Validacion: Maximo 3 niveles de anidacion
    if (editorState.navigationStack.levels.length >= MAX_NESTING_LEVELS) {
        alert(`Maximo ${MAX_NESTING_LEVELS} niveles de anidacion permitidos`);
        return;
    }

    // Guardar estado del nivel actual
    saveCurrentLevelState(targetVarId);

    // Verificar si el nivel ya existe (para re-edicion)
    const existingIndex = editorState.navigationStack.levels.findIndex(
        level => level.functionId === functionId && level.parentBuilderId === parentBuilderId
    );

    if (existingIndex !== -1) {
        // Navegar al nivel existente
        navigateToLevel(existingIndex, targetVarId);
        return;
    }

    // Crear nuevo nivel
    const newLevel = createConfigLevel(functionName, parentBuilderId, functionId, targetVarId);
    editorState.navigationStack.levels.push(newLevel);
    editorState.navigationStack.currentLevel = editorState.navigationStack.levels.length - 1;

    console.log('Nuevo nivel creado:', editorState.navigationStack.currentLevel);

    // Renderizar el nuevo nivel
    renderCurrentConfigLevel(targetVarId);
}

/**
 * Guarda el estado del nivel actual antes de navegar
 * @param {number} varId - ID de la variable
 */
function saveCurrentLevelState(varId) {
    if (editorState.navigationStack.currentLevel < 0) return;

    const currentLevel = editorState.navigationStack.levels[editorState.navigationStack.currentLevel];
    if (!currentLevel) return;

    const body = document.getElementById(`functionConfigBody_${varId}`);
    if (!body) return;

    // Guardar HTML
    currentLevel.savedHTML = body.innerHTML;

    // Guardar estados de mini-builders de este nivel
    const levelPrefix = `_level${editorState.navigationStack.currentLevel}_`;
    const builders = body.querySelectorAll('.mini-builder-zone');

    builders.forEach(builder => {
        const builderId = builder.id;
        if (builderId.includes(levelPrefix) && editorState.miniBuilderComponents[builderId]) {
            currentLevel.miniBuilderStates[builderId] = JSON.parse(
                JSON.stringify(editorState.miniBuilderComponents[builderId])
            );
        }
    });

    console.log('Estado guardado para nivel:', editorState.navigationStack.currentLevel);
}

/**
 * Renderiza el formulario de configuracion del nivel actual
 * @param {number} varId - ID de la variable
 */
function renderCurrentConfigLevel(varId) {
    const currentLevel = editorState.navigationStack.levels[editorState.navigationStack.currentLevel];
    if (!currentLevel) return;

    const body = document.getElementById(`functionConfigBody_${varId}`);
    const title = document.getElementById(`functionConfigTitle_${varId}`);
    const breadcrumb = document.getElementById(`functionBreadcrumb_${varId}`);

    if (!body || !title) return;

    // Actualizar titulo con indicador de nivel
    const levelIndicator = editorState.navigationStack.currentLevel > 0
        ? ` (Nivel ${editorState.navigationStack.currentLevel + 1})`
        : '';
    title.textContent = `Configurar: ${currentLevel.functionName}${levelIndicator}`;

    // Actualizar breadcrumb
    updateNavigationBreadcrumb(breadcrumb, varId);

    // Restaurar HTML guardado o generar nuevo formulario
    if (currentLevel.savedHTML) {
        body.innerHTML = currentLevel.savedHTML;

        // Restaurar estados de mini-builders
        Object.keys(currentLevel.miniBuilderStates).forEach(builderId => {
            editorState.miniBuilderComponents[builderId] = JSON.parse(
                JSON.stringify(currentLevel.miniBuilderStates[builderId])
            );
            renderMiniBuilder(builderId);
        });
    } else {
        // Generar nuevo formulario con mini-builders
        body.innerHTML = generarFormularioConMiniBuilders(currentLevel.functionName, varId);
    }

    // Scroll al panel
    const panel = document.getElementById(`functionConfigPanel_${varId}`);
    if (panel) {
        setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }

    updateCurrentLevelPreview();
}

/**
 * Navega a un nivel especifico del stack
 * @param {number} targetLevel - Indice del nivel destino
 * @param {number} varId - ID de la variable
 */
function navigateToLevel(targetLevel, varId) {
    if (targetLevel < 0 || targetLevel >= editorState.navigationStack.levels.length) return;
    if (targetLevel === editorState.navigationStack.currentLevel) return;

    const targetVarId = varId || editorState.currentConfigVarId;

    console.log('Navegando de nivel', editorState.navigationStack.currentLevel, 'a nivel', targetLevel);

    // Guardar estado actual
    saveCurrentLevelState(targetVarId);

    // Si navegamos hacia arriba (al padre), actualizar expresion del hijo
    if (targetLevel < editorState.navigationStack.currentLevel) {
        updateChildExpressionInParent(targetLevel);
    }

    // Cambiar nivel
    editorState.navigationStack.currentLevel = targetLevel;

    // Renderizar nivel destino
    renderCurrentConfigLevel(targetVarId);
}

/**
 * Actualiza la expresion del nivel hijo en el componente del padre
 * @param {number} targetLevel - Nivel padre destino
 */
function updateChildExpressionInParent(targetLevel) {
    const childLevel = editorState.navigationStack.levels[editorState.navigationStack.currentLevel];
    if (!childLevel || !childLevel.parentBuilderId || !childLevel.functionId) return;

    console.log('Actualizando expresion del hijo en padre:', childLevel.functionName);

    // Construir expresion del nivel hijo
    const childExpression = buildLevelExpression(childLevel);
    console.log('Expresion construida:', childExpression);

    // Actualizar el componente en el padre
    const parentComponents = editorState.miniBuilderComponents[childLevel.parentBuilderId];
    if (parentComponents) {
        const functionComp = parentComponents.find(c => c.functionId === childLevel.functionId);
        if (functionComp) {
            functionComp.fullExpression = childExpression;
            functionComp.configured = true;

            // Actualizar HTML del componente
            const shortExpr = childExpression.length > 40
                ? childExpression.substring(0, 37) + '...'
                : childExpression;
            functionComp.html = `<i class="fas fa-magic"></i><span class="expr-value">${escapeHtml(shortExpr)}</span>`;

            console.log('Componente actualizado:', functionComp);

            // Actualizar estado guardado del nivel padre
            const parentLevel = editorState.navigationStack.levels[targetLevel];
            if (parentLevel && parentLevel.miniBuilderStates[childLevel.parentBuilderId]) {
                const savedFunctionComp = parentLevel.miniBuilderStates[childLevel.parentBuilderId]
                    .find(c => c.functionId === childLevel.functionId);
                if (savedFunctionComp) {
                    savedFunctionComp.fullExpression = childExpression;
                    savedFunctionComp.configured = true;
                    savedFunctionComp.html = functionComp.html;
                }
                // Invalidar HTML para forzar re-generacion
                parentLevel.savedHTML = null;
            }
        }
    }
}

/**
 * Actualiza el breadcrumb de navegacion
 * @param {Element} breadcrumbEl - Elemento del breadcrumb
 * @param {number} varId - ID de la variable
 */
function updateNavigationBreadcrumb(breadcrumbEl, varId) {
    if (!breadcrumbEl) return;

    if (editorState.navigationStack.levels.length <= 1) {
        breadcrumbEl.style.display = 'none';
        return;
    }

    breadcrumbEl.style.display = 'block';

    let html = '<nav aria-label="breadcrumb"><ol class="breadcrumb mb-0">';

    editorState.navigationStack.levels.forEach((level, index) => {
        const isLast = index === editorState.navigationStack.currentLevel;

        if (isLast) {
            html += `<li class="breadcrumb-item active" aria-current="page">${escapeHtml(level.functionName)}</li>`;
        } else {
            html += `
                <li class="breadcrumb-item">
                    <a href="#" onclick="event.preventDefault(); navigateToLevel(${index}, ${varId});">
                        ${escapeHtml(level.functionName)}
                    </a>
                </li>
            `;
        }
    });

    html += '</ol></nav>';
    breadcrumbEl.innerHTML = html;
}

// =============================================
// CONSTRUCCION DE EXPRESIONES
// =============================================

/**
 * Construye la expresion completa de un nivel
 * @param {Object} level - Nivel de configuracion
 * @returns {string} Expresion en formato #Funcion(params)#
 */
function buildLevelExpression(level) {
    let params = [];

    // Recopilar de todos los mini-builders de este nivel
    // Usar miniBuilderStates si esta guardado, o miniBuilderComponents si es el nivel actual
    const levelIndex = editorState.navigationStack.levels.indexOf(level);
    const isCurrentLevel = levelIndex === editorState.navigationStack.currentLevel;

    if (isCurrentLevel) {
        // Usar estado actual
        const levelPrefix = `_level${levelIndex}_`;
        Object.keys(editorState.miniBuilderComponents).forEach(builderId => {
            if (builderId.includes(levelPrefix)) {
                const components = editorState.miniBuilderComponents[builderId];
                if (components && components.length > 0) {
                    params.push(buildComponentsExpression(components));
                }
            }
        });
    } else {
        // Usar estado guardado
        Object.keys(level.miniBuilderStates).forEach(builderId => {
            const components = level.miniBuilderStates[builderId];
            if (components && components.length > 0) {
                params.push(buildComponentsExpression(components));
            }
        });
    }

    const paramsText = params.filter(p => p && p.trim() !== '').join(',');
    return `#${level.functionName}(${paramsText})#`;
}

/**
 * Construye una expresion desde un array de componentes
 * @param {Array} components - Array de componentes
 * @returns {string} Expresion combinada
 */
function buildComponentsExpression(components) {
    return components.map(comp => {
        switch (comp.type) {
            case 'field':
                return comp.value.startsWith('[') ? comp.value : `[${comp.value}]`;
            case 'operator':
                return comp.value;
            case 'value':
                return comp.value;
            case 'function':
                if (comp.configured && comp.fullExpression) {
                    return comp.fullExpression;
                }
                return `#${comp.value}(...)#`;
            default:
                return comp.value || '';
        }
    }).join(' ');
}

/**
 * Actualiza la vista previa del nivel actual
 */
function updateCurrentLevelPreview() {
    if (editorState.navigationStack.currentLevel < 0) return;

    const currentLevel = editorState.navigationStack.levels[editorState.navigationStack.currentLevel];
    if (!currentLevel) return;

    const previewEl = document.getElementById(`levelPreview_${currentLevel.varId}`);
    if (!previewEl) return;

    // Construir expresion temporal del nivel actual
    const expression = buildLevelExpression(currentLevel);
    previewEl.textContent = expression;
}

/**
 * Genera el formulario de funcion usando mini-builders
 * @param {string} functionName - Nombre de la funcion
 * @param {number} varId - ID de la variable
 * @returns {string} HTML del formulario
 */
function generarFormularioConMiniBuilders(functionName, varId) {
    const funcConfig = funciones.find(f => f.value === functionName);
    if (!funcConfig) {
        return '<div class="alert alert-warning">Funcion no encontrada</div>';
    }

    let html = '<div class="params-container-mini">';

    // Determinar numero de parametros
    const numParams = funcConfig.params === 'N' ? funcConfig.minParams : funcConfig.params;

    for (let i = 0; i < numParams; i++) {
        const label = funcConfig.params === 'N'
            ? `${funcConfig.labels[0]} ${i + 1}`
            : funcConfig.labels[i];

        html += generateSelectorMiniBuilder(`param${i + 1}`, label, varId);
    }

    // Boton para agregar mas parametros en funciones N-arias
    if (funcConfig.params === 'N') {
        html += `
            <div class="add-param-container">
                <button type="button" class="btn btn-outline-secondary btn-sm"
                        onclick="agregarParametroMiniBuilder('${functionName}', ${varId})">
                    <i class="fas fa-plus"></i> Agregar otro valor
                </button>
            </div>
        `;
    }

    html += '</div>';

    // Seccion de vista previa
    html += `
        <div class="current-level-preview">
            <label><i class="fas fa-eye"></i> Vista previa:</label>
            <div class="preview-code" id="levelPreview_${varId}">
                #${functionName}()#
            </div>
        </div>
    `;

    return html;
}

/**
 * Agrega un parametro extra para funciones N-arias
 * @param {string} functionName - Nombre de la funcion
 * @param {number} varId - ID de la variable
 */
function agregarParametroMiniBuilder(functionName, varId) {
    const funcConfig = funciones.find(f => f.value === functionName);
    if (!funcConfig || funcConfig.params !== 'N') return;

    const container = document.querySelector(`#functionConfigBody_${varId} .params-container-mini`);
    if (!container) return;

    // Contar parametros existentes
    const existingParams = container.querySelectorAll('.mini-builder-container').length;
    const newIndex = existingParams + 1;
    const label = `${funcConfig.labels[0]} ${newIndex}`;

    // Crear nuevo mini-builder
    const newParamHtml = generateSelectorMiniBuilder(`param${newIndex}`, label, varId);

    // Insertar antes del boton de agregar
    const addButton = container.querySelector('.add-param-container');
    if (addButton) {
        addButton.insertAdjacentHTML('beforebegin', newParamHtml);
    } else {
        container.insertAdjacentHTML('beforeend', newParamHtml);
    }

    updateCurrentLevelPreview();
}

// =============================================
// DATOS DE CONFIGURACION
// =============================================
const operadores = [
    { value: '==', text: 'Igual a (==)' },
    { value: '!=', text: 'Diferente de (!=)' },
    { value: '>', text: 'Mayor que (>)' },
    { value: '<', text: 'Menor que (<)' },
    { value: '>=', text: 'Mayor o igual (>=)' },
    { value: '<=', text: 'Menor o igual (<=)' },
    { value: 'LIKE', text: 'Contiene (LIKE)' },
    { value: 'NOT LIKE', text: 'No contiene (NOT LIKE)' },
    { value: 'IN', text: 'Esta en (IN)' },
    { value: 'NOT IN', text: 'No esta en (NOT IN)' },
    { value: 'BETWEEN', text: 'Entre (BETWEEN)' }
];

const funciones = [
    { value: 'Minimo', text: 'Minimo', params: 2, labels: ['Valor 1', 'Valor 2'] },
    { value: 'Maximo', text: 'Maximo', params: 2, labels: ['Valor 1', 'Valor 2'] },
    { value: 'Suma', text: 'Suma', params: 'N', labels: ['Valor'], minParams: 2 },
    { value: 'Promedio', text: 'Promedio', params: 'N', labels: ['Valor'], minParams: 2 },
    { value: 'Conteo', text: 'Conteo', params: 'N', labels: ['Valor'], minParams: 1 },
    { value: 'ConteoCaracteres', text: 'Conteo de Caracteres', params: 1, labels: ['Texto'] },
    { value: 'ExpresionRegular', text: 'Expresion Regular', params: 2, labels: ['Patron', 'Texto'] },
    { value: 'SiEntonces', text: 'Si Entonces', params: 3, labels: ['Condicion', 'Valor si Verdadero', 'Valor si Falso'] },
    { value: 'CalcularEdad', text: 'Calcular Edad', params: 1, labels: ['Fecha de Nacimiento'] }
];

// =============================================
// INICIALIZACION
// =============================================
function initEditor() {
    console.log('Inicializando Editor de Reglas con Selectores...');
    cargarCampos();
}

/**
 * Carga los campos disponibles desde el servidor
 */
function cargarCampos() {
    if (typeof PageMethods !== 'undefined' && PageMethods.ObtenerCampos) {
        PageMethods.ObtenerCampos(function(result) {
            if (result.success) {
                editorState.campos = result.data;
            } else {
                console.error('Error al cargar campos:', result.message);
                usarCamposEjemplo();
            }
        }, function(error) {
            console.error('Error de conexion:', error);
            usarCamposEjemplo();
        });
    } else {
        usarCamposEjemplo();
    }
}

function usarCamposEjemplo() {
    editorState.campos = [
        { value: '[Nombre]', text: 'Nombre', tipo: 'texto' },
        { value: '[Apellido]', text: 'Apellido', tipo: 'texto' },
        { value: '[Edad]', text: 'Edad', tipo: 'numero' },
        { value: '[FechaNacimiento]', text: 'Fecha Nacimiento', tipo: 'fecha' },
        { value: '[Salario]', text: 'Salario', tipo: 'numero' },
        { value: '[Email]', text: 'Email', tipo: 'texto' },
        { value: '[Telefono]', text: 'Telefono', tipo: 'texto' },
        { value: '[CantidadHijos]', text: 'Cantidad Hijos', tipo: 'numero' },
        { value: '[Activo]', text: 'Activo', tipo: 'booleano' }
    ];
}

// =============================================
// CRUD DE VARIABLES
// =============================================

/**
 * Agrega una nueva variable con nombre editable inline
 */
function agregarVariable() {
    const varId = 'var_' + (++editorState.variableCounter);
    const nombreDefault = 'Variable_' + editorState.variableCounter;

    editorState.variables[varId] = {
        name: nombreDefault,
        components: []
    };

    renderVariables();
    setActiveVariable(varId);
    updateVariablesCount();
    actualizarSelectVariables();

    // Activar modo edición del nombre automáticamente
    setTimeout(() => {
        editarNombreVariable(varId);
    }, 50);
}

/**
 * Elimina una variable
 */
function eliminarVariable(varId) {
    if (!confirm('¿Esta seguro de eliminar esta variable?')) return;

    delete editorState.variables[varId];

    // Limpiar expresion logica de referencias a esta variable
    editorState.logicComponents = editorState.logicComponents.filter(c =>
        c.type !== 'variable' || c.value !== varId
    );

    if (editorState.activeVariableId === varId) {
        editorState.activeVariableId = null;
    }

    renderVariables();
    renderLogicExpression();
    updateVariablesCount();
    actualizarSelectVariables(); // Actualizar el select de expresión lógica
}

/**
 * Inicia la edicion del nombre de una variable
 */
function editarNombreVariable(varId) {
    const nameSpan = document.getElementById(`varName_${varId}`);
    const currentName = editorState.variables[varId].name;

    nameSpan.innerHTML = `
        <input type="text" class="variable-name-input" id="varNameInput_${varId}"
               value="${escapeHtml(currentName)}"
               onblur="guardarNombreVariable('${varId}')"
               onkeypress="if(event.key==='Enter') this.blur()">
    `;

    document.getElementById(`varNameInput_${varId}`).focus();
}

/**
 * Guarda el nombre de una variable
 */
function guardarNombreVariable(varId) {
    const input = document.getElementById(`varNameInput_${varId}`);
    if (!input) return;

    const newName = input.value.trim() || 'Variable_' + varId.split('_')[1];

    // Verificar si ya existe una variable con ese nombre (excluyendo la actual)
    const existe = Object.entries(editorState.variables).some(([id, v]) =>
        id !== varId && v.name.toLowerCase() === newName.toLowerCase()
    );

    if (existe) {
        input.classList.add('is-invalid');
        input.focus();
        mostrarErrorVariable(varId, 'Ya existe una variable con ese nombre');
        return;
    }

    input.classList.remove('is-invalid');
    editorState.variables[varId].name = newName;

    renderVariables();
    renderLogicExpression();
    actualizarSelectVariables();
}

/**
 * Muestra un mensaje de error para una variable
 */
function mostrarErrorVariable(varId, mensaje) {
    const input = document.getElementById(`varNameInput_${varId}`);
    if (!input) return;

    // Crear o actualizar mensaje de error
    let errorDiv = input.parentElement.querySelector('.variable-error-msg');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'variable-error-msg text-danger small mt-1';
        input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = mensaje;

    // Remover después de 3 segundos
    setTimeout(() => {
        if (errorDiv) errorDiv.remove();
        input.classList.remove('is-invalid');
    }, 3000);
}

/**
 * Establece la variable activa
 */
function setActiveVariable(varId) {
    editorState.activeVariableId = varId;

    // Actualizar UI
    document.querySelectorAll('.variable-card').forEach(card => {
        card.classList.remove('active');
    });

    const activeCard = document.getElementById(`card_${varId}`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
}

/**
 * Colapsa o expande una variable
 */
function toggleCollapseVariable(varId) {
    const variable = editorState.variables[varId];
    variable.collapsed = !variable.collapsed;

    const card = document.getElementById(`card_${varId}`);
    if (card) {
        card.classList.toggle('collapsed', variable.collapsed);

        // Actualizar icono
        const icon = card.querySelector('.btn-collapse i');
        if (icon) {
            icon.className = `fas fa-chevron-${variable.collapsed ? 'right' : 'down'}`;
        }

        // Actualizar preview cuando está colapsado
        const nameContainer = card.querySelector('.variable-name-container');
        const existingPreview = nameContainer.querySelector('.variable-preview-collapsed');

        if (variable.collapsed) {
            const expression = buildVariableExpression(varId);
            if (expression && !existingPreview) {
                const preview = document.createElement('span');
                preview.className = 'variable-preview-collapsed';
                preview.textContent = expression.substring(0, 50) + (expression.length > 50 ? '...' : '');
                nameContainer.appendChild(preview);
            }
        } else if (existingPreview) {
            existingPreview.remove();
        }
    }
}

/**
 * Colapsa todas las variables
 */
function colapsarTodasVariables() {
    Object.keys(editorState.variables).forEach(varId => {
        editorState.variables[varId].collapsed = true;
    });
    renderVariables();
}

/**
 * Expande todas las variables
 */
function expandirTodasVariables() {
    Object.keys(editorState.variables).forEach(varId => {
        editorState.variables[varId].collapsed = false;
    });
    renderVariables();
}

/**
 * Actualiza el contador de variables
 */
function updateVariablesCount() {
    const count = Object.keys(editorState.variables).length;
    document.getElementById('variablesCount').textContent = count;
}

// =============================================
// RENDERIZADO DE VARIABLES
// =============================================

/**
 * Renderiza todas las variables
 */
function renderVariables() {
    const container = document.getElementById('variablesContainer');
    const noMessage = document.getElementById('noVariablesMessage');
    const varIds = Object.keys(editorState.variables);

    if (varIds.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4" id="noVariablesMessage">
                <i class="fas fa-info-circle fa-2x mb-2 d-block"></i>
                No hay variables. Haga clic en "Nueva Variable" para comenzar.
            </div>
        `;
        return;
    }

    container.innerHTML = varIds.map(varId => renderVariableCard(varId)).join('');
}

/**
 * Renderiza una tarjeta de variable
 */
function renderVariableCard(varId) {
    const variable = editorState.variables[varId];
    const isActive = editorState.activeVariableId === varId;
    const expression = buildVariableExpression(varId);
    const isCollapsed = variable.collapsed === true;

    return `
        <div class="variable-card ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}" id="card_${varId}" onclick="setActiveVariable('${varId}')">
            <div class="variable-card-header">
                <button type="button" class="btn-collapse" onclick="event.stopPropagation(); toggleCollapseVariable('${varId}')" title="${isCollapsed ? 'Expandir' : 'Colapsar'}">
                    <i class="fas fa-chevron-${isCollapsed ? 'right' : 'down'}"></i>
                </button>
                <div class="variable-name-container">
                    <div class="variable-icon">
                        <i class="fas fa-cube"></i>
                    </div>
                    <span class="variable-name" id="varName_${varId}" ondblclick="editarNombreVariable('${varId}')">
                        ${escapeHtml(variable.name)}
                    </span>
                    ${isCollapsed && expression ? `<span class="variable-preview-collapsed">${escapeHtml(expression.substring(0, 50))}${expression.length > 50 ? '...' : ''}</span>` : ''}
                </div>
                <div class="variable-actions">
                    <button type="button" class="btn btn-outline-primary btn-sm" onclick="event.stopPropagation(); editarNombreVariable('${varId}')" title="Renombrar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="event.stopPropagation(); eliminarVariable('${varId}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="variable-card-body">
                <!-- Selectores -->
                <div class="variable-selectors">
                    <select class="form-select form-select-sm" id="typeSelect_${varId}" onchange="onTypeChange('${varId}')">
                        <option value="field">Campo</option>
                        <option value="function">Funcion</option>
                    </select>
                    <select class="form-select form-select-sm" id="itemSelect_${varId}">
                        <option value="">-- Seleccione --</option>
                        ${generarOpcionesCampos()}
                    </select>
                    <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation(); agregarComponenteAVariable('${varId}')">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>

                <!-- Zona de construccion -->
                <div class="variable-build-zone ${variable.components.length === 0 ? 'empty' : ''}" id="buildZone_${varId}">
                    ${variable.components.length === 0 ?
                        '<span>Agregue componentes para construir la expresion</span>' :
                        variable.components.map(c => createPillHtml(c, varId)).join('')
                    }
                </div>

                <!-- Panel de configuracion de funcion (inline) -->
                <div class="function-config-panel" id="functionConfigPanel_${varId}">
                    <div class="function-config-header">
                        <div class="function-config-title">
                            <i class="fas fa-cog"></i>
                            <span id="functionConfigTitle_${varId}">Configurar Funcion</span>
                        </div>
                        <button type="button" class="function-config-close" onclick="event.stopPropagation(); cancelarFuncion('${varId}')" title="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="function-config-breadcrumb" id="functionBreadcrumb_${varId}"></div>
                    <div class="function-config-body" id="functionConfigBody_${varId}">
                        <!-- Parametros generados dinamicamente -->
                    </div>
                    <div class="function-config-footer">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); cancelarFuncion('${varId}')">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="button" class="btn btn-success btn-sm" onclick="event.stopPropagation(); aceptarFuncion('${varId}')">
                            <i class="fas fa-check"></i> Aceptar
                        </button>
                    </div>
                </div>
            </div>

            <div class="variable-card-footer">
                <div class="variable-expression-preview" id="preview_${varId}">${expression || ''}</div>
            </div>
        </div>
    `;
}

/**
 * Cuando cambia el tipo de selector en una variable
 */
function onTypeChange(varId) {
    const typeSelect = document.getElementById(`typeSelect_${varId}`);
    const itemSelect = document.getElementById(`itemSelect_${varId}`);
    const type = typeSelect.value;

    // Limpiar y actualizar opciones
    itemSelect.innerHTML = '<option value="">-- Seleccione --</option>';

    let items = [];
    if (type === 'field') {
        items = editorState.campos.map(c => ({ value: c.value, text: c.text }));
    } else if (type === 'function') {
        items = funciones.map(f => ({ value: f.value, text: f.text }));
    }

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.text;
        itemSelect.appendChild(option);
    });
}

/**
 * Genera opciones de campos para un select
 */
function generarOpcionesCampos() {
    return editorState.campos.map(c =>
        `<option value="${c.value}">${c.text}</option>`
    ).join('');
}

// =============================================
// COMPONENTES DE VARIABLE
// =============================================

/**
 * Agrega un componente a una variable
 */
function agregarComponenteAVariable(varId) {
    const typeSelect = document.getElementById(`typeSelect_${varId}`);
    const itemSelect = document.getElementById(`itemSelect_${varId}`);
    const type = typeSelect.value;

    const value = itemSelect.value;
    if (!value) {
        alert('Por favor seleccione un item');
        return;
    }

    // Si es función, abrir el configurador
    if (type === 'function') {
        abrirConfiguradorFuncion(value, varId);
        return;
    }

    // Para campos
    const displayText = value.replace('[', '').replace(']', '');

    // Crear componente
    const component = {
        id: 'comp_' + (++editorState.componentCounter),
        type: type,
        value: value,
        displayText: displayText,
        metadata: {}
    };

    editorState.variables[varId].components.push(component);
    renderVariableCard_Update(varId);
}

/**
 * Elimina un componente de una variable
 */
function eliminarComponenteDeVariable(compId, varId) {
    event.stopPropagation();
    const variable = editorState.variables[varId];
    const index = variable.components.findIndex(c => c.id === compId);
    if (index !== -1) {
        variable.components.splice(index, 1);
        renderVariableCard_Update(varId);
    }
}

/**
 * Edita un componente de una variable
 */
function editarComponenteDeVariable(compId, varId) {
    event.stopPropagation();
    const variable = editorState.variables[varId];
    const component = variable.components.find(c => c.id === compId);

    if (!component) return;

    if (component.type === 'function') {
        editorState.functionConfig.editingComponentId = compId;
        abrirConfiguradorFuncion(component.metadata.functionName, varId, component.metadata.params);
    } else {
        const nuevoValor = prompt('Editar valor:', component.displayText);
        if (nuevoValor !== null && nuevoValor.trim() !== '') {
            component.displayText = nuevoValor.trim();
            if (component.type === 'field') {
                component.value = `[${nuevoValor}]`;
            } else {
                component.value = nuevoValor;
            }
            renderVariableCard_Update(varId);
        }
    }
}

/**
 * Actualiza solo la zona de construccion y preview de una variable
 */
function renderVariableCard_Update(varId) {
    const variable = editorState.variables[varId];
    const buildZone = document.getElementById(`buildZone_${varId}`);
    const preview = document.getElementById(`preview_${varId}`);

    if (variable.components.length === 0) {
        buildZone.className = 'variable-build-zone empty';
        buildZone.innerHTML = '<span>Agregue componentes para construir la expresion</span>';
    } else {
        buildZone.className = 'variable-build-zone';
        buildZone.innerHTML = variable.components.map(c => createPillHtml(c, varId)).join('');
    }

    preview.textContent = buildVariableExpression(varId);
}

/**
 * Construye la expresion de una variable
 */
function buildVariableExpression(varId) {
    const variable = editorState.variables[varId];
    if (!variable || variable.components.length === 0) return '';

    return variable.components.map(c => c.value).join(' ');
}

/**
 * Crea el HTML de un pill
 */
function createPillHtml(component, varId) {
    const pillClass = `pill pill-${component.type}`;
    let displayText = component.displayText;

    if (component.type === 'function') {
        displayText = `#${component.metadata.functionName}(...)#`;
    }

    return `
        <span class="${pillClass}"
              onclick="event.stopPropagation(); editarComponenteDeVariable('${component.id}', '${varId}')"
              title="Click para editar">
            <span class="pill-text">${escapeHtml(displayText)}</span>
            <button type="button" class="pill-delete"
                    onclick="eliminarComponenteDeVariable('${component.id}', '${varId}')"
                    title="Eliminar">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `;
}

// =============================================
// CONFIGURADOR DE FUNCIONES
// =============================================

/**
 * Abre el panel de configuracion de funcion (inline dentro del card)
 * ACTUALIZADO: Usa el nuevo sistema de navegacion multinivel
 */
function abrirConfiguradorFuncion(functionName, varId, existingParams = null) {
    const funcConfig = funciones.find(f => f.value === functionName);
    if (!funcConfig) return;

    console.log('Abriendo configurador para:', functionName, 'varId:', varId);

    // Cerrar cualquier panel abierto en otras variables
    document.querySelectorAll('.function-config-panel.active').forEach(panel => {
        panel.classList.remove('active');
    });

    // NUEVO: Limpiar navigation stack e inicializar para nueva configuracion
    editorState.navigationStack.levels = [];
    editorState.navigationStack.currentLevel = -1;
    editorState.miniBuilderComponents = {};
    editorState.currentConfigVarId = varId;

    // LEGACY: Mantener compatibilidad con functionConfig
    editorState.functionConfig.active = true;
    editorState.functionConfig.functionName = functionName;
    editorState.functionConfig.targetVariableId = varId;
    editorState.functionConfig.paramValues = {};
    editorState.functionConfig.nestedLevel = 0;
    editorState.functionConfig.nestedStack = [];

    // NUEVO: Crear nivel raiz en navigation stack
    const rootLevel = createConfigLevel(functionName, null, null, varId);
    editorState.navigationStack.levels.push(rootLevel);
    editorState.navigationStack.currentLevel = 0;

    // Actualizar titulo en el panel de esta variable
    const titleEl = document.getElementById(`functionConfigTitle_${varId}`);
    if (titleEl) {
        titleEl.textContent = `Configurar: ${funcConfig.text}`;
    }

    // NUEVO: Generar formulario con mini-builders
    const body = document.getElementById(`functionConfigBody_${varId}`);
    if (body) {
        body.innerHTML = generarFormularioConMiniBuilders(functionName, varId);
    }

    // Mostrar panel inline
    const panel = document.getElementById(`functionConfigPanel_${varId}`);
    if (panel) {
        panel.classList.add('active');
        // Scroll al panel
        setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    // NUEVO: Actualizar breadcrumb con nuevo sistema
    const breadcrumb = document.getElementById(`functionBreadcrumb_${varId}`);
    updateNavigationBreadcrumb(breadcrumb, varId);
}

/**
 * Genera el formulario de parametros para una funcion
 */
function generarFormularioFuncion(funcConfig, existingParams, varId) {
    let html = '<div class="params-container">';

    const numParams = funcConfig.params === 'N' ?
        (existingParams ? existingParams.length : funcConfig.minParams) :
        funcConfig.params;

    for (let i = 0; i < numParams; i++) {
        const label = funcConfig.params === 'N' ?
            `${funcConfig.labels[0]} ${i + 1}` :
            funcConfig.labels[i];

        const existingValue = existingParams ? existingParams[i] : null;
        html += generarFilaParametro(i, label, existingValue, funcConfig.value, varId);
    }

    if (funcConfig.params === 'N') {
        html += `
            <button type="button" class="btn-add-param" onclick="event.stopPropagation(); agregarParametroExtra('${funcConfig.value}', '${varId}')">
                <i class="fas fa-plus"></i> Agregar otro valor
            </button>
        `;
    }

    html += '</div>';
    return html;
}

/**
 * Genera una fila de parametro
 */
function generarFilaParametro(index, label, existingValue, functionName, varId) {
    const paramId = `param_${editorState.functionConfig.nestedLevel}_${index}`;
    const targetVarId = varId || editorState.functionConfig.targetVariableId;

    return `
        <div class="param-row" data-param-index="${index}">
            <div class="param-label">${label}:</div>
            <div class="param-inputs">
                <div class="param-selectors">
                    <select class="form-select form-select-sm" id="${paramId}_type" onchange="onParamTypeChange('${paramId}')">
                        <option value="field">Campo</option>
                        <option value="value">Valor</option>
                        <option value="function">Funcion</option>
                    </select>
                    <select class="form-select form-select-sm" id="${paramId}_value" onchange="onParamValueChange('${paramId}')">
                        <option value="">-- Seleccione --</option>
                        ${generarOpcionesCampos()}
                    </select>
                </div>
                <div class="param-preview" id="${paramId}_preview">
                    ${existingValue ? createMiniPill(existingValue) : '<span class="text-muted">Sin valor</span>'}
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary btn-nested-function"
                        onclick="event.stopPropagation(); crearFuncionAnidada('${paramId}', ${index}, '${targetVarId}')">
                    <i class="fas fa-code-branch"></i> Usar funcion anidada
                </button>
            </div>
        </div>
    `;
}

/**
 * Crea un mini pill para preview
 */
function createMiniPill(value) {
    let type = 'value';
    let displayText = value;

    if (typeof value === 'string') {
        if (value.startsWith('[') && value.endsWith(']')) {
            type = 'field';
            displayText = value.slice(1, -1);
        } else if (value.startsWith('#') && value.endsWith('#')) {
            type = 'function';
        }
    }

    return `<span class="pill pill-${type}" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">${escapeHtml(displayText)}</span>`;
}

/**
 * Cuando cambia el tipo de parametro
 */
function onParamTypeChange(paramId) {
    const typeSelect = document.getElementById(paramId + '_type');
    const type = typeSelect.value;
    const selectorsContainer = typeSelect.parentElement;

    // Buscar el elemento de valor existente (puede ser select o input)
    let valueSelect = document.getElementById(paramId + '_value');
    let valueInput = document.getElementById(paramId + '_input');

    // Si existe un input, reemplazarlo por un select
    if (valueInput) {
        const newSelect = document.createElement('select');
        newSelect.className = 'form-select form-select-sm';
        newSelect.id = paramId + '_value';
        newSelect.onchange = function() { onParamValueChange(paramId); };
        selectorsContainer.replaceChild(newSelect, valueInput);
        valueSelect = newSelect;
    }

    // Limpiar opciones del select
    valueSelect.innerHTML = '<option value="">-- Seleccione --</option>';
    valueSelect.style.display = 'block';

    if (type === 'field') {
        editorState.campos.forEach(c => {
            const option = document.createElement('option');
            option.value = c.value;
            option.textContent = c.text;
            valueSelect.appendChild(option);
        });
    } else if (type === 'value') {
        // Reemplazar select por input
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control form-control-sm';
        input.placeholder = 'Ingrese un valor';
        input.id = paramId + '_input';
        input.onchange = function() { onParamValueChange(paramId); };
        input.onkeyup = function() { onParamValueChange(paramId); };
        selectorsContainer.replaceChild(input, valueSelect);
    } else if (type === 'function') {
        funciones.forEach(f => {
            const option = document.createElement('option');
            option.value = f.value;
            option.textContent = f.text;
            valueSelect.appendChild(option);
        });
        valueSelect.style.display = 'block';
    }
}

/**
 * Cuando cambia el valor de un parametro
 */
function onParamValueChange(paramId) {
    const typeSelect = document.getElementById(paramId + '_type');
    const valueElement = document.getElementById(paramId + '_value') || document.getElementById(paramId + '_input');
    const preview = document.getElementById(paramId + '_preview');

    if (!typeSelect || !valueElement) return;

    const type = typeSelect.value;
    const value = valueElement.value;

    if (!value) {
        preview.innerHTML = '<span class="text-muted">Sin valor</span>';
        return;
    }

    let displayValue = value;
    if (type === 'value' && !/^-?\d+(\.\d+)?$/.test(value)) {
        displayValue = `"${value}"`;
    }

    preview.innerHTML = createMiniPill(displayValue);

    const paramIndex = paramId.split('_')[2];
    editorState.functionConfig.paramValues[paramIndex] = {
        type: type,
        value: displayValue
    };
}

/**
 * Agrega un parametro extra
 */
function agregarParametroExtra(functionName, varId) {
    const targetVarId = varId || editorState.functionConfig.targetVariableId;
    const body = document.getElementById(`functionConfigBody_${targetVarId}`);
    if (!body) return;

    const container = body.querySelector('.params-container');
    if (!container) return;

    const existingParams = container.querySelectorAll('.param-row').length;
    const funcConfig = funciones.find(f => f.value === functionName);

    const label = `${funcConfig.labels[0]} ${existingParams + 1}`;
    const newRow = document.createElement('div');
    newRow.innerHTML = generarFilaParametro(existingParams, label, null, functionName, targetVarId);

    const addButton = container.querySelector('.btn-add-param');
    container.insertBefore(newRow.firstElementChild, addButton);
}

/**
 * Crea una funcion anidada
 */
function crearFuncionAnidada(parentParamId, paramIndex, varId) {
    const targetVarId = varId || editorState.functionConfig.targetVariableId;
    const body = document.getElementById(`functionConfigBody_${targetVarId}`);
    if (!body) return;

    editorState.functionConfig.nestedStack.push({
        functionName: editorState.functionConfig.functionName,
        paramValues: { ...editorState.functionConfig.paramValues },
        parentParamId: parentParamId,
        paramIndex: paramIndex,
        bodyHtml: body.innerHTML
    });

    editorState.functionConfig.nestedLevel++;

    body.innerHTML = `
        <div class="alert alert-info mb-3">
            <i class="fas fa-info-circle"></i>
            Seleccione la funcion que desea anidar como parametro
        </div>
        <div class="form-group">
            <label>Funcion a anidar:</label>
            <select class="form-select" id="nestedFunctionSelect">
                <option value="">-- Seleccione una funcion --</option>
                ${funciones.map(f => `<option value="${f.value}">${f.text}</option>`).join('')}
            </select>
        </div>
        <div class="mt-3">
            <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation(); confirmarFuncionAnidada('${targetVarId}')">
                <i class="fas fa-check"></i> Continuar
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); cancelarFuncionAnidada('${targetVarId}')">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
        </div>
    `;

    actualizarBreadcrumb(targetVarId);
}

/**
 * Confirma la seleccion de funcion anidada
 */
function confirmarFuncionAnidada(varId) {
    const targetVarId = varId || editorState.functionConfig.targetVariableId;
    const select = document.getElementById('nestedFunctionSelect');
    const functionName = select.value;

    if (!functionName) {
        alert('Por favor seleccione una funcion');
        return;
    }

    const funcConfig = funciones.find(f => f.value === functionName);
    editorState.functionConfig.functionName = functionName;
    editorState.functionConfig.paramValues = {};

    const body = document.getElementById(`functionConfigBody_${targetVarId}`);
    if (body) {
        body.innerHTML = generarFormularioFuncion(funcConfig, null, targetVarId);
    }

    actualizarBreadcrumb(targetVarId);
}

/**
 * Cancela la funcion anidada
 */
function cancelarFuncionAnidada(varId) {
    const targetVarId = varId || editorState.functionConfig.targetVariableId;

    if (editorState.functionConfig.nestedStack.length > 0) {
        const previousState = editorState.functionConfig.nestedStack.pop();
        editorState.functionConfig.nestedLevel--;
        editorState.functionConfig.functionName = previousState.functionName;
        editorState.functionConfig.paramValues = previousState.paramValues;

        const body = document.getElementById(`functionConfigBody_${targetVarId}`);
        if (body) {
            body.innerHTML = previousState.bodyHtml;
        }
    }

    actualizarBreadcrumb(targetVarId);
}

/**
 * Actualiza el breadcrumb
 */
function actualizarBreadcrumb(varId) {
    const targetVarId = varId || editorState.functionConfig.targetVariableId;
    const breadcrumb = document.getElementById(`functionBreadcrumb_${targetVarId}`);

    if (!breadcrumb) return;

    if (editorState.functionConfig.nestedLevel === 0) {
        breadcrumb.innerHTML = '';
        breadcrumb.style.display = 'none';
        return;
    }

    breadcrumb.style.display = 'block';
    let html = '<nav><ol class="breadcrumb mb-0" style="font-size: 0.8rem;">';

    editorState.functionConfig.nestedStack.forEach((level, index) => {
        html += `
            <li class="breadcrumb-item">
                <a href="#" onclick="event.stopPropagation(); navegarANivel(${index}, '${targetVarId}'); return false;">${level.functionName}</a>
            </li>
        `;
    });

    html += `<li class="breadcrumb-item active">${editorState.functionConfig.functionName}</li>`;
    html += '</ol></nav>';

    breadcrumb.innerHTML = html;
}

/**
 * Navega a un nivel especifico
 */
function navegarANivel(targetLevel, varId) {
    const targetVarId = varId || editorState.functionConfig.targetVariableId;
    while (editorState.functionConfig.nestedStack.length > targetLevel) {
        cancelarFuncionAnidada(targetVarId);
    }
}

/**
 * Acepta la configuracion de la funcion
 * ACTUALIZADO: Usa el nuevo sistema de navegacion multinivel
 */
function aceptarFuncion(varId) {
    const targetVarId = varId || editorState.currentConfigVarId || editorState.functionConfig.targetVariableId;

    console.log('Aceptando funcion, nivel actual:', editorState.navigationStack.currentLevel);

    // NUEVO: Usar sistema de navegacion multinivel
    if (editorState.navigationStack.currentLevel >= 0) {
        const currentLevel = editorState.navigationStack.levels[editorState.navigationStack.currentLevel];

        // Verificar que hay al menos un parametro configurado
        const hasParams = Object.keys(editorState.miniBuilderComponents).some(builderId => {
            if (builderId.includes(`_level${editorState.navigationStack.currentLevel}_`)) {
                const components = editorState.miniBuilderComponents[builderId];
                return components && components.length > 0;
            }
            return false;
        });

        if (!hasParams) {
            alert('Por favor configure al menos un parametro');
            return;
        }

        // Si hay mas de un nivel, navegar al padre
        if (editorState.navigationStack.currentLevel > 0) {
            // Guardar estado actual antes de navegar
            saveCurrentLevelState(targetVarId);

            // Propagar expresion al padre
            updateChildExpressionInParent(editorState.navigationStack.currentLevel - 1);

            // Navegar al nivel padre
            navigateToLevel(editorState.navigationStack.currentLevel - 1, targetVarId);
            return;
        }

        // Nivel raiz - crear componente final
        const expression = buildLevelExpression(currentLevel);
        console.log('Expresion final:', expression);

        // Recopilar parametros para metadata
        const params = [];
        Object.keys(editorState.miniBuilderComponents).forEach(builderId => {
            if (builderId.includes(`_level0_`)) {
                const components = editorState.miniBuilderComponents[builderId];
                if (components && components.length > 0) {
                    params.push(buildComponentsExpression(components));
                }
            }
        });

        const component = {
            id: editorState.functionConfig.editingComponentId || 'comp_' + (++editorState.componentCounter),
            type: 'function',
            value: expression,
            displayText: expression,
            metadata: {
                functionName: currentLevel.functionName,
                params: params
            }
        };

        if (editorState.functionConfig.editingComponentId) {
            const variable = editorState.variables[targetVarId];
            const index = variable.components.findIndex(c => c.id === editorState.functionConfig.editingComponentId);
            if (index !== -1) {
                variable.components[index] = component;
            }
        } else {
            if (!editorState.variables[targetVarId]) {
                editorState.variables[targetVarId] = { name: `Variable ${targetVarId}`, components: [] };
            }
            editorState.variables[targetVarId].components.push(component);
        }

        cerrarConfiguradorFuncion(targetVarId);
        renderVariableCard_Update(targetVarId);
        return;
    }

    // LEGACY: Fallback al sistema anterior si no hay navigation stack
    const params = recopilarParametros(targetVarId);

    if (params.some(p => !p)) {
        alert('Por favor complete todos los parametros');
        return;
    }

    if (editorState.functionConfig.nestedStack.length > 0) {
        const expression = construirExpresionFuncion(editorState.functionConfig.functionName, params);

        const previousState = editorState.functionConfig.nestedStack.pop();
        editorState.functionConfig.nestedLevel--;
        editorState.functionConfig.functionName = previousState.functionName;
        editorState.functionConfig.paramValues = previousState.paramValues;

        const body = document.getElementById(`functionConfigBody_${targetVarId}`);
        if (body) {
            body.innerHTML = previousState.bodyHtml;
        }

        const parentPreview = document.getElementById(previousState.parentParamId + '_preview');
        if (parentPreview) {
            parentPreview.innerHTML = createMiniPill(expression);
        }

        editorState.functionConfig.paramValues[previousState.paramIndex] = {
            type: 'function',
            value: expression
        };

        actualizarBreadcrumb(targetVarId);
        return;
    }

    // Nivel raiz (legacy)
    const expression = construirExpresionFuncion(editorState.functionConfig.functionName, params);

    const component = {
        id: editorState.functionConfig.editingComponentId || 'comp_' + (++editorState.componentCounter),
        type: 'function',
        value: expression,
        displayText: expression,
        metadata: {
            functionName: editorState.functionConfig.functionName,
            params: params
        }
    };

    if (editorState.functionConfig.editingComponentId) {
        const variable = editorState.variables[targetVarId];
        const index = variable.components.findIndex(c => c.id === editorState.functionConfig.editingComponentId);
        if (index !== -1) {
            variable.components[index] = component;
        }
    } else {
        editorState.variables[targetVarId].components.push(component);
    }

    cerrarConfiguradorFuncion(targetVarId);
    renderVariableCard_Update(targetVarId);
}

/**
 * Recopila los valores de los parametros
 */
function recopilarParametros(varId) {
    const targetVarId = varId || editorState.functionConfig.targetVariableId;
    const body = document.getElementById(`functionConfigBody_${targetVarId}`);
    if (!body) return [];

    const container = body.querySelector('.params-container');
    if (!container) return [];

    const rows = container.querySelectorAll('.param-row');
    const params = [];

    rows.forEach((row, index) => {
        const paramId = `param_${editorState.functionConfig.nestedLevel}_${index}`;

        if (editorState.functionConfig.paramValues[index]) {
            params.push(editorState.functionConfig.paramValues[index].value);
            return;
        }

        const typeSelect = document.getElementById(paramId + '_type');
        const valueElement = document.getElementById(paramId + '_value') || document.getElementById(paramId + '_input');

        if (!typeSelect || !valueElement) {
            params.push(null);
            return;
        }

        const type = typeSelect.value;
        let value = valueElement.value;

        if (!value) {
            params.push(null);
            return;
        }

        if (type === 'value' && !/^-?\d+(\.\d+)?$/.test(value)) {
            value = `"${value}"`;
        }

        params.push(value);
    });

    return params;
}

/**
 * Construye la expresion de una funcion
 */
function construirExpresionFuncion(functionName, params) {
    return `#${functionName}(${params.join(',')})#`;
}

/**
 * Cancela la configuracion
 * ACTUALIZADO: Usa el nuevo sistema de navegacion multinivel
 */
function cancelarFuncion(varId) {
    const targetVarId = varId || editorState.currentConfigVarId || editorState.functionConfig.targetVariableId;

    // NUEVO: Usar sistema de navegacion multinivel
    if (editorState.navigationStack.currentLevel > 0) {
        // Hay niveles anidados - navegar al padre sin guardar
        const currentLevel = editorState.navigationStack.levels[editorState.navigationStack.currentLevel];

        // Eliminar el componente de funcion del padre si no esta configurado
        if (currentLevel.parentBuilderId && currentLevel.functionId) {
            const parentComponents = editorState.miniBuilderComponents[currentLevel.parentBuilderId];
            if (parentComponents) {
                const funcIndex = parentComponents.findIndex(c => c.functionId === currentLevel.functionId);
                if (funcIndex !== -1 && !parentComponents[funcIndex].configured) {
                    parentComponents.splice(funcIndex, 1);
                }
            }
        }

        // Eliminar el nivel actual del stack
        editorState.navigationStack.levels.pop();
        editorState.navigationStack.currentLevel--;

        // Renderizar nivel padre
        renderCurrentConfigLevel(targetVarId);
        return;
    }

    // LEGACY: Fallback
    if (editorState.functionConfig.nestedStack.length > 0) {
        cancelarFuncionAnidada(targetVarId);
        return;
    }

    cerrarConfiguradorFuncion(targetVarId);
}

/**
 * Cierra el configurador
 * ACTUALIZADO: Limpia el nuevo sistema de navegacion multinivel
 */
function cerrarConfiguradorFuncion(varId) {
    const targetVarId = varId || editorState.currentConfigVarId || editorState.functionConfig.targetVariableId;

    console.log('Cerrando configurador para varId:', targetVarId);

    // NUEVO: Limpiar mini-builder components de todos los niveles
    editorState.navigationStack.levels.forEach(level => {
        Object.keys(level.miniBuilderStates).forEach(builderId => {
            delete editorState.miniBuilderComponents[builderId];
        });
    });

    // Limpiar cualquier mini-builder restante
    Object.keys(editorState.miniBuilderComponents).forEach(builderId => {
        if (builderId.startsWith('miniBuilder_')) {
            delete editorState.miniBuilderComponents[builderId];
        }
    });

    // NUEVO: Resetear navigation stack
    editorState.navigationStack.levels = [];
    editorState.navigationStack.currentLevel = -1;
    editorState.currentConfigVarId = null;

    // LEGACY: Resetear functionConfig
    editorState.functionConfig.active = false;
    editorState.functionConfig.functionName = null;
    editorState.functionConfig.targetVariableId = null;
    editorState.functionConfig.editingComponentId = null;
    editorState.functionConfig.nestedLevel = 0;
    editorState.functionConfig.nestedStack = [];
    editorState.functionConfig.paramValues = {};

    // Cerrar panel inline de la variable específica
    if (targetVarId) {
        const panel = document.getElementById(`functionConfigPanel_${targetVarId}`);
        if (panel) {
            panel.classList.remove('active');
        }
    }

    // También cerrar cualquier otro panel que pueda estar abierto
    document.querySelectorAll('.function-config-panel.active').forEach(panel => {
        panel.classList.remove('active');
    });
}

// =============================================
// EXPRESION LOGICA
// =============================================

/**
 * Actualiza el select de variables disponibles para la expresión lógica
 */
function actualizarSelectVariables() {
    const select = document.getElementById('selectVariableLogica');
    if (!select) return;

    const varIds = Object.keys(editorState.variables);

    if (varIds.length === 0) {
        select.innerHTML = '<option value="">-- Sin variables --</option>';
        return;
    }

    select.innerHTML = '<option value="">-- Seleccione --</option>';

    varIds.forEach(varId => {
        const variable = editorState.variables[varId];
        const option = document.createElement('option');
        option.value = varId;
        option.textContent = variable.name;
        select.appendChild(option);
    });
}

/**
 * Agrega la variable seleccionada a la expresión lógica
 */
function agregarVariableSeleccionada() {
    const select = document.getElementById('selectVariableLogica');
    const varId = select.value;

    if (!varId) {
        alert('Por favor seleccione una variable');
        return;
    }

    const variable = editorState.variables[varId];

    editorState.logicComponents.push({
        id: 'logic_' + (++editorState.componentCounter),
        type: 'variable',
        value: varId,
        displayText: variable.name
    });

    renderLogicExpression();
}

/**
 * Agrega un operador logico o de comparacion
 */
function agregarOperadorLogico(operator) {
    // Determinar si es operador de comparación
    const comparisonOperators = ['==', '!=', '>', '<', '>=', '<='];
    const isComparison = comparisonOperators.includes(operator);

    // Texto a mostrar para operadores de comparación
    const displayMap = {
        '==': '=',
        '!=': '≠',
        '>': '>',
        '<': '<',
        '>=': '≥',
        '<=': '≤'
    };

    editorState.logicComponents.push({
        id: 'logic_' + (++editorState.componentCounter),
        type: isComparison ? 'comparison' : 'logic',
        value: operator,
        displayText: displayMap[operator] || operator
    });

    renderLogicExpression();
}

/**
 * Muestra el input inline para insertar un valor
 */
function mostrarInputValor() {
    const inputContainer = document.getElementById('inlineValueInput');
    const input = document.getElementById('inputValorLogico');
    const btn = document.getElementById('btnInsertarValor');

    inputContainer.style.display = 'inline-flex';
    btn.style.display = 'none';
    input.value = '';
    input.focus();
}

/**
 * Acepta el valor ingresado y lo agrega a la expresión lógica
 */
function aceptarValorLogico() {
    const input = document.getElementById('inputValorLogico');
    let value = input.value.trim();

    if (!value) {
        alert('Por favor ingrese un valor');
        return;
    }

    let displayText = value;

    // Determinar si es número o texto
    if (!/^-?\d+(\.\d+)?$/.test(value)) {
        // Es texto, agregar comillas
        value = `"${value}"`;
        displayText = `"${value.replace(/"/g, '')}"`;
    }

    editorState.logicComponents.push({
        id: 'logic_' + (++editorState.componentCounter),
        type: 'value',
        value: value,
        displayText: displayText
    });

    cancelarValorLogico();
    renderLogicExpression();
}

/**
 * Cancela la inserción de valor y oculta el input
 */
function cancelarValorLogico() {
    const inputContainer = document.getElementById('inlineValueInput');
    const btn = document.getElementById('btnInsertarValor');

    inputContainer.style.display = 'none';
    btn.style.display = 'inline-flex';
}

/**
 * Elimina un componente de la expresion logica
 */
function eliminarComponenteLogico(compId) {
    const index = editorState.logicComponents.findIndex(c => c.id === compId);
    if (index !== -1) {
        editorState.logicComponents.splice(index, 1);
        renderLogicExpression();
    }
}

/**
 * Renderiza la expresion logica
 */
function renderLogicExpression() {
    const buildZone = document.getElementById('logicBuildZone');
    const preview = document.getElementById('logicExpressionPreview');

    if (editorState.logicComponents.length === 0) {
        buildZone.innerHTML = `
            <div class="build-zone-placeholder">
                <i class="fas fa-arrow-up"></i>
                Agregue variables y operadores para crear la expresion logica
            </div>
        `;
        buildZone.classList.add('empty');
        preview.textContent = '';
        return;
    }

    buildZone.classList.remove('empty');
    buildZone.innerHTML = editorState.logicComponents.map(comp => {
        // Determinar clase del pill según el tipo
        let pillClass = 'pill pill-logic';
        if (comp.type === 'variable') {
            pillClass = 'pill pill-variable';
        } else if (comp.type === 'comparison') {
            pillClass = 'pill pill-comparison';
        } else if (comp.type === 'value') {
            pillClass = 'pill pill-value';
        }

        // Actualizar nombre de variable
        if (comp.type === 'variable') {
            const variable = editorState.variables[comp.value];
            if (variable) {
                comp.displayText = variable.name;
            }
        }

        return `
            <span class="${pillClass}">
                <span class="pill-text">${escapeHtml(comp.displayText)}</span>
                <button type="button" class="pill-delete"
                        onclick="eliminarComponenteLogico('${comp.id}')"
                        title="Eliminar">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `;
    }).join('');

    // Construir preview (usar value para operadores, displayText para variables)
    const expression = editorState.logicComponents.map(comp => {
        if (comp.type === 'variable') {
            return `{${comp.displayText}}`;
        }
        return comp.value;  // Para operadores usar el valor real (==, !=, etc.)
    }).join(' ');

    preview.textContent = expression;
}

// =============================================
// GUARDAR / CARGAR
// =============================================

/**
 * Muestra el modal para guardar
 */
function guardarRegla() {
    const varCount = Object.keys(editorState.variables).length;

    if (varCount === 0) {
        alert('No hay variables para guardar');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalGuardar'));
    modal.show();
}

/**
 * Confirma el guardado
 */
function confirmarGuardar() {
    const nombre = document.getElementById('inputNombreRegla').value.trim();
    const descripcion = document.getElementById('inputDescripcionRegla').value.trim();

    if (!nombre) {
        alert('El nombre de la regla es requerido');
        return;
    }

    // Construir expresion logica
    const logicExpression = editorState.logicComponents.map(comp => {
        if (comp.type === 'variable') {
            return `{${comp.displayText}}`;
        }
        return comp.value;
    }).join(' ');

    // Construir datos de variables
    const variablesData = {};
    Object.keys(editorState.variables).forEach(varId => {
        const variable = editorState.variables[varId];
        variablesData[varId] = {
            name: variable.name,
            expression: buildVariableExpression(varId),
            components: variable.components
        };
    });

    const data = {
        variables: variablesData,
        logicComponents: editorState.logicComponents,
        logicExpression: logicExpression
    };

    if (typeof PageMethods !== 'undefined' && PageMethods.GuardarRegla) {
        PageMethods.GuardarRegla(nombre, descripcion, logicExpression, JSON.stringify(data), function(result) {
            if (result.success) {
                alert('Regla guardada exitosamente');
                bootstrap.Modal.getInstance(document.getElementById('modalGuardar')).hide();
                document.getElementById('inputNombreRegla').value = '';
                document.getElementById('inputDescripcionRegla').value = '';
            } else {
                alert('Error: ' + result.message);
            }
        }, function(error) {
            alert('Error de conexion: ' + error.get_message());
        });
    } else {
        console.log('Datos a guardar:', data);
        alert('Regla preparada (PageMethods no disponible - ver consola)');
        bootstrap.Modal.getInstance(document.getElementById('modalGuardar')).hide();
    }
}

/**
 * Muestra el modal para cargar
 */
function mostrarModalCargar() {
    if (typeof PageMethods !== 'undefined' && PageMethods.ListarReglas) {
        PageMethods.ListarReglas(function(result) {
            if (result.success) {
                const select = document.getElementById('selectReglaCargar');
                select.innerHTML = '<option value="">-- Seleccione --</option>';

                result.data.forEach(regla => {
                    const option = document.createElement('option');
                    option.value = regla.id;
                    option.textContent = `${regla.nombre} (${regla.fechaCreacion})`;
                    select.appendChild(option);
                });

                const modal = new bootstrap.Modal(document.getElementById('modalCargar'));
                modal.show();
            } else {
                alert('Error: ' + result.message);
            }
        }, function(error) {
            alert('Error de conexion: ' + error.get_message());
        });
    } else {
        alert('Funcionalidad de cargar no disponible (PageMethods no configurado)');
    }
}

/**
 * Carga la regla seleccionada
 */
function cargarReglaSeleccionada() {
    const select = document.getElementById('selectReglaCargar');
    const reglaId = parseInt(select.value);

    if (!reglaId) {
        alert('Por favor seleccione una regla');
        return;
    }

    PageMethods.CargarRegla(reglaId, function(result) {
        if (result.success) {
            // Limpiar estado actual
            editorState.variables = {};
            editorState.logicComponents = [];
            editorState.variableCounter = 0;
            editorState.componentCounter = 0;

            // TODO: Cargar datos desde result.data

            renderVariables();
            renderLogicExpression();
            updateVariablesCount();

            bootstrap.Modal.getInstance(document.getElementById('modalCargar')).hide();
            alert('Regla cargada: ' + result.data.nombre);
        } else {
            alert('Error: ' + result.message);
        }
    }, function(error) {
        alert('Error de conexion: ' + error.get_message());
    });
}

/**
 * Limpia el editor
 */
function limpiarEditor() {
    const varCount = Object.keys(editorState.variables).length;

    if (varCount === 0 && editorState.logicComponents.length === 0) return;

    if (confirm('¿Esta seguro de limpiar el editor? Se perderan todos los datos.')) {
        editorState.variables = {};
        editorState.logicComponents = [];
        editorState.variableCounter = 0;
        editorState.componentCounter = 0;
        editorState.activeVariableId = null;

        cerrarConfiguradorFuncion();
        renderVariables();
        renderLogicExpression();
        updateVariablesCount();
    }
}

// =============================================
// UTILIDADES
// =============================================

/**
 * Escapa HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
