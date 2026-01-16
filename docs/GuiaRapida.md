# Guia Rapida - Editor de Funciones

## Inicio Rapido

### Estructura Minima de un Modulo

```javascript
const MiModulo = (() => {
    'use strict';

    // 1. Asegurar namespace
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };

    // 2. Funciones
    const miFuncion = () => { /* ... */ };

    // 3. API publica
    const publicAPI = { miFuncion };

    // 4. Exponer globalmente
    window.miFuncion = miFuncion;

    // 5. Registrar en namespace
    EF.Core.MiModulo = publicAPI;

    return publicAPI;
})();
```

---

## Cheat Sheet: Drag & Drop

| Accion | Estado Global | Handler |
|--------|---------------|---------|
| Arrastrar campo | `EF.State.draggedField` | `dragFieldStart()` |
| Arrastrar operador | `EF.State.draggedOperator` | `dragOperatorStart()` |
| Arrastrar funcion | `EF.State.draggedFunctionName` | `dragFunctionStart()` |
| Arrastrar valor | `EF.State.draggedValue` | `dragValueStart()` |
| Arrastrar parentesis | `EF.State.draggedParenthesis` | `dragParenthesisStart()` |
| Arrastrar variable | `EF.State.draggedVariable` | (inline handler) |
| Arrastrar logico | `EF.State.draggedLogicOperator` | `dragLogicOperatorStart()` |

---

## Cheat Sheet: Agregar Componente

```javascript
// Agregar campo
addExprComponent(varId, 'field', 'NombreCampo',
    '<i class="fas fa-database"></i><span>NombreCampo</span>');

// Agregar operador
addExprComponent(varId, 'operator', '+',
    '<span class="expr-value">+</span>');

// Agregar funcion
addExprComponent(varId, 'function', '#Minimo(...)#',
    '<i class="fas fa-cog"></i><span>#Minimo(...)#</span>',
    { functionName: 'Minimo', params: [...] });

// Agregar variable existente
addExprComponent(varId, 'variable', '[Variable 1]',
    '<i class="fas fa-cube"></i><span>Variable 1</span>');
```

---

## Cheat Sheet: Nueva Funcion

```javascript
// Scripts/functions/NuevaFuncion.js

const FunctionNueva = (() => {
    class NuevaClass extends FunctionBase {
        static functionName = 'Nueva Funcion';
        static functionId = 'NuevaFuncion';
        static icon = 'fa-star';
        static category = 'general'; // agregacion|condicional|texto|fecha

        getParameters() {
            return [
                { id: 'param1', label: 'Param 1', type: 'miniBuilder', required: true }
            ];
        }

        generateForm() {
            return this.getMiniBuilder('param1', 'Parametro', 'Placeholder');
        }

        buildExpression(params) {
            return `#NuevaFuncion(${params.join(',')})#`;
        }
    }

    FunctionRegistry.register(NuevaClass);
    return NuevaClass;
})();
```

---

## Cheat Sheet: Selectores CSS

```css
/* Variable Card */
.variable-card                    /* Tarjeta completa */
.variable-card.expanded           /* Tarjeta expandida */
.variable-card-header             /* Header de la tarjeta */

/* Expression Builder */
.expression-builder               /* Contenedor del builder */
.expr-component                   /* Componente individual */
.expr-component[data-type="field"]
.expr-component[data-type="operator"]
.expr-component[data-type="function"]

/* Origen de Datos */
.origen-selector                  /* Selector Buro/Segmento */
.origen-selector-btn.active       /* Boton activo */
.buro-card.selected              /* Buro seleccionado */
.segmento-card.selected          /* Segmento seleccionado */

/* Paletas */
.resources-sidebar               /* Paleta operadores */
.functions-sidebar               /* Paleta funciones */
.op-pill                         /* Boton operador */
.function-item                   /* Item funcion */

/* Estados */
.dragging                        /* Elemento siendo arrastrado */
.drag-over                       /* Zona lista para drop */
```

---

## Cheat Sheet: IDs Importantes

| ID | Elemento |
|----|----------|
| `variablesContainer` | Contenedor de todas las variable cards |
| `variablesCount` | Contador de variables |
| `varCard{n}` | Variable card n |
| `varName{n}` | Nombre editable de variable n |
| `exprBuilder{n}` | Expression builder de variable n |
| `logicExprBuilder` | Expression builder de logica final |
| `logicExpressionPreview` | Vista previa expresion logica |
| `factoresList` | Lista de factores guardados |
| `factoresCount` | Contador de factores |

---

## Cheat Sheet: Orden de Carga de Scripts

```html
<!-- 1. Namespace (PRIMERO) -->
<script src="Scripts/core/Namespace.js"></script>

<!-- 2. Infraestructura base -->
<script src="Scripts/FunctionBase.js"></script>
<script src="Scripts/FunctionRegistry.js"></script>

<!-- 3. Core modular -->
<script src="Scripts/core/DragDropManager.js"></script>
<script src="Scripts/core/NavigationStack.js"></script>
<script src="Scripts/core/MiniBuilderManager.js"></script>
<script src="Scripts/core/ExpressionBuilder.js"></script>
<script src="Scripts/core/ConfigPanel.js"></script>
<script src="Scripts/core/FunctionCatalog.js"></script>
<script src="Scripts/core/AutocompleteManager.js"></script>
<script src="Scripts/core/LogicExpressionBuilder.js"></script>
<script src="Scripts/core/InputHandlers.js"></script>
<script src="Scripts/core/VariableCardManager.js"></script>

<!-- 4. Funciones (se auto-registran) -->
<script src="Scripts/functions/Minimo.js"></script>
<script src="Scripts/functions/Maximo.js"></script>
<!-- ... mas funciones ... -->

<!-- 5. Core editor (ULTIMO) -->
<script src="Scripts/EditorFunciones.js"></script>
```

---

## Comandos de Consola para Debug

```javascript
// Ver estado global
console.log(EF.State);

// Ver funciones registradas
console.log(FunctionRegistry.getAll());

// Ver factores guardados
console.log(FactoresManager.obtenerFactores());

// Serializar variables manualmente
FactoresManager.serializarVariables();

// Limpiar formulario
FactoresManager.limpiarFormulario();

// Ver navigation stack
console.log(navigationStack);

// Ver componentes de un builder
document.querySelectorAll('#exprBuilder1 .expr-component')
    .forEach(c => console.log(c.getAttribute('data-value')));
```

---

## Errores Comunes

| Error | Causa | Solucion |
|-------|-------|----------|
| `EF is undefined` | Namespace.js no cargado | Verificar orden de scripts |
| `FunctionRegistry is undefined` | FunctionRegistry.js no cargado | Cargar antes de funciones |
| `Cannot read property of null` | Elemento no existe en DOM | Verificar IDs, usar `?.` |
| Funcion no aparece en paleta | No registrada | Agregar `FunctionRegistry.register()` |
| Drop no funciona | Estado no limpiado | Verificar `dragEnd` handlers |

---

## Flujo Tipico de Desarrollo

1. **Crear nueva funcion**
   - Crear archivo en `Scripts/functions/`
   - Extender `FunctionBase`
   - Implementar `getParameters()`, `generateForm()`, `buildExpression()`
   - Agregar `FunctionRegistry.register()`

2. **Agregar nuevo campo**
   - Modificar `datosDemo` en `VariableCardManager.js`
   - Agregar al buro/segmento correspondiente

3. **Modificar drag & drop**
   - Editar `DragDropManager.js`
   - Agregar nuevo estado en `EF.State` si es necesario
   - Crear handlers `dragXxxStart()` y `dragXxxEnd()`

4. **Agregar nueva accion**
   - Agregar `<asp:DropDownList>` en `.aspx`
   - Actualizar `FactoresManager` (guardar, limpiar, editar)
   - Actualizar CSS si es necesario

---

*Version: 1.0*
