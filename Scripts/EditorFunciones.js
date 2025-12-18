let variablesCounter = 0;
let activeInput = null;
let currentExpandedCard = null;
let autocompletePopup = null;
let selectedAutocompleteIndex = -1;
let expressionComponents = {}; // Almacena componentes por variable: {varId: [components]}
let componentCounter = 0;
let draggedFunctionName = null; // Para almacenar qué función se está arrastrando
let draggedOperator = null; // Para almacenar qué operador se está arrastrando
let draggedField = null; // Para almacenar qué campo se está arrastrando
let targetVarId = null; // Para almacenar a qué variable se soltó
// Stack mejorado con información completa de cada nivel
let navigationStack = {
    levels: [],           // Array de niveles de configuración
    currentLevel: -1      // Índice del nivel actual
};

// ✨ NUEVA ESTRUCTURA: Cada nivel guarda su estado completo
function createConfigLevel(functionName, parentBuilderId, functionId, varId) {
    return {
        functionName: functionName,
        parentBuilderId: parentBuilderId,
        functionId: functionId,
        varId: varId,
        savedHTML: null,           // HTML del formulario
        miniBuilderStates: {}      // Estados de los mini-builders de este nivel
    };
}

// ===== DRAG & DROP DE CAMPOS =====

function dragFieldStart(event) {
    const fieldItem = event.target.closest('.draggable-field-item');
    if (!fieldItem) {
        console.error('❌ No se encontró .draggable-field-item');
        return;
    }
    const fieldName = fieldItem.getAttribute('data-field');
    console.log('🎬 DRAG START Campo:', fieldName);
    draggedField = fieldName;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', fieldName);
    fieldItem.classList.add('dragging');
}

function dragFieldEnd(event) {
    console.log('🏁 DRAG END Campo');
    // Limpiar estado visual cuando termina el drag
    const fieldItem = event.target.closest('.draggable-field-item');
    if (fieldItem) {
        fieldItem.classList.remove('dragging');
    }
    // ✅ CORREGIDO: No limpiar draggedField aquí porque el evento 'drop' puede no haber ejecutado aún
    // draggedField se limpia en dropIntoMiniBuilder() después de usarlo
}

// ===== DRAG & DROP DE OPERADORES DESDE SIDEBAR =====

function dragOperatorStart(event) {
    const operatorSymbol = event.target.closest('.draggable-operator-item').getAttribute('data-operator');
    draggedOperator = operatorSymbol;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', operatorSymbol);
    event.target.closest('.draggable-operator-item').classList.add('dragging');
}

function dragOperatorEnd(event) {
    console.log('🏁 DRAG END Operador');
    // Limpiar estado visual cuando termina el drag
    const operatorItem = event.target.closest('.draggable-operator-item');
    if (operatorItem) {
        operatorItem.classList.remove('dragging');
    }
    // ✅ CORREGIDO: No limpiar draggedOperator aquí porque el evento 'drop' puede no haber ejecutado aún
    // draggedOperator se limpia en dropIntoMiniBuilder() o dropIntoExpression() después de usarlo
}
function dragStart(event) {
    const type = event.target.getAttribute('data-type');
    const value = event.target.getAttribute('data-value');

    console.log('🚀 Drag started - Palette item:', type, value);

    // Establecer las variables globales según el tipo
    if (type === 'field') {
        draggedField = value;
    } else if (type === 'operator') {
        draggedOperator = value;
    } else if (type === 'function') {
        draggedFunctionName = value;
    }

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('type', type);
    event.dataTransfer.setData('value', value);
    event.target.classList.add('dragging');
}

function allowOperatorDrop(event, varId) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
    targetVarId = varId;
}

function dragOperatorLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function dropOperator(event, varId) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    // Remover clase dragging
    document.querySelectorAll('.draggable-operator-item.dragging').forEach(item => {
        item.classList.remove('dragging');
    });

    if (!draggedOperator) return;

    // Agregar operador directamente al constructor visual
    addExprComponent(varId, 'operator', draggedOperator, `<span class="expr-value">${draggedOperator}</span>`);

    // Limpiar
    draggedOperator = null;
    targetVarId = null;
}

// ===== FUNCIONES UNIFICADAS PARA MANEJAR TODOS LOS DROPS =====

function allowItemDrop(event, varId) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
    targetVarId = varId;
}

function dragItemLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function dropItem(event, varId) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    // Remover clase dragging de todos los items
    document.querySelectorAll('.draggable-function-item.dragging, .draggable-operator-item.dragging, .draggable-field-item.dragging').forEach(item => {
        item.classList.remove('dragging');
    });

    // Manejar drop de campo
    if (draggedField) {
        addExprComponent(varId, 'field', draggedField, `<i class="fas fa-database expr-icon"></i><span class="expr-value">${draggedField}</span>`);
        draggedField = null;
        targetVarId = null;
        return;
    }

    // Manejar drop de función
    if (draggedFunctionName) {
        const builder = document.getElementById('exprBuilder' + varId);
        if (builder) {
            const tempInput = document.createElement('textarea');
            tempInput.style.display = 'none';
            builder.appendChild(tempInput);

            activeInput = tempInput;
            activeInput.varId = varId;
        }

        openFunctionModal(draggedFunctionName, activeInput);
        draggedFunctionName = null;
        targetVarId = null;
        return;
    }

    // Manejar drop de operador
    if (draggedOperator) {
        addExprComponent(varId, 'operator', draggedOperator, `<span class="expr-value">${draggedOperator}</span>`);
        draggedOperator = null;
        targetVarId = null;
        return;
    }
}

// ===== DROP EN MINI BUILDERS (DENTRO DEL CONFIG PANEL) =====
// ✅ ELIMINADO: configurationContext - Ya no se usa, reemplazado por navigationStack
// Almacenar componentes por mini-builder
let miniBuilderComponents = {};

// ✨ ACTUALIZADA: dropIntoMiniBuilder con mejor manejo
function dropIntoMiniBuilder(event, builderId) {
    event.preventDefault();
    event.stopPropagation();

    console.log('🎯 DROP en mini-builder:', builderId);
    console.log('   draggedField:', draggedField);
    console.log('   draggedOperator:', draggedOperator);
    console.log('   draggedFunctionName:', draggedFunctionName);

    const builder = document.getElementById(builderId);
    if (!builder) {
        console.error('❌ Builder no encontrado:', builderId);
        return;
    }

    // Remover clase drag-over
    builder.classList.remove('drag-over');

    // Remover clase dragging de todos los items
    document.querySelectorAll('.draggable-function-item.dragging, .draggable-operator-item.dragging, .draggable-field-item.dragging, .palette-item.dragging').forEach(item => {
        item.classList.remove('dragging');
    });

    // Inicializar array de componentes si no existe
    if (!miniBuilderComponents[builderId]) {
        miniBuilderComponents[builderId] = [];
        console.log('🆕 Inicializando array para builderId:', builderId);
    }

    let componentAdded = false;

    // Manejar drop de campo
    if (draggedField) {
        console.log('✅ Campo detectado, agregando:', draggedField);
        miniBuilderComponents[builderId].push({
            type: 'field',
            value: draggedField,
            html: `<i class="fas fa-database expr-icon"></i><span class="expr-value">${draggedField}</span>`
        });
        componentAdded = true;
        draggedField = null;
    }

    // Manejar drop de operador
    if (draggedOperator) {
        console.log('➕ Operador arrastrado:', draggedOperator);
        miniBuilderComponents[builderId].push({
            type: 'operator',
            value: draggedOperator,
            html: `<span class="expr-value">${draggedOperator}</span>`
        });
        componentAdded = true;
        draggedOperator = null;
    }

    // Manejar drop de función (abrir panel anidado)
    if (draggedFunctionName) {
        console.log('🔮 Función arrastrada:', draggedFunctionName);

        // ✅ CORREGIDO: Guardar el valor antes de que se limpie
        const functionNameToOpen = draggedFunctionName;

        // Crear placeholder para la función sin configurar
        const functionId = 'func_' + Date.now();
        miniBuilderComponents[builderId].push({
            type: 'function',
            value: functionNameToOpen,
            functionId: functionId,
            configured: false,
            params: [],
            html: `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${functionNameToOpen}(...)</span>`
        });

        componentAdded = true;

        // Limpiar la variable global inmediatamente
        draggedFunctionName = null;

        // Renderizar primero para mostrar el placeholder
        renderMiniBuilder(builderId);

        // Luego abrir configuración de función anidada (usando variable local)
        setTimeout(() => {
            console.log('⏰ Abriendo nivel anidado para función:', functionNameToOpen);
            openNestedFunctionConfig(functionNameToOpen, builderId, functionId);
        }, 100);

        return; // Salir temprano porque renderMiniBuilder ya fue llamado
    }

    if (componentAdded) {
        console.log('✅ Componente agregado, renderizando...');
        renderMiniBuilder(builderId);
    } else {
        console.warn('⚠️ No se detectó ningún componente arrastrado');
    }
}
// ✨ NUEVA FUNCIÓN: Abrir configuración de función anidada desde mini-builder
// ✨ MEJORADA: Abrir configuración de función anidada (navegación in-place)
function openNestedFunctionConfig(functionName, parentBuilderId, functionId) {
    console.log('📂 Navegando a función anidada:', functionName);
    console.log('   parentBuilderId:', parentBuilderId);
    console.log('   functionId:', functionId);

    if (!functionName) {
        console.error('❌ ERROR: functionName es null o undefined');
        return;
    }

    const varId = currentConfigVarId;
    if (!varId) {
        console.error('❌ ERROR: currentConfigVarId es null');
        return;
    }

    // Guardar el estado actual antes de navegar
    saveCurrentLevelState();

    // ✨ NUEVO: Buscar si ya existe un nivel con este functionId
    const existingLevelIndex = navigationStack.levels.findIndex(
        level => level.functionId === functionId && level.parentBuilderId === parentBuilderId
    );

    if (existingLevelIndex !== -1) {
        console.log('♻️ Nivel existente encontrado, navegando a él:', existingLevelIndex);
        // Navegar al nivel existente en lugar de crear uno nuevo
        navigateToLevel(existingLevelIndex);
        return;
    }

    // No existe, crear nuevo nivel
    const newLevel = createConfigLevel(functionName, parentBuilderId, functionId, varId);
    console.log('🆕 Nuevo nivel creado:', newLevel);

    navigationStack.levels.push(newLevel);
    navigationStack.currentLevel = navigationStack.levels.length - 1;

    console.log('📊 Estado de navigationStack:', {
        totalLevels: navigationStack.levels.length,
        currentLevel: navigationStack.currentLevel
    });

    // Actualizar función actual
    currentFunction = functionName;

    // Renderizar el nuevo nivel
    renderCurrentConfigLevel();
}
// ✨ NUEVA FUNCIÓN: Renderizar nivel actual de configuración
function renderCurrentConfigLevel() {
    const currentLevel = navigationStack.levels[navigationStack.currentLevel];
    if (!currentLevel) return;

    const varId = currentLevel.varId;
    const body = document.getElementById('configPanelBody' + varId);
    const title = document.getElementById('configPanelTitle' + varId);
    const breadcrumb = document.getElementById('configBreadcrumb' + varId);

    if (!body || !title) return;

    console.log('🎨 Renderizando nivel:', currentLevel.functionName);

    // Actualizar título con indicador de nivel
    const icons = {
        'Conteo': 'fa-hashtag',
        'Máximo': 'fa-arrow-up',
        'Mínimo': 'fa-arrow-down',
        'Suma': 'fa-plus',
        'Si entonces': 'fa-code-branch',
        'Calcular edad': 'fa-birthday-cake',
        'Promedio': 'fa-chart-line',
        'Conteo caracteres': 'fa-text-width',
        'Expresión regular': 'fa-code',
        'Cualquier fecha': 'fa-calendar-alt'
    };

    const levelIndicator = navigationStack.currentLevel > 0
        ? `<span style="color: var(--primary); font-size: 12px; margin-left: 8px;">(Nivel ${navigationStack.currentLevel + 1})</span>`
        : '';

    title.innerHTML = `<i class="fas ${icons[currentLevel.functionName] || 'fa-cog'}"></i> ${currentLevel.functionName} ${levelIndicator}`;

    // Actualizar breadcrumb con navegación
    updateNavigationBreadcrumb(breadcrumb);

    // Restaurar HTML guardado o generar nuevo
    if (currentLevel.savedHTML) {
        console.log('♻️ Restaurando HTML guardado');
        body.innerHTML = currentLevel.savedHTML;

        // Restaurar estados de mini-builders
        Object.keys(currentLevel.miniBuilderStates).forEach(builderId => {
            miniBuilderComponents[builderId] = JSON.parse(
                JSON.stringify(currentLevel.miniBuilderStates[builderId])
            );
            renderMiniBuilder(builderId);
        });
    } else {
        console.log('🆕 Generando formulario nuevo');
        availableFields = getAvailableFields();
        body.innerHTML = generateFunctionForm(currentLevel.functionName);

        // ✨ NUEVO: Restaurar componentes desde miniBuilderStates si existen
        if (Object.keys(currentLevel.miniBuilderStates).length > 0) {
            console.log('   🔄 Restaurando componentes desde miniBuilderStates');
            Object.keys(currentLevel.miniBuilderStates).forEach(builderId => {
                miniBuilderComponents[builderId] = JSON.parse(
                    JSON.stringify(currentLevel.miniBuilderStates[builderId])
                );
                console.log(`      Restaurando ${builderId}:`, miniBuilderComponents[builderId].length, 'componentes');
                renderMiniBuilder(builderId);
            });
        }
    }

    // Scroll al inicio
    const panel = document.getElementById('configPanel' + varId);
    if (panel) {
        const panelBody = panel.querySelector('.config-panel-body');
        if (panelBody) panelBody.scrollTop = 0;
    }

    // ✅ NUEVO: Actualizar vista previa global después de renderizar
    setTimeout(() => {
        updateCurrentLevelPreview();

        // ✨ NUEVO: Actualizar breadcrumbs individuales para "Si entonces"
        if (currentLevel.functionName === 'Si entonces') {
            console.log('🥖 Actualizando breadcrumbs individuales para Si entonces');
            const levelIndex = navigationStack.currentLevel;

            // Actualizar breadcrumb para cada mini-builder del nivel
            for (let paramNum = 1; paramNum <= 3; paramNum++) {
                const builderId = `miniBuilder_level${levelIndex}_param${paramNum}`;
                updateMiniBreadcrumb(builderId);
            }
        }
    }, 100);
}
// ✨ NUEVA FUNCIÓN: Obtener nombre legible del parámetro según la función y builderId
function getParameterLabel(parentBuilderId, parentFunctionName) {
    if (!parentBuilderId) return null;

    // Extraer número de parámetro del builderId: miniBuilder_level0_param1 → param1
    const paramMatch = parentBuilderId.match(/param(\d+)$/);
    if (!paramMatch) return null;

    const paramNum = parseInt(paramMatch[1]);

    // Mapear según la función padre
    const paramLabels = {
        'Si entonces': {
            1: 'Condición',
            2: 'Valor si es Verdadero',
            3: 'Valor si es Falso'
        },
        'Conteo': { 1: 'Campo o Expresión' },
        'Máximo': { 1: 'Campo o Expresión' },
        'Mínimo': { 1: 'Campo o Expresión' },
        'Suma': { 1: 'Campo o Expresión' },
        'Promedio': { 1: 'Campo o Expresión' },
        'Conteo caracteres': { 1: 'Texto' },
        'Expresión regular': { 1: 'Texto', 2: 'Patrón' },
        'Cualquier fecha': { 1: 'Fecha', 2: 'Formato Entrada', 3: 'Formato Salida' }
    };

    const labels = paramLabels[parentFunctionName];
    return labels ? labels[paramNum] : `Parámetro ${paramNum}`;
}

// ✨ NUEVA FUNCIÓN: Actualizar breadcrumb específico de un mini-builder
// Filtra los niveles de navegación para mostrar solo los relevantes a ese mini-builder
function updateMiniBreadcrumb(builderId) {
    const breadcrumb = document.getElementById('breadcrumb_' + builderId);
    if (!breadcrumb) return;

    console.log('🥖 Actualizando breadcrumb para:', builderId);

    // Filtrar niveles que pertenecen a la cadena de este mini-builder
    const relevantLevels = [];

    // Encontrar el nivel que contiene este mini-builder
    for (let i = 0; i < navigationStack.levels.length; i++) {
        const level = navigationStack.levels[i];

        // Verificar si este nivel tiene este builderId en sus miniBuilderStates
        if (level.miniBuilderStates && level.miniBuilderStates[builderId]) {
            // Encontrado - ahora reconstruir la cadena desde el inicio
            let chainLevel = i;
            while (chainLevel >= 0) {
                relevantLevels.unshift(navigationStack.levels[chainLevel]);

                // Buscar el nivel padre
                const currentLevel = navigationStack.levels[chainLevel];
                if (!currentLevel.parentBuilderId) {
                    break; // Llegamos al nivel raíz
                }

                // Buscar el nivel que contiene el parentBuilderId
                let found = false;
                for (let j = chainLevel - 1; j >= 0; j--) {
                    if (navigationStack.levels[j].miniBuilderStates &&
                        navigationStack.levels[j].miniBuilderStates[currentLevel.parentBuilderId]) {
                        chainLevel = j;
                        found = true;
                        break;
                    }
                }

                if (!found) break;
            }
            break;
        }
    }

    console.log('   Niveles relevantes encontrados:', relevantLevels.length);

    // Si no hay niveles anidados, ocultar breadcrumb
    if (relevantLevels.length <= 1) {
        breadcrumb.style.display = 'none';
        return;
    }

    // Generar HTML del breadcrumb
    breadcrumb.style.display = 'flex';

    let html = '<i class="fas fa-sitemap" style="color: var(--gray-400); margin-right: 4px; font-size: 11px;"></i>';

    relevantLevels.forEach((level, index) => {
        const isLast = (index === relevantLevels.length - 1);

        // Encontrar el índice global de este nivel en navigationStack.levels
        const globalIndex = navigationStack.levels.indexOf(level);

        // Obtener etiqueta del parámetro si existe
        let displayLabel = level.functionName;
        if (level.parentBuilderId) {
            const parentLevel = relevantLevels[index - 1];
            if (parentLevel) {
                const paramLabel = getParameterLabel(level.parentBuilderId, parentLevel.functionName);
                if (paramLabel) {
                    displayLabel = `${level.functionName} <span style="color: var(--gray-500); font-size: 10px;">(${paramLabel})</span>`;
                }
            }
        }

        html += `
            <span style="
                color: ${isLast ? 'var(--primary)' : 'var(--gray-600)'};
                font-weight: ${isLast ? '600' : '500'};
                font-size: 11px;
                cursor: ${isLast ? 'default' : 'pointer'};
                padding: 2px 6px;
                border-radius: 4px;
                background: ${isLast ? 'var(--primary-light)' : 'transparent'};
                transition: all 0.2s;
            " ${!isLast ? `onclick="navigateToLevel(${globalIndex})"` : ''}
            ${!isLast ? `onmouseover="this.style.background='var(--gray-100)'"` : ''}
            ${!isLast ? `onmouseout="this.style.background='transparent'"` : ''}>
                ${displayLabel}
            </span>
        `;

        if (!isLast) {
            html += '<i class="fas fa-chevron-right" style="color: var(--gray-400); font-size: 9px;"></i>';
        }
    });

    breadcrumb.innerHTML = html;
}

// ✨ NUEVA FUNCIÓN: Actualizar breadcrumb con navegación funcional
// ✅ MEJORADO: Muestra contexto del parámetro para cada nivel
function updateNavigationBreadcrumb(breadcrumb) {
    if (!breadcrumb) return;

    if (navigationStack.levels.length === 0) {
        breadcrumb.style.display = 'none';
        return;
    }

    breadcrumb.style.display = 'flex';
    breadcrumb.style.alignItems = 'center';
    breadcrumb.style.gap = '4px';
    breadcrumb.style.flexWrap = 'wrap';

    let html = '<i class="fas fa-layer-group" style="color: var(--gray-400); margin-right: 8px; font-size: 14px;"></i>';

    navigationStack.levels.forEach((level, index) => {
        const isLast = index === navigationStack.currentLevel;
        const isCurrent = index === navigationStack.currentLevel;

        // ✅ NUEVO: Obtener contexto del parámetro padre si existe
        let displayLabel = level.functionName;
        if (level.parentBuilderId && index > 0) {
            const parentLevel = navigationStack.levels[index - 1];
            const paramLabel = getParameterLabel(level.parentBuilderId, parentLevel.functionName);
            if (paramLabel) {
                displayLabel = `${level.functionName} <span style="color: ${isCurrent ? 'rgba(255,255,255,0.7)' : 'var(--gray-500)'}; font-size: 10px;">(${paramLabel})</span>`;
            }
        }

        // Botón navegable
        html += `
            <button type="button"
                    class="breadcrumb-nav-item ${isCurrent ? 'active' : ''}"
                    onclick="navigateToLevel(${index})"
                    style="
                        background: ${isCurrent ? 'var(--primary)' : 'var(--gray-100)'};
                        color: ${isCurrent ? 'white' : 'var(--gray-700)'};
                        border: 2px solid ${isCurrent ? 'var(--primary)' : 'var(--gray-300)'};
                        border-radius: 6px;
                        padding: 6px 12px;
                        font-size: 12px;
                        font-weight: 600;
                        cursor: ${isCurrent ? 'default' : 'pointer'};
                        transition: all 0.2s;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                    "
                    ${isCurrent ? 'disabled' : ''}
                    onmouseover="if(!this.disabled) this.style.borderColor='var(--primary)'; if(!this.disabled) this.style.background='var(--primary-light)';"
                    onmouseout="if(!this.disabled) this.style.borderColor='var(--gray-300)'; if(!this.disabled) this.style.background='var(--gray-100)';">
                <span style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    background: ${isCurrent ? 'rgba(255,255,255,0.3)' : 'var(--gray-300)'};
                    border-radius: 50%;
                    font-size: 10px;
                    font-weight: 700;
                ">${index + 1}</span>
                ${displayLabel}
            </button>
        `;

        if (!isLast) {
            html += '<i class="fas fa-chevron-right" style="color: var(--gray-400); font-size: 10px; margin: 0 4px;"></i>';
        }
    });

    breadcrumb.innerHTML = html;
}

// ✨ NUEVA FUNCIÓN: Navegar a un nivel específico
function navigateToLevel(targetLevel) {
    if (targetLevel < 0 || targetLevel >= navigationStack.levels.length) return;
    if (targetLevel === navigationStack.currentLevel) return;

    console.log('🧭 Navegando del nivel', navigationStack.currentLevel, 'al nivel', targetLevel);

    // Guardar estado actual antes de navegar
    saveCurrentLevelState();

    // ✨ NUEVO: Si estamos navegando hacia un nivel padre, actualizar la expresión completa de la función anidada
    if (targetLevel < navigationStack.currentLevel) {
        const childLevel = navigationStack.levels[navigationStack.currentLevel];
        if (childLevel.parentBuilderId && childLevel.functionId) {
            console.log('🔄 Actualizando expresión completa de función anidada:', childLevel.functionName);

            // Construir la expresión completa del nivel hijo
            let childExpression = buildLevelExpression(childLevel);
            console.log('   Expresión construida del hijo:', childExpression);

            // Actualizar el componente de función en el nivel padre
            const parentComponents = miniBuilderComponents[childLevel.parentBuilderId];
            if (parentComponents) {
                const functionComp = parentComponents.find(c => c.functionId === childLevel.functionId);
                if (functionComp) {
                    functionComp.fullExpression = childExpression;
                    functionComp.configured = true;

                    // Actualizar el HTML del componente para reflejar los parámetros
                    const paramsPreview = childExpression.length > 50 ?
                        childExpression.substring(0, 47) + '...' :
                        childExpression;
                    functionComp.html = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${paramsPreview}</span>`;

                    console.log('   ✅ Componente actualizado en memoria:', functionComp);

                    // ✨ CRÍTICO: También actualizar el estado guardado del nivel padre
                    const parentLevel = navigationStack.levels[targetLevel];
                    if (parentLevel) {
                        // Actualizar miniBuilderStates
                        if (parentLevel.miniBuilderStates[childLevel.parentBuilderId]) {
                            const savedComponents = parentLevel.miniBuilderStates[childLevel.parentBuilderId];
                            const savedFunctionComp = savedComponents.find(c => c.functionId === childLevel.functionId);
                            if (savedFunctionComp) {
                                savedFunctionComp.fullExpression = childExpression;
                                savedFunctionComp.configured = true;
                                savedFunctionComp.html = functionComp.html;
                                console.log('   ✅ Estado guardado del padre también actualizado');
                            }
                        }

                        // ✅ NUEVO: Invalidar savedHTML para forzar re-generación con componentes actualizados
                        console.log('   🔄 Invalidando savedHTML del nivel padre para re-generar DOM');
                        parentLevel.savedHTML = null;
                    }
                }
            }
        }
    }

    // Cambiar nivel actual
    navigationStack.currentLevel = targetLevel;

    const level = navigationStack.levels[targetLevel];
    currentFunction = level.functionName;

    // Renderizar el nivel objetivo
    renderCurrentConfigLevel();
}
// ✨ NUEVA FUNCIÓN: Guardar estado del nivel actual antes de cambiar
function saveCurrentLevelState() {
    if (navigationStack.currentLevel < 0) return;

    const currentLevel = navigationStack.levels[navigationStack.currentLevel];
    if (!currentLevel) return;

    const varId = currentLevel.varId;
    const body = document.getElementById('configPanelBody' + varId);

    if (body) {
        // Guardar HTML completo
        currentLevel.savedHTML = body.innerHTML;

        // ✅ CORREGIDO: Guardar solo los builders que pertenecen a este nivel
        // Los builders tienen IDs como: miniBuilder_level0_param1, miniBuilder_level1_param1, etc.
        const levelPrefix = `_level${navigationStack.currentLevel}_`;
        const miniBuilders = body.querySelectorAll('.mini-expression-builder');

        miniBuilders.forEach(builder => {
            const builderId = builder.id;
            // Solo guardar si el builder pertenece a este nivel
            if (builderId.includes(levelPrefix) && miniBuilderComponents[builderId]) {
                currentLevel.miniBuilderStates[builderId] = JSON.parse(
                    JSON.stringify(miniBuilderComponents[builderId])
                );
            }
        });

        console.log('💾 Estado guardado:', currentLevel.functionName, 'nivel:', navigationStack.currentLevel, currentLevel.miniBuilderStates);
    }
}

// ✨ NUEVA FUNCIÓN: Mostrar panel de configuración anidado
function showNestedConfigPanel(functionName, parentBuilderId, functionId) {
    const varId = currentConfigVarId;
    if (!varId) return;

    const body = document.getElementById('configPanelBody' + varId);
    const title = document.getElementById('configPanelTitle' + varId);
    const breadcrumb = document.getElementById('configBreadcrumb' + varId);

    if (!body || !title) return;

    // Actualizar breadcrumb
    updateConfigBreadcrumb(breadcrumb);

    // Actualizar título
    const icons = {
        'Conteo': 'fa-hashtag',
        'Máximo': 'fa-arrow-up',
        'Mínimo': 'fa-arrow-down',
        'Suma': 'fa-plus',
        'Si entonces': 'fa-code-branch',
        'Calcular edad': 'fa-birthday-cake'
    };

    title.innerHTML = `<i class="fas ${icons[functionName] || 'fa-cog'}"></i> ${functionName} <span style="color: var(--primary); font-size: 12px;">(Anidada)</span>`;

    // Generar formulario para la función anidada
    availableFields = getAvailableFields();
    body.innerHTML = generateFunctionForm(functionName);

    // Scroll al top del panel
    const panel = document.getElementById('configPanel' + varId);
    if (panel) {
        const panelBody = panel.querySelector('.config-panel-body');
        if (panelBody) panelBody.scrollTop = 0;
    }
}

// ✅ ELIMINADO: updateConfigBreadcrumb() - Ya existe updateNavigationBreadcrumb() que usa navigationStack
// ✅ ELIMINADO: renderMiniBuilder() duplicado - La versión mejorada está en línea ~3876

function removeMiniBuilderComponent(builderId, index) {
    if (!miniBuilderComponents[builderId]) return;

    const component = miniBuilderComponents[builderId][index];
    console.log('🗑️ Eliminando componente:', component);

    // Si es una función anidada, eliminar su nivel del navigationStack
    if (component.type === 'function' && component.functionId) {
        const functionId = component.functionId;
        console.log('   Buscando nivel anidado con functionId:', functionId);

        // Buscar y eliminar el nivel hijo del navigationStack
        const levelIndex = navigationStack.levels.findIndex(level =>
            level.functionId === functionId && level.parentBuilderId === builderId
        );

        if (levelIndex !== -1) {
            console.log('   ✅ Eliminando nivel anidado del stack:', navigationStack.levels[levelIndex].functionName);

            // ✨ NUEVO: Limpiar TODOS los mini-builders asociados con este nivel
            const levelToDelete = navigationStack.levels[levelIndex];
            console.log('   🧹 Limpiando mini-builders del nivel:', levelIndex);

            // Buscar y eliminar todos los mini-builders que pertenecen a este nivel
            const buildersToDelete = Object.keys(miniBuilderComponents).filter(key =>
                key.startsWith(`miniBuilder_level${levelIndex}_`)
            );

            buildersToDelete.forEach(builderKey => {
                console.log('      Eliminando mini-builder:', builderKey);
                delete miniBuilderComponents[builderKey];
            });

            // También limpiar del estado guardado del nivel
            if (levelToDelete.miniBuilderStates) {
                Object.keys(levelToDelete.miniBuilderStates).forEach(builderKey => {
                    console.log('      Eliminando estado guardado de:', builderKey);
                    delete levelToDelete.miniBuilderStates[builderKey];
                });
            }

            // Si estamos en ese nivel o uno posterior, retroceder
            if (navigationStack.currentLevel >= levelIndex) {
                const parentLevelIndex = navigationStack.levels.findIndex(level =>
                    !level.parentBuilderId || level.parentBuilderId !== builderId
                );
                if (parentLevelIndex !== -1 && parentLevelIndex < levelIndex) {
                    navigateToLevel(parentLevelIndex);
                }
            }

            // Eliminar el nivel del stack
            navigationStack.levels.splice(levelIndex, 1);

            // Ajustar currentLevel si es necesario
            if (navigationStack.currentLevel >= levelIndex) {
                navigationStack.currentLevel = Math.max(0, navigationStack.currentLevel - 1);
            }

            // ✨ NUEVO: Actualizar el breadcrumb para reflejar la eliminación del nivel
            const currentLevel = navigationStack.levels[navigationStack.currentLevel];
            if (currentLevel && currentLevel.varId) {
                const breadcrumb = document.getElementById('configBreadcrumb' + currentLevel.varId);
                if (breadcrumb) {
                    console.log('   🔄 Actualizando breadcrumb después de eliminar nivel');
                    updateNavigationBreadcrumb(breadcrumb);
                }
            }
        }
    }

    // Eliminar el componente del array
    miniBuilderComponents[builderId].splice(index, 1);
    console.log('   ✅ Componente eliminado, re-renderizando');

    // Re-renderizar el mini-builder (esto llama a updateCurrentLevelPreview)
    renderMiniBuilder(builderId);
}

// ✅ Actualizar vista previa global del nivel actual
function updateCurrentLevelPreview() {
    console.log('🔍 updateCurrentLevelPreview() llamado');

    if (navigationStack.currentLevel < 0) {
        console.log('⚠️ navigationStack.currentLevel < 0');
        return;
    }

    const currentLevel = navigationStack.levels[navigationStack.currentLevel];
    if (!currentLevel) {
        console.log('⚠️ currentLevel no existe');
        return;
    }

    console.log('📊 Nivel actual:', currentLevel.functionName);

    const varId = currentLevel.varId;
    const previewElement = document.getElementById('globalPreview' + varId);
    const previewContainer = document.getElementById('globalPreview' + varId + 'Container');

    console.log('🎯 Buscando elementos:');
    console.log('   previewElement:', previewElement ? 'Encontrado' : 'NO ENCONTRADO');
    console.log('   previewContainer:', previewContainer ? 'Encontrado' : 'NO ENCONTRADO');

    if (!previewElement || !previewContainer) return;

    const body = document.getElementById('configPanelBody' + varId);
    if (!body) {
        console.log('⚠️ Body no encontrado');
        return;
    }

    // Verificar si es "Calcular edad" que usa bloques en lugar de mini-builders
    let params = [];
    let fullExpression;

    if (currentLevel.functionName === 'Calcular edad' && typeof droppedBlocks !== 'undefined') {
        console.log('🎂 Función Calcular edad detectada, usando droppedBlocks');
        console.log('   Bloques:', droppedBlocks);

        // La vista previa muestra lo que el usuario está construyendo
        fullExpression = buildCalculaEdadPreview();
    } else {
        // Recopilar expresiones de todos los mini-builders del nivel actual
        const miniBuilders = body.querySelectorAll('.mini-expression-builder');
        console.log('🔨 Mini-builders encontrados:', miniBuilders.length);

        miniBuilders.forEach((builder, index) => {
            const builderId = builder.id;
            const components = miniBuilderComponents[builderId] || [];

            console.log(`   Builder ${index + 1} (${builderId}):`, components.length, 'componentes');
            console.log('      Componentes:', components);

            if (components.length > 0) {
                const expression = buildComponentsExpression(components);
                console.log('      Expresión construida:', expression);
                params.push(expression);
            } else {
                params.push('');  // Parámetro vacío
            }
        });

        console.log('📦 Parámetros recopilados:', params);

        // Construir expresión completa
        if (params.length > 0) {
            // Unir parámetros con comas
            const paramsText = params.filter(p => p.trim() !== '').join(',');
            fullExpression = `#${currentLevel.functionName}(${paramsText})#`;
        } else {
            fullExpression = `#${currentLevel.functionName}()#`;
        }
    }

    console.log('✅ Expresión completa:', fullExpression);

    previewElement.textContent = fullExpression;

    // ✅ El contenedor ahora siempre es visible, solo actualizamos el contenido
}

function closeOperatorsSidebar() {
    const sidebar = document.querySelector('.operators-sidebar');
    if (sidebar) {
        sidebar.style.display = 'none';
    }
}

// ===== DRAG & DROP DE FUNCIONES DESDE SIDEBAR =====

function dragFunctionStart(event) {
    const functionName = event.target.closest('.draggable-function-item').getAttribute('data-function');
    draggedFunctionName = functionName;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', functionName);
    event.target.closest('.draggable-function-item').classList.add('dragging');
}

function dragFunctionEnd(event) {
    console.log('🏁 DRAG END Función');
    // Limpiar estado visual cuando termina el drag
    const functionItem = event.target.closest('.draggable-function-item');
    if (functionItem) {
        functionItem.classList.remove('dragging');
    }
    // ✅ CORREGIDO: No limpiar draggedFunctionName aquí porque el evento 'drop' puede no haber ejecutado aún
    // draggedFunctionName se limpia en dropIntoMiniBuilder() o dropIntoExpression() después de usarlo
}

function allowFunctionDrop(event, varId) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
    targetVarId = varId;
}

function dragFunctionLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

// ========== DRAG DE VARIABLES ==========
let draggedVariableId = null;
let draggedVariableName = '';

function dragVariable(event, varId) {
    console.log('🎯 DRAG START Variable:', varId);
    draggedVariableId = varId;

    // Obtener el nombre de la variable
    const nameElement = document.getElementById('varName' + varId);
    draggedVariableName = nameElement ? nameElement.textContent : `Variable ${varId}`;

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', draggedVariableName);
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    console.log('🏁 DRAG END Variable');
    event.target.classList.remove('dragging');
}

// ========== EXPRESIÓN LÓGICA FINAL ==========
let logicComponents = [];
let draggedLogicOperator = null;

// Drag operadores lógicos
function dragLogicOperator(event, operator) {
    console.log('🔧 DRAG START Logic Operator:', operator);
    draggedLogicOperator = operator;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', operator);
    event.target.classList.add('dragging');
}

function dragLogicOperatorEnd(event) {
    console.log('🏁 DRAG END Logic Operator');
    event.target.classList.remove('dragging');
}

// Drop zone handlers
function allowLogicDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('👀 DRAG OVER expresión lógica');
    event.currentTarget.classList.add('drag-over');
}

function dragLogicLeave(event) {
    console.log('👋 DRAG LEAVE expresión lógica');
    event.currentTarget.classList.remove('drag-over');
}

// Drop into logic expression
function dropIntoLogicExpression(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    console.log('📦 DROP en expresión lógica');

    let component = null;

    // Verificar si es una variable
    if (draggedVariableId !== null) {
        console.log('   ✅ Variable detectada:', draggedVariableId);

        const nameElement = document.getElementById('varName' + draggedVariableId);
        const varName = nameElement ? nameElement.textContent : `Variable ${draggedVariableId}`;

        component = {
            type: 'variable',
            id: draggedVariableId,
            name: varName,
            html: varName
        };

        draggedVariableId = null;
        draggedVariableName = '';
    }
    // Verificar si es un operador lógico (de la paleta nueva)
    else if (draggedLogicOperator !== null) {
        console.log('   ✅ Operador lógico detectado:', draggedLogicOperator);

        const isParenthesis = draggedLogicOperator === '(' || draggedLogicOperator === ')';

        component = {
            type: isParenthesis ? 'parenthesis' : 'operator',
            value: draggedLogicOperator,
            html: draggedLogicOperator
        };

        draggedLogicOperator = null;
    }
    // Verificar si es un operador del sidebar
    else if (draggedOperator !== null && draggedOperator !== undefined) {
        console.log('   ✅ Operador del sidebar detectado:', draggedOperator);

        const isParenthesis = draggedOperator === '(' || draggedOperator === ')';

        component = {
            type: isParenthesis ? 'parenthesis' : 'operator',
            value: draggedOperator,
            html: draggedOperator
        };

        draggedOperator = null;
    }

    if (component) {
        logicComponents.push(component);
        console.log('   📊 Total componentes:', logicComponents.length);
        renderLogicExpression();
    }

    // Limpiar estados de dragging
    document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
    });
}

// =============================================
// INSERTAR VALORES EN EXPRESIÓN LÓGICA
// =============================================

/**
 * Muestra el input inline para insertar un valor en la expresión lógica
 */
function mostrarInputValorLogico() {
    const inputContainer = document.getElementById('inlineValueInputLogico');
    const input = document.getElementById('inputValorLogicoExpr');
    const btn = document.getElementById('btnInsertarValorLogico');

    if (inputContainer && btn && input) {
        inputContainer.style.display = 'inline-flex';
        btn.style.display = 'none';
        input.value = '';
        input.focus();
    }
}

/**
 * Acepta el valor ingresado y lo agrega a la expresión lógica
 */
function aceptarValorLogicoExpr() {
    const input = document.getElementById('inputValorLogicoExpr');
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

    // Agregar el valor a la expresión lógica
    const component = {
        type: 'value',
        value: value,
        html: displayText
    };

    logicComponents.push(component);
    console.log('   📊 Valor agregado:', value);

    cancelarValorLogicoExpr();
    renderLogicExpression();
}

/**
 * Cancela la inserción de valor y oculta el input
 */
function cancelarValorLogicoExpr() {
    const inputContainer = document.getElementById('inlineValueInputLogico');
    const btn = document.getElementById('btnInsertarValorLogico');

    if (inputContainer && btn) {
        inputContainer.style.display = 'none';
        btn.style.display = 'inline-flex';
    }
}

// Renderizar la expresión lógica
function renderLogicExpression() {
    const builder = document.getElementById('logicExprBuilder');
    if (!builder) {
        console.error('❌ No se encontró el contenedor logicExprBuilder');
        return;
    }

    console.log('🎨 Renderizando expresión lógica:', logicComponents);
    console.log('   Builder encontrado:', builder);

    if (logicComponents.length === 0) {
        builder.innerHTML = `
            <div class="empty">
                <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                Arrastra variables y operadores para construir la expresión lógica
            </div>
        `;
        console.log('   ✅ Placeholder mostrado (sin componentes)');
        updateLogicExpressionString();
        return;
    }

    console.log('   🧹 Limpiando contenedor...');
    builder.innerHTML = '';

    logicComponents.forEach((comp, index) => {
        console.log(`   🔨 Creando pill #${index}:`, comp);

        const pill = document.createElement('div');
        pill.className = `logic-component ${comp.type}`;
        pill.innerHTML = `
            <span>${comp.html}</span>
            <button class="remove-btn" onclick="removeLogicComponent(${index})" type="button">
                <i class="fas fa-times"></i>
            </button>
        `;

        builder.appendChild(pill);
        console.log(`      ✅ Pill #${index} agregada. Clases:`, pill.className);
    });

    console.log('   📊 Total pills en DOM:', builder.children.length);
    console.log('   📝 HTML final:', builder.innerHTML.substring(0, 200) + '...');

    updateLogicExpressionString();
}

// Eliminar un componente de la expresión lógica
function removeLogicComponent(index) {
    console.log('🗑️ Eliminando componente lógico:', index);
    logicComponents.splice(index, 1);
    renderLogicExpression();
}

// Actualizar el string de la expresión lógica
function updateLogicExpressionString() {
    const expression = logicComponents.map(comp => {
        if (comp.type === 'variable') {
            // Las variables se representan con su nombre entre llaves
            return `{${comp.name}}`;
        } else if (comp.type === 'operator' || comp.type === 'parenthesis') {
            return comp.value;
        } else if (comp.type === 'value') {
            // Los valores se agregan tal cual (números o texto con comillas)
            return comp.value;
        }
        return '';
    }).join(' ');

    console.log('📝 Expresión lógica final:', expression);

    // Actualizar el HiddenField si existe
    const hiddenField = document.querySelector('input[id*="hdnExpresionLogica"]');
    if (hiddenField) {
        hiddenField.value = expression;
        console.log('   ✅ HiddenField actualizado');
    }

    // Actualizar la vista previa visual
    const preview = document.getElementById('logicExpressionPreview');
    if (preview) {
        if (expression.trim() === '') {
            preview.innerHTML = '<span class="preview-empty">Sin expresión configurada</span>';
        } else {
            preview.textContent = expression;
        }
        console.log('   ✅ Vista previa actualizada');
    }

    return expression;
}

function dropFunction(event, varId) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    // Remover clase dragging de todos los items
    document.querySelectorAll('.draggable-function-item.dragging').forEach(item => {
        item.classList.remove('dragging');
    });

    if (!draggedFunctionName) return;

    // Establecer contexto para el constructor visual
    const builder = document.getElementById('exprBuilder' + varId);
    if (builder) {
        const tempInput = document.createElement('textarea');
        tempInput.style.display = 'none';
        builder.appendChild(tempInput);

        activeInput = tempInput;
        activeInput.varId = varId;
    }

    // Abrir modal inmediatamente con la función
    openFunctionModal(draggedFunctionName, activeInput);

    // Limpiar
    draggedFunctionName = null;
    targetVarId = null;
}

// Filtrar funciones en sidebar
function filterSidebarFunctions(event) {
    const query = event.target.value.toLowerCase();
    const items = document.querySelectorAll('.draggable-function-item');

    items.forEach(item => {
        const name = item.querySelector('.draggable-function-name').textContent.toLowerCase();
        const desc = item.querySelector('.draggable-function-desc').textContent.toLowerCase();

        if (name.includes(query) || desc.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Inicializar componentes de expresión para una variable
function initExpressionComponents(varId) {
    if (!expressionComponents[varId]) {
        expressionComponents[varId] = [];
    }
}

// ===== CONSTRUCTOR VISUAL DE EXPRESIONES =====

// Abrir selector de funciones
function openFunctionSelector(varId) {
    const builder = document.getElementById('exprBuilder' + varId);
    const tempInput = document.createElement('textarea');
    tempInput.style.display = 'none';
    builder.appendChild(tempInput);

    activeInput = tempInput;
    activeInput.varId = varId;

    const card = builder.closest('.variable-card');
    const functionMenu = card.querySelector('.function-menu');
    if (functionMenu) {
        // Cerrar todos los otros menús
        document.querySelectorAll('.function-menu.active').forEach(m => m.classList.remove('active'));

        // Abrir este menú
        functionMenu.classList.add('active');

        // Hacer scroll hasta el menú de funciones con animación suave
        setTimeout(() => {
            const functionMenuContainer = card.querySelector('.function-menu-container');
            if (functionMenuContainer) {
                functionMenuContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });

                // Efecto visual de destacar el menú
                functionMenu.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    functionMenu.style.animation = '';
                }, 500);
            }
        }, 100);
    }
}

// Abrir selector de campos
function openFieldSelector(varId) {
    const fields = getAvailableFields();
    if (fields.length === 0) {
        alert('⚠️ No hay campos disponibles\n\nAsegúrese de que existen campos configurados en el sistema.');
        return;
    }

    let fieldOptions = '📊 SELECCIONAR CAMPO\n\n';
    fieldOptions += 'Campos disponibles:\n\n';
    fields.forEach((f, i) => {
        fieldOptions += `  ${i + 1}. ${f.name}${f.description ? ' - ' + f.description : ''}\n`;
    });
    fieldOptions += '\n💡 Ingrese el número del campo:';

    const fieldName = prompt(fieldOptions);
    if (fieldName) {
        const fieldIndex = parseInt(fieldName) - 1;
        if (fieldIndex >= 0 && fieldIndex < fields.length) {
            addExprComponent(varId, 'field', `[${fields[fieldIndex].name}]`, `<i class="fas fa-database expr-icon"></i><span class="expr-value">[${fields[fieldIndex].name}]</span>`);
        } else {
            alert('❌ Número inválido\n\nPor favor ingrese un número entre 1 y ' + fields.length);
        }
    }
}

// Abrir selector de operadores
// Abrir panel lateral de operadores
function openOperatorSelector(varId) {
    const sidebar = document.querySelector('.operators-sidebar');
    if (sidebar) {
        sidebar.style.display = 'flex';
    }

    // Ocultar panel de funciones si está abierto
    const functionsSidebar = document.querySelector('.functions-sidebar');
    if (functionsSidebar) {
        functionsSidebar.style.display = 'none';
    }
}

// Agregar componente de valor
function addValueComponent(varId) {
    const builder = document.getElementById('exprBuilder' + varId);
    if (!builder) return;

    // Verificar si ya hay un input inline activo
    const existingInput = builder.querySelector('.inline-value-input');
    if (existingInput) {
        existingInput.querySelector('input').focus();
        return;
    }

    // Remover la clase 'empty' si existe
    const emptyDiv = builder.querySelector('.empty');
    if (emptyDiv) {
        emptyDiv.style.display = 'none';
    }

    // Crear el contenedor de componentes si no existe
    let componentsContainer = builder.querySelector('.expression-components');
    if (!componentsContainer) {
        componentsContainer = document.createElement('div');
        componentsContainer.className = 'expression-components';
        builder.appendChild(componentsContainer);
    }

    // Crear el input inline
    const inlineInputContainer = document.createElement('div');
    inlineInputContainer.className = 'inline-value-input';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = '18, "TEXTO", 3.14';
    inputField.autocomplete = 'off';

    const btnAccept = document.createElement('button');
    btnAccept.className = 'btn-accept';
    btnAccept.innerHTML = '✓';
    btnAccept.title = 'Aceptar';

    const btnCancel = document.createElement('button');
    btnCancel.className = 'btn-cancel';
    btnCancel.innerHTML = '✕';
    btnCancel.title = 'Cancelar';

    // Función para aceptar el valor
    const acceptValue = () => {
        const value = inputField.value.trim();
        if (value !== '') {
            addExprComponent(varId, 'value', value, `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${value}</span>`);
        }
        inlineInputContainer.remove();

        // Mostrar empty si no hay componentes
        if (!expressionComponents[varId] || expressionComponents[varId].length === 0) {
            if (emptyDiv) emptyDiv.style.display = 'flex';
        }
    };

    // Función para cancelar
    const cancelInput = () => {
        inlineInputContainer.remove();

        // Mostrar empty si no hay componentes
        if (!expressionComponents[varId] || expressionComponents[varId].length === 0) {
            if (emptyDiv) emptyDiv.style.display = 'flex';
        }
    };

    // Event listeners
    btnAccept.onclick = acceptValue;
    btnCancel.onclick = cancelInput;

    inputField.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            acceptValue();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelInput();
        }
    };

    // Ensamblar
    inlineInputContainer.appendChild(inputField);
    inlineInputContainer.appendChild(btnAccept);
    inlineInputContainer.appendChild(btnCancel);
    componentsContainer.appendChild(inlineInputContainer);

    // Focus automático
    setTimeout(() => inputField.focus(), 100);
}

// Agregar paréntesis
function addParenthesis(varId, type) {
    const choice = prompt('() SELECCIONAR PARÉNTESIS\n\nOpciones:\n\n  1. ( Abrir paréntesis\n  2. ) Cerrar paréntesis\n\n💡 Ingrese el número:');
    if (choice === '1') {
        addExprComponent(varId, 'parenthesis', '(', '<span class="expr-value">(</span>');
    } else if (choice === '2') {
        addExprComponent(varId, 'parenthesis', ')', '<span class="expr-value">)</span>');
    } else if (choice !== null && choice.trim() !== '') {
        alert('❌ Opción inválida\n\nPor favor ingrese 1 o 2');
    }
}

// Agregar componente a la expresión
function addExprComponent(varId, type, value, html, metadata = null) {
    initExpressionComponents(varId);
    const componentId = 'comp_' + (++componentCounter);
    const component = {
        id: componentId,
        type: type,
        value: value,
        html: html,
        order: expressionComponents[varId].length,
        metadata: metadata // Guardar metadata para funciones (nombre, bloques, etc)
    };
    expressionComponents[varId].push(component);
    renderExpression(varId);
    updateExpressionPreview(varId);
}

// Renderizar expresión visual
function renderExpression(varId) {
    const builder = document.getElementById('exprBuilder' + varId);
    if (!builder) return;

    initExpressionComponents(varId);
    const components = expressionComponents[varId];

    if (components.length === 0) {
        builder.classList.add('empty');
        builder.innerHTML = '<div class="empty"><i class="fas fa-puzzle-piece" style="margin-right: 8px;"></i>Arrastra componentes aquí para construir la expresión</div>';
        return;
    }

    builder.classList.remove('empty');
    let html = '<div class="expression-components">';
    components.forEach((comp, index) => {
        html += `<div class="expr-component" data-type="${comp.type}" data-comp-id="${comp.id}"><div class="expr-content">${comp.html}</div><div class="expr-actions">`;
        if (comp.type === 'function') html += `<button type="button" class="expr-btn edit" onclick="editExprComponent('${comp.id}', ${varId})" title="Editar"><i class="fas fa-edit"></i></button>`;
        if (comp.type === 'value') html += `<button type="button" class="expr-btn edit" onclick="editExprValue('${comp.id}', ${varId})" title="Editar"><i class="fas fa-edit"></i></button>`;
        html += `<button type="button" class="expr-btn delete" onclick="deleteExprComponent('${comp.id}', ${varId})" title="Eliminar"><i class="fas fa-trash"></i></button></div></div>`;
    });
    html += '</div>';
    builder.innerHTML = html;
}

// Eliminar componente
// Eliminar componente con confirmación
function deleteExprComponent(compId, varId) {
    initExpressionComponents(varId);
    const comp = expressionComponents[varId].find(c => c.id === compId);
    if (!comp) return;

    // Tipos simples que NO requieren confirmación
    const simpleTypes = ['operator', 'value', 'parenthesis'];

    if (simpleTypes.includes(comp.type)) {
        // Eliminar directamente sin confirmación
        expressionComponents[varId] = expressionComponents[varId].filter(c => c.id !== compId);
        renderExpression(varId);
        updateExpressionPreview(varId);
        return;
    }

    // Para funciones y campos, pedir confirmación
    const componentTypes = {
        'function': '📅 Función',
        'field': '📊 Campo'
    };

    const typeLabel = componentTypes[comp.type] || comp.type;
    const shortValue = comp.value.length > 30 ? comp.value.substring(0, 27) + '...' : comp.value;

    let mensaje = `¿Eliminar este componente?\n\n`;
    mensaje += `Tipo: ${typeLabel}\n`;
    mensaje += `Valor: ${shortValue}`;

    if (comp.type === 'function' && comp.metadata) {
        mensaje += `\n\n⚠️ Esta función tiene ${comp.metadata.blocks ? comp.metadata.blocks.length : 0} bloque(s) configurado(s)`;
    }

    if (confirm(mensaje)) {
        expressionComponents[varId] = expressionComponents[varId].filter(c => c.id !== compId);
        renderExpression(varId);
        updateExpressionPreview(varId);
    }
}

// Editar valor de componente
function editExprValue(compId, varId) {
    initExpressionComponents(varId);
    const comp = expressionComponents[varId].find(c => c.id === compId);
    if (!comp) return;
    const newValue = prompt('Editar valor:', comp.value);
    if (newValue !== null && newValue.trim() !== '') {
        comp.value = newValue.trim();
        comp.html = `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${newValue.trim()}</span>`;
        renderExpression(varId);
        updateExpressionPreview(varId);
    }
}

// Editar componente de función
// ✨ NUEVO: Editar componente de función desde expression builder
function editExprComponent(compId, varId) {
    initExpressionComponents(varId);
    const comp = expressionComponents[varId].find(c => c.id === compId);
    if (!comp || comp.type !== 'function') return;

    console.log('✏️ Editando función:', comp);

    // Verificar que tenga metadata con la información necesaria
    if (!comp.metadata || !comp.metadata.functionName) {
        alert('No se puede editar esta función. Por favor elimínela y créela de nuevo.');
        return;
    }

    // Guardar referencia para actualizar después
    window.editingComponent = { compId, varId, originalComponent: comp };

    // Crear input temporal para el contexto
    const builder = document.getElementById('exprBuilder' + varId);
    const tempInput = document.createElement('textarea');
    tempInput.style.display = 'none';
    builder.appendChild(tempInput);

    activeInput = tempInput;
    activeInput.varId = varId;
    activeInput.editMode = true; // Marcar modo edición

    // Abrir panel de configuración
    openConfigPanel(comp.metadata.functionName, tempInput);

    // Esperar a que el panel se renderice y cargar los parámetros
    setTimeout(() => {
        loadParamsIntoConfigPanel(comp.metadata, varId);
    }, 300);
}

// ✨ NUEVA FUNCIÓN: Cargar parámetros guardados en el panel de configuración para editar
function loadParamsIntoConfigPanel(metadata, varId) {
    console.log('📥 Cargando parámetros para editar:', metadata);

    // Manejo especial para "Calcular edad" que usa bloques
    console.log('   🔍 Verificando Calcular edad:', {
        functionName: metadata.functionName,
        hasBlocks: !!metadata.blocks,
        blocksLength: metadata.blocks ? metadata.blocks.length : 0
    });

    if (metadata.functionName === 'Calcular edad' && metadata.blocks) {
        console.log('   🎂 Restaurando bloques de Calcular edad:', metadata.blocks);

        // Restaurar droppedBlocks desde metadata
        droppedBlocks = JSON.parse(JSON.stringify(metadata.blocks));

        // Renderizar los bloques en la drop zone
        setTimeout(() => {
            renderBlocks();
            updateBlockPreview();
        }, 100);

        return;
    }

    if (!metadata.params || metadata.params.length === 0) {
        console.log('   No hay parámetros guardados');
        return;
    }

    const body = document.getElementById('configPanelBody' + varId);
    if (!body) return;

    const miniBuilders = body.querySelectorAll('.mini-expression-builder');

    console.log('   Mini-builders encontrados:', miniBuilders.length);
    console.log('   Parámetros a cargar:', metadata.params);

    // Cargar cada parámetro en su mini-builder correspondiente
    metadata.params.forEach((paramExpression, index) => {
        if (index >= miniBuilders.length) return;

        const builder = miniBuilders[index];
        const builderId = builder.id;

        console.log(`   Cargando en builder ${index} (${builderId}):`, paramExpression);

        // Parsear la expresión del parámetro y recrear los componentes
        const components = parseExpressionToComponents(paramExpression);

        if (components.length > 0) {
            miniBuilderComponents[builderId] = components;
            renderMiniBuilder(builderId);
            console.log('      ✅ Componentes cargados:', components);

            // ✨ NUEVO: Recrear niveles anidados en el navigationStack para funciones anidadas
            components.forEach(comp => {
                if (comp.type === 'function' && comp.configured && comp.params) {
                    console.log('      🔄 Recreando nivel anidado para:', comp.value);
                    recreateNestedLevel(comp.value, builderId, comp.functionId, comp.params, varId);
                }
            });
        }
    });

    // Actualizar vista previa
    setTimeout(() => {
        updateCurrentLevelPreview();
    }, 100);
}

// ✨ NUEVA FUNCIÓN: Recrear nivel anidado en el navigationStack
// ✅ CORREGIDO: Calcular levelIndex correctamente antes de usarlo
function recreateNestedLevel(functionName, parentBuilderId, functionId, params, varId) {
    console.log('      📦 Recreando nivel:', functionName, 'con params:', params);

    // Verificar si ya existe este nivel en el stack
    const existingLevel = navigationStack.levels.find(
        level => level.functionId === functionId && level.parentBuilderId === parentBuilderId
    );

    if (existingLevel) {
        console.log('      ℹ️ Nivel ya existe, saltando recreación');
        return;
    }

    // ✅ CRÍTICO: Calcular el índice del nivel ANTES de agregarlo
    const levelIndex = navigationStack.levels.length;
    console.log(`      📍 Nivel será el índice: ${levelIndex}`);

    // Crear nuevo nivel
    const newLevel = createConfigLevel(functionName, parentBuilderId, functionId, varId);

    // Parsear los parámetros y crear mini-builders para este nivel
    params.forEach((paramExpression, paramIndex) => {
        // ✅ CORREGIDO: Usar levelIndex fijo en lugar de navigationStack.levels.length dinámico
        const paramBuilderId = `miniBuilder_level${levelIndex}_param${paramIndex + 1}`;

        console.log(`         Creando builder ${paramBuilderId} con expresión:`, paramExpression);

        // Parsear componentes del parámetro
        const paramComponents = parseExpressionToComponents(paramExpression);

        if (paramComponents.length > 0) {
            // Guardar componentes en el estado del nivel
            newLevel.miniBuilderStates[paramBuilderId] = paramComponents;
            console.log(`         💾 Guardados ${paramComponents.length} componentes en ${paramBuilderId}`);

            // Recursivamente recrear sub-niveles si hay funciones anidadas
            paramComponents.forEach(comp => {
                if (comp.type === 'function' && comp.configured && comp.params) {
                    console.log(`         🔄 Función anidada encontrada: ${comp.value}`);
                    // Agregar el nivel actual primero antes de recursar
                    navigationStack.levels.push(newLevel);
                    recreateNestedLevel(comp.value, paramBuilderId, comp.functionId, comp.params, varId);
                    // El nivel ya fue agregado, no lo agregamos de nuevo
                    return;
                }
            });
        }
    });

    // Agregar el nivel al stack si aún no está
    if (!navigationStack.levels.find(l => l.functionId === functionId)) {
        navigationStack.levels.push(newLevel);
        console.log('      ✅ Nivel recreado y agregado al stack');
    }
}

// ✨ NUEVA FUNCIÓN: Parsear parámetros respetando funciones anidadas
function parseNestedParams(paramsStr) {
    if (!paramsStr || paramsStr.trim() === '') {
        return [];
    }

    const params = [];
    let current = '';
    let depth = 0; // Nivel de anidación de #...#

    for (let i = 0; i < paramsStr.length; i++) {
        const char = paramsStr[i];

        if (char === '#') {
            // Alternar depth cuando encontramos #
            if (i > 0 && paramsStr[i - 1] !== '\\') { // No contar \# escapado
                depth = depth === 0 ? 1 : 0;
            }
            current += char;
        } else if (char === ',' && depth === 0) {
            // Solo dividir por coma si no estamos dentro de una función (#...#)
            if (current.trim() !== '') {
                params.push(current.trim());
            }
            current = '';
        } else {
            current += char;
        }
    }

    // Agregar el último parámetro
    if (current.trim() !== '') {
        params.push(current.trim());
    }

    return params;
}

// ✨ NUEVA FUNCIÓN: Parsear expresión de texto a componentes
// ✅ CORREGIDO: Parser manual para manejar funciones anidadas correctamente
function parseExpressionToComponents(expression) {
    const components = [];

    if (!expression || expression.trim() === '') {
        return components;
    }

    console.log('      Parseando expresión:', expression);

    let i = 0;
    while (i < expression.length) {
        const char = expression[i];

        // Saltar espacios
        if (char === ' ') {
            i++;
            continue;
        }

        // Detectar campo: [nombre]
        if (char === '[') {
            const endIdx = expression.indexOf(']', i);
            if (endIdx !== -1) {
                const fieldName = expression.substring(i + 1, endIdx);
                components.push({
                    type: 'field',
                    value: fieldName,
                    html: `<i class="fas fa-database expr-icon"></i><span class="expr-value">${fieldName}</span>`
                });
                i = endIdx + 1;
                continue;
            }
        }

        // Detectar función anidada: #Nombre(...)#
        if (char === '#') {
            // Buscar el # de cierre, contando paréntesis para manejar anidación
            let depth = 0;
            let inFunction = false;
            let endIdx = i + 1;

            for (let j = i + 1; j < expression.length; j++) {
                if (expression[j] === '(') {
                    depth++;
                    inFunction = true;
                } else if (expression[j] === ')') {
                    depth--;
                } else if (expression[j] === '#' && inFunction && depth === 0) {
                    endIdx = j;
                    break;
                }
            }

            if (endIdx > i + 1) {
                const token = expression.substring(i, endIdx + 1);
                const funcNameMatch = token.match(/#([^(]+)\(/);
                if (funcNameMatch) {
                    const funcName = funcNameMatch[1];
                    const startIdx = token.indexOf('(') + 1;
                    const lastIdx = token.lastIndexOf(')');
                    const paramsStr = token.substring(startIdx, lastIdx);
                    const funcParams = parseNestedParams(paramsStr);
                    const functionId = 'func_' + Date.now() + '_' + i;

                    components.push({
                        type: 'function',
                        value: funcName,
                        functionId: functionId,
                        configured: true,
                        fullExpression: token,
                        params: funcParams,
                        html: `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${token}</span>`
                    });
                }
                i = endIdx + 1;
                continue;
            }
        }

        // Detectar operadores
        const remaining = expression.substring(i);
        const operatorMatch = remaining.match(/^(AND|OR|>=|<=|!=|[+\-*/=<>!])/i);
        if (operatorMatch) {
            const operator = operatorMatch[1];
            components.push({
                type: 'operator',
                value: operator,
                html: `<span class="expr-operator">${operator}</span>`
            });
            i += operator.length;
            continue;
        }

        // Detectar valores simples (números, texto, etc.)
        const valueMatch = remaining.match(/^([^\s\[\]#(),]+)/);
        if (valueMatch) {
            const value = valueMatch[1];
            if (value !== ',') {  // Ignorar comas sueltas
                components.push({
                    type: 'value',
                    value: value,
                    html: `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${value}</span>`
                });
            }
            i += value.length;
            continue;
        }

        // Si no coincide con nada, avanzar un carácter
        i++;
    }

    return components;
}

// Cargar bloques guardados en el modal para edición
function loadBlocksIntoModal(blocks) {
    if (!blocks || blocks.length === 0) return;

    // Limpiar bloques actuales
    droppedBlocks = [];

    // Recargar cada bloque
    blocks.forEach(block => {
        droppedBlocks.push({
            id: 'block_' + Date.now() + '_' + Math.random(),
            type: block.type,
            value: block.value,
            order: block.order
        });
    });

    // Renderizar bloques en el modal
    renderBlocks();
    updateBlockPreview();
}


// Actualizar preview de la expresión
function updateExpressionPreview(varId) {
    initExpressionComponents(varId);
    const components = expressionComponents[varId];
    let exprText = '';
    components.forEach(comp => {
        if (comp.type === 'field' || comp.type === 'value' || comp.type === 'function' || comp.type === 'parenthesis') {
            exprText += comp.value;
        } else if (comp.type === 'operator') {
            exprText += ' ' + comp.value + ' ';
        }
    });
    updatePreview(varId, 'expr', exprText);
}

// Drag & drop para expresiones
function allowExprDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function dragExprLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function dropExprComponent(event, varId) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
}

// ===== FIN CONSTRUCTOR VISUAL =====

// Catálogo de funciones con sus parámetros
const functionCatalog = {
    'CalculaEdad': {
        icon: 'fa-birthday-cake',
        name: 'Calcular Edad',
        desc: 'Calcula la edad en años desde una fecha de nacimiento. Si especificas operador y valor, retorna true/false.',
        params: [
            { name: 'campo_fecha', type: 'field', required: true, hint: 'Campo con fecha de nacimiento' },
            { name: 'operador', type: 'select', required: false, hint: 'Operador de comparación (vacío para solo calcular)', options: ['', '>', '<', '>=', '<=', '=', '!='] },
            { name: 'valor', type: 'text', required: false, hint: 'Valor a comparar (ej: 18). Dejar vacío si no usas operador' },
            { name: 'formato', type: 'select', required: true, hint: 'Formato de año', options: ['YYYY', 'YY'] }
        ],
        template: '#CalculaEdad([?campo_fecha],[?operador],[?valor],[?formato])#'
    },
    'SiEntonces': {
        icon: 'fa-code-branch',
        name: 'Si Entonces',
        desc: 'Evaluación condicional - retorna un valor si la condición es verdadera, otro si es falsa',
        params: [
            { name: 'condicion', type: 'text', required: true, hint: 'Expresión lógica a evaluar' },
            { name: 'valor_verdadero', type: 'text', required: true, hint: 'Valor si es verdadero' },
            { name: 'valor_falso', type: 'text', required: true, hint: 'Valor si es falso' }
        ],
        template: '#SiEntonces([?condicion], [?valor_verdadero], [?valor_falso])#'
    },
    'Conteo': {
        icon: 'fa-hashtag',
        name: 'Conteo',
        desc: 'Cuenta elementos en una colección',
        params: [
            { name: 'campo', type: 'field', required: true, hint: 'Campo a contar' }
        ],
        template: '#Conteo([?campo])#'
    },
    'Maximo': {
        icon: 'fa-arrow-up',
        name: 'Máximo',
        desc: 'Retorna el valor máximo de una colección',
        params: [
            { name: 'campo', type: 'field', required: true, hint: 'Campo a evaluar' }
        ],
        template: '#Maximo([?campo])#'
    },
    'Minimo': {
        icon: 'fa-arrow-down',
        name: 'Mínimo',
        desc: 'Retorna el valor mínimo de una colección',
        params: [
            { name: 'campo', type: 'field', required: true, hint: 'Campo a evaluar' }
        ],
        template: '#Minimo([?campo])#'
    },
    'Promedio': {
        icon: 'fa-chart-line',
        name: 'Promedio',
        desc: 'Calcula el promedio aritmético',
        params: [
            { name: 'campo', type: 'field', required: true, hint: 'Campo a promediar' }
        ],
        template: '#Promedio([?campo])#'
    },
    'Suma': {
        icon: 'fa-plus',
        name: 'Suma',
        desc: 'Suma todos los valores',
        params: [
            { name: 'campo', type: 'field', required: true, hint: 'Campo a sumar' }
        ],
        template: '#Suma([?campo])#'
    },
    'ConteoCaracteres': {
        icon: 'fa-text-width',
        name: 'Conteo Caracteres',
        desc: 'Cuenta la cantidad de caracteres en un texto',
        params: [
            { name: 'campo', type: 'field', required: true, hint: 'Campo de texto' }
        ],
        template: '#ConteoCaracteres([?campo])#'
    },
    'ExpresionRegular': {
        icon: 'fa-code',
        name: 'Expresión Regular',
        desc: 'Validación de texto con expresión regular',
        params: [
            { name: 'campo', type: 'field', required: true, hint: 'Campo a validar' },
            { name: 'patron', type: 'text', required: true, hint: 'Patrón regex' }
        ],
        template: '#ExpresionRegular([?campo], [?patron])#'
    },
    'CualquierFecha': {
        icon: 'fa-calendar-alt',
        name: 'Cualquier Fecha',
        desc: 'Operaciones con fechas',
        params: [
            { name: 'campo', type: 'field', required: true, hint: 'Campo de fecha' },
            { name: 'operacion', type: 'text', required: false, hint: 'Operación (ej: +30 días)' }
        ],
        template: '#CualquierFecha([?campo], [?operacion])#'
    }
};

// Crear popup de autocompletado
function createAutocompletePopup() {
    if (autocompletePopup) return;

    autocompletePopup = document.createElement('div');
    autocompletePopup.className = 'autocomplete-popup';
    autocompletePopup.id = 'autocompletePopup';
    document.body.appendChild(autocompletePopup);

    // Click fuera cierra el popup
    document.addEventListener('click', function (e) {
        if (autocompletePopup && !autocompletePopup.contains(e.target) && e.target !== activeInput) {
            hideAutocomplete();
        }
    });
}

function agregarVariable() {
    variablesCounter++;
    const container = document.getElementById('variablesContainer');

    const card = document.createElement('div');
    card.className = 'variable-card';
    card.id = 'varCard' + variablesCounter;
    card.innerHTML = `
                <div class="variable-card-header" onclick="toggleCard(${variablesCounter})"
                     draggable="true"
                     ondragstart="dragVariable(event, ${variablesCounter})"
                     ondragend="dragEnd(event)">
                    <div class="variable-card-content">
                        <div class="variable-number">${variablesCounter}</div>
                        <div class="variable-info">
                            <div class="variable-name-preview" id="varName${variablesCounter}">Variable ${variablesCounter}</div>
                            <div class="variable-expression-preview" id="varExpr${variablesCounter}">Sin expresión configurada</div>
                        </div>
                    </div>
                    <div class="variable-card-actions" onclick="event.stopPropagation();">
                        <button type="button" class="variable-btn expand" onclick="toggleCard(${variablesCounter})">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <button type="button" class="variable-btn delete" onclick="eliminarVariable(${variablesCounter})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="variable-card-body">
                    <div class="variable-field">
                        <div class="variable-field-label">Nombre de la Variable</div>
                        <input type="text" class="variable-field-input" placeholder="Ej: EDAD" 
                               onkeyup="updatePreview(${variablesCounter}, 'name', this.value)"
                               onfocus="activeInput = this"
                               style="font-family: inherit;">
                    </div>
                    
                    <div class="variable-fields-grid">
                        <div class="variable-field">
                            <div class="variable-field-label">Función</div>
                            <select class="variable-field-input" style="font-family: inherit;">
                                <option value="expresion">Expresión</option>
                                <option value="valor">Valor Fijo</option>
                            </select>
                        </div>
                        <div class="variable-field">
                            <div class="variable-field-label">Origen</div>
                            <select class="variable-field-input" style="font-family: inherit;">
                                <option value="producto">Campos del Producto</option>
                                <option value="cliente">Campos del Cliente</option>
                            </select>
                        </div>
                    </div>

                    <div class="variable-field">
                        <div class="variable-field-label">Expresión</div>
                        <div class="expression-builder" id="exprBuilder${variablesCounter}" 
                             ondrop="dropItem(event, ${variablesCounter})" 
                             ondragover="allowItemDrop(event, ${variablesCounter})" 
                             ondragleave="dragItemLeave(event)">
                            <div class="empty">
                                <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                                Arrastra funciones u operadores o usa los componentes
                            </div>
                        </div>
                        
                        <div class="component-palette">
                            <div class="component-palette-title">
                                <i class="fas fa-cubes"></i>
                                Componentes Disponibles
                            </div>
                            <div class="component-palette-items">
                                <div class="component-palette-item" data-type="value" onclick="addValueComponent(${variablesCounter})">
                                    <i class="fas fa-hashtag"></i>
                                    Valor
                                </div>
                                <div class="component-palette-item" data-type="parenthesis" onclick="addParenthesis(${variablesCounter}, '(')">
                                    <i class="fas fa-bracket-curly"></i>
                                    ( )
                                </div>
                            </div>
                        </div>

                        <!-- Panel de configuración inline para funciones -->
                        <div class="config-panel" id="configPanel${variablesCounter}">
                            <div class="config-panel-content">
                                <!-- Header -->
                                <div class="config-panel-header">
                                    <div class="config-panel-header-left">
                                        <i class="fas fa-cog"></i>
                                        <span class="config-panel-title" id="configPanelTitle${variablesCounter}">Configurar Función</span>
                                    </div>
                                    <button class="config-panel-close" onclick="closeConfigPanel(${variablesCounter})" title="Cerrar" type="button">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>

                                <!-- Breadcrumb para funciones anidadas -->
                                <div class="config-panel-breadcrumb" id="configBreadcrumb${variablesCounter}" style="display: none;">
                                    <!-- Dinámico: Función 1 > Función 2 > Función 3 -->
                                </div>

                                <!-- Body -->
                                <div class="config-panel-body" id="configPanelBody${variablesCounter}">
                                    <!-- Contenido dinámico -->
                                </div>

                                <!-- ✅ NUEVO: Vista previa global de la expresión completa -->
                                <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; padding: 20px; margin: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid #334155;" id="globalPreview${variablesCounter}Container">
                                    <div style="font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 1px;">
                                        <i class="fas fa-eye" style="color: #10b981; font-size: 16px;"></i>
                                        VISTA PREVIA COMPLETA
                                    </div>
                                    <div id="globalPreview${variablesCounter}" style="font-family: 'Courier New', Consolas, Monaco, monospace; font-size: 14px; color: #10b981; word-break: break-all; line-height: 1.8; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; border-left: 4px solid #10b981; min-height: 40px;">
                                        <span style="color: #64748b; font-style: italic;">Esperando parámetros...</span>
                                    </div>
                                </div>

                                <!-- Footer -->
                                <div class="config-panel-footer">
                                    <button class="btn btn-secondary" onclick="closeConfigPanel(${variablesCounter})" type="button">
                                        <i class="fas fa-times"></i>
                                        Cancelar
                                    </button>
                                    <button class="btn btn-primary" onclick="acceptFunctionConfig(${variablesCounter})" type="button">
                                        <i class="fas fa-check"></i>
                                        Aceptar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="variable-field">
                        <div class="variable-field-label">Expresión Condicional</div>
                        <textarea class="variable-field-input" rows="2" placeholder="Condición opcional"
                                  onfocus="activeInput = this"></textarea>
                    </div>

                    <div class="variable-fields-grid">
                        <div class="variable-field">
                            <div class="variable-field-label">Expresión WHERE</div>
                            <input type="text" class="variable-field-input" placeholder="Opcional"
                                   onfocus="activeInput = this">
                        </div>
                        <div class="variable-field">
                            <div class="variable-field-label">Mensaje WHERE</div>
                            <input type="text" class="variable-field-input" placeholder="Opcional"
                                   onfocus="activeInput = this">
                        </div>
                    </div>

                    <div class="variable-fields-grid">
                        <div class="variable-field">
                            <div class="variable-field-label">Tipo Respuesta</div>
                            <select class="variable-field-input" style="font-family: inherit;">
                                <option value="numerico">Numérico</option>
                                <option value="texto">Texto</option>
                                <option value="booleano">Booleano</option>
                            </select>
                        </div>
                        <div class="variable-field">
                            <div class="variable-field-label">Buró</div>
                            <select class="variable-field-input" style="font-family: inherit;">
                                <option value="">Ninguno</option>
                                <option value="producto">Campos del producto</option>
                            </select>
                        </div>
                    </div>

                    <div class="variable-fields-grid">
                        <div class="variable-field">
                            <div class="variable-field-label">Bloque</div>
                            <select class="variable-field-input" style="font-family: inherit;">
                                <option value="">Seleccione...</option>
                                <option value="bloque1">Bloque 1</option>
                            </select>
                        </div>
                        <div class="variable-field">
                            <div class="variable-field-label">Acción</div>
                            <select class="variable-field-input" style="font-family: inherit;">
                                <option value="END">END</option>
                                <option value="STOP">STOP</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;

    container.appendChild(card);
    updateVariablesCount();

    // Inicializar constructor visual para esta variable
    initExpressionComponents(variablesCounter);

    // Auto-expandir la nueva variable (y cerrar otras)
    setTimeout(() => {
        toggleCard(variablesCounter);
    }, 100);
}

// ACCORDION: Solo una variable abierta a la vez
function toggleCard(id) {
    const card = document.getElementById('varCard' + id);
    const functionsSidebar = document.querySelector('.functions-sidebar');

    // Si esta card ya está expandida, cerrarla
    if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        currentExpandedCard = null;

        // Ocultar panel de funciones
        if (functionsSidebar) {
            functionsSidebar.style.display = 'none';
        }
        return;
    }

    // Cerrar la card actualmente expandida
    if (currentExpandedCard) {
        const prevCard = document.getElementById('varCard' + currentExpandedCard);
        if (prevCard) {
            prevCard.classList.remove('expanded');
        }
    }

    // Expandir la nueva card
    card.classList.add('expanded');
    currentExpandedCard = id;

    // Mostrar panel de funciones
    if (functionsSidebar) {
        functionsSidebar.style.display = 'flex';
    }

    // Scroll suave a la card expandida
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

function eliminarVariable(id) {
    // Obtener información de la variable antes de eliminar
    const card = document.getElementById('varCard' + id);
    if (!card) return;

    const nameInput = card.querySelector('input[placeholder="Nombre de la variable"]');
    const varName = nameInput ? nameInput.value.trim() : '';
    const displayName = varName || 'Variable ' + id;

    // Contar componentes de expresión
    initExpressionComponents(id);
    const components = expressionComponents[id] || [];
    const componentCount = components.length;

    // Construir mensaje de confirmación detallado
    let mensaje = `⚠️ ¿Está seguro de eliminar esta variable?\n\n`;
    mensaje += `📝 Variable: ${displayName}\n`;

    if (componentCount > 0) {
        mensaje += `🧩 Componentes: ${componentCount} elemento(s) configurado(s)\n`;

        // Mostrar preview de componentes
        const componentTypes = {
            'function': '📅 Función',
            'field': '📊 Campo',
            'operator': '➕ Operador',
            'value': '🔢 Valor',
            'parenthesis': '() Paréntesis'
        };

        const summary = components.slice(0, 3).map(c => {
            const typeLabel = componentTypes[c.type] || c.type;
            const shortValue = c.value.length > 20 ? c.value.substring(0, 17) + '...' : c.value;
            return `   • ${typeLabel}: ${shortValue}`;
        }).join('\n');

        mensaje += '\nContenido:\n' + summary;
        if (componentCount > 3) {
            mensaje += `\n   ... y ${componentCount - 3} más`;
        }
    } else {
        mensaje += `📭 Sin componentes configurados\n`;
    }

    mensaje += `\n\n⚠️ Esta acción no se puede deshacer.`;

    if (confirm(mensaje)) {
        card.remove();

        if (currentExpandedCard === id) {
            currentExpandedCard = null;

            // Ocultar panel de funciones si se elimina la variable expandida
            const functionsSidebar = document.querySelector('.functions-sidebar');
            if (functionsSidebar) {
                functionsSidebar.style.display = 'none';
            }
        }

        // Limpiar componentes de expresión
        delete expressionComponents[id];

        updateVariablesCount();
    }
}

function updatePreview(id, type, value) {
    if (type === 'name') {
        const nameEl = document.getElementById('varName' + id);
        nameEl.textContent = value || 'Variable ' + id;
    } else if (type === 'expr') {
        const exprEl = document.getElementById('varExpr' + id);
        exprEl.textContent = value || 'Sin expresión configurada';
    }
}

function updateVariablesCount() {
    const count = document.querySelectorAll('.variable-card').length;
    document.getElementById('variablesCount').textContent = count + ' variable' + (count !== 1 ? 's' : '');
}

function insertarCampo(campo) {
    if (activeInput) {
        const start = activeInput.selectionStart;
        const end = activeInput.selectionEnd;
        const text = activeInput.value;

        activeInput.value = text.substring(0, start) + '[' + campo + ']' + text.substring(end);
        activeInput.focus();
        activeInput.selectionStart = activeInput.selectionEnd = start + campo.length + 2;

        // Actualizar preview si es el campo de expresión
        const card = activeInput.closest('.variable-card');
        if (card) {
            const cardId = card.id.replace('varCard', '');
            updatePreview(cardId, 'expr', activeInput.value);
        }
    } else {
        alert('Por favor, haga clic en un campo de texto antes de insertar un campo.');
    }
}

// Track del input activo
document.addEventListener('DOMContentLoaded', function () {
    // Crear modal dinámicamente
    createModalInBody();

    // Crear popup de autocompletado
    createAutocompletePopup();

    // Verificar que el contenedor de expresión lógica existe
    const logicBuilder = document.getElementById('logicExprBuilder');
    if (logicBuilder) {
        console.log('✅ Logic expression builder encontrado');
    } else {
        console.error('❌ Logic expression builder NO encontrado');
    }

    document.addEventListener('focus', function (e) {
        if (e.target.classList.contains('variable-field-input') ||
            e.target.tagName === 'TEXTAREA' && e.target.classList.contains('variable-field-input')) {
            activeInput = e.target;
        }
    }, true);
});

// Mostrar autocompletado
function showAutocomplete(input, query) {
    if (!autocompletePopup) return;

    // Filtrar funciones según el query
    const filtered = Object.keys(functionCatalog).filter(key => {
        const func = functionCatalog[key];
        return key.toLowerCase().includes(query.toLowerCase()) ||
            func.name.toLowerCase().includes(query.toLowerCase());
    });

    if (filtered.length === 0) {
        hideAutocomplete();
        return;
    }

    // Generar HTML del popup
    let html = '<div class="autocomplete-header">Funciones disponibles</div>';

    filtered.forEach((key, index) => {
        const func = functionCatalog[key];
        const paramList = func.params.map(p => p.name).join(', ');

        html += `
                    <div class="autocomplete-item ${index === 0 ? 'selected' : ''}" data-function="${key}" data-index="${index}">
                        <i class="fas ${func.icon} autocomplete-item-icon"></i>
                        <div class="autocomplete-item-content">
                            <div class="autocomplete-item-name">${func.name}</div>
                            <div class="autocomplete-item-desc">${func.desc}</div>
                            <div class="autocomplete-item-params">${paramList}</div>
                        </div>
                    </div>
                `;
    });

    html += '<div class="autocomplete-hint"><i class="fas fa-lightbulb"></i>Presiona Enter para insertar o Esc para cerrar</div>';

    autocompletePopup.innerHTML = html;

    // Posicionar el popup
    const rect = input.getBoundingClientRect();
    const caretPos = getCaretCoordinates(input);

    autocompletePopup.style.position = 'fixed';
    autocompletePopup.style.left = (rect.left + caretPos.left) + 'px';
    autocompletePopup.style.top = (rect.top + caretPos.top + 20) + 'px';

    // Ajustar si se sale de la pantalla
    const popupRect = autocompletePopup.getBoundingClientRect();
    if (popupRect.right > window.innerWidth) {
        autocompletePopup.style.left = (window.innerWidth - popupRect.width - 20) + 'px';
    }
    if (popupRect.bottom > window.innerHeight) {
        autocompletePopup.style.top = (rect.top + caretPos.top - popupRect.height - 10) + 'px';
    }

    autocompletePopup.classList.add('active');
    selectedAutocompleteIndex = 0;

    // Event listeners para los items
    autocompletePopup.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', function () {
            const funcKey = this.getAttribute('data-function');
            insertFunctionTemplate(funcKey, input);
        });
    });
}

// Ocultar autocompletado
function hideAutocomplete() {
    if (autocompletePopup) {
        autocompletePopup.classList.remove('active');
        selectedAutocompleteIndex = -1;
    }
}

// Obtener coordenadas del cursor en un textarea
function getCaretCoordinates(element) {
    const position = element.selectionStart;
    const div = document.createElement('div');
    const style = getComputedStyle(element);

    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.font = style.font;
    div.style.padding = style.padding;
    div.style.width = style.width;

    const text = element.value.substring(0, position);
    div.textContent = text;

    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);

    document.body.appendChild(div);
    const coordinates = {
        left: span.offsetLeft,
        top: span.offsetTop
    };
    document.body.removeChild(div);

    return coordinates;
}

// Navegar con teclado en el autocompletado
function navigateAutocomplete(direction) {
    if (!autocompletePopup || !autocompletePopup.classList.contains('active')) return;

    const items = autocompletePopup.querySelectorAll('.autocomplete-item');
    if (items.length === 0) return;

    // Remover selección actual
    items[selectedAutocompleteIndex]?.classList.remove('selected');

    // Calcular nuevo índice
    if (direction === 'down') {
        selectedAutocompleteIndex = (selectedAutocompleteIndex + 1) % items.length;
    } else if (direction === 'up') {
        selectedAutocompleteIndex = selectedAutocompleteIndex <= 0 ? items.length - 1 : selectedAutocompleteIndex - 1;
    }

    // Agregar selección nueva
    items[selectedAutocompleteIndex].classList.add('selected');
    items[selectedAutocompleteIndex].scrollIntoView({ block: 'nearest' });
}

// Seleccionar función del autocompletado
function selectAutocompleteItem() {
    if (!autocompletePopup || !autocompletePopup.classList.contains('active')) return false;

    const selectedItem = autocompletePopup.querySelector('.autocomplete-item.selected');
    if (selectedItem) {
        const funcKey = selectedItem.getAttribute('data-function');
        insertFunctionTemplate(funcKey, activeInput);
        return true;
    }
    return false;
}

// Insertar plantilla de función - ABRE EL MODAL CON BLOQUES
function insertFunctionTemplate(funcKey, input) {
    const func = functionCatalog[funcKey];
    if (!func) return;

    // Guardar la posición donde se debe insertar
    const text = input.value;
    const cursorPos = input.selectionStart;

    // Buscar hacia atrás desde el cursor para encontrar el #
    let hashPos = cursorPos - 1;
    while (hashPos >= 0 && text[hashPos] !== '#') {
        hashPos--;
    }

    if (hashPos >= 0) {
        // Eliminar el # y texto parcial que escribió el usuario
        input.value = text.substring(0, hashPos) + text.substring(cursorPos);
        input.selectionStart = input.selectionEnd = hashPos;
    }

    hideAutocomplete();

    // Mapear nombres del catálogo a nombres del modal
    const modalFunctionNames = {
        'CalculaEdad': 'Calcular edad',
        'SiEntonces': 'Si entonces',
        'Conteo': 'Conteo',
        'Maximo': 'Máximo',
        'Minimo': 'Mínimo',
        'Promedio': 'Promedio',
        'Suma': 'Suma',
        'ConteoCaracteres': 'Conteo caracteres',
        'ExpresionRegular': 'Expresión regular',
        'CualquierFecha': 'Cualquier fecha'
    };

    const modalFunctionName = modalFunctionNames[funcKey] || func.name;

    // Abrir el modal configurador (ahora con bloques para CalculaEdad)
    openFunctionModal(modalFunctionName, input);
}

// Función legacy para compatibilidad con menú de funciones
function insertFunction(functionName, varId) {
    // Si se proporciona varId, establecer el contexto del constructor visual
    if (varId) {
        const builder = document.getElementById('exprBuilder' + varId);
        if (builder) {
            // Crear input temporal para establecer contexto
            const tempInput = document.createElement('textarea');
            tempInput.style.display = 'none';
            builder.appendChild(tempInput);

            activeInput = tempInput;
            activeInput.varId = varId;
        }
    }

    if (!activeInput) {
        alert('Por favor, haga clic en un campo de expresión antes de seleccionar una función.');
        return;
    }

    // Cerrar todos los menús de funciones
    document.querySelectorAll('.function-menu.active').forEach(menu => {
        menu.classList.remove('active');
    });

    // Abrir modal con configuración de la función
    openFunctionModal(functionName, activeInput);
}

// Manejar el input en tiempo real para detectar #
function handleInputChange(e) {
    const input = e.target;
    const text = input.value;
    const cursorPos = input.selectionStart;

    // Detectar si el usuario está escribiendo después de #
    if (cursorPos > 0) {
        let hashPos = cursorPos - 1;

        // Buscar hacia atrás hasta encontrar # o espacio/salto de línea
        while (hashPos >= 0 && text[hashPos] !== '#' && text[hashPos] !== ' ' && text[hashPos] !== '\n') {
            hashPos--;
        }

        if (hashPos >= 0 && text[hashPos] === '#') {
            // Extraer el query después de #
            const query = text.substring(hashPos + 1, cursorPos);

            // Solo mostrar autocompletado si hay al menos 1 caracter o es solo #
            if (query.length >= 0) {
                showAutocomplete(input, query);
            }
        } else {
            hideAutocomplete();
        }
    } else {
        hideAutocomplete();
    }
}

// Manejar teclas especiales
function handleKeyDown(e) {
    const input = e.target;

    // Si el autocompletado está activo
    if (autocompletePopup && autocompletePopup.classList.contains('active')) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateAutocomplete('down');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateAutocomplete('up');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectAutocompleteItem()) {
                return;
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            hideAutocomplete();
        }
    }
}

// Agregar event listeners a los textareas de expresión
function attachAutocompleteListeners(textarea) {
    textarea.addEventListener('input', handleInputChange);
    textarea.addEventListener('keydown', handleKeyDown);
}
document.addEventListener('click', function (e) {
    if (!e.target.closest('.function-menu-container')) {
        document.querySelectorAll('.function-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
});

// Toggle del menú de funciones (específico por tarjeta)
function toggleFunctionMenu(event, cardId) {
    event.preventDefault();
    event.stopPropagation();

    const menu = document.getElementById('functionMenu' + cardId);
    const wasActive = menu.classList.contains('active');

    // Cerrar todos los otros menús
    document.querySelectorAll('.function-menu.active').forEach(m => {
        m.classList.remove('active');
    });

    // Toggle el menú actual
    if (!wasActive) {
        menu.classList.add('active');
    }
}

// Filtrar funciones en el menú (específico por tarjeta)
function filterFunctions(cardId) {
    const menu = document.getElementById('functionMenu' + cardId);
    const searchInput = menu.querySelector('.function-menu-search input');
    const filter = searchInput.value.toLowerCase();
    const items = menu.querySelectorAll('.function-item');

    items.forEach(item => {
        const keywords = item.getAttribute('data-keywords') || '';
        const name = item.querySelector('.function-item-name').textContent.toLowerCase();
        const desc = item.querySelector('.function-item-desc').textContent.toLowerCase();

        if (keywords.includes(filter) || name.includes(filter) || desc.includes(filter)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });

    // Ocultar categorías vacías
    const categories = menu.querySelectorAll('.function-category');
    categories.forEach(category => {
        const visibleItems = category.querySelectorAll('.function-item:not(.hidden)');
        category.style.display = visibleItems.length > 0 ? 'block' : 'none';
    });
}

// Variables para el modal
let currentFunction = null;
let availableFields = [];
let droppedBlocks = [];
let draggedElement = null;

// Generar items de campos para la paleta
function generateFieldPaletteItems() {
    let html = '';
    availableFields.forEach(field => {
        html += `<div class="palette-item" data-type="field" data-value="${field.name}" draggable="true" ondragstart="dragStart(event)">${field.name}</div>`;
    });
    if (availableFields.length === 0) {
        html = '<div style="color: var(--gray-500); font-size: 13px;">No hay campos disponibles</div>';
    }
    return html;
}

// Iniciar arrastre
// ✅ RENOMBRADO: dragBlockStart para evitar conflicto con dragStart() de palette items
function dragBlockStart(event) {
    console.log('🧱 DRAG START Block (Calcular edad)');
    draggedElement = event.target;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/html', event.target.innerHTML);
    event.dataTransfer.setData('type', event.target.getAttribute('data-type'));
    event.dataTransfer.setData('value', event.target.getAttribute('data-value'));

    setTimeout(() => {
        event.target.classList.add('dragging');
    }, 0);
}

// Permitir drop
function allowDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.add('drag-over');
}

// Salir de zona de drop
function dragLeave(event) {
    const dropZone = document.getElementById('dropZone');
    if (event.target === dropZone) {
        dropZone.classList.remove('drag-over');
    }
}

// Soltar bloque
function dropBlock(event) {
    event.preventDefault();
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.remove('drag-over');

    let type = event.dataTransfer.getData('type');
    let value = event.dataTransfer.getData('value');

    // Si no hay type/value, verificar si es un campo o operador arrastrado desde el sidebar
    if (!type || !value) {
        if (draggedField) {
            console.log('📦 Campo detectado en dropBlock:', draggedField);
            type = 'field';
            value = draggedField;
            draggedField = null; // Limpiar
        } else if (draggedOperator) {
            console.log('📦 Operador detectado en dropBlock:', draggedOperator);
            type = 'operator';
            value = draggedOperator;
            draggedOperator = null; // Limpiar
        } else if (draggedFunctionName) {
            console.log('📦 Función detectada en dropBlock:', draggedFunctionName);
            type = 'function';
            value = draggedFunctionName;
            draggedFunctionName = null; // Limpiar
        }
    }

    if (!type || !value) return;

    // Remover el placeholder "empty" si existe
    const emptyDiv = dropZone.querySelector('.empty');
    if (emptyDiv) {
        emptyDiv.remove();
    }

    // Crear bloque
    const blockId = 'block_' + Date.now();
    const block = {
        id: blockId,
        type: type,
        value: value,
        order: droppedBlocks.length
    };

    // Si es una función anidada, agregar metadata
    if (type === 'function') {
        block.nestedBlocks = []; // Bloques dentro de esta función
        block.configured = false; // Si ya fue configurada
    }

    droppedBlocks.push(block);

    // Renderizar bloques
    renderBlocks();
    updateBlockPreview();

    // Actualizar vista previa global del nivel actual
    updateCurrentLevelPreview();

    // Limpiar clase dragging
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
    }
}

// Renderizar bloques en la zona de drop
function renderBlocks() {
    const dropZone = document.getElementById('dropZone');

    if (droppedBlocks.length === 0) {
        dropZone.innerHTML = `
                    <div class="empty">
                        <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                        Arrastra los bloques aquí para construir la función
                    </div>
                `;
        return;
    }

    // Ordenar bloques
    droppedBlocks.sort((a, b) => a.order - b.order);

    let html = '';
    droppedBlocks.forEach((block, index) => {
        const labels = {
            'field': 'Campo',
            'operator': 'Operador',
            'value': 'Valor',
            'format': 'Formato',
            'function': 'Función'
        };

        // Si es función anidada, renderizar de forma especial
        if (block.type === 'function') {
            const configuredClass = block.configured ? 'nested-function-configured' : 'nested-function-pending';
            const configuredIcon = block.configured ? 'fa-check-circle' : 'fa-exclamation-circle';
            const nestedCount = block.nestedBlocks ? block.nestedBlocks.length : 0;

            html += `
                        <div class="param-block param-block-function ${configuredClass}" data-type="${block.type}" data-block-id="${block.id}">
                            <div class="param-block-number">${index + 1}</div>
                            <div class="param-block-content">
                                <div class="param-block-label">
                                    <i class="fas fa-layer-group"></i> Función Anidada
                                </div>
                                <div class="param-block-value">#${block.value}(...)#</div>
                                <div class="nested-function-info">
                                    <i class="fas ${configuredIcon}"></i>
                                    ${block.configured ? nestedCount + ' parámetros' : 'Sin configurar - Click en ⚙️'}
                                </div>
                            </div>
                            <div class="param-block-actions">
                                <button type="button" class="param-block-btn config" onclick="configureNestedFunction('${block.id}')" title="Configurar función">
                                    <i class="fas fa-cog"></i>
                                </button>
                                <button type="button" class="param-block-btn delete" onclick="deleteBlock('${block.id}')" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
        } else {
            // Renderizado normal para otros tipos
            html += `
                        <div class="param-block" data-type="${block.type}" data-block-id="${block.id}" draggable="true" ondragstart="dragBlockStart(event, '${block.id}')">
                            <div class="param-block-number">${index + 1}</div>
                            <div class="param-block-content">
                                <div class="param-block-label">${labels[block.type]}</div>
                                <div class="param-block-value">${block.value}</div>
                            </div>
                            <div class="param-block-actions">
                                ${block.type === 'value' ? `<button type="button" class="param-block-btn edit" onclick="editBlockValue('${block.id}')" title="Editar"><i class="fas fa-edit"></i></button>` : ''}
                                <button type="button" class="param-block-btn delete" onclick="deleteBlock('${block.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    `;
        }
    });

    dropZone.innerHTML = html;
}

// Eliminar bloque
function deleteBlock(blockId) {
    droppedBlocks = droppedBlocks.filter(b => b.id !== blockId);
    renderBlocks();
    updateBlockPreview();
    updateCurrentLevelPreview();
}

// Editar valor de bloque
function editBlockValue(blockId) {
    const block = droppedBlocks.find(b => b.id === blockId);
    if (!block) return;

    const newValue = prompt('Ingrese el nuevo valor:', block.value);
    if (newValue !== null && newValue.trim() !== '') {
        block.value = newValue.trim();
        renderBlocks();
        updateBlockPreview();
        updateCurrentLevelPreview();
    }
}

// Editar valor en paleta
function editPaletteValue(element) {
    const currentValue = element.getAttribute('data-value');
    const newValue = prompt('Ingrese el valor personalizado:', currentValue);
    if (newValue !== null && newValue.trim() !== '') {
        element.setAttribute('data-value', newValue.trim());
        element.textContent = newValue.trim();
    }
}

// Agregar valor personalizado
function addCustomValue() {
    const value = prompt('Ingrese el valor numérico:');
    if (value !== null && value.trim() !== '') {
        const paletteItems = document.querySelector('.palette-section:nth-child(3) .palette-items');
        const newItem = document.createElement('div');
        newItem.className = 'palette-item';
        newItem.setAttribute('data-type', 'value');
        newItem.setAttribute('data-value', value.trim());
        newItem.setAttribute('draggable', 'true');
        newItem.ondragstart = dragStart;
        newItem.onclick = function () { editPaletteValue(this); };
        newItem.textContent = value.trim();
        paletteItems.insertBefore(newItem, paletteItems.lastElementChild);
    }
}

// ===== CONFIGURAR FUNCIÓN ANIDADA =====
let currentNestedFunctionBlockId = null;

function configureNestedFunction(blockId) {
    const block = droppedBlocks.find(b => b.id === blockId);
    if (!block || block.type !== 'function') return;

    currentNestedFunctionBlockId = blockId;

    // Abrir modal secundario para configurar la función anidada
    openNestedFunctionModal(block.value, block.nestedBlocks || []);
}

function openNestedFunctionModal(functionName, existingBlocks) {
    // Resetear bloques anidados
    nestedDroppedBlocks = existingBlocks && existingBlocks.length > 0 ? [...existingBlocks] : [];

    // Crear modal secundario (más pequeño, encima del modal principal)
    let nestedModal = document.getElementById('nestedFunctionModal');

    if (!nestedModal) {
        nestedModal = document.createElement('div');
        nestedModal.id = 'nestedFunctionModal';
        nestedModal.className = 'nested-function-modal-overlay';
        nestedModal.innerHTML = `
                    <div class="nested-function-modal">
                        <div class="nested-function-modal-header">
                            <div>
                                <i class="fas fa-layer-group" id="nestedModalIcon"></i>
                                <span id="nestedModalTitle">Configurar Función</span>
                            </div>
                            <button type="button" onclick="closeNestedFunctionModal()" class="modal-close-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="nested-function-modal-body" id="nestedModalBody">
                            <!-- Contenido dinámico -->
                        </div>
                        <div class="nested-function-modal-footer">
                            <button type="button" onclick="closeNestedFunctionModal()" class="btn-secondary">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="button" onclick="saveNestedFunctionWithStack()" class="btn-primary">
                                <i class="fas fa-check"></i> Guardar Función
                            </button>
                        </div>
                    </div>
                `;
        document.body.appendChild(nestedModal);
    }

    // Configurar título
    document.getElementById('nestedModalTitle').textContent = 'Configurar: #' + functionName + '#';

    // Generar contenido del modal
    const modalBody = document.getElementById('nestedModalBody');
    modalBody.innerHTML = generateNestedFunctionContent(functionName, existingBlocks);

    // Renderizar bloques existentes
    setTimeout(() => {
        renderNestedBlocks();
        updateNestedPreview();
    }, 100);

    // Mostrar modal
    nestedModal.style.display = 'flex';
}

function generateNestedFunctionContent(functionName, existingBlocks) {
    // Crear un sistema de bloques similar pero más compacto
    return `
                <div class="nested-function-content">
                    <div class="nested-function-info-banner">
                        <i class="fas fa-info-circle"></i>
                        Arrastra bloques para configurar los parámetros de <strong>#${functionName}#</strong>
                    </div>

                    <div class="nested-two-column">
                        <!-- Paleta compacta -->
                        <div class="nested-palette">
                            <div class="nested-palette-section">
                                <div class="nested-palette-title">📊 Campos</div>
                                <div class="nested-palette-items" id="nestedFieldsContainer">
                                    ${generateFieldPaletteItems()}
                                </div>
                            </div>

                            <div class="nested-palette-section">
                                <div class="nested-palette-title">🧮 Operadores</div>
                                <div class="nested-palette-items">
                                    <div class="palette-item" data-type="operator" data-value=">" draggable="true" ondragstart="dragNestedStart(event)">&gt;</div>
                                    <div class="palette-item" data-type="operator" data-value="<" draggable="true" ondragstart="dragNestedStart(event)">&lt;</div>
                                    <div class="palette-item" data-type="operator" data-value=">=" draggable="true" ondragstart="dragNestedStart(event)">&gt;=</div>
                                    <div class="palette-item" data-type="operator" data-value="<=" draggable="true" ondragstart="dragNestedStart(event)">&lt;=</div>
                                    <div class="palette-item" data-type="operator" data-value="=" draggable="true" ondragstart="dragNestedStart(event)">=</div>
                                    <div class="palette-item" data-type="operator" data-value="!=" draggable="true" ondragstart="dragNestedStart(event)">!=</div>
                                </div>
                            </div>

                            <div class="nested-palette-section">
                                <div class="nested-palette-title"># Valores</div>
                                <div class="nested-palette-items">
                                    <div class="palette-item" data-type="value" data-value="1" draggable="true" ondragstart="dragNestedStart(event)">1</div>
                                    <div class="palette-item" data-type="value" data-value="3" draggable="true" ondragstart="dragNestedStart(event)">3</div>
                                    <div class="palette-item" data-type="value" data-value="6" draggable="true" ondragstart="dragNestedStart(event)">6</div>
                                    <button type="button" onclick="addNestedCustomValue()" class="btn-add-value">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="nested-palette-section">
                                <div class="nested-palette-title">🔗 Funciones Anidadas</div>
                                <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">Arrastra para anidar más funciones</div>
                                <div class="nested-palette-items">
                                    <div class="palette-item palette-item-function" data-type="function" data-value="Conteo" draggable="true" ondragstart="dragNestedStart(event)">
                                        <i class="fas fa-hashtag"></i> Conteo
                                    </div>
                                    <div class="palette-item palette-item-function" data-type="function" data-value="Máximo" draggable="true" ondragstart="dragNestedStart(event)">
                                        <i class="fas fa-arrow-up"></i> Máximo
                                    </div>
                                    <div class="palette-item palette-item-function" data-type="function" data-value="Mínimo" draggable="true" ondragstart="dragNestedStart(event)">
                                        <i class="fas fa-arrow-down"></i> Mínimo
                                    </div>
                                    <div class="palette-item palette-item-function" data-type="function" data-value="Suma" draggable="true" ondragstart="dragNestedStart(event)">
                                        <i class="fas fa-plus"></i> Suma
                                    </div>
                                    <div class="palette-item palette-item-function" data-type="function" data-value="CuentaCaracteres" draggable="true" ondragstart="dragNestedStart(event)">
                                        <i class="fas fa-text-width"></i> Caracteres
                                    </div>
                                    <div class="palette-item palette-item-function" data-type="function" data-value="DifFechaHoy" draggable="true" ondragstart="dragNestedStart(event)">
                                        <i class="fas fa-calendar-day"></i> DifFecha
                                    </div>
                                    <div class="palette-item palette-item-function" data-type="function" data-value="Si entonces" draggable="true" ondragstart="dragNestedStart(event)">
                                        <i class="fas fa-code-branch"></i> Si
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Zona de drop -->
                        <div class="nested-drop-area">
                            <div class="nested-drop-label">
                                <i class="fas fa-cubes"></i> Parámetros de la Función
                            </div>
                            <div class="nested-drop-zone" id="nestedDropZone" ondrop="dropNestedBlock(event)" ondragover="allowDrop(event)" ondragleave="dragLeave(event)">
                                <div class="empty">
                                    <i class="fas fa-hand-pointer"></i>
                                    Arrastra bloques aquí
                                </div>
                            </div>
                            <div class="nested-preview">
                                <div class="nested-preview-label">Vista Previa</div>
                                <div class="nested-preview-code" id="nestedPreviewCode">#${functionName}()#</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
}

function closeNestedFunctionModal() {
    const modal = document.getElementById('nestedFunctionModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentNestedFunctionBlockId = null;
}

function saveNestedFunction() {
    if (!currentNestedFunctionBlockId) return;

    const block = droppedBlocks.find(b => b.id === currentNestedFunctionBlockId);
    if (!block) return;

    // Guardar los bloques anidados
    block.nestedBlocks = [...nestedDroppedBlocks];
    block.configured = nestedDroppedBlocks.length > 0;

    // Cerrar modal
    closeNestedFunctionModal();

    // Actualizar renderizado
    renderBlocks();
    updateBlockPreview();
}

// Stack para manejar funciones anidadas recursivamente
let nestedFunctionStack = [];

function configureDeepNestedFunction(blockId) {
    // Encontrar el bloque dentro de nestedDroppedBlocks
    const block = nestedDroppedBlocks.find(b => b.id === blockId);
    if (!block || block.type !== 'function') return;

    // Guardar el estado actual en el stack
    nestedFunctionStack.push({
        blockId: currentNestedFunctionBlockId,
        blocks: [...nestedDroppedBlocks]
    });

    // Configurar el nuevo nivel
    currentNestedFunctionBlockId = blockId;

    // Abrir modal anidado para esta función
    openNestedFunctionModal(block.value, block.nestedBlocks || []);
}

// Modificar saveNestedFunction para manejar el stack
function saveNestedFunctionWithStack() {
    if (!currentNestedFunctionBlockId) return;

    // Si estamos en un nivel profundo, guardar en el bloque correcto
    if (nestedFunctionStack.length > 0) {
        // Encontrar el bloque en nestedDroppedBlocks actual
        const block = nestedDroppedBlocks.find(b => b.id === currentNestedFunctionBlockId);
        if (block) {
            block.nestedBlocks = [...nestedDroppedBlocks];
            block.configured = nestedDroppedBlocks.length > 0;
        }

        // Restaurar el nivel anterior del stack
        const previousLevel = nestedFunctionStack.pop();
        currentNestedFunctionBlockId = previousLevel.blockId;
        nestedDroppedBlocks = previousLevel.blocks;

        // Re-renderizar el nivel anterior
        renderNestedBlocks();
        updateNestedPreview();
    } else {
        // Nivel principal - usar la lógica original
        const block = droppedBlocks.find(b => b.id === currentNestedFunctionBlockId);
        if (block) {
            block.nestedBlocks = [...nestedDroppedBlocks];
            block.configured = nestedDroppedBlocks.length > 0;
        }

        closeNestedFunctionModal();
        renderBlocks();
        updateBlockPreview();
    }
}

// Variables para manejo de bloques anidados
let nestedDroppedBlocks = [];
let draggedNestedElement = null;

function dragNestedStart(event) {
    draggedNestedElement = event.target;
    event.dataTransfer.setData('type', event.target.getAttribute('data-type'));
    event.dataTransfer.setData('value', event.target.getAttribute('data-value'));
    event.target.classList.add('dragging');
}

function dropNestedBlock(event) {
    event.preventDefault();
    const dropZone = document.getElementById('nestedDropZone');
    dropZone.classList.remove('drag-over');

    const type = event.dataTransfer.getData('type');
    const value = event.dataTransfer.getData('value');

    if (!type || !value) return;

    // Remover empty
    const emptyDiv = dropZone.querySelector('.empty');
    if (emptyDiv) emptyDiv.remove();

    // Crear bloque
    const blockId = 'nested_block_' + Date.now();
    const block = {
        id: blockId,
        type: type,
        value: value,
        order: nestedDroppedBlocks.length
    };

    // Si es una función anidada, agregar metadata
    if (type === 'function') {
        block.nestedBlocks = []; // Bloques dentro de esta función
        block.configured = false; // Si ya fue configurada
    }

    nestedDroppedBlocks.push(block);
    renderNestedBlocks();
    updateNestedPreview();

    if (draggedNestedElement) {
        draggedNestedElement.classList.remove('dragging');
        draggedNestedElement = null;
    }
}

function renderNestedBlocks() {
    const dropZone = document.getElementById('nestedDropZone');
    if (!dropZone) return;

    if (nestedDroppedBlocks.length === 0) {
        dropZone.innerHTML = `
                    <div class="empty">
                        <i class="fas fa-hand-pointer"></i>
                        Arrastra bloques aquí
                    </div>
                `;
        return;
    }

    nestedDroppedBlocks.sort((a, b) => a.order - b.order);

    let html = '';
    nestedDroppedBlocks.forEach((block, index) => {
        const labels = {
            'field': 'Campo',
            'operator': 'Operador',
            'value': 'Valor',
            'format': 'Formato',
            'function': 'Función'
        };

        // Si es función anidada, renderizar de forma especial
        if (block.type === 'function') {
            const configuredClass = block.configured ? 'nested-function-configured' : 'nested-function-pending';
            const configuredIcon = block.configured ? 'fa-check-circle' : 'fa-exclamation-circle';
            const nestedCount = block.nestedBlocks ? block.nestedBlocks.length : 0;

            html += `
                        <div class="nested-param-block nested-param-block-function ${configuredClass}" data-type="${block.type}" data-block-id="${block.id}">
                            <div class="nested-param-block-number">${index + 1}</div>
                            <div class="nested-param-block-content">
                                <div class="nested-param-block-label">
                                    <i class="fas fa-layer-group"></i> Función
                                </div>
                                <div class="nested-param-block-value">#${block.value}(...)#</div>
                                <div class="nested-function-info-small">
                                    <i class="fas ${configuredIcon}"></i>
                                    ${block.configured ? nestedCount + ' params' : 'Sin configurar'}
                                </div>
                            </div>
                            <div class="nested-param-block-actions">
                                <button type="button" class="nested-param-block-btn config" onclick="configureDeepNestedFunction('${block.id}')" title="Configurar">
                                    <i class="fas fa-cog"></i>
                                </button>
                                <button type="button" class="nested-param-block-btn delete" onclick="deleteNestedBlock('${block.id}')" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
        } else {
            // Renderizado normal para otros tipos
            html += `
                        <div class="nested-param-block" data-type="${block.type}" data-block-id="${block.id}">
                            <div class="nested-param-block-number">${index + 1}</div>
                            <div class="nested-param-block-content">
                                <div class="nested-param-block-label">${labels[block.type]}</div>
                                <div class="nested-param-block-value">${block.value}</div>
                            </div>
                            <div class="nested-param-block-actions">
                                <button type="button" class="nested-param-block-btn delete" onclick="deleteNestedBlock('${block.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
        }
    });

    dropZone.innerHTML = html;
}

function deleteNestedBlock(blockId) {
    nestedDroppedBlocks = nestedDroppedBlocks.filter(b => b.id !== blockId);
    renderNestedBlocks();
    updateNestedPreview();
}

function updateNestedPreview() {
    const previewEl = document.getElementById('nestedPreviewCode');
    if (!previewEl) return;

    const block = droppedBlocks.find(b => b.id === currentNestedFunctionBlockId);
    if (!block) return;

    const functionName = block.value;
    const params = nestedDroppedBlocks.map(b => b.value).join(',');

    previewEl.textContent = `#${functionName}(${params})#`;
}

function addNestedCustomValue() {
    const value = prompt('Ingrese el valor:');
    if (value !== null && value.trim() !== '') {
        const paletteItems = document.querySelector('#nestedFunctionModal .nested-palette-section:nth-child(3) .nested-palette-items');
        const newItem = document.createElement('div');
        newItem.className = 'palette-item';
        newItem.setAttribute('data-type', 'value');
        newItem.setAttribute('data-value', value.trim());
        newItem.setAttribute('draggable', 'true');
        newItem.ondragstart = dragNestedStart;
        newItem.textContent = value.trim();
        paletteItems.insertBefore(newItem, paletteItems.lastElementChild);
    }
}

// Arrastrar bloque existente para reordenar
let draggedBlockId = null;

function dragBlockStart(event, blockId) {
    draggedBlockId = blockId;
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
}

// Construir la expresión completa de CalculaEdad con TODOS los parámetros
function buildCalculaEdadExpression() {
    // CalculaEdad siempre tiene 4 parámetros: campo_fecha, operador, valor, formato
    const params = ['[]', '[]', '[]', 'YYYY']; // Valores por defecto

    droppedBlocks.forEach((block) => {
        if (block.type === 'field') {
            // Primer campo encontrado va en param[0]
            if (params[0] === '[]') {
                params[0] = `[${block.value}]`;
            }
        } else if (block.type === 'operator') {
            // Primer operador encontrado va en param[1]
            if (params[1] === '[]') {
                params[1] = block.value;
            }
        } else if (block.type === 'value' || (!isNaN(block.value) && block.type !== 'format')) {
            // Primer valor encontrado va en param[2]
            if (params[2] === '[]') {
                params[2] = block.value;
            }
        } else if (block.type === 'format' || block.value === 'YYYY' || block.value === 'YY') {
            // Formato va en param[3]
            params[3] = block.value;
        } else if (block.type === 'function') {
            // Si es función anidada, puede ir en cualquier posición vacía
            const funcStr = block.configured && block.nestedBlocks && block.nestedBlocks.length > 0
                ? `#${block.value}(${block.nestedBlocks.map(nb => nb.value).join(',')})#`
                : `#${block.value}(...)#`;

            // Buscar primer parámetro vacío
            const emptyIndex = params.findIndex(p => p === '[]');
            if (emptyIndex !== -1) {
                params[emptyIndex] = funcStr;
            }
        }
    });

    return `#CalculaEdad(${params.join(',')})#`;
}

// Construir vista previa de CalculaEdad (solo muestra lo que el usuario arrastró)
function buildCalculaEdadPreview() {
    if (!droppedBlocks || droppedBlocks.length === 0) {
        return '#Calcular edad()#';
    }

    const previewParams = [];

    droppedBlocks.forEach((block) => {
        if (block.type === 'field') {
            previewParams.push(`[${block.value}]`);
        } else if (block.type === 'operator') {
            previewParams.push(block.value);
        } else if (block.type === 'value' || (!isNaN(block.value) && block.type !== 'format')) {
            previewParams.push(block.value);
        } else if (block.type === 'format' || block.value === 'YYYY' || block.value === 'YY') {
            previewParams.push(block.value);
        } else if (block.type === 'function') {
            const funcStr = block.configured && block.nestedBlocks && block.nestedBlocks.length > 0
                ? `#${block.value}(${block.nestedBlocks.map(nb => nb.value).join(',')})#`
                : `#${block.value}(...)#`;
            previewParams.push(funcStr);
        } else {
            previewParams.push(block.value);
        }
    });

    return `#Calcular edad(${previewParams.join(',')})#`;
}

// Actualizar preview de bloques
function updateBlockPreview() {
    const previewEl = document.getElementById('modalPreviewCode');
    if (!previewEl) return;

    // La vista previa muestra lo que el usuario está construyendo
    const preview = buildCalculaEdadPreview();
    previewEl.textContent = preview;
}

// Crear modal y agregarlo directamente al body
function createModalInBody() {
    if (document.getElementById('functionModalOverlay')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'functionModalOverlay';
    overlay.className = 'function-modal-overlay';

    overlay.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.5) !important;
                display: none !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 2147483647 !important;
                backdrop-filter: blur(4px) !important;
            `;

    overlay.innerHTML = `
                <div class="function-modal" onclick="event.stopPropagation()" style="background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 90%; max-width: 900px; max-height: 90vh; overflow: hidden; position: relative; z-index: 2147483647;">
                    <div style="padding: 24px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700;">
                            <i class="fas fa-magic" id="modalIcon"></i>
                            <span id="modalTitle">Configurar Función</span>
                        </div>
                        <button type="button" onclick="closeFunctionModal()" style="width: 36px; height: 36px; border: none; background: rgba(255, 255, 255, 0.2); color: white; border-radius: 8px; cursor: pointer;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="modalBody" style="padding: 24px; max-height: calc(90vh - 180px); overflow-y: auto;">
                        <!-- Los parámetros se cargan dinámicamente aquí -->
                    </div>
                    <div style="padding: 20px 24px; background: var(--gray-50); border-top: 1px solid var(--gray-200); display: flex; justify-content: flex-end; gap: 12px;">
                        <button type="button" onclick="closeFunctionModal()" style="padding: 10px 24px; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; background: white; color: var(--gray-700);">
                            Cancelar
                        </button>
                        <button type="button" onclick="insertFunctionFromModal()" style="padding: 10px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <i class="fas fa-check"></i> Insertar Función
                        </button>
                    </div>
                </div>
            `;

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeFunctionModal();
        }
    });

    document.body.appendChild(overlay);
}

// Abrir modal de configuración
function openFunctionModal(functionName, input) {
    // Redirigir al nuevo panel de configuración
    openConfigPanel(functionName, input);
}

// ===== PANEL DE CONFIGURACIÓN (REEMPLAZO DE MODALES) =====

let currentConfigVarId = null;

function openConfigPanel(functionName, input) {
    console.log('🚀 Abriendo panel de configuración:', functionName);

    // Si se pasa un input, establecer lo como activo y extraer varId
    if (input) {
        activeInput = input;
        currentConfigVarId = input.varId;
    }

    // ✅ CORREGIDO: Limpiar navigationStack si es nuevo
    if (navigationStack.levels.length === 0) {
        navigationStack.levels = [];
        navigationStack.currentLevel = -1;
    }

    // Limpiar droppedBlocks solo si NO estamos en modo edición
    if (!input || !input.editMode) {
        droppedBlocks = [];
    }

    // ✅ CORREGIDO: Crear nivel raíz usando navigationStack (sistema unificado)
    const newLevel = createConfigLevel(functionName, null, null, currentConfigVarId);
    navigationStack.levels.push(newLevel);
    navigationStack.currentLevel = 0;

    // Actualizar función actual
    currentFunction = functionName;

    // Mostrar panel inline de esta variable específica
    const panel = document.getElementById('configPanel' + currentConfigVarId);
    if (panel) {
        panel.classList.add('active');
    }

    // ✅ CORREGIDO: Renderizar usando el sistema unificado
    renderCurrentConfigLevel();
}

// ✅ ELIMINADO: updateConfigPanel() - Ya no se usa, reemplazado por renderCurrentConfigLevel()

function updateConfigPreview() {
    // Actualizar preview dentro del panel
    const preview = document.getElementById('configPanelPreview');
    if (preview && navigationStack.currentLevel >= 0) {
        // ✅ CORREGIDO: Usar navigationStack en lugar de configStack
        const currentLevel = navigationStack.levels[navigationStack.currentLevel];
        if (!currentLevel) return;

        // Generar preview basado en inputs actuales
        const inputs = document.querySelectorAll('#configPanelBody input, #configPanelBody select');
        let params = [];
        inputs.forEach(input => {
            if (input.value) params.push(input.value);
        });
        preview.textContent = `#${currentLevel.functionName}(${params.join(', ')})#`;
    }
}

// ✅ ELIMINADO: navigateToConfigLevel() - Ya existe navigateToLevel() que usa navigationStack

// ✨ MEJORADA: Cerrar panel (limpiar navegación)
function closeConfigPanel(varId) {
    const targetVarId = varId || currentConfigVarId;
    if (!targetVarId) return;

    // Confirmar si hay niveles anidados sin guardar
    if (navigationStack.levels.length > 1) {
        if (!confirm('¿Cerrar sin guardar? Hay funciones anidadas sin configurar.')) {
            return;
        }
    }

    const panel = document.getElementById('configPanel' + targetVarId);
    if (panel) {
        panel.classList.remove('active');
    }

    // Limpiar todos los mini-builders de todos los niveles
    navigationStack.levels.forEach(level => {
        Object.keys(level.miniBuilderStates).forEach(builderId => {
            delete miniBuilderComponents[builderId];
        });
    });

    // Limpiar stack de navegación
    navigationStack.levels = [];
    navigationStack.currentLevel = -1;

    // Limpiar bloques de Calcular edad
    droppedBlocks = [];

    currentConfigVarId = null;
    currentFunction = null;

    // ✨ NUEVO: Limpiar modo edición si está activo
    if (activeInput && activeInput.editMode) {
        delete activeInput.editMode;
    }
    if (window.editingComponent) {
        delete window.editingComponent;
    }
}
function addBackButtonToPanel(varId) {
    const header = document.querySelector(`#configPanel${varId} .config-panel-header`);
    if (!header) return;

    // Verificar si ya existe
    if (header.querySelector('.back-button')) return;

    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.type = 'button';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.title = 'Volver al nivel anterior';
    backButton.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        border-radius: 6px;
        width: 32px;
        height: 32px;
        cursor: pointer;
        transition: all 0.2s;
        display: none;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
    `;

    backButton.onclick = () => {
        if (navigationStack.currentLevel > 0) {
            navigateToLevel(navigationStack.currentLevel - 1);
        }
    };

    const headerLeft = header.querySelector('.config-panel-header-left');
    if (headerLeft) {
        headerLeft.insertBefore(backButton, headerLeft.firstChild);
    }

    // Mostrar/ocultar según el nivel
    const updateBackButton = () => {
        backButton.style.display = navigationStack.currentLevel > 0 ? 'flex' : 'none';
    };

    // Actualizar al cambiar de nivel
    const originalRender = renderCurrentConfigLevel;
    renderCurrentConfigLevel = function () {
        originalRender.call(this);
        updateBackButton();
    };
}

// ✨ NUEVA FUNCIÓN: Guardar toda la estructura con niveles anidados de una vez
function acceptAllNestedLevels(varId) {
    console.log('🔄 Procesando todos los niveles anidados...');

    // Guardar el estado actual del nivel raíz
    saveCurrentLevelState();

    // ✅ NUEVO: Restaurar TODOS los mini-builders de TODOS los niveles desde sus estados guardados
    // Esto asegura que todos los componentes estén en memoria antes de procesarlos
    console.log('📥 Restaurando todos los mini-builders desde estados guardados...');
    navigationStack.levels.forEach((level, idx) => {
        console.log(`   Restaurando mini-builders del nivel ${idx}:`, Object.keys(level.miniBuilderStates));
        Object.keys(level.miniBuilderStates).forEach(builderId => {
            miniBuilderComponents[builderId] = JSON.parse(
                JSON.stringify(level.miniBuilderStates[builderId])
            );
        });
    });

    // Procesar todos los niveles desde el más profundo hacia arriba
    // Comenzar desde el nivel más alto (más anidado) hacia el nivel 0
    for (let levelIndex = navigationStack.levels.length - 1; levelIndex > 0; levelIndex--) {
        const currentLevel = navigationStack.levels[levelIndex];
        const parentLevel = navigationStack.levels[levelIndex - 1];

        console.log(`   Procesando nivel ${levelIndex}: ${currentLevel.functionName}`);

        // Construir expresión completa del nivel actual
        const levelExpression = buildLevelExpression(currentLevel);
        console.log(`      Expresión: ${levelExpression}`);

        // Actualizar el componente de función en el nivel padre
        if (currentLevel.parentBuilderId && currentLevel.functionId) {
            const parentComponents = miniBuilderComponents[currentLevel.parentBuilderId];

            if (parentComponents) {
                const functionComp = parentComponents.find(c => c.functionId === currentLevel.functionId);
                if (functionComp) {
                    functionComp.fullExpression = levelExpression;
                    functionComp.configured = true;

                    // Actualizar HTML
                    const shortPreview = levelExpression.length > 40 ?
                        levelExpression.substring(0, 37) + '...' :
                        levelExpression;
                    functionComp.html = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${shortPreview}</span>`;

                    console.log(`      ✅ Componente actualizado en nivel ${levelIndex - 1}:`, functionComp.value);

                    // Actualizar estado guardado del padre
                    parentLevel.miniBuilderStates[currentLevel.parentBuilderId] = JSON.parse(
                        JSON.stringify(miniBuilderComponents[currentLevel.parentBuilderId])
                    );

                    // ✅ NUEVO: Renderizar el mini-builder padre para mostrar el cambio visualmente
                    console.log(`      🎨 Re-renderizando mini-builder padre:`, currentLevel.parentBuilderId);
                    renderMiniBuilder(currentLevel.parentBuilderId);
                } else {
                    console.warn(`      ⚠️ No se encontró componente con functionId:`, currentLevel.functionId);
                }
            } else {
                console.warn(`      ⚠️ No se encontraron componentes para builder:`, currentLevel.parentBuilderId);
            }
        }
    }

    // Ahora construir la expresión final del nivel raíz
    const rootLevel = navigationStack.levels[0];
    console.log('   📦 Construyendo expresión final del nivel raíz:', rootLevel.functionName);

    let functionText;
    let displayPreview;
    let params = []; // ✅ CORREGIDO: Declarar params fuera del bloque para que esté disponible en metadata

    // Manejo especial para "Calcular edad"
    if (rootLevel.functionName === 'Calcular edad' && typeof droppedBlocks !== 'undefined') {
        console.log('   🎂 Calcular edad detectado, usando blocks');
        functionText = buildCalculaEdadExpression();  // Guarda con todos los parámetros
        displayPreview = buildCalculaEdadPreview();   // Vista previa con lo arrastrado
        console.log('   💾 Valor guardado:', functionText);
        console.log('   👁️ Vista previa:', displayPreview);
    } else {
        // Funciones normales con mini-builders
        for (let builderId in rootLevel.miniBuilderStates) {
            const components = rootLevel.miniBuilderStates[builderId];
            if (components && components.length > 0) {
                const expression = buildComponentsExpression(components);
                params.push(expression);
            }
        }

        const paramsText = params.filter(p => p.trim() !== '').join(',');
        functionText = `#${rootLevel.functionName}(${paramsText})#`;
        displayPreview = functionText;

        console.log('   ✅ Expresión completa final:', functionText);
    }

    // Truncar displayPreview si es muy largo
    if (displayPreview.length > 60) {
        displayPreview = displayPreview.substring(0, 50) + '...' + displayPreview.substring(displayPreview.length - 7);
    }

    const displayHtml = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${displayPreview}</span>`;

    const metadata = {
        functionName: rootLevel.functionName,
        params: params,
        fullExpression: functionText
    };

    // Agregar blocks para "Calcular edad"
    if (rootLevel.functionName === 'Calcular edad' && droppedBlocks && droppedBlocks.length > 0) {
        metadata.blocks = JSON.parse(JSON.stringify(droppedBlocks));
        console.log('📦 Guardando blocks en metadata (nested):', metadata.blocks);
    }

    console.log('📋 Metadata final (nested):', metadata);

    // Verificar si estamos en modo edición
    if (activeInput && activeInput.editMode && window.editingComponent) {
        console.log('✏️ Actualizando función editada con toda la estructura');

        initExpressionComponents(window.editingComponent.varId);
        const comp = expressionComponents[window.editingComponent.varId].find(
            c => c.id === window.editingComponent.compId
        );

        if (comp) {
            comp.value = functionText;
            comp.html = displayHtml;
            comp.metadata = metadata;
            renderExpression(window.editingComponent.varId);
            updateExpressionPreview(window.editingComponent.varId);
        }

        delete window.editingComponent;
        delete activeInput.editMode;
    } else {
        // Agregar nuevo componente
        console.log('✅ Agregando función completa al expression builder');
        addExprComponent(varId, 'function', functionText, displayHtml, metadata);
    }

    // Limpiar todos los mini-builders
    navigationStack.levels.forEach(level => {
        Object.keys(level.miniBuilderStates).forEach(builderId => {
            delete miniBuilderComponents[builderId];
        });
    });

    // Limpiar stack
    navigationStack.levels = [];
    navigationStack.currentLevel = -1;

    closeConfigPanel(varId);
}

// ✨ MEJORADA: Aceptar configuración (puede ser raíz o anidada)
// ✨ MEJORADA: Aceptar configuración con navegación
function acceptFunctionConfig(varId) {
    const targetVarId = varId || currentConfigVarId;
    if (!targetVarId) return;

    // ✨ NUEVO: Si estamos en nivel raíz (0) y hay niveles anidados, guardar todo de una vez
    if (navigationStack.currentLevel === 0 && navigationStack.levels.length > 1) {
        console.log('💾 Guardando toda la estructura con niveles anidados');
        acceptAllNestedLevels(targetVarId);
        return;
    }

    const body = document.getElementById('configPanelBody' + targetVarId);
    if (!body) return;

    let params = [];

    // Recopilar valores de mini-builders
    const miniBuilders = body.querySelectorAll('.mini-expression-builder');

    if (miniBuilders.length > 0) {
        miniBuilders.forEach(builder => {
            const builderId = builder.id;
            const components = miniBuilderComponents[builderId] || [];

            if (components.length > 0) {
                const expression = buildComponentsExpression(components);
                params.push(expression);
            }
        });
    }

    // ✨ Verificar si estamos en un nivel anidado
    if (navigationStack.currentLevel > 0) {
        // Estamos en un nivel anidado, guardar y volver al nivel anterior
        const currentLevel = navigationStack.levels[navigationStack.currentLevel];
        const parentLevel = navigationStack.levels[navigationStack.currentLevel - 1];

        const parentBuilderId = currentLevel.parentBuilderId;
        const functionId = currentLevel.functionId;

        console.log('💾 Guardando función anidada:', {
            functionName: currentLevel.functionName,
            params: params,
            parentBuilderId: parentBuilderId,
            functionId: functionId
        });

        // Encontrar el componente de función en el mini-builder padre
        const parentComponents = miniBuilderComponents[parentBuilderId];
        if (parentComponents) {
            const funcComponent = parentComponents.find(c => c.functionId === functionId);
            if (funcComponent) {
                // Marcar como configurada y guardar los parámetros
                funcComponent.configured = true;
                funcComponent.params = params;

                // Construir expresión completa (sin espacios, solo comas)
                const paramsText = params.filter(p => p.trim() !== '').join(',');
                const functionText = `#${funcComponent.value}(${paramsText})#`;
                funcComponent.fullExpression = functionText;

                // Actualizar HTML con preview mejorado
                const shortPreview = functionText.length > 40 ? functionText.substring(0, 37) + '...' : functionText;
                funcComponent.html = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${shortPreview}</span>`;

                console.log('✅ Función configurada:', funcComponent);

                // Actualizar el estado guardado del nivel padre
                if (parentLevel.miniBuilderStates[parentBuilderId]) {
                    parentLevel.miniBuilderStates[parentBuilderId] = JSON.parse(
                        JSON.stringify(miniBuilderComponents[parentBuilderId])
                    );
                }
            }
        }

        // ✨ NUEVO: NO eliminar el nivel del stack, solo navegar de vuelta al padre
        // Esto permite que cuando vuelvas a abrir esta función, recupere sus parámetros

        // Guardar el estado actual antes de navegar
        saveCurrentLevelState();

        // Navegar al nivel padre usando navigateToLevel en lugar de eliminar el nivel
        navigateToLevel(navigationStack.currentLevel - 1);

        // Renderizar el mini-builder padre para reflejar cambios
        setTimeout(() => {
            renderMiniBuilder(parentBuilderId);
        }, 100);

        return;
    }

    // ✨ Nivel raíz - insertar en el constructor principal
    let functionText;
    let displayPreview;

    // Manejo especial para "Calcular edad" que usa blocks
    if (currentFunction === 'Calcular edad' && typeof droppedBlocks !== 'undefined') {
        console.log('🎂 Calcular edad detectado, usando blocks');
        functionText = buildCalculaEdadExpression();  // Guarda con todos los parámetros
        displayPreview = buildCalculaEdadPreview();   // Vista previa con lo arrastrado
        console.log('💾 Valor guardado:', functionText);
        console.log('👁️ Vista previa:', displayPreview);
    } else {
        // Funciones normales con mini-builders
        // Unir params sin espacios adicionales (solo con comas)
        const paramsText = params.filter(p => p.trim() !== '').join(',');
        functionText = `#${currentFunction}(${paramsText})#`;
        displayPreview = functionText;
    }

    // Truncar displayPreview si es muy largo
    if (displayPreview.length > 60) {
        // Si es muy largo, mostrar inicio y final
        displayPreview = displayPreview.substring(0, 50) + '...' + displayPreview.substring(displayPreview.length - 7);
    }

    const displayHtml = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${displayPreview}</span>`;

    const metadata = {
        functionName: currentFunction,
        params: params,
        fullExpression: functionText
    };

    // Agregar blocks para "Calcular edad"
    if (currentFunction === 'Calcular edad' && droppedBlocks && droppedBlocks.length > 0) {
        metadata.blocks = JSON.parse(JSON.stringify(droppedBlocks));
        console.log('📦 Guardando blocks en metadata:', metadata.blocks);
    }

    console.log('📋 Metadata final:', metadata);

    // ✨ NUEVO: Verificar si estamos en modo edición
    if (activeInput && activeInput.editMode && window.editingComponent) {
        console.log('✏️ Actualizando función editada:', functionText);

        // Encontrar y actualizar el componente existente
        initExpressionComponents(window.editingComponent.varId);
        const comp = expressionComponents[window.editingComponent.varId].find(
            c => c.id === window.editingComponent.compId
        );

        if (comp) {
            // Actualizar el componente con los nuevos valores
            comp.value = functionText;
            comp.html = displayHtml;
            comp.metadata = metadata;

            console.log('   ✅ Componente actualizado:', comp);

            // Re-renderizar expression builder
            renderExpression(window.editingComponent.varId);
            updateExpressionPreview(window.editingComponent.varId);
        }

        // Limpiar modo edición
        delete window.editingComponent;
        delete activeInput.editMode;
    } else {
        // Modo normal: agregar nuevo componente
        console.log('✅ Función raíz aceptada:', functionText);
        addExprComponent(targetVarId, 'function', functionText, displayHtml, metadata);
    }

    // Limpiar mini-builders
    miniBuilders.forEach(builder => {
        delete miniBuilderComponents[builder.id];
    });

    // Limpiar stack de navegación
    navigationStack.levels = [];
    navigationStack.currentLevel = -1;

    closeConfigPanel(targetVarId);
}
// ✨ NUEVA FUNCIÓN: Construir expresión a partir de componentes (con funciones anidadas)
// ✨ NUEVA FUNCIÓN: Construir expresión completa de un nivel con todos sus parámetros
function buildLevelExpression(level) {
    console.log('🔨 Construyendo expresión para nivel:', level.functionName);

    // Recopilar parámetros de todos los mini-builders del nivel
    let params = [];

    // Iterar por todos los mini-builders guardados en el nivel
    for (let builderId in level.miniBuilderStates) {
        const components = level.miniBuilderStates[builderId];
        if (components && components.length > 0) {
            const expression = buildComponentsExpression(components);
            console.log('   Builder', builderId, '→', expression);
            params.push(expression);
        } else {
            params.push('');
        }
    }

    const paramsText = params.filter(p => p.trim() !== '').join(',');
    const fullExpression = `#${level.functionName}(${paramsText})#`;

    console.log('   📦 Expresión completa:', fullExpression);
    return fullExpression;
}

function buildComponentsExpression(components) {
    return components.map(comp => {
        if (comp.type === 'field') return `[${comp.value}]`;
        if (comp.type === 'operator') return comp.value;
        if (comp.type === 'value') return comp.value;
        if (comp.type === 'function') {
            // Si la función está configurada, usar su expresión completa
            if (comp.configured && comp.fullExpression) {
                return comp.fullExpression;
            }
            // Si no está configurada, mostrar placeholder
            return `#${comp.value}(...)#`;
        }
        return comp.value;
    }).join(' ');
}

// ✨ MEJORADA: Renderizar mini-builder con soporte para editar funciones
function renderMiniBuilder(builderId) {
    const builder = document.getElementById(builderId);
    if (!builder) return;

    const components = miniBuilderComponents[builderId] || [];

    // Ocultar empty si hay componentes
    const emptyDiv = builder.querySelector('.empty');
    if (emptyDiv) {
        emptyDiv.style.display = components.length > 0 ? 'none' : 'flex';
    }

    // Crear o actualizar contenedor de componentes
    let componentsContainer = builder.querySelector('.expression-components');
    if (!componentsContainer) {
        componentsContainer = document.createElement('div');
        componentsContainer.className = 'expression-components';
        builder.appendChild(componentsContainer);
    }

    // Renderizar badges
    componentsContainer.innerHTML = components.map((comp, index) => {
        let badge = `<div class="expr-component" data-type="${comp.type}">`;
        badge += comp.html;

        // ✨ Agregar botón de configurar si es función
        if (comp.type === 'function') {
            const configuredClass = comp.configured ? 'configured' : 'pending';
            const configuredIcon = comp.configured ? 'fa-check-circle' : 'fa-cog';
            const configuredColor = comp.configured ? 'var(--success)' : 'var(--warning)';

            badge += `
                <button type="button" 
                        onclick="editNestedFunction('${builderId}', ${index})" 
                        style="background: none; border: none; color: ${configuredColor}; cursor: pointer; padding: 0; margin-left: 4px;"
                        title="${comp.configured ? 'Reconfigurar función' : 'Configurar función'}">
                    <i class="fas ${configuredIcon}"></i>
                </button>
            `;
        }

        badge += `
            <button type="button" 
                    onclick="removeMiniBuilderComponent('${builderId}', ${index})" 
                    style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 0; margin-left: 4px;">
                <i class="fas fa-times"></i>
            </button>
        </div>`;

        return badge;
    }).join('');

    // Actualizar vista previa global
    updateCurrentLevelPreview();
}

// ✨ NUEVA FUNCIÓN: Editar/Configurar función anidada en mini-builder
function editNestedFunction(builderId, componentIndex) {
    const components = miniBuilderComponents[builderId];
    if (!components || !components[componentIndex]) return;

    const funcComponent = components[componentIndex];
    if (funcComponent.type !== 'function') return;

    console.log('🔧 Editando función anidada:', funcComponent.value);
    console.log('   Configurada:', funcComponent.configured);
    console.log('   Parámetros guardados:', funcComponent.params);

    // ✅ Abrir configuración de esta función
    // openNestedFunctionConfig ahora busca si el nivel ya existe y recupera sus parámetros automáticamente
    openNestedFunctionConfig(funcComponent.value, builderId, funcComponent.functionId);
}

// ✅ ELIMINADO: Segunda función closeConfigPanel duplicada - Ya existe una versión en línea 2590

// ===== FUNCIONES AUXILIARES =====

// Cerrar modal (mantener por compatibilidad)
function closeFunctionModal() {
    const modal = document.getElementById('functionModalOverlay');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Obtener campos disponibles
function getAvailableFields() {
    const fields = [];
    // ✅ CORREGIDO: Usar las clases correctas del ASPX
    document.querySelectorAll('.draggable-field-item').forEach(item => {
        const name = item.querySelector('.field-pill-name')?.textContent;
        const desc = item.getAttribute('title') || '';  // ✅ Descripción en atributo title
        if (name) {
            fields.push({ name: name.trim(), desc: desc.trim() });
        }
    });
    console.log('📊 Campos disponibles encontrados:', fields.length, fields);
    return fields;
}

// Generar opciones de campos
function generateFieldOptions() {
    let options = '<option value="">-- Seleccione un campo --</option>';
    availableFields.forEach(field => {
        options += `<option value="${field.name}">${field.name} - ${field.desc}</option>`;
    });
    return options;
}

// Generar mini expression builder para parámetros de función
let paramBuilderCounter = 0;

function generateMiniBuilder(paramId, label, placeholder = "Arrastra campos, operadores o funciones", includeBreadcrumb = false) {
    // ✅ CORREGIDO: ID predecible basado en nivel actual y paramId
    const levelId = navigationStack.currentLevel >= 0 ? navigationStack.currentLevel : 0;
    const builderId = `miniBuilder_level${levelId}_${paramId}`;

    console.log('🔨 Generando mini-builder:', builderId, 'para nivel:', levelId);

    // ✅ NUEVO: Agregar breadcrumb opcional para cada mini-builder
    const breadcrumbHtml = includeBreadcrumb ? `
        <div id="breadcrumb_${builderId}" class="mini-builder-breadcrumb" style="
            display: none;
            align-items: center;
            gap: 4px;
            flex-wrap: wrap;
            margin-bottom: 8px;
            padding: 8px 12px;
            background: var(--gray-50);
            border-radius: 6px;
            border: 1px solid var(--gray-200);
        "></div>
    ` : '';

    return `
        <div class="mini-builder-container" style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">
                ${label} <span style="color: var(--danger);">*</span>
            </label>
            ${breadcrumbHtml}
            <div class="mini-expression-builder"
                 id="${builderId}"
                 ondrop="dropIntoMiniBuilder(event, '${builderId}')"
                 ondragover="allowMiniBuilderDrop(event)"
                 ondragleave="dragMiniBuilderLeave(event)"
                 data-param-id="${paramId}">
                <div class="empty" style="font-size: 13px; color: var(--gray-500); display: flex; align-items: center; justify-content: center; min-height: 60px;">
                    <i class="fas fa-hand-pointer" style="margin-right: 6px;"></i>
                    ${placeholder}
                </div>
            </div>
        </div>
    `;
}
function allowMiniBuilderDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log('🔄 DRAGOVER en mini-builder:', event.currentTarget?.id);

    const target = event.currentTarget;
    if (target) {
        target.classList.add('drag-over');
    }
}
function dragMiniBuilderLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    const target = event.currentTarget;
    if (target && event.target === target) {
        target.classList.remove('drag-over');
    }
}
// Generar formulario según la función (código extenso - lo resumo)
function generateFunctionForm(functionName) {
    let html = '';
    const modalParamStyle = 'margin-bottom: 20px;';
    const labelStyle = 'display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;';
    const inputStyle = 'width: 100%; padding: 10px 14px; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 14px; font-family: "Courier New", monospace;';
    const selectStyle = 'width: 100%; padding: 10px 14px; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 14px;';

    switch (functionName) {
        case 'Calcular edad':
            html = `
                        <div class="two-column-layout">
                            <!-- COLUMNA IZQUIERDA: Paleta -->
                            <div class="palette-column">
                                <div class="elements-palette">
                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-database" style="color: #3b82f6;"></i>
                                            Campos
                                        </div>
                                        <div class="palette-items" id="fieldsContainer">
                                            ${generateFieldPaletteItems()}
                                        </div>
                                    </div>

                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-calculator" style="color: #8b5cf6;"></i>
                                            Operadores
                                        </div>
                                        <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">Opcional - para retornar true/false</div>
                                        <div class="palette-items">
                                            <div class="palette-item" data-type="operator" data-value=">" draggable="true" ondragstart="dragStart(event)">&gt;</div>
                                            <div class="palette-item" data-type="operator" data-value="<" draggable="true" ondragstart="dragStart(event)">&lt;</div>
                                            <div class="palette-item" data-type="operator" data-value=">=" draggable="true" ondragstart="dragStart(event)">&gt;=</div>
                                            <div class="palette-item" data-type="operator" data-value="<=" draggable="true" ondragstart="dragStart(event)">&lt;=</div>
                                            <div class="palette-item" data-type="operator" data-value="=" draggable="true" ondragstart="dragStart(event)">=</div>
                                            <div class="palette-item" data-type="operator" data-value="!=" draggable="true" ondragstart="dragStart(event)">!=</div>
                                        </div>
                                    </div>

                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-sort-numeric-up" style="color: #10b981;"></i>
                                            Valores
                                        </div>
                                        <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">Click para editar</div>
                                        <div class="palette-items">
                                            <div class="palette-item" data-type="value" data-value="18" draggable="true" ondragstart="dragStart(event)" onclick="editPaletteValue(this)">18</div>
                                            <div class="palette-item" data-type="value" data-value="21" draggable="true" ondragstart="dragStart(event)" onclick="editPaletteValue(this)">21</div>
                                            <div class="palette-item" data-type="value" data-value="65" draggable="true" ondragstart="dragStart(event)" onclick="editPaletteValue(this)">65</div>
                                            <button type="button" onclick="addCustomValue()" style="padding: 6px 10px; background: var(--primary-light); border: 2px solid var(--primary); border-radius: 6px; color: var(--primary-dark); font-weight: 600; cursor: pointer; font-size: 11px;">
                                                <i class="fas fa-plus"></i> +
                                            </button>
                                        </div>
                                    </div>

                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-calendar" style="color: #f59e0b;"></i>
                                            Formato
                                        </div>
                                        <div class="palette-items">
                                            <div class="palette-item" data-type="format" data-value="YYYY" draggable="true" ondragstart="dragStart(event)">YYYY</div>
                                            <div class="palette-item" data-type="format" data-value="YY" draggable="true" ondragstart="dragStart(event)">YY</div>
                                        </div>
                                    </div>

                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-layer-group" style="color: #ec4899;"></i>
                                            Funciones Anidadas
                                        </div>
                                        <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">Arrastra para anidar funciones</div>
                                        <div class="palette-items">
                                            <div class="palette-item palette-item-function" data-type="function" data-value="Conteo" draggable="true" ondragstart="dragStart(event)">
                                                <i class="fas fa-hashtag"></i> Conteo
                                            </div>
                                            <div class="palette-item palette-item-function" data-type="function" data-value="Máximo" draggable="true" ondragstart="dragStart(event)">
                                                <i class="fas fa-arrow-up"></i> Máximo
                                            </div>
                                            <div class="palette-item palette-item-function" data-type="function" data-value="Mínimo" draggable="true" ondragstart="dragStart(event)">
                                                <i class="fas fa-arrow-down"></i> Mínimo
                                            </div>
                                            <div class="palette-item palette-item-function" data-type="function" data-value="Suma" draggable="true" ondragstart="dragStart(event)">
                                                <i class="fas fa-plus"></i> Suma
                                            </div>
                                            <div class="palette-item palette-item-function" data-type="function" data-value="CuentaCaracteres" draggable="true" ondragstart="dragStart(event)">
                                                <i class="fas fa-text-width"></i> CuentaCaracteres
                                            </div>
                                            <div class="palette-item palette-item-function" data-type="function" data-value="DifFechaHoy" draggable="true" ondragstart="dragStart(event)">
                                                <i class="fas fa-calendar-day"></i> DifFechaHoy
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style="background: var(--primary-light); border-left: 3px solid var(--primary); padding: 10px; border-radius: 6px; margin-top: 16px; font-size: 11px; color: var(--gray-700); line-height: 1.5;">
                                    <strong style="color: var(--primary-dark);">💡 CÓMO USAR</strong><br>
                                    <strong>1️⃣</strong> Arrastra campo → Calcula edad<br>
                                    <strong>2️⃣</strong> + Operador + Valor → true/false<br>
                                    <strong>3️⃣</strong> Agrega formato (YYYY/YY)
                                </div>
                            </div>

                            <!-- COLUMNA DERECHA: Zona de Drop -->
                            <div class="drop-column">
                                <div>
                                    <div class="block-builder-label">
                                        <i class="fas fa-cubes"></i> Zona de Construcción
                                    </div>
                                    <div class="drop-zone" id="dropZone" ondrop="dropBlock(event)" ondragover="allowDrop(event)" ondragleave="dragLeave(event)" style="min-height: 120px;">
                                        <div class="empty">
                                            <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                                            Arrastra bloques aquí para construir la función
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
            break;
        case 'Si entonces':
            html = generateMiniBuilder('param1', 'Condición', 'Arrastra campos y operadores de comparación', true);
            html += generateMiniBuilder('param2', 'Valor si es Verdadero', 'Arrastra un campo o usa el botón Valor', true);
            html += generateMiniBuilder('param3', 'Valor si es Falso', 'Arrastra un campo o usa el botón Valor', true);
            break;
        default:
            // Funciones simples que necesitan 1 o más parámetros de campo/expresión
            html = generateMiniBuilder('param1', 'Campo o Expresión', 'Arrastra campos, operadores o funciones');

            // Si es Suma, agregar opción de múltiples campos
            if (functionName === 'Suma' || functionName === 'Promedio' || functionName === 'Conteo') {
                html += `
                            <div style="text-align: center; margin: 12px 0;">
                                <button type="button" onclick="addMiniBuilderParam()" 
                                        style="padding: 8px 16px; background: var(--primary-light); border: 2px solid var(--primary); 
                                               border-radius: 6px; color: var(--primary-dark); font-weight: 600; cursor: pointer; font-size: 12px;">
                                    <i class="fas fa-plus"></i> Agregar Campo
                                </button>
                            </div>
                            <div id="additionalParams"></div>
                        `;
            }
            break;
    }

    return html;
}

// Insertar función desde el modal
    function insertFunctionFromModal() {
        const previewEl = document.getElementById('modalPreviewCode');
        let preview = previewEl ? previewEl.textContent : '#CalculaEdad()#';

        // Si es Calcular edad, el valor guardado debe tener todos los parámetros
        // pero la vista previa muestra solo lo que el usuario construyó
        let savedValue = preview;
        if (currentFunction === 'Calcular edad') {
            savedValue = buildCalculaEdadExpression();  // Guarda con todos los parámetros
        }

        if (activeInput && activeInput.varId) {
            const varId = activeInput.varId;
            const icon = '<i class="fas fa-function expr-icon"></i>';
            const shortPreview = preview.length > 40 ? preview.substring(0, 37) + '...' : preview;

            // Preparar metadata con los bloques y nombre de función
            const metadata = {
                functionName: currentFunction,
                blocks: droppedBlocks.map(b => ({ type: b.type, value: b.value, order: b.order }))
            };

            // Verificar si estamos editando un componente existente
            if (activeInput.editMode && window.editingComponent) {
                // Modo edición: actualizar el componente existente
                initExpressionComponents(varId);
                const comp = expressionComponents[varId].find(c => c.id === window.editingComponent.compId);
                if (comp) {
                    comp.value = savedValue;  // Guarda el valor completo
                    comp.html = `${icon}<span class="expr-value">${shortPreview}</span>`;
                    comp.metadata = metadata;
                    renderExpression(varId);
                    updateExpressionPreview(varId);
                }
                window.editingComponent = null;
            } else {
                // Modo inserción: crear nuevo componente
                addExprComponent(varId, 'function', savedValue, `${icon}<span class="expr-value">${shortPreview}</span>`, metadata);
            }

            // Remover el input temporal
            activeInput.remove();
            activeInput = null;
        } else if (activeInput) {
            // Fallback al comportamiento anterior
            insertAtCursor(activeInput, preview);

            const card = activeInput.closest('.variable-card');
            if (card) {
                const cardId = card.id.replace('varCard', '');
                updatePreview(cardId, 'expr', activeInput.value);
            }
        }

        closeFunctionModal();
    }

    // Insertar texto en la posición del cursor
    function insertAtCursor(input, text) {
        const startPos = input.selectionStart;
        const endPos = input.selectionEnd;
        const scrollTop = input.scrollTop;

        const currentValue = input.value;
        input.value = currentValue.substring(0, startPos) + text + currentValue.substring(endPos);

        input.selectionStart = input.selectionEnd = startPos + text.length;
        input.scrollTop = scrollTop;

        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }

    // ===== PREVENIR DROPS FUERA DE ZONAS VÁLIDAS =====

    // Prevenir drop en cualquier lugar del documento por defecto
    document.addEventListener('dragover', function (e) {
        // Solo permitir dragover si estamos arrastrando algo
        if (draggedFunctionName || draggedOperator || draggedField) {
            const target = e.target;
            // ✅ CORREGIDO: Agregar .mini-expression-builder y .logic-expression-builder a las zonas válidas
            const isValidZone = target.closest('.expression-builder') ||
                target.closest('.mini-expression-builder') ||
                target.closest('.logic-expression-builder') ||
                target.closest('.drop-zone');

            if (!isValidZone) {
                // No permitir drop en este elemento
                e.dataTransfer.effectAllowed = 'none';
                e.dataTransfer.dropEffect = 'none';
            }
        }
    }, false);

    // Prevenir drop en todo el documento excepto zonas válidas
    document.addEventListener('drop', function (e) {
        const target = e.target;
        // ✅ CORREGIDO: Agregar .mini-expression-builder y .logic-expression-builder a las zonas válidas
        const isValidZone = target.closest('.expression-builder') ||
            target.closest('.mini-expression-builder') ||
            target.closest('.logic-expression-builder') ||
            target.closest('.drop-zone');

        if (!isValidZone && (draggedFunctionName || draggedOperator || draggedField)) {
            // Prevenir el drop en elementos no válidos
            console.log('🚫 Drop bloqueado fuera de zona válida');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, false);

// ===== AGREGAR PARÁMETROS ADICIONALES DINÁMICAMENTE =====

function addMiniBuilderParam() {
    // Obtener el contenedor donde se agregarán los parámetros adicionales
    const additionalParamsContainer = document.getElementById('additionalParams');
    if (!additionalParamsContainer) return;

    // Contar cuántos parámetros adicionales ya existen
    const existingParams = additionalParamsContainer.querySelectorAll('.mini-builder-container').length;
    const paramNumber = existingParams + 2; // +2 porque param1 ya existe

    // Generar nuevo mini-builder
    const newParamHtml = generateMiniBuilder(
        `param${paramNumber}`,
        `Campo ${paramNumber}`,
        'Arrastra campos, operadores o funciones'
    );

    // Crear contenedor temporal para insertar el HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newParamHtml;

    // Agregar al contenedor con animación
    const newParam = tempDiv.firstElementChild;
    newParam.style.opacity = '0';
    newParam.style.transform = 'translateY(-10px)';
    additionalParamsContainer.appendChild(newParam);

    // Animar entrada
    setTimeout(() => {
        newParam.style.transition = 'all 0.3s ease';
        newParam.style.opacity = '1';
        newParam.style.transform = 'translateY(0)';
    }, 10);

    // Agregar botón para eliminar este parámetro
    addRemoveButtonToParam(newParam, paramNumber);
}
// ===== AGREGAR BOTÓN DE ELIMINAR A PARÁMETROS ADICIONALES =====

function addRemoveButtonToParam(paramContainer, paramNumber) {
    const label = paramContainer.querySelector('label');
    if (!label) return;

    // Crear botón de eliminar
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove-param';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.title = 'Eliminar este campo';

    removeBtn.style.cssText = `
        background: var(--danger);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 4px 8px;
        margin-left: 8px;
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s;
        vertical-align: middle;
    `;

    // Evento de hover
    removeBtn.onmouseenter = () => {
        removeBtn.style.background = '#dc2626';
        removeBtn.style.transform = 'scale(1.05)';
    };
    removeBtn.onmouseleave = () => {
        removeBtn.style.background = 'var(--danger)';
        removeBtn.style.transform = 'scale(1)';
    };

    // Evento de click
    removeBtn.onclick = () => {
        removeMiniBuilderParam(paramContainer, paramNumber);
    };

    // Agregar el botón al label
    label.appendChild(removeBtn);
}
// ===== ELIMINAR PARÁMETRO ADICIONAL =====

function removeMiniBuilderParam(paramContainer, paramNumber) {
    // Obtener el builderId antes de eliminar
    const builder = paramContainer.querySelector('.mini-expression-builder');
    if (builder) {
        const builderId = builder.id;

        // Limpiar datos del mini-builder
        delete miniBuilderComponents[builderId];
    }

    // Confirmar eliminación si tiene contenido
    const components = miniBuilderComponents[builder?.id] || [];
    if (components.length > 0) {
        if (!confirm(`¿Eliminar el Campo ${paramNumber}?\n\nTiene ${components.length} componente(s) configurado(s).`)) {
            return;
        }
    }

    // Animar salida
    paramContainer.style.transition = 'all 0.3s ease';
    paramContainer.style.opacity = '0';
    paramContainer.style.transform = 'translateX(-20px)';
    paramContainer.style.maxHeight = paramContainer.offsetHeight + 'px';

    setTimeout(() => {
        paramContainer.style.maxHeight = '0';
        paramContainer.style.marginBottom = '0';
        paramContainer.style.padding = '0';
    }, 150);

    // Eliminar del DOM después de la animación
    setTimeout(() => {
        paramContainer.remove();

        // Renumerar los campos restantes
        renumberAdditionalParams();
    }, 450);
}
function renumberAdditionalParams() {
    const additionalParamsContainer = document.getElementById('additionalParams');
    if (!additionalParamsContainer) return;

    const params = additionalParamsContainer.querySelectorAll('.mini-builder-container');

    params.forEach((param, index) => {
        const label = param.querySelector('label');
        if (label) {
            // Actualizar el número en el label (mantener el botón de eliminar)
            const removeBtn = label.querySelector('.btn-remove-param');
            const newNumber = index + 2; // +2 porque param1 ya existe

            // Guardar el botón si existe
            if (removeBtn) {
                removeBtn.remove();
            }

            // Actualizar texto del label
            const labelText = label.childNodes[0];
            if (labelText) {
                labelText.textContent = `Campo ${newNumber} `;
            }

            // Re-agregar el botón
            if (removeBtn) {
                removeBtn.onclick = () => removeMiniBuilderParam(param, newNumber);
                label.appendChild(removeBtn);
            }
        }
    });
}