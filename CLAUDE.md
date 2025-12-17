# Engine Validador - Documentación Técnica

## Descripción General

Engine Validador es una aplicación ASP.NET WebForms para la construcción visual de reglas de validación mediante expresiones lógicas. Permite crear variables con expresiones complejas usando funciones y campos, y combinarlas en una expresión lógica final.

## Arquitectura

### Stack Tecnológico
- **Backend**: ASP.NET WebForms (.NET Framework)
- **Frontend**: JavaScript Vanilla (ES5/ES6)
- **Estilos**: CSS3 con variables CSS
- **Drag & Drop**: HTML5 Drag and Drop API

### Archivos Principales

```
engineValidador/
├── EditorFunciones.aspx              # Página principal con markup
├── Scripts/
│   ├── EditorFunciones.js           # Lógica principal del editor (~4200 líneas)
│   └── ValidadorFrontendWebForms.js # Motor de validaciones
├── Content/
│   └── EditorReglas.css             # Estilos del editor
└── bin/
    └── enginevalidator.dll          # Assembly compilado
```

## Sistemas Principales

### 1. Sistema de Variables y Expresiones

Cada variable tiene:
- **Número identificador**: `variablesCounter`
- **Nombre**: Configurable por el usuario
- **Expresión**: Construida con componentes drag-and-drop
- **Panel de configuración inline**: Se expande para editar funciones

#### Estructura de Variable

```javascript
// Variable card HTML
<div class="variable-card" id="varCard{id}">
  <div class="variable-card-header" draggable="true">
    <div class="variable-number">{id}</div>
    <div class="variable-name-preview">{nombre}</div>
  </div>
  <div class="variable-card-body">
    <div id="exprBuilder{id}">
      <!-- Expression builder aquí -->
    </div>
  </div>
  <div id="configPanel{id}">
    <!-- Panel de configuración inline -->
  </div>
</div>
```

### 2. Expression Builder (Constructor de Expresiones)

Sistema de drag-and-drop para construir expresiones combinando:
- **Campos**: `[Nombre_Campo]`
- **Operadores**: `>`, `<`, `=`, `AND`, `OR`, etc.
- **Valores**: Números, textos
- **Funciones**: `#NombreFuncion(parametros)#`
- **Paréntesis**: `(`, `)`

#### Componentes del Expression Builder

```javascript
expressionComponents[varId] = [
  {
    id: 'comp_' + timestamp,
    type: 'field|operator|value|function|parenthesis',
    value: 'valor_interno',
    html: '<i>...</i><span>vista</span>',
    metadata: { /* solo para funciones */ }
  }
]
```

#### Estados Globales Drag & Drop

```javascript
// Variables globales de estado
let draggedField = null;          // Campo siendo arrastrado
let draggedOperator = null;       // Operador siendo arrastrado
let draggedFunctionName = null;   // Nombre de función siendo arrastrada
let draggedVariableId = null;     // ID de variable siendo arrastrada
```

### 3. Sistema de Funciones

Las funciones se configuran en un **panel inline** que se expande dentro de la variable.

#### Tipos de Funciones

**A) Funciones con Mini-Builders** (mayoría)
- Ejemplos: `Minimo`, `Maximo`, `Suma`, `Si entonces`
- Usan mini-expression-builders para cada parámetro
- Permiten anidar funciones

**B) Funciones con Blocks** (especial)
- Solo: `Calcular edad`
- Usa sistema de bloques drag-and-drop
- Drop zone con renderizado de bloques numerados

#### Metadata de Funciones

```javascript
// Para funciones con mini-builders
metadata = {
  functionName: 'Minimo',
  params: ['[Campo1]', '[Campo2]'],
  fullExpression: '#Minimo([Campo1],[Campo2])#'
}

// Para Calcular edad (blocks)
metadata = {
  functionName: 'Calcular edad',
  blocks: [
    { type: 'field', value: 'Fecha_Nacimiento', order: 0, id: 'block_xxx' },
    { type: 'operator', value: '>', order: 1, id: 'block_yyy' }
  ],
  fullExpression: '#CalculaEdad([Fecha_Nacimiento],[],[],YYYY)#'
}
```

### 4. Navigation Stack (Funciones Anidadas)

Sistema para manejar niveles de funciones anidadas:

```javascript
navigationStack = {
  currentLevel: 0,
  levels: [
    {
      functionName: 'Si entonces',
      parentBuilderId: null,
      functionId: null,
      varId: 1,
      miniBuilderStates: {
        'miniBuilder_xxx': [ /* componentes */ ]
      }
    },
    {
      functionName: 'Minimo',  // Función anidada
      parentBuilderId: 'miniBuilder_xxx',
      functionId: 'func_yyy',
      varId: 1,
      miniBuilderStates: { /* ... */ }
    }
  ]
}
```

### 5. Logic Expression Builder (Expresión Lógica Final)

Sistema para combinar variables en la expresión lógica resultado:

```javascript
logicComponents = [
  {
    type: 'variable',
    id: 1,
    name: 'Variable 1',
    html: 'Variable 1'
  },
  {
    type: 'operator',
    value: 'AND',
    html: 'AND'
  },
  {
    type: 'variable',
    id: 2,
    name: 'Variable 2',
    html: 'Variable 2'
  }
]
```

Genera expresión: `{Variable 1} AND {Variable 2}`

## Convenciones Importantes

### 1. Formato de Expresiones

```javascript
// Campos
[Nombre_Campo]

// Funciones
#NombreFuncion(param1,param2)#

// Variables en expresión lógica
{Variable 1}

// Expresión completa
{Variable 1} > 18 AND {Variable 2} = "Aprobado"
```

### 2. IDs y Nombres

```javascript
// IDs de elementos
'varCard' + varId                    // Variable card
'exprBuilder' + varId                // Expression builder
'configPanel' + varId                // Panel de configuración
'miniBuilder_' + timestamp           // Mini-builder
'comp_' + timestamp                  // Componente
'block_' + timestamp + '_' + random  // Bloque
```

### 3. Clases CSS Importantes

```css
.variable-card                    /* Card de variable */
.variable-card.expanded           /* Variable expandida */
.expression-builder               /* Constructor principal */
.mini-expression-builder          /* Mini-constructor para parámetros */
.logic-expression-builder         /* Constructor de expresión lógica */
.expr-component                   /* Componente visual (pill) */
.logic-component.variable         /* Pill de variable (morado) */
.logic-component.operator         /* Pill de operador (rosa) */
.logic-component.parenthesis      /* Pill de paréntesis (gris) */
.config-panel                     /* Panel de configuración inline */
.config-panel.active              /* Panel visible */
.drop-zone                        /* Zona de drop para blocks */
.param-block                      /* Bloque visual */
```

### 4. Eventos Drag & Drop

```javascript
// Secuencia de eventos
dragstart → dragover → drop → dragend

// Handlers principales
dragField(event, fieldName)           // Arrastrar campo
dragOperator(event, operator)         // Arrastrar operador
dragFunction(event, functionName)     // Arrastrar función
dragVariable(event, varId)            // Arrastrar variable

dropIntoBuilder(event, varId)         // Drop en expression builder
dropIntoMiniBuilder(event, builderId) // Drop en mini-builder
dropIntoLogicExpression(event)        // Drop en logic expression
dropBlock(event)                      // Drop en zona de blocks
```

## Patrones de Implementación

### 1. Crear Nueva Variable

```javascript
function addVariable() {
  variablesCounter++;
  const card = createVariableCard(variablesCounter);
  container.appendChild(card);
  initExpressionComponents(variablesCounter);
}
```

### 2. Drag & Drop de Campo

```javascript
// 1. Inicio del drag
function dragField(event, fieldName) {
  draggedField = fieldName;
  event.dataTransfer.effectAllowed = 'copy';
}

// 2. Permitir drop
function allowDrop(event) {
  event.preventDefault();
}

// 3. Drop
function dropIntoBuilder(event, varId) {
  event.preventDefault();
  if (draggedField) {
    addExprComponent(varId, 'field', `[${draggedField}]`, html);
    draggedField = null;
  }
}
```

### 3. Abrir Panel de Configuración

```javascript
function openConfigPanel(functionName, input) {
  // 1. Guardar contexto
  activeInput = input;
  currentConfigVarId = input.varId;
  currentFunction = functionName;

  // 2. Crear nivel en stack
  const level = createConfigLevel(functionName, null, null, varId);
  navigationStack.levels.push(level);
  navigationStack.currentLevel = 0;

  // 3. Mostrar panel
  const panel = document.getElementById('configPanel' + varId);
  panel.classList.add('active');

  // 4. Renderizar contenido
  renderCurrentConfigLevel();
}
```

### 4. Aceptar Configuración de Función

```javascript
function acceptFunctionConfig(varId) {
  // 1. Recopilar parámetros
  const params = collectParams();

  // 2. Construir expresión
  const functionText = `#${currentFunction}(${params.join(',')})#`;

  // 3. Crear metadata
  const metadata = {
    functionName: currentFunction,
    params: params,
    fullExpression: functionText
  };

  // Para Calcular edad, agregar blocks
  if (currentFunction === 'Calcular edad') {
    metadata.blocks = JSON.parse(JSON.stringify(droppedBlocks));
  }

  // 4. Agregar componente
  addExprComponent(varId, 'function', functionText, html, metadata);

  // 5. Limpiar y cerrar
  closeConfigPanel(varId);
}
```

### 5. Editar Función Existente

```javascript
function editExprComponent(compId, varId) {
  // 1. Encontrar componente
  const comp = expressionComponents[varId].find(c => c.id === compId);

  // 2. Marcar modo edición
  window.editingComponent = { compId, varId, originalComponent: comp };
  activeInput.editMode = true;

  // 3. Abrir panel
  openConfigPanel(comp.metadata.functionName, tempInput);

  // 4. Cargar parámetros guardados
  setTimeout(() => {
    loadParamsIntoConfigPanel(comp.metadata, varId);
  }, 300);
}
```

## Casos Especiales

### Calcular Edad

Esta función es **especial** porque usa blocks en lugar de mini-builders:

#### Vista Previa vs Valor Guardado

```javascript
// Vista previa (muestra solo lo arrastrado)
buildCalculaEdadPreview()
// Retorna: "#Calcular edad([Fecha_Nacimiento])#"

// Valor guardado (SIEMPRE 4 parámetros)
buildCalculaEdadExpression()
// Retorna: "#CalculaEdad([Fecha_Nacimiento],[],[],YYYY)#"
```

#### Estructura de Blocks

```javascript
droppedBlocks = [
  { id: 'block_1', type: 'field', value: 'Fecha_Nacimiento', order: 0 },
  { id: 'block_2', type: 'operator', value: '>', order: 1 },
  { id: 'block_3', type: 'value', value: '18', order: 2 },
  { id: 'block_4', type: 'format', value: 'YYYY', order: 3 }
]
```

#### Renderizado de Blocks

```javascript
function renderBlocks() {
  // Ordena por orden
  droppedBlocks.sort((a, b) => a.order - b.order);

  // Renderiza cada bloque como card numerado
  droppedBlocks.forEach((block, index) => {
    html += `
      <div class="param-block" data-block-id="${block.id}">
        <div class="param-block-number">${index + 1}</div>
        <div class="param-block-content">
          <div class="param-block-label">${labels[block.type]}</div>
          <div class="param-block-value">${block.value}</div>
        </div>
        <div class="param-block-actions">
          <button onclick="deleteBlock('${block.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
}
```

#### Restauración al Editar

```javascript
function loadParamsIntoConfigPanel(metadata, varId) {
  // Detectar Calcular edad
  if (metadata.functionName === 'Calcular edad' && metadata.blocks) {
    // Restaurar blocks desde metadata
    droppedBlocks = JSON.parse(JSON.stringify(metadata.blocks));

    // Renderizar en drop zone
    renderBlocks();
    updateBlockPreview();
  }
}
```

## Funciones Clave

### Expression Builder

```javascript
initExpressionComponents(varId)        // Inicializar array de componentes
addExprComponent(varId, type, value, html, metadata)  // Agregar componente
deleteExprComponent(compId, varId)     // Eliminar componente
editExprComponent(compId, varId)       // Editar función
renderExpression(varId)                // Renderizar componentes como pills
updateExpressionPreview(varId)         // Actualizar vista previa textual
buildComponentsExpression(components)  // Construir string de expresión
```

### Config Panel

```javascript
openConfigPanel(functionName, input)          // Abrir panel inline
closeConfigPanel(varId)                       // Cerrar panel
acceptFunctionConfig(varId)                   // Aceptar configuración
acceptAllNestedLevels(varId)                  // Aceptar con niveles anidados
renderCurrentConfigLevel()                    // Renderizar nivel actual
navigateToLevel(levelIndex)                   // Navegar a nivel específico
saveCurrentLevelState()                       // Guardar estado actual
loadParamsIntoConfigPanel(metadata, varId)    // Cargar params al editar
```

### Mini-Builders

```javascript
createMiniBuilder(builderId, varId)           // Crear mini-builder
dropIntoMiniBuilder(event, builderId)         // Drop en mini-builder
addMiniComponent(builderId, type, value, html) // Agregar componente
deleteMiniComponent(compId, builderId)        // Eliminar componente
renderMiniBuilder(builderId)                  // Renderizar componentes
```

### Blocks (Calcular Edad)

```javascript
dropBlock(event)                      // Drop en zona de blocks
renderBlocks()                        // Renderizar blocks
deleteBlock(blockId)                  // Eliminar bloque
editBlockValue(blockId)               // Editar valor de bloque
buildCalculaEdadExpression()          // Construir expresión completa
buildCalculaEdadPreview()             // Construir vista previa
updateBlockPreview()                  // Actualizar preview modal
```

### Logic Expression

```javascript
dropIntoLogicExpression(event)        // Drop en logic expression
renderLogicExpression()               // Renderizar pills
updateLogicExpressionString()         // Construir string final
deleteLogicComponent(index)           // Eliminar componente
```

## Flujo de Trabajo Típico

### Crear Variable con Función

1. Usuario hace clic en "Agregar Variable"
2. Se crea nueva variable card con `variablesCounter++`
3. Usuario arrastra función desde sidebar
4. Se abre panel inline de configuración
5. Usuario construye expresión en mini-builders
6. Usuario hace clic en "Aceptar"
7. Se crea componente function en expression builder
8. Se muestra como pill visual con preview

### Editar Función Existente

1. Usuario hace clic en botón "editar" (lápiz) del pill
2. Se marca `window.editingComponent` y `activeInput.editMode = true`
3. Se abre panel de configuración
4. Se ejecuta `loadParamsIntoConfigPanel()` para restaurar:
   - Mini-builders: parsea expresión y recrea componentes
   - Calcular edad: restaura droppedBlocks desde metadata
5. Usuario modifica la configuración
6. Usuario hace clic en "Aceptar"
7. Se actualiza el componente existente (NO crea nuevo)
8. Se limpia modo edición

### Crear Expresión Lógica Final

1. Usuario arrastra variable desde su header
2. Se detecta `draggedVariableId` en drop
3. Se crea componente tipo 'variable' con pill morado
4. Usuario arrastra operador desde sidebar
5. Se crea componente tipo 'operator' con pill rosa
6. Se actualiza vista previa con expresión: `{Variable 1} AND {Variable 2}`

## Variables Globales Importantes

```javascript
// Contadores
let variablesCounter = 0;              // ID de siguiente variable

// Estado drag & drop
let draggedField = null;
let draggedOperator = null;
let draggedFunctionName = null;
let draggedVariableId = null;
let draggedElement = null;

// Estado de función actual
let currentFunction = null;            // Nombre de función en config
let currentConfigVarId = null;         // Variable siendo configurada
let activeInput = null;                // Input activo para contexto

// Componentes
let expressionComponents = {};         // {varId: [componentes]}
let miniBuilderComponents = {};        // {builderId: [componentes]}
let logicComponents = [];              // Componentes de expresión lógica

// Blocks (Calcular edad)
let droppedBlocks = [];               // Bloques arrastrados

// Navegación
let navigationStack = {
  currentLevel: -1,
  levels: []
};
```

## Testing y Debugging

### Console Logs Importantes

El sistema usa emojis para identificar logs:

```javascript
🚀  // Inicio de operación
📦  // Guardado de datos
📥  // Carga de datos
🎨  // Renderizado
✅  // Operación exitosa
❌  // Error
🔍  // Debug/inspección
🎯  // Punto clave
🎂  // Calcular edad (función especial)
✏️  // Edición
```

### Verificar Estado

```javascript
// En consola del navegador:
console.log('Variables:', variablesCounter);
console.log('Expression components:', expressionComponents);
console.log('Mini builders:', miniBuilderComponents);
console.log('Logic components:', logicComponents);
console.log('Navigation stack:', navigationStack);
console.log('Dropped blocks:', droppedBlocks);
```

## Problemas Conocidos y Soluciones

### 1. CSS no carga
**Problema**: Los estilos no se aplican
**Solución**: Verificar que `EditorReglas.css` esté referenciado en el `<head>`

### 2. Drops no funcionan
**Problema**: El placeholder `.empty` bloquea eventos
**Solución**: Usar `pointer-events: none` en placeholder

### 3. Operadores del sidebar no se detectan
**Problema**: Se usa variable diferente para operadores
**Solución**: Detectar tanto `draggedLogicOperator` como `draggedOperator`

### 4. Parámetros no se recuperan al editar
**Problema**: Metadata no guarda la información necesaria
**Solución**: Para Calcular edad, guardar `metadata.blocks`

## Mejoras Futuras

- [ ] Validación de expresiones en tiempo real
- [ ] Autocompletado de campos
- [ ] Undo/Redo
- [ ] Exportar/Importar configuraciones
- [ ] Snippets de expresiones comunes
- [ ] Modo oscuro
- [ ] Accesibilidad (ARIA labels, keyboard navigation)

## Contacto y Mantenimiento

Este proyecto usa Claude Code (Sonnet 4.5) para asistencia en desarrollo.

Para modificaciones futuras:
1. Lee este documento completo primero
2. Revisa la sección de "Convenciones Importantes"
3. Prueba en variables de prueba antes de modificar producción
4. Agrega console.logs para debugging
5. Actualiza este documento con cambios significativos
