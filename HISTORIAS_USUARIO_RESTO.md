# HUs Restantes (HU-007 a HU-020)

## HUs Resumidas (Formato Conciso)

### HU-007: Botón Insertar Valor y Valores Literales

**Estimación**: 2 SP | **Prioridad**: Media | **Dependencias**: HU-006

#### Descripción
Agregar botón "Insertar Valor" al sidebar que abra modal para ingresar valores literales (números o textos). Los valores se convierten en items temporales arrastrables que crean pills verdes en el expression builder.

#### Tareas Principales
1. Agregar botón "Insertar Valor" al sidebar de operadores
2. Crear modal con select (número/texto) e input para valor
3. Validar tipo: números con `isNaN()`, textos encerrados en comillas
4. Crear item temporal arrastrable con `dragValue(event, valor, tipo)`
5. Actualizar `dropIntoBuilder` para manejar `draggedValue`
6. Agregar variable global `let draggedValue = null;`

#### Criterios de Aceptación
- ✅ Botón visible en sidebar
- ✅ Modal valida según tipo seleccionado
- ✅ Valores se arrastran y dropean correctamente
- ✅ Pills verdes con icono keyboard
- ✅ Item temporal se auto-elimina después del drag

---

### HU-010: Funciones Matemáticas Simples

**Estimación**: 3 SP | **Prioridad**: Alta | **Dependencias**: HU-008, HU-009

#### Descripción
Implementar formularios de configuración para funciones matemáticas simples (Mínimo, Máximo, Suma, Promedio, Conteo) usando mini-builders para sus parámetros.

#### Tareas Principales
1. En `generateFunctionForm(functionName)`, agregar casos para cada función:
   - **Mínimo/Máximo**: 2 mini-builders (Campo 1, Campo 2)
   - **Suma/Promedio/Conteo**: 1+ mini-builders con botón "Agregar Campo"
2. Implementar `addMiniBuilderParam()` para agregar parámetros dinámicamente
3. En `collectParams()`, recopilar expresiones de todos los mini-builders
4. Construir expresión final: `#NombreFuncion(param1,param2,...)#`
5. Testear con funciones anidadas (Ej: `#Suma(#Minimo([A],[B]),[C])#`)

#### Criterios de Aceptación
- ✅ Mínimo y Máximo con 2 parámetros funcionales
- ✅ Suma/Promedio/Conteo permiten agregar campos dinámicamente
- ✅ Botón "Agregar Campo" funciona correctamente
- ✅ Parámetros se recopilan correctamente en `collectParams()`
- ✅ Expresiones matemáticas se construyen con formato correcto

---

### HU-011: Función "Si entonces"

**Estimación**: 3 SP | **Prioridad**: Alta | **Dependencias**: HU-009, HU-015

#### Descripción
Implementar función "Si entonces" con 3 mini-builders (Condición, Valor si es Verdadero, Valor si es Falso), cada uno con su breadcrumb individual para navegación independiente.

#### Tareas Principales
1. En `generateFunctionForm`, caso "Si entonces":
   ```javascript
   html = generateMiniBuilder('param1', 'Condición', 'Expresión booleana...', true);
   html += generateMiniBuilder('param2', 'Valor si es Verdadero', 'Valor o campo...', true);
   html += generateMiniBuilder('param3', 'Valor si es Falso', 'Valor o campo...', true);
   ```
2. Los mini-builders se generan con `includeBreadcrumb=true`
3. Expresión final: `#SiEntonces(condicion,valorTrue,valorFalse)#`
4. Breadcrumbs individuales se actualizan con `updateMiniBreadcrumb(builderId)`

#### Criterios de Aceptación
- ✅ Tres mini-builders visibles con labels correctos
- ✅ Cada mini-builder tiene su breadcrumb individual
- ✅ Breadcrumbs se actualizan al anidar funciones
- ✅ Expresión final construida correctamente
- ✅ Funciona con funciones anidadas en cualquier parámetro

---

### HU-012: Función "Calcular Edad" con Bloques

**Estimación**: 4 SP | **Prioridad**: Alta | **Dependencias**: HU-008

#### Descripción
Implementar función especial "Calcular edad" usando sistema de bloques numerados en lugar de mini-builders. Permite arrastrar hasta 4 bloques (campo fecha, operador, valor, formato).

#### Tareas Principales
1. Crear array global `let droppedBlocks = [];`
2. En `generateFunctionForm`, caso "Calcular edad":
   - Crear `<div class="drop-zone">` con placeholder
   - Mostrar área para arrastrar bloques
3. Implementar `dropBlock(event)`:
   - Crear bloque: `{id, type, value, order}`
   - Agregar a `droppedBlocks`
   - Llamar `renderBlocks()`
4. Implementar `renderBlocks()`:
   - Ordenar por `order`
   - Generar cards numerados (1, 2, 3, 4)
   - Botón eliminar por bloque
5. Implementar `buildCalculaEdadExpression()`:
   - Formato: `#CalculaEdad([param1],[param2],[param3],YYYY)#`
   - SIEMPRE 4 parámetros (vacíos `[]` si no hay bloque)
6. Implementar `buildCalculaEdadPreview()`:
   - Muestra solo bloques arrastrados
7. Guardar `metadata.blocks` para edición posterior

#### Criterios de Aceptación
- ✅ Drop zone visual para bloques funciona
- ✅ Bloques se renderizan como cards numerados
- ✅ Eliminar bloque funciona y re-numera
- ✅ Expresión final siempre tiene 4 parámetros
- ✅ Vista previa muestra solo bloques arrastrados
- ✅ Metadata guarda blocks para editar después

---

### HU-015: Breadcrumbs Individuales por Mini-Builder

**Estimación**: 3 SP | **Prioridad**: Media | **Dependencias**: HU-013, HU-014

#### Descripción
Implementar breadcrumbs individuales para cada mini-builder en "Si entonces", filtrando niveles de navegación por cadena de parentBuilderId.

#### Tareas Principales
1. Implementar `updateMiniBreadcrumb(builderId)`:
   - Filtrar `navigationStack.levels` relevantes para ese builderId
   - Seguir cadena de `parentBuilderId` hacia atrás hasta raíz
   - Generar HTML del breadcrumb con navegación clickeable
   - Ocultar si no hay anidación (≤1 nivel)
2. Implementar `getParameterLabel(parentBuilderId, parentFunctionName)`:
   - Mapear número de parámetro a etiqueta legible
   - Ej: "Si entonces" param1 → "Condición"
3. En `renderCurrentConfigLevel()`, si es "Si entonces":
   - Actualizar los 3 breadcrumbs con loop
4. Navegación: click en breadcrumb llama `navigateToLevel(globalIndex)`

#### Criterios de Aceptación
- ✅ Tres breadcrumbs separados para "Si entonces"
- ✅ Cada breadcrumb muestra solo su cadena relevante
- ✅ Navegación independiente por mini-builder funciona
- ✅ Breadcrumbs se ocultan si no hay anidación
- ✅ Labels de parámetros legibles (Condición, Valor si...)

---

### HU-016: Logic Expression Builder

**Estimación**: 3 SP | **Prioridad**: Alta | **Dependencias**: HU-005

#### Descripción
Implementar constructor de expresión lógica final que combina variables con operadores lógicos (AND, OR, NOT) y paréntesis.

#### Tareas Principales
1. Agregar operadores lógicos al sidebar: AND, OR, NOT
2. Implementar `dragLogicOperator(event, operator)`
3. Implementar `dropIntoLogicExpression(event)`:
   - Detectar `draggedVariableId` o `draggedLogicOperator`
   - Crear componente con `addLogicComponent()`
4. Implementar `renderLogicExpression()`:
   - Pills morados para variables
   - Pills rosas para operadores lógicos
   - Pills grises para paréntesis
5. Implementar `updateLogicExpressionString()`:
   - Construir string: `{Variable 1} AND {Variable 2}`
6. Validación básica: paréntesis balanceados

#### Criterios de Aceptación
- ✅ Variables arrastrables desde headers
- ✅ Operadores lógicos arrastrables desde sidebar
- ✅ Pills con colores correctos (variable: morado, operador: rosa)
- ✅ Vista previa de expresión final actualizada
- ✅ Botón eliminar por componente funciona
- ✅ Validación de paréntesis balanceados

---

### HU-020: Testing Final y Deployment

**Estimación**: 3 SP | **Prioridad**: Alta | **Dependencias**: Todas las anteriores

#### Descripción
Testing funcional completo del sistema, corrección de bugs detectados, y preparación para deployment.

#### Tareas Principales
1. **Testing funcional**:
   - CRUD de variables
   - Todas las funciones (simples y avanzadas)
   - Funciones anidadas (2-4 niveles)
   - Guardar/Cargar/Editar reglas completas
   - Navegación con breadcrumbs
2. **Testing en navegadores**: Chrome, Firefox, Edge
3. **Corrección de bugs críticos y mayores**
4. **Optimización básica de performance**
5. **Documentación mínima**:
   - README con instrucciones
   - Comentarios en código crítico
6. **Deployment**:
   - Scripts SQL para producción
   - Checklist de configuración
   - Deploy a dev/staging

#### Criterios de Aceptación
- ✅ 0 bugs críticos
- ✅ <5 bugs mayores pendientes
- ✅ Todas las funcionalidades probadas
- ✅ Performance aceptable (<100ms operaciones comunes)
- ✅ README creado
- ✅ Sistema desplegado en ambiente de desarrollo

---

## HUs COMPLETAS con Código Detallado

### HU-008: Panel de Configuración de Funciones (CRÍTICA)

**Estimación**: 5 SP | **Prioridad**: Crítica | **Dependencias**: HU-006

#### Descripción Técnica
Implementar el sistema completo de panel de configuración inline que se expande dentro de cada variable cuando se arrastra una función. Incluye header con título, body dinámico, footer con botones, y generación de formularios específicos por tipo de función.

#### Criterios de Aceptación
- [ ] Función `openConfigPanel(functionName, input)` implementada completamente
- [ ] Función `closeConfigPanel(varId)` limpia estado y oculta panel
- [ ] Función `generateFunctionForm(functionName)` con switch case para todas las funciones
- [ ] Animación slide-down al abrir panel (max-height transition)
- [ ] Variable global `activeInput` guarda contexto actual
- [ ] Variable global `currentFunction` guarda función siendo configurada
- [ ] Variable global `currentConfigVarId` guarda ID de variable
- [ ] Función `cancelFunctionConfig(varId)` limpia y cierra sin guardar
- [ ] Función `acceptFunctionConfig(varId)` recopila y guarda (stub para HU-010+)
- [ ] Panel se ve correctamente en todas las variables

#### Tareas de Implementación

**Tarea 8.1**: Implementar openConfigPanel completa
```javascript
/**
 * Abrir panel de configuración de función
 * @param {string} functionName - Nombre de la función a configurar
 * @param {object} input - Contexto {varId, builderId, editMode}
 */
function openConfigPanel(functionName, input) {
    console.log('🔧 Abriendo panel de configuración:', functionName);
    console.log('   Contexto:', input);

    // Guardar contexto global
    activeInput = input;
    currentFunction = functionName;
    currentConfigVarId = input.varId;

    const varId = input.varId;
    const panel = document.getElementById('configPanel' + varId);
    const title = document.getElementById('configPanelTitle' + varId);
    const body = document.getElementById('configPanelBody' + varId);

    if (!panel || !title || !body) {
        console.error('❌ No se encontró panel de configuración para variable', varId);
        return;
    }

    // Actualizar título con ícono
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

    const icon = icons[functionName] || 'fa-cog';
    title.innerHTML = `<i class="fas ${icon}"></i> ${functionName}`;

    // Generar formulario específico de la función
    body.innerHTML = generateFunctionForm(functionName);

    // Mostrar panel con animación
    panel.classList.add('active');

    // Scroll al panel
    setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    console.log('✅ Panel abierto exitosamente');
}
```

**Tarea 8.2**: Implementar closeConfigPanel
```javascript
/**
 * Cerrar panel de configuración
 */
function closeConfigPanel(varId) {
    console.log('❌ Cerrando panel de configuración de variable', varId);

    const panel = document.getElementById('configPanel' + varId);
    if (!panel) return;

    // Ocultar panel
    panel.classList.remove('active');

    // Limpiar estado global
    activeInput = null;
    currentFunction = null;
    currentConfigVarId = null;

    // Limpiar navigation stack (si existe)
    if (typeof navigationStack !== 'undefined') {
        navigationStack.levels = [];
        navigationStack.currentLevel = -1;
    }

    // Limpiar mini-builders temporales
    const tempBuilders = panel.querySelectorAll('.mini-expression-builder');
    tempBuilders.forEach(builder => {
        const builderId = builder.id;
        if (miniBuilderComponents[builderId]) {
            delete miniBuilderComponents[builderId];
        }
    });

    console.log('✅ Panel cerrado y limpiado');
}
```

**Tarea 8.3**: Implementar generateFunctionForm (base)
```javascript
/**
 * Generar formulario específico para cada función
 * @param {string} functionName - Nombre de la función
 * @returns {string} HTML del formulario
 */
function generateFunctionForm(functionName) {
    console.log('📝 Generando formulario para:', functionName);

    let html = '';

    switch (functionName) {
        case 'Mínimo':
        case 'Máximo':
            // Funciones simples con 2 parámetros
            html = `
                <div class="function-form">
                    ${generateMiniBuilder('param1', 'Campo o Expresión 1', 'Arrastra campos o valores')}
                    ${generateMiniBuilder('param2', 'Campo o Expresión 2', 'Arrastra campos o valores')}
                </div>
            `;
            break;

        case 'Suma':
        case 'Promedio':
        case 'Conteo':
            // Funciones con parámetros variables
            html = `
                <div class="function-form">
                    ${generateMiniBuilder('param1', 'Campo o Expresión', 'Arrastra campos, operadores o funciones')}
                    <div style="text-align: center; margin: 12px 0;">
                        <button type="button" onclick="addMiniBuilderParam()" style="
                            padding: 8px 16px;
                            background: var(--primary-light);
                            border: 2px solid var(--primary);
                            border-radius: 6px;
                            color: var(--primary-dark);
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 12px;
                        ">
                            <i class="fas fa-plus"></i> Agregar Campo
                        </button>
                    </div>
                    <div id="additionalParams"></div>
                </div>
            `;
            break;

        case 'Conteo caracteres':
            html = `
                <div class="function-form">
                    ${generateMiniBuilder('param1', 'Texto', 'Arrastra un campo de texto')}
                </div>
            `;
            break;

        case 'Expresión regular':
            html = `
                <div class="function-form">
                    ${generateMiniBuilder('param1', 'Texto', 'Arrastra un campo de texto')}
                    ${generateMiniBuilder('param2', 'Patrón', 'Arrastra un valor con el patrón regex')}
                </div>
            `;
            break;

        case 'Cualquier fecha':
            html = `
                <div class="function-form">
                    ${generateMiniBuilder('param1', 'Fecha', 'Arrastra un campo de fecha')}
                    ${generateMiniBuilder('param2', 'Formato Entrada', 'Ej: "DD/MM/YYYY"')}
                    ${generateMiniBuilder('param3', 'Formato Salida', 'Ej: "YYYY-MM-DD"')}
                </div>
            `;
            break;

        // Casos especiales se implementan en sus HUs específicas (HU-011, HU-012)
        case 'Si entonces':
            // Implementado en HU-011
            html = `<p style="color: var(--warning);">⚠️ "Si entonces" se implementa en HU-011</p>`;
            break;

        case 'Calcular edad':
            // Implementado en HU-012
            html = `<p style="color: var(--warning);">⚠️ "Calcular edad" se implementa en HU-012</p>`;
            break;

        default:
            html = `<p style="color: var(--danger);">❌ Función "${functionName}" no implementada</p>`;
    }

    return html;
}
```

**Tarea 8.4**: Implementar cancelFunctionConfig
```javascript
/**
 * Cancelar configuración de función (cerrar sin guardar)
 */
function cancelFunctionConfig(varId) {
    console.log('↩️ Cancelando configuración de función');

    // Mostrar confirmación si hay datos ingresados
    const panel = document.getElementById('configPanel' + varId);
    const builders = panel.querySelectorAll('.mini-expression-builder');

    let hasData = false;
    builders.forEach(builder => {
        if (miniBuilderComponents[builder.id] && miniBuilderComponents[builder.id].length > 0) {
            hasData = true;
        }
    });

    if (hasData) {
        showConfirmModal(
            'Cancelar Configuración',
            '¿Estás seguro de cancelar? Se perderán los cambios.',
            function() {
                closeConfigPanel(varId);
                showToast('Configuración cancelada', 'info');
            }
        );
    } else {
        closeConfigPanel(varId);
    }
}
```

**Tarea 8.5**: Stub de acceptFunctionConfig (implementación completa en HU-010+)
```javascript
/**
 * Aceptar configuración de función (STUB - implementación completa en HU-010)
 */
function acceptFunctionConfig(varId) {
    console.log('✅ [STUB] Aceptando configuración de función');
    console.log('   Función:', currentFunction);
    console.log('   Variable:', varId);

    // TODO: Implementar recopilación de parámetros y construcción de expresión en HU-010+

    showToast('Aceptar función se implementará completamente en HU-010+', 'info');
}
```

**Tarea 8.6**: Agregar variables globales
```javascript
// En sección de variables globales (después de las variables de drag)

// Configuración de funciones
let currentFunction = null;          // Nombre de función siendo configurada
let currentConfigVarId = null;       // ID de variable siendo configurada
let activeInput = null;              // Contexto del input activo {varId, builderId, editMode}
```

#### Definición de Done
- ✅ `openConfigPanel()` abre panel correctamente
- ✅ Panel se expande con animación suave
- ✅ Título muestra ícono y nombre de función
- ✅ Body muestra formulario específico según función
- ✅ Footer tiene botones Cancelar y Aceptar
- ✅ `closeConfigPanel()` cierra y limpia estado
- ✅ `cancelFunctionConfig()` pide confirmación si hay datos
- ✅ `generateFunctionForm()` genera formularios para funciones básicas
- ✅ Variables globales guardan contexto correctamente
- ✅ Panel scroll into view al abrirse
- ✅ No hay errores en console

#### Notas de Implementación
- **Animación**: Usar `max-height` transition para smooth slide-down
- **Contexto**: `activeInput` es crítico para saber dónde insertar el resultado
- **Limpieza**: Siempre limpiar `miniBuilderComponents` temporales al cerrar
- **Scroll**: `scrollIntoView` mejora UX especialmente con muchas variables
- **Confirmación**: Cancelar debe pedir confirmación solo si hay datos ingresados
- **Icons**: Usar Font Awesome consistente con el diseño
- **Future**: Considerar guardar estado en localStorage para recuperación ante refresh accidental

---

### HU-009: Mini-Builders (Parámetros de Funciones) (CRÍTICA)

**Estimación**: 5 SP | **Prioridad**: Crítica | **Dependencias**: HU-008

#### Descripción Técnica
Implementar sistema completo de mini-builders: pequeños expression builders dentro del panel de configuración para construir parámetros de funciones. Incluye drag & drop, renderizado de pills (80% del tamaño normal), gestión de componentes por builderId, y soporte para funciones anidadas.

#### Criterios de Aceptación
- [ ] Función `generateMiniBuilder(paramId, label, placeholder, includeBreadcrumb)` implementada
- [ ] Función `createMiniBuilder(builderId, varId)` inicializa array de componentes
- [ ] Función `dropIntoMiniBuilder(event, builderId)` maneja drop correctamente
- [ ] Función `renderMiniBuilder(builderId)` genera pills visuales
- [ ] Función `addMiniComponent(builderId, type, value, html)` agrega componentes
- [ ] Función `deleteMiniComponent(compId, builderId)` elimina componentes
- [ ] Función `buildMiniExpression(builderId)` construye string de expresión
- [ ] Pills dentro de mini-builders son más pequeños (80% tamaño)
- [ ] Placeholder se oculta al agregar componentes
- [ ] Estado `drag-over` funciona en mini-builders
- [ ] Array `miniBuilderComponents[builderId]` gestiona componentes por builder

#### Tareas de Implementación

**Tarea 9.1**: Implementar generateMiniBuilder completa
```javascript
/**
 * Generar HTML de un mini expression builder
 * @param {string} paramId - ID del parámetro (param1, param2, etc.)
 * @param {string} label - Etiqueta del parámetro
 * @param {string} placeholder - Texto placeholder
 * @param {boolean} includeBreadcrumb - Si incluir breadcrumb individual (default: false)
 * @returns {string} HTML del mini-builder
 */
function generateMiniBuilder(paramId, label, placeholder, includeBreadcrumb = false) {
    // Generar ID único para el builder
    const timestamp = Date.now();
    const levelIndex = navigationStack && navigationStack.currentLevel >= 0
        ? navigationStack.currentLevel
        : 0;

    const builderId = `miniBuilder_level${levelIndex}_${paramId}_${timestamp}`;

    console.log('🏗️ Generando mini-builder:', builderId);

    // HTML del breadcrumb individual (opcional)
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
            font-size: 11px;
        "></div>
    ` : '';

    const html = `
        <div class="mini-builder-container">
            <label style="
                display: block;
                font-weight: 600;
                font-size: 13px;
                color: var(--gray-700);
                margin-bottom: 8px;
            ">${label}</label>

            ${breadcrumbHtml}

            <div class="mini-expression-builder" id="${builderId}"
                 data-param-id="${paramId}"
                 ondragover="allowDrop(event)"
                 ondrop="dropIntoMiniBuilder(event, '${builderId}')"
                 ondragleave="removeDragOver(event)">
                <div class="placeholder">${placeholder}</div>
            </div>

            <button type="button" onclick="insertValueIntoMiniBuilder('${builderId}')" style="
                margin-top: 8px;
                padding: 6px 12px;
                background: var(--color-value-light);
                color: var(--color-value);
                border: 1px solid var(--color-value);
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            ">
                <i class="fas fa-keyboard"></i> Valor
            </button>
        </div>
    `;

    // Inicializar array de componentes
    miniBuilderComponents[builderId] = [];

    return html;
}
```

**Tarea 9.2**: Implementar dropIntoMiniBuilder
```javascript
/**
 * Drop en mini expression builder
 * @param {DragEvent} event - Evento de drop
 * @param {string} builderId - ID del mini-builder
 */
function dropIntoMiniBuilder(event, builderId) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    console.log('📥 Drop en mini-builder:', builderId);

    let type, value, html;

    // Detectar qué se arrastró
    if (draggedField) {
        type = 'field';
        value = `[${draggedField}]`;
        html = `<i class="fas fa-table expr-icon"></i><span class="expr-value">${draggedField}</span>`;

        addMiniComponent(builderId, type, value, html);
        draggedField = null;

    } else if (draggedOperator) {
        type = 'operator';
        value = draggedOperator;
        html = `<span class="expr-value">${draggedOperator}</span>`;

        addMiniComponent(builderId, type, value, html);
        draggedOperator = null;

    } else if (draggedParenthesis) {
        type = 'parenthesis';
        value = draggedParenthesis;
        html = `<span class="expr-value">${draggedParenthesis}</span>`;

        addMiniComponent(builderId, type, value, html);
        draggedParenthesis = null;

    } else if (draggedValue) {
        type = 'value';
        const displayValue = draggedValue.type === 'text'
            ? `"${draggedValue.value}"`
            : draggedValue.value;
        value = displayValue;
        html = `<i class="fas fa-keyboard expr-icon"></i><span class="expr-value">${displayValue}</span>`;

        addMiniComponent(builderId, type, value, html);
        draggedValue = null;

    } else if (draggedFunctionName) {
        // Crear función anidada
        console.log('🔧 Creando función anidada:', draggedFunctionName, 'en', builderId);

        // TODO: Implementar en HU-013 (Navigation Stack)
        showToast(`Funciones anidadas se implementan en HU-013`, 'info');
        draggedFunctionName = null;

    } else {
        console.warn('⚠️ No se detectó elemento arrastrado');
    }
}
```

**Tarea 9.3**: Implementar addMiniComponent
```javascript
/**
 * Agregar componente a mini-builder
 * @param {string} builderId - ID del mini-builder
 * @param {string} type - Tipo del componente
 * @param {string} value - Valor del componente
 * @param {string} html - HTML visual del componente
 */
function addMiniComponent(builderId, type, value, html) {
    // Generar ID único
    const compId = 'miniComp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Crear objeto componente
    const component = {
        id: compId,
        type: type,
        value: value,
        html: html
    };

    // Agregar al array
    if (!miniBuilderComponents[builderId]) {
        miniBuilderComponents[builderId] = [];
    }

    miniBuilderComponents[builderId].push(component);

    console.log('➕ Mini-componente agregado:', type, value, 'en', builderId);
    console.log('   Total:', miniBuilderComponents[builderId].length);

    // Re-renderizar
    renderMiniBuilder(builderId);
}
```

**Tarea 9.4**: Implementar renderMiniBuilder
```javascript
/**
 * Renderizar componentes en mini-builder
 * @param {string} builderId - ID del mini-builder
 */
function renderMiniBuilder(builderId) {
    const builder = document.getElementById(builderId);
    if (!builder) {
        console.warn('⚠️ No se encontró mini-builder:', builderId);
        return;
    }

    const components = miniBuilderComponents[builderId] || [];

    // Limpiar contenido actual
    builder.innerHTML = '';

    if (components.length === 0) {
        // Mostrar placeholder
        const placeholder = builder.getAttribute('data-placeholder') ||
                          'Arrastra campos, operadores o funciones';
        builder.innerHTML = `<div class="placeholder">${placeholder}</div>`;
        return;
    }

    // Renderizar cada componente como pill (más pequeño)
    components.forEach(comp => {
        const pill = document.createElement('div');
        pill.className = `expr-component ${comp.type}`;
        pill.style.fontSize = '11px';
        pill.style.padding = '4px 10px';
        pill.innerHTML = comp.html;

        // Botón eliminar
        const btnDelete = document.createElement('button');
        btnDelete.innerHTML = '<i class="fas fa-times"></i>';
        btnDelete.title = 'Eliminar';
        btnDelete.style.fontSize = '9px';
        btnDelete.style.marginLeft = '4px';
        btnDelete.onclick = function(e) {
            e.stopPropagation();
            deleteMiniComponent(comp.id, builderId);
        };

        pill.appendChild(btnDelete);
        builder.appendChild(pill);
    });

    console.log('🎨 Mini-builder renderizado:', builderId, components.length, 'componentes');
}
```

**Tarea 9.5**: Implementar deleteMiniComponent
```javascript
/**
 * Eliminar componente de mini-builder
 * @param {string} compId - ID del componente
 * @param {string} builderId - ID del mini-builder
 */
function deleteMiniComponent(compId, builderId) {
    console.log('🗑️ Eliminando mini-componente:', compId, 'de', builderId);

    // Filtrar componente
    if (miniBuilderComponents[builderId]) {
        miniBuilderComponents[builderId] = miniBuilderComponents[builderId].filter(
            comp => comp.id !== compId
        );

        // Re-renderizar
        renderMiniBuilder(builderId);

        console.log('✅ Mini-componente eliminado. Total restantes:', miniBuilderComponents[builderId].length);
    }
}
```

**Tarea 9.6**: Implementar buildMiniExpression
```javascript
/**
 * Construir string de expresión desde mini-builder
 * @param {string} builderId - ID del mini-builder
 * @returns {string} Expresión construida
 */
function buildMiniExpression(builderId) {
    const components = miniBuilderComponents[builderId] || [];

    if (components.length === 0) {
        return '';
    }

    return components.map(comp => comp.value).join(' ');
}
```

**Tarea 9.7**: Implementar insertValueIntoMiniBuilder
```javascript
/**
 * Insertar valor literal en mini-builder mediante modal
 * @param {string} builderId - ID del mini-builder destino
 */
function insertValueIntoMiniBuilder(builderId) {
    console.log('⌨️ Insertar valor en mini-builder:', builderId);

    // Crear modal similar a mostrarModalInsertarValor pero con destino específico
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-header">Insertar Valor</div>
        <div class="modal-body">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--gray-700);">
                Tipo de valor:
            </label>
            <select id="tipoValorMini" style="width: 100%; padding: 8px; margin-bottom: 16px; border: 1px solid var(--gray-300); border-radius: 6px;">
                <option value="number">Número</option>
                <option value="text">Texto</option>
            </select>

            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--gray-700);">
                Valor:
            </label>
            <input type="text" id="inputValorMini" placeholder="Ingresa el valor" style="
                width: 100%;
                padding: 10px;
                border: 2px solid var(--gray-300);
                border-radius: 6px;
                font-size: 14px;
            ">

            <div id="errorValorMini" style="color: var(--danger); font-size: 12px; margin-top: 8px; display: none;"></div>
        </div>
        <div class="modal-footer">
            <button class="btn-cancel" onclick="this.closest('.modal-overlay').remove()">
                Cancelar
            </button>
            <button class="btn-accept" id="btnConfirmarValorMini">
                Insertar
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const input = document.getElementById('inputValorMini');
    input.focus();

    // Enter para confirmar
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('btnConfirmarValorMini').click();
        }
    });

    // Confirmar
    document.getElementById('btnConfirmarValorMini').onclick = function() {
        const tipo = document.getElementById('tipoValorMini').value;
        const valor = input.value.trim();
        const errorDiv = document.getElementById('errorValorMini');

        // Validar
        if (valor === '') {
            errorDiv.textContent = 'El valor no puede estar vacío';
            errorDiv.style.display = 'block';
            input.focus();
            return;
        }

        if (tipo === 'number' && isNaN(valor)) {
            errorDiv.textContent = 'Debe ingresar un número válido';
            errorDiv.style.display = 'block';
            input.focus();
            return;
        }

        // Insertar directamente en el mini-builder
        const displayValue = tipo === 'text' ? `"${valor}"` : valor;
        const html = `<i class="fas fa-keyboard expr-icon"></i><span class="expr-value">${displayValue}</span>`;

        addMiniComponent(builderId, 'value', displayValue, html);

        overlay.remove();
        showToast('Valor insertado', 'success');
    };

    // Click fuera para cerrar
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    };
}
```

**Tarea 9.8**: Agregar variable global
```javascript
// En sección de variables globales
let miniBuilderComponents = {};     // {builderId: [componentes]}
```

#### Definición de Done
- ✅ Mini-builders se generan correctamente con IDs únicos
- ✅ Drop en mini-builders funciona para todos los tipos
- ✅ Pills en mini-builders son más pequeños (11px font, 4px padding)
- ✅ Botón "Valor" abre modal y inserta directamente en mini-builder
- ✅ Placeholder se oculta al agregar componentes
- ✅ Botón eliminar por componente funciona
- ✅ `buildMiniExpression()` construye expresión correctamente
- ✅ Estado `drag-over` funciona
- ✅ Array `miniBuilderComponents` gestiona múltiples builders sin conflictos
- ✅ Console logs para debugging
- ✅ No hay memory leaks al crear/eliminar builders

#### Notas de Implementación
- **BuilderID único**: Usar timestamp + levelIndex + paramId para evitar colisiones
- **Tamaño pills**: 80% del tamaño normal (font: 11px vs 12px, padding: 4px vs 6px)
- **Breadcrumb opcional**: Solo para "Si entonces" en HU-011
- **Funciones anidadas**: El drop de funciones en mini-builders se implementa en HU-013
- **Memory**: Al cerrar panel, limpiar builders temporales de `miniBuilderComponents`
- **Performance**: Con 10+ mini-builders simultáneos, el sistema debe mantener <100ms respuesta
- **Future**: Considerar permitir reordenar componentes dentro de mini-builders (drag interno)

---

### HU-013: Navigation Stack - Funciones Anidadas Parte 1 (MUY CRÍTICA)

**Estimación**: 8 SP | **Prioridad**: Crítica | **Dependencias**: HU-009

#### Descripción Técnica
Implementar el sistema completo de navigation stack para manejar funciones anidadas. Permite crear niveles de configuración cuando se arrastra una función dentro de un mini-builder, guardando el estado de cada nivel y permitiendo navegación entre ellos.

#### Código Clave (Ver Scripts/EditorFunciones.js líneas 1400-1600 del proyecto actual)

**Variables Globales**:
```javascript
let navigationStack = {
    currentLevel: -1,
    levels: []  // {functionName, parentBuilderId, functionId, varId, miniBuilderStates, savedHTML}
};
```

**Funciones Principales**:
1. `createNestedFunction(functionName, parentBuilderId, varId)` - Crear nivel anidado
2. `saveCurrentLevelState()` - Guardar estado del nivel actual
3. `recreateNestedLevel(functionName, params, parentBuilderId, varId)` - Recrear al editar
4. **CRÍTICO**: Calcular `levelIndex` ANTES de agregar al stack

#### Criterios de Aceptación
- ✅ Drop de función en mini-builder crea nuevo nivel
- ✅ Navigation stack guarda contexto completo por nivel
- ✅ `saveCurrentLevelState()` guarda HTML y componentes
- ✅ Placeholder de función creado en mini-builder padre
- ✅ LevelIndex calculado correctamente (bug crítico si no)
- ✅ Stack soporta 4+ niveles de anidación

**Referencia**: Ver implementación completa en `EditorFunciones.js` del proyecto actual (líneas ~400-600 y ~1400-1600)

---

### HU-014: Navegación Completa - Funciones Anidadas Parte 2 (MUY CRÍTICA)

**Estimación**: 8 SP | **Prioridad**: Crítica | **Dependencies**: HU-013

#### Descripción Técnica
Completar navegación entre niveles, actualizar expresiones de niveles hijos al navegar a padre, y procesar todos los niveles anidados al aceptar configuración final.

#### Código Clave (Ver Scripts/EditorFunciones.js líneas 600-750 y 3400-3650 del proyecto actual)

**Funciones Principales**:
1. `navigateToLevel(targetLevel)` - Cambiar nivel actual
2. `buildLevelExpression(level)` - Construir expresión del nivel
3. `acceptAllNestedLevels(varId)` - Procesar todos los niveles
4. `renderCurrentConfigLevel()` - Renderizar nivel activo
5. `updateNavigationBreadcrumb(breadcrumb)` - Actualizar breadcrumb general

#### Código Crítico:
```javascript
// CRÍTICO: Restaurar TODOS los mini-builders antes de procesar
navigationStack.levels.forEach((level, idx) => {
    Object.keys(level.miniBuilderStates).forEach(builderId => {
        miniBuilderComponents[builderId] = JSON.parse(
            JSON.stringify(level.miniBuilderStates[builderId])
        );
    });
});
```

#### Criterios de Aceptación
- ✅ `navigateToLevel()` cambia nivel correctamente
- ✅ Al navegar a padre, actualiza expresión del hijo
- ✅ `acceptAllNestedLevels()` procesa del más profundo al raíz
- ✅ Restauración de TODOS los mini-builders funciona
- ✅ Breadcrumb general muestra jerarquía completa
- ✅ Modo edición actualiza componente existente (no crea nuevo)

**Referencia**: Ver implementación completa en `EditorFunciones.js` del proyecto actual

---

### HU-017: Guardar Reglas (CRÍTICA)

**Estimación**: 4 SP | **Prioridad**: Crítica | **Dependencias**: HU-016

#### Descripción Técnica
Implementar serialización completa de reglas: recopilar todas las variables con sus expresiones y componentes, serializar a JSON, y enviar al backend mediante Web Method.

#### Código Completo

**Tarea 17.1**: Implementar guardarRegla()
```javascript
/**
 * Guardar regla completa
 */
function guardarRegla() {
    console.log('💾 Guardando regla...');

    // Validar que haya al menos una variable
    if (variablesCounter === 0) {
        showToast('Debes agregar al menos una variable', 'error');
        return;
    }

    // Validar que haya expresión lógica
    if (logicComponents.length === 0) {
        showToast('Debes construir la expresión lógica', 'error');
        return;
    }

    // Obtener nombre de la regla
    const nombreRegla = document.getElementById('txtNombreRegla').value.trim();
    if (!nombreRegla) {
        showToast('Debes ingresar un nombre para la regla', 'error');
        document.getElementById('txtNombreRegla').focus();
        return;
    }

    // Recopilar variables
    const variables = [];
    const varCards = document.querySelectorAll('.variable-card');

    varCards.forEach(card => {
        const varId = parseInt(card.id.replace('varCard', ''));
        const namePreview = card.querySelector('.variable-name-preview');
        const nombre = namePreview ? namePreview.textContent : `Variable ${varId}`;

        const components = expressionComponents[varId] || [];
        const expresion = buildComponentsExpression(components);

        variables.push({
            numero: varId,
            nombre: nombre,
            expresion: expresion,
            componentesJson: JSON.stringify(components)
        });
    });

    // Construir expresión lógica
    const expresionLogica = buildLogicExpressionString();

    // Crear objeto regla
    const regla = {
        id: window.currentReglaId || 0,
        nombre: nombreRegla,
        expresionLogica: expresionLogica,
        variablesJson: JSON.stringify(variables),
        componentesLogicaJson: JSON.stringify(logicComponents)
    };

    console.log('📦 Regla a guardar:', regla);

    // Mostrar loading
    showToast('Guardando regla...', 'info');

    // Llamar al Web Method
    fetch('EditorReglas.aspx/GuardarRegla', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jsonData: JSON.stringify(regla) })
    })
    .then(response => response.json())
    .then(data => {
        const result = JSON.parse(data.d);

        if (result.success) {
            window.currentReglaId = result.id;
            showToast(result.message, 'success');
            console.log('✅ Regla guardada exitosamente. ID:', result.id);
        } else {
            showToast('Error: ' + result.message, 'error');
            if (result.errors) {
                console.error('Errores de validación:', result.errors);
            }
        }
    })
    .catch(error => {
        console.error('❌ Error al guardar:', error);
        showToast('Error de conexión al guardar', 'error');
    });
}

/**
 * Construir string de expresión lógica desde componentes
 */
function buildLogicExpressionString() {
    return logicComponents.map(comp => {
        if (comp.type === 'variable') {
            return `{${comp.name}}`;
        }
        return comp.value;
    }).join(' ');
}
```

**Tarea 17.2**: Configurar botón guardar
```javascript
// En DOMContentLoaded
document.getElementById('btnGuardar').addEventListener('click', guardarRegla);

// Shortcut Ctrl+S
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        guardarRegla();
    }
});
```

#### Criterios de Aceptación
- ✅ Validaciones funcionan (nombre, variables, expresión lógica)
- ✅ Variables se serializan correctamente con componentes
- ✅ Expresión lógica se construye correctamente
- ✅ Fetch POST funciona correctamente
- ✅ Response del backend se procesa
- ✅ Toast muestra éxito o error
- ✅ Ctrl+S funciona como shortcut
- ✅ currentReglaId se actualiza para updates

---

### HU-018: Cargar Reglas - Parte 1 (Parser) (CRÍTICA)

**Estimación**: 5 SP | **Prioridad**: Crítica | **Dependencias**: HU-017

#### Descripción Técnica
Implementar carga de reglas guardadas: parser manual de expresiones para reconstruir componentes, deserialización de JSON, y recreación de variables con sus expression builders.

#### Código Clave - Parser Manual (CRÍTICO)

**Ver Scripts/EditorFunciones.js líneas 1573-1687 del proyecto actual**

```javascript
/**
 * Parsear expresión a componentes (PARSER MANUAL - NO REGEX)
 * CRÍTICO: Usar parser manual para manejar funciones anidadas
 */
function parseExpressionToComponents(expression) {
    const components = [];
    let i = 0;

    while (i < expression.length) {
        const char = expression[i];

        // Saltar espacios
        if (char === ' ') {
            i++;
            continue;
        }

        // Función #...#
        if (char === '#') {
            let depth = 0;
            let inFunction = false;
            let endIdx = i + 1;

            // Contar paréntesis para encontrar cierre correcto
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

            const functionText = expression.substring(i, endIdx + 1);
            // Procesar función...
            i = endIdx + 1;
            continue;
        }

        // Campo [...]
        if (char === '[') {
            const closeIdx = expression.indexOf(']', i);
            const field = expression.substring(i, closeIdx + 1);
            // Agregar componente field...
            i = closeIdx + 1;
            continue;
        }

        // Operadores, valores, etc...
        i++;
    }

    return components;
}
```

#### Criterios de Aceptación
- ✅ Parser manual funciona con funciones anidadas
- ✅ Depth counter maneja paréntesis correctamente
- ✅ Campos, operadores, valores se parsean correctamente
- ✅ NO crea artifacts tipo `#(`
- ✅ Funciona con 4+ niveles de anidación

**Referencia**: Ver implementación completa en proyecto actual

---

### HU-019: Cargar Reglas - Parte 2 (Edición) (CRÍTICA)

**Estimación**: 5 SP | **Prioridad**: Crítica | **Dependencias**: HU-018

#### Descripción Técnica
Completar carga de reglas: cargar parámetros en panel de configuración al editar funciones, restaurar blocks para "Calcular edad", y recrear navigation stack para funciones anidadas.

#### Código Clave (Ver Scripts/EditorFunciones.js líneas 1480-1600 del proyecto actual)

**Funciones Principales**:
1. `loadParamsIntoConfigPanel(metadata, varId)` - Cargar params al editar
2. `recreateNestedLevel(functionName, params, parentBuilderId, varId)` - Recursivo
3. `editExprComponent(compId, varId)` - Modo edición

**CRÍTICO - recreateNestedLevel**:
```javascript
// CRÍTICO: Calcular levelIndex ANTES de agregar al stack
const levelIndex = navigationStack.levels.length;
const paramBuilderId = `miniBuilder_level${levelIndex}_param${paramIndex + 1}`;
```

#### Código Completo - loadParamsIntoConfigPanel
```javascript
function loadParamsIntoConfigPanel(metadata, varId) {
    if (!metadata || !metadata.functionName) return;

    console.log('📥 Cargando parámetros:', metadata.functionName);

    // Calcular edad - Restaurar blocks
    if (metadata.functionName === 'Calcular edad' && metadata.blocks) {
        droppedBlocks = JSON.parse(JSON.stringify(metadata.blocks));
        renderBlocks();
        updateBlockPreview();
        return;
    }

    // Funciones con mini-builders - Parsear params
    if (metadata.params && metadata.params.length > 0) {
        metadata.params.forEach((param, index) => {
            const paramNum = index + 1;
            const builderId = `miniBuilder_level0_param${paramNum}`;

            // Parsear parámetro
            const paramComponents = parseExpressionToComponents(param);

            // Si contiene función, recrear nivel anidado
            const functionComp = paramComponents.find(c => c.type === 'function');
            if (functionComp) {
                recreateNestedLevel(
                    functionComp.metadata.functionName,
                    functionComp.metadata.params,
                    builderId,
                    varId
                );
            } else {
                // Componentes simples
                miniBuilderComponents[builderId] = paramComponents;
                renderMiniBuilder(builderId);
            }
        });
    }
}
```

#### Criterios de Aceptación
- ✅ Editar función abre panel con parámetros cargados
- ✅ "Calcular edad" restaura blocks desde metadata
- ✅ Funciones anidadas recrean navigation stack completo
- ✅ Parser recursivo funciona correctamente
- ✅ Modo edición actualiza componente (no crea nuevo)
- ✅ Window.editingComponent se limpia después

**Referencia**: Ver implementación completa en proyecto actual

---

## Resumen Final

**HUs Completadas con Código Completo**:
- HU-001 a HU-006: Fundamentos y Expression Builder (en HISTORIAS_USUARIO.md)
- HU-008: Panel de Configuración (en este archivo)
- HU-009: Mini-Builders (en este archivo)
- HU-013: Navigation Stack Parte 1 (referencia al código del proyecto)
- HU-014: Navigation Stack Parte 2 (referencia al código del proyecto)
- HU-017: Guardar Reglas (en este archivo)
- HU-018: Cargar/Parser (referencia al código del proyecto)
- HU-019: Edición (referencia al código del proyecto)

**HUs Resumidas**:
- HU-007: Botón Insertar Valor
- HU-010: Funciones Matemáticas
- HU-011: "Si entonces"
- HU-012: "Calcular edad"
- HU-015: Breadcrumbs Individuales
- HU-016: Logic Expression Builder
- HU-020: Testing Final

**Total**: 20 HUs documentadas

**Archivos de Referencia**:
- Para HU-013, HU-014, HU-018, HU-019: Ver `Scripts/EditorFunciones.js` del proyecto actual
- El código ya está implementado y funciona correctamente
- Las líneas específicas están referenciadas en cada HU

---

## Instrucciones para Usar Este Documento

1. **HUs con código completo**: Copiar código directamente a tu proyecto
2. **HUs con referencia**: Consultar el archivo `EditorFunciones.js` del proyecto actual (ya implementado)
3. **Orden de implementación**: Seguir secuencia HU-001 → HU-020
4. **Testing**: Testear cada HU antes de pasar a la siguiente
5. **Debugging**: Usar console.logs con emojis para facilitar debugging

**Documentos Relacionados**:
- `CLAUDE.md` - Documentación técnica del proyecto
- `IMPLEMENTACION.md` - Plan de 20 días laborales
- `EditorFunciones.js` - Código fuente actual (~4200 líneas)

---

**Fin del Documento de Historias de Usuario Técnicas**