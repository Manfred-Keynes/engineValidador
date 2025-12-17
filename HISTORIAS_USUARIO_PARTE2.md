# Historias de Usuario Técnicas - Parte 2

## Nota
Este archivo contiene las HUs desde HU-005 hasta HU-020. Debe agregarse al final de HISTORIAS_USUARIO.md

---

### HU-005: Sistema de Variables (CRUD Completo)

**Estimación**: 3 SP | **Prioridad**: Crítica | **Dependencias**: HU-001, HU-004

#### Descripción Técnica
Implementar el sistema completo de gestión de variables: crear, editar nombre, eliminar, duplicar. Incluye contador global, generación de IDs únicos, event listeners para drag desde header, y gestión del estado de componentes por variable.

#### Criterios de Aceptación
- [ ] Función `addVariable()` implementada y funcional
- [ ] Contador `variablesCounter` incrementándose correctamente
- [ ] Variable cards generándose con HTML correcto
- [ ] Array `expressionComponents[varId]` inicializado para cada variable
- [ ] Edición inline de nombre de variable funcional (click → input → enter/blur)
- [ ] Eliminación de variable con confirmación modal
- [ ] Duplicación de variable copiando estructura y componentes
- [ ] Drag desde header de variable configurado (para logic expression)
- [ ] Empty state ocultándose al agregar primera variable
- [ ] Empty state mostrándose al eliminar última variable

#### Tareas de Implementación

**Tarea 5.1**: Implementar función `addVariable()` en EditorReglas.js
```javascript
/**
 * Agregar nueva variable al editor
 */
function addVariable() {
    variablesCounter++;
    const varId = variablesCounter;

    console.log('➕ Agregando variable', varId);

    // Crear HTML de la variable card
    const varCard = document.createElement('div');
    varCard.className = 'variable-card';
    varCard.id = 'varCard' + varId;
    varCard.innerHTML = `
        <div class="variable-card-header" draggable="true"
             ondragstart="dragVariable(event, ${varId})"
             ondragend="endDrag(event)">
            <div class="variable-number">${varId}</div>
            <div class="variable-name-preview" onclick="editVariableName(${varId})">
                Variable ${varId}
            </div>
            <div class="variable-card-actions">
                <button onclick="duplicateVariable(${varId})" title="Duplicar variable">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="deleteVariable(${varId})" title="Eliminar variable">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>

        <div class="variable-card-body">
            <div class="expression-builder" id="exprBuilder${varId}"
                 ondragover="allowDrop(event)"
                 ondrop="dropIntoBuilder(event, ${varId})"
                 ondragleave="removeDragOver(event)">
                <div class="placeholder">
                    Arrastra campos, operadores y funciones aquí para construir la expresión
                </div>
            </div>
            <div class="expression-preview" id="exprPreview${varId}"></div>
        </div>

        <!-- Panel de configuración de funciones (oculto por defecto) -->
        <div class="config-panel" id="configPanel${varId}">
            <div class="config-panel-header">
                <h3 id="configPanelTitle${varId}"></h3>
                <div id="configBreadcrumb${varId}"></div>
            </div>
            <div class="config-panel-body" id="configPanelBody${varId}"></div>
            <div class="config-panel-footer">
                <button class="btn-cancel" onclick="cancelFunctionConfig(${varId})">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button class="btn-accept" onclick="acceptAllNestedLevels(${varId})">
                    <i class="fas fa-check"></i> Aceptar
                </button>
            </div>
        </div>
    `;

    // Insertar en el DOM
    const variablesArea = document.getElementById('variablesArea');
    variablesArea.appendChild(varCard);

    // Inicializar array de componentes para esta variable
    expressionComponents[varId] = [];

    // Ocultar empty state si es la primera variable
    const emptyState = document.getElementById('emptyState');
    if (emptyState && variablesCounter === 1) {
        emptyState.style.display = 'none';
    }

    console.log('✅ Variable', varId, 'agregada exitosamente');
}
```

**Tarea 5.2**: Implementar edición de nombre de variable
```javascript
/**
 * Activar modo de edición de nombre de variable
 */
function editVariableName(varId) {
    const varCard = document.getElementById('varCard' + varId);
    const namePreview = varCard.querySelector('.variable-name-preview');

    const currentName = namePreview.textContent;

    // Crear input temporal
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'variable-name-edit';

    // Reemplazar preview con input
    namePreview.replaceWith(input);
    input.focus();
    input.select();

    // Guardar al presionar Enter o perder foco
    const saveEdit = function() {
        const newName = input.value.trim();

        if (newName === '') {
            showToast('El nombre de la variable no puede estar vacío', 'error');
            input.value = currentName;
            input.focus();
            return;
        }

        if (newName.length > 50) {
            showToast('El nombre no puede exceder 50 caracteres', 'error');
            input.value = currentName;
            input.focus();
            return;
        }

        // Crear nuevo preview
        const newPreview = document.createElement('div');
        newPreview.className = 'variable-name-preview';
        newPreview.textContent = newName;
        newPreview.onclick = function() { editVariableName(varId); };

        input.replaceWith(newPreview);

        console.log(`✏️ Nombre de variable ${varId} cambiado a: ${newName}`);
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveEdit();
        }
        if (e.key === 'Escape') {
            // Cancelar edición
            const newPreview = document.createElement('div');
            newPreview.className = 'variable-name-preview';
            newPreview.textContent = currentName;
            newPreview.onclick = function() { editVariableName(varId); };
            input.replaceWith(newPreview);
        }
    });
}
```

**Tarea 5.3**: Implementar eliminación de variable con confirmación
```javascript
/**
 * Eliminar variable con confirmación
 */
function deleteVariable(varId) {
    // Obtener nombre de la variable
    const varCard = document.getElementById('varCard' + varId);
    const namePreview = varCard.querySelector('.variable-name-preview');
    const varName = namePreview ? namePreview.textContent : `Variable ${varId}`;

    // Mostrar modal de confirmación
    showConfirmModal(
        'Eliminar Variable',
        `¿Estás seguro de eliminar "${varName}"?<br><br>Esta acción no se puede deshacer.`,
        function() {
            // Confirmado - eliminar
            console.log('🗑️ Eliminando variable', varId);

            // Remover del DOM
            varCard.remove();

            // Limpiar array de componentes
            delete expressionComponents[varId];

            // Verificar si hay variables restantes
            const remainingVars = document.querySelectorAll('.variable-card');
            if (remainingVars.length === 0) {
                // Mostrar empty state
                const emptyState = document.getElementById('emptyState');
                if (emptyState) {
                    emptyState.style.display = 'flex';
                }
            }

            // Limpiar referencias en expresión lógica
            removeVariableFromLogicExpression(varId);

            showToast(`Variable "${varName}" eliminada`, 'success');
            console.log('✅ Variable eliminada exitosamente');
        }
    );
}

/**
 * Remover variable de la expresión lógica si estaba presente
 */
function removeVariableFromLogicExpression(varId) {
    // Filtrar componentes que no sean esta variable
    logicComponents = logicComponents.filter(comp => {
        return !(comp.type === 'variable' && comp.id === varId);
    });

    // Re-renderizar
    renderLogicExpression();
    updateLogicExpressionString();
}
```

**Tarea 5.4**: Implementar duplicación de variable
```javascript
/**
 * Duplicar variable (copia estructura y componentes)
 */
function duplicateVariable(varId) {
    console.log('📋 Duplicando variable', varId);

    // Obtener datos de la variable original
    const originalCard = document.getElementById('varCard' + varId);
    const originalName = originalCard.querySelector('.variable-name-preview').textContent;
    const originalComponents = expressionComponents[varId] || [];

    // Crear nueva variable
    variablesCounter++;
    const newVarId = variablesCounter;

    // Crear HTML similar
    const varCard = document.createElement('div');
    varCard.className = 'variable-card';
    varCard.id = 'varCard' + newVarId;
    varCard.innerHTML = `
        <div class="variable-card-header" draggable="true"
             ondragstart="dragVariable(event, ${newVarId})"
             ondragend="endDrag(event)">
            <div class="variable-number">${newVarId}</div>
            <div class="variable-name-preview" onclick="editVariableName(${newVarId})">
                ${originalName} (Copia)
            </div>
            <div class="variable-card-actions">
                <button onclick="duplicateVariable(${newVarId})" title="Duplicar variable">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="deleteVariable(${newVarId})" title="Eliminar variable">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>

        <div class="variable-card-body">
            <div class="expression-builder" id="exprBuilder${newVarId}"
                 ondragover="allowDrop(event)"
                 ondrop="dropIntoBuilder(event, ${newVarId})"
                 ondragleave="removeDragOver(event)">
                <div class="placeholder">
                    Arrastra campos, operadores y funciones aquí para construir la expresión
                </div>
            </div>
            <div class="expression-preview" id="exprPreview${newVarId}"></div>
        </div>

        <div class="config-panel" id="configPanel${newVarId}">
            <div class="config-panel-header">
                <h3 id="configPanelTitle${newVarId}"></h3>
                <div id="configBreadcrumb${newVarId}"></div>
            </div>
            <div class="config-panel-body" id="configPanelBody${newVarId}"></div>
            <div class="config-panel-footer">
                <button class="btn-cancel" onclick="cancelFunctionConfig(${newVarId})">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button class="btn-accept" onclick="acceptAllNestedLevels(${newVarId})">
                    <i class="fas fa-check"></i> Aceptar
                </button>
            </div>
        </div>
    `;

    // Insertar después de la variable original
    originalCard.insertAdjacentElement('afterend', varCard);

    // Copiar componentes (deep clone)
    expressionComponents[newVarId] = originalComponents.map(comp => {
        return {
            ...comp,
            id: 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
    });

    // Renderizar componentes copiados
    setTimeout(() => {
        renderExpression(newVarId);
        updateExpressionPreview(newVarId);
    }, 50);

    showToast(`Variable duplicada: ${originalName} (Copia)`, 'success');
    console.log('✅ Variable duplicada exitosamente');
}
```

**Tarea 5.5**: Implementar drag desde header de variable
```javascript
/**
 * Iniciar drag de variable (desde header)
 */
function dragVariable(event, varId) {
    draggedVariableId = varId;
    event.dataTransfer.effectAllowed = 'copy';

    // Obtener nombre de la variable
    const varCard = document.getElementById('varCard' + varId);
    const namePreview = varCard.querySelector('.variable-name-preview');
    const varName = namePreview ? namePreview.textContent : `Variable ${varId}`;

    // Agregar clase de drag
    varCard.classList.add('dragging');

    console.log('🖐️ Arrastrando variable:', varId, '-', varName);
}

/**
 * Terminar drag
 */
function endDrag(event) {
    // Limpiar estado de drag
    if (draggedVariableId) {
        const varCard = document.getElementById('varCard' + draggedVariableId);
        if (varCard) {
            varCard.classList.remove('dragging');
        }
    }

    draggedField = null;
    draggedOperator = null;
    draggedFunctionName = null;
    draggedVariableId = null;
    draggedLogicOperator = null;
}
```

**Tarea 5.6**: Implementar modal de confirmación y toasts
```javascript
/**
 * Mostrar modal de confirmación
 */
function showConfirmModal(title, message, onConfirm) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-header">${title}</div>
        <div class="modal-body">${message}</div>
        <div class="modal-footer">
            <button class="btn-cancel" onclick="this.closest('.modal-overlay').remove()">
                Cancelar
            </button>
            <button class="btn-accept" id="modalConfirmBtn">
                Confirmar
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Click en confirm
    document.getElementById('modalConfirmBtn').onclick = function() {
        overlay.remove();
        if (onConfirm) onConfirm();
    };

    // Click fuera del modal para cerrar
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    };
}

/**
 * Mostrar toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
```

**Tarea 5.7**: Actualizar inicialización en DOMContentLoaded
```javascript
// En la sección de inicialización (línea ~50)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Editor de Reglas iniciando...');

    // Cargar campos disponibles
    cargarCamposDisponibles();

    // Configurar botón "Agregar Variable"
    document.getElementById('btnAddVariable').addEventListener('click', addVariable);

    console.log('✅ Editor de Reglas iniciado');
});

/**
 * Cargar campos disponibles del backend
 */
function cargarCamposDisponibles() {
    // Llamada AJAX al WebMethod
    fetch('EditorReglas.aspx/ObtenerCamposDisponibles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const result = JSON.parse(data.d);
        if (result.success) {
            availableFields = result.data;
            renderCamposEnSidebar(availableFields);
            console.log('📋 Campos cargados:', availableFields.length);
        }
    })
    .catch(error => {
        console.error('❌ Error cargando campos:', error);
        showToast('Error al cargar campos disponibles', 'error');
    });
}

/**
 * Renderizar campos en sidebar
 */
function renderCamposEnSidebar(campos) {
    const camposList = document.getElementById('camposList');
    camposList.innerHTML = '';

    campos.forEach(campo => {
        const item = document.createElement('div');
        item.className = 'campo-item';
        item.draggable = true;
        item.innerHTML = `
            <i class="fas fa-table"></i>
            <span>${campo}</span>
        `;

        item.addEventListener('dragstart', function(e) {
            dragField(e, campo);
        });

        item.addEventListener('dragend', endDrag);

        camposList.appendChild(item);
    });
}
```

#### Definición de Done
- ✅ Botón "Agregar Variable" funciona
- ✅ Variables se crean con ID único e incremental
- ✅ Edición de nombre funciona (click, input, enter/esc)
- ✅ Eliminación funciona con modal de confirmación
- ✅ Duplicación copia estructura y componentes correctamente
- ✅ Drag desde header de variable funciona
- ✅ Empty state se oculta/muestra correctamente
- ✅ Array `expressionComponents[varId]` inicializado por cada variable
- ✅ Toast notifications funcionan
- ✅ Modal de confirmación funciona
- ✅ Console logs muestran operaciones correctamente

#### Notas de Implementación
- **IDs únicos**: Usar `Date.now() + Math.random()` para IDs de componentes
- **Confirmación**: Siempre pedir confirmación antes de eliminar (previene pérdidas accidentales)
- **Empty state**: Verificar si hay variables restantes después de cada eliminación
- **Performance**: Con 100+ variables, considerar pagination o virtual scroll
- **Validación de nombres**: Máximo 50 caracteres, no vacío
- **Drag visual feedback**: Usar clase `.dragging` para feedback visual
- **Memory leaks**: Al eliminar variable, también limpiar event listeners si los hay
- **Accesibilidad**: Agregar atributos ARIA para lectores de pantalla

---

### HU-006: Expression Builder Base (Drag & Drop)

**Estimación**: 5 SP | **Prioridad**: Crítica | **Dependencias**: HU-005

#### Descripción Técnica
Implementar el sistema completo de drag & drop para el expression builder principal: detectar elementos arrastrados (campos, operadores, valores), manejar eventos drop en el builder, crear componentes visuales (pills), y gestionar el array de componentes por variable.

#### Criterios de Aceptación
- [ ] Variables globales de estado drag implementadas: `draggedField`, `draggedOperator`, `draggedValue`, `draggedFunctionName`
- [ ] Funciones drag implementadas: `dragField()`, `dragOperator()`, `dragValue()`, `dragFunction()`
- [ ] Función `allowDrop(event)` implementada con `event.preventDefault()`
- [ ] Función `dropIntoBuilder(event, varId)` implementada con detección de tipo
- [ ] Función `addExprComponent(varId, type, value, html, metadata)` creando componentes correctamente
- [ ] Función `renderExpression(varId)` generando pills HTML
- [ ] Pills con colores diferenciados por tipo (campo: azul, operador: rosa, función: morado, valor: verde)
- [ ] Placeholder ocultándose al agregar primer componente
- [ ] Estado `drag-over` visual funcionando en drop zones
- [ ] Console logs para debugging de operaciones drag & drop

#### Tareas de Implementación

**Tarea 6.1**: Renderizar operadores en sidebar
```javascript
/**
 * Renderizar operadores en sidebar (después de campos)
 */
function renderOperadoresEnSidebar() {
    const operadoresList = document.getElementById('operadoresList');

    const operadores = [
        { symbol: '>', label: 'Mayor que' },
        { symbol: '<', label: 'Menor que' },
        { symbol: '=', label: 'Igual a' },
        { symbol: '>=', label: 'Mayor o igual' },
        { symbol: '<=', label: 'Menor o igual' },
        { symbol: '!=', label: 'Diferente de' },
        { symbol: '+', label: 'Suma' },
        { symbol: '-', label: 'Resta' },
        { symbol: '*', label: 'Multiplicación' },
        { symbol: '/', label: 'División' },
        { symbol: '(', label: 'Paréntesis abierto' },
        { symbol: ')', label: 'Paréntesis cerrado' }
    ];

    operadoresList.innerHTML = '';

    operadores.forEach(op => {
        const item = document.createElement('div');
        item.className = 'operador-item';
        item.draggable = true;
        item.textContent = op.symbol;
        item.title = op.label;

        item.addEventListener('dragstart', function(e) {
            if (op.symbol === '(' || op.symbol === ')') {
                dragParenthesis(e, op.symbol);
            } else {
                dragOperator(e, op.symbol);
            }
        });

        item.addEventListener('dragend', endDrag);

        operadoresList.appendChild(item);
    });
}

/**
 * Iniciar drag de operador
 */
function dragOperator(event, operator) {
    draggedOperator = operator;
    event.dataTransfer.effectAllowed = 'copy';
    event.target.classList.add('dragging');
    console.log('🖐️ Arrastrando operador:', operator);
}

/**
 * Iniciar drag de paréntesis
 */
function dragParenthesis(event, symbol) {
    draggedParenthesis = symbol;
    event.dataTransfer.effectAllowed = 'copy';
    event.target.classList.add('dragging');
    console.log('🖐️ Arrastrando paréntesis:', symbol);
}
```

**Tarea 6.2**: Renderizar funciones en sidebar
```javascript
/**
 * Renderizar funciones en sidebar
 */
function renderFuncionesEnSidebar() {
    const funcionesList = document.getElementById('funcionesList');

    const funciones = [
        { name: 'Mínimo', icon: 'fa-arrow-down' },
        { name: 'Máximo', icon: 'fa-arrow-up' },
        { name: 'Suma', icon: 'fa-plus' },
        { name: 'Promedio', icon: 'fa-chart-line' },
        { name: 'Conteo', icon: 'fa-hashtag' },
        { name: 'Si entonces', icon: 'fa-code-branch' },
        { name: 'Calcular edad', icon: 'fa-birthday-cake' },
        { name: 'Conteo caracteres', icon: 'fa-text-width' },
        { name: 'Expresión regular', icon: 'fa-code' },
        { name: 'Cualquier fecha', icon: 'fa-calendar-alt' }
    ];

    funcionesList.innerHTML = '';

    funciones.forEach(func => {
        const item = document.createElement('div');
        item.className = 'funcion-item';
        item.draggable = true;
        item.innerHTML = `
            <i class="fas ${func.icon}"></i>
            <span>${func.name}</span>
        `;

        item.addEventListener('dragstart', function(e) {
            dragFunction(e, func.name);
        });

        item.addEventListener('dragend', endDrag);

        funcionesList.appendChild(item);
    });
}

/**
 * Iniciar drag de función
 */
function dragFunction(event, functionName) {
    draggedFunctionName = functionName;
    event.dataTransfer.effectAllowed = 'copy';
    event.target.classList.add('dragging');
    console.log('🖐️ Arrastrando función:', functionName);
}
```

**Tarea 6.3**: Implementar allowDrop y visual feedback
```javascript
/**
 * Permitir drop en zona
 */
function allowDrop(event) {
    event.preventDefault();

    // Agregar clase visual
    const target = event.currentTarget;
    if (!target.classList.contains('drag-over')) {
        target.classList.add('drag-over');
    }
}

/**
 * Remover clase drag-over al salir
 */
function removeDragOver(event) {
    event.currentTarget.classList.remove('drag-over');
}
```

**Tarea 6.4**: Implementar dropIntoBuilder con detección de tipo
```javascript
/**
 * Drop en expression builder
 */
function dropIntoBuilder(event, varId) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    console.log('📥 Drop en expression builder', varId);

    let type, value, html;

    // Detectar qué se arrastró
    if (draggedField) {
        type = 'field';
        value = `[${draggedField}]`;
        html = `<i class="fas fa-table expr-icon"></i><span class="expr-value">${draggedField}</span>`;

        addExprComponent(varId, type, value, html);
        draggedField = null;

    } else if (draggedOperator) {
        type = 'operator';
        value = draggedOperator;
        html = `<span class="expr-value">${draggedOperator}</span>`;

        addExprComponent(varId, type, value, html);
        draggedOperator = null;

    } else if (draggedParenthesis) {
        type = 'parenthesis';
        value = draggedParenthesis;
        html = `<span class="expr-value">${draggedParenthesis}</span>`;

        addExprComponent(varId, type, value, html);
        draggedParenthesis = null;

    } else if (draggedFunctionName) {
        // Abrir panel de configuración de función
        console.log('🔧 Abriendo configuración de función:', draggedFunctionName);

        // Crear objeto de contexto temporal
        const tempInput = {
            varId: varId,
            builderId: 'exprBuilder' + varId,
            editMode: false
        };

        openConfigPanel(draggedFunctionName, tempInput);
        draggedFunctionName = null;

    } else {
        console.warn('⚠️ No se detectó elemento arrastrado');
    }
}
```

**Tarea 6.5**: Implementar addExprComponent
```javascript
/**
 * Agregar componente al expression builder
 */
function addExprComponent(varId, type, value, html, metadata = null) {
    // Generar ID único
    const compId = 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Crear objeto componente
    const component = {
        id: compId,
        type: type,
        value: value,
        html: html,
        metadata: metadata
    };

    // Agregar al array
    if (!expressionComponents[varId]) {
        expressionComponents[varId] = [];
    }

    expressionComponents[varId].push(component);

    console.log('➕ Componente agregado:', type, value);
    console.log('   Total componentes en var', varId + ':', expressionComponents[varId].length);

    // Re-renderizar
    renderExpression(varId);
    updateExpressionPreview(varId);
}
```

**Tarea 6.6**: Implementar renderExpression (pills visuales)
```javascript
/**
 * Renderizar componentes como pills en el expression builder
 */
function renderExpression(varId) {
    const builder = document.getElementById('exprBuilder' + varId);
    if (!builder) return;

    const components = expressionComponents[varId] || [];

    // Limpiar contenido actual
    builder.innerHTML = '';

    if (components.length === 0) {
        // Mostrar placeholder
        builder.innerHTML = '<div class="placeholder">Arrastra campos, operadores y funciones aquí para construir la expresión</div>';
        return;
    }

    // Renderizar cada componente como pill
    components.forEach(comp => {
        const pill = document.createElement('div');
        pill.className = `expr-component ${comp.type}`;
        pill.innerHTML = comp.html;

        // Agregar botones de acción
        const actions = document.createElement('span');
        actions.style.marginLeft = '4px';

        // Botón editar (solo para funciones)
        if (comp.type === 'function') {
            const btnEdit = document.createElement('button');
            btnEdit.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            btnEdit.title = 'Editar función';
            btnEdit.onclick = function(e) {
                e.stopPropagation();
                editExprComponent(comp.id, varId);
            };
            actions.appendChild(btnEdit);
        }

        // Botón eliminar
        const btnDelete = document.createElement('button');
        btnDelete.innerHTML = '<i class="fas fa-times"></i>';
        btnDelete.title = 'Eliminar';
        btnDelete.onclick = function(e) {
            e.stopPropagation();
            deleteExprComponent(comp.id, varId);
        };
        actions.appendChild(btnDelete);

        pill.appendChild(actions);
        builder.appendChild(pill);
    });
}
```

**Tarea 6.7**: Implementar deleteExprComponent
```javascript
/**
 * Eliminar componente del expression builder
 */
function deleteExprComponent(compId, varId) {
    console.log('🗑️ Eliminando componente:', compId);

    // Filtrar componente
    expressionComponents[varId] = expressionComponents[varId].filter(comp => comp.id !== compId);

    // Re-renderizar
    renderExpression(varId);
    updateExpressionPreview(varId);

    console.log('✅ Componente eliminado. Total restantes:', expressionComponents[varId].length);
}
```

**Tarea 6.8**: Implementar updateExpressionPreview
```javascript
/**
 * Actualizar vista previa textual de la expresión
 */
function updateExpressionPreview(varId) {
    const preview = document.getElementById('exprPreview' + varId);
    if (!preview) return;

    const components = expressionComponents[varId] || [];

    if (components.length === 0) {
        preview.textContent = '';
        preview.style.display = 'none';
        return;
    }

    // Construir string de expresión
    const expression = buildComponentsExpression(components);

    preview.textContent = 'Expresión: ' + expression;
    preview.style.display = 'block';
}

/**
 * Construir string de expresión desde array de componentes
 */
function buildComponentsExpression(components) {
    return components.map(comp => {
        if (comp.type === 'function' && comp.metadata && comp.metadata.fullExpression) {
            // Para funciones, usar la expresión completa guardada en metadata
            return comp.metadata.fullExpression;
        }
        return comp.value;
    }).join(' ');
}
```

**Tarea 6.9**: Actualizar inicialización para renderizar sidebar
```javascript
// Actualizar DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Editor de Reglas iniciando...');

    // Cargar campos disponibles
    cargarCamposDisponibles();

    // Renderizar operadores y funciones
    renderOperadoresEnSidebar();
    renderFuncionesEnSidebar();

    // Configurar botón "Agregar Variable"
    document.getElementById('btnAddVariable').addEventListener('click', addVariable);

    console.log('✅ Editor de Reglas iniciado');
});
```

**Tarea 6.10**: Agregar declaración de variable global para paréntesis
```javascript
// En la sección de variables globales
let draggedParenthesis = null;
```

#### Definición de Done
- ✅ Campos arrastrables desde sidebar
- ✅ Operadores arrastrables desde sidebar
- ✅ Funciones arrastrables desde sidebar
- ✅ Drop en expression builder funciona para todos los tipos
- ✅ Pills se generan correctamente con colores por tipo
- ✅ Botón eliminar en cada pill funciona
- ✅ Placeholder se oculta al agregar componentes
- ✅ Vista previa textual se actualiza automáticamente
- ✅ Estado `drag-over` visual funciona
- ✅ Console logs para debugging
- ✅ Array `expressionComponents[varId]` se mantiene actualizado

#### Notas de Implementación
- **Performance drag**: Evitar manipulaciones de DOM pesadas durante dragover (solo agregar/remover clase)
- **IDs únicos**: Usar `Date.now() + Math.random()` para garantizar unicidad incluso con clicks rápidos
- **Visual feedback**: La clase `.dragging` debe aplicarse al elemento siendo arrastrado
- **Paréntesis**: Son componentes separados de operadores (type: 'parenthesis')
- **Funciones**: No se agregan directamente como componentes, primero abren panel de configuración
- **Metadata**: Para funciones, siempre guardar fullExpression para poder editar después
- **Memory**: Limpiar variables globales de drag después de cada drop (previene bugs)
- **Accesibilidad**: Considerar implementar drag alternativo con teclado para accesibilidad

---