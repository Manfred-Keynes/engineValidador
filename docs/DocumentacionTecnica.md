# Documentacion Tecnica - Editor de Funciones (Builder)

## Tabla de Contenidos
1. [Arquitectura General](#arquitectura-general)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Diagrama de Componentes](#diagrama-de-componentes)
4. [Flujo de Datos](#flujo-de-datos)
5. [Diagramas de Secuencia](#diagramas-de-secuencia)
6. [Modulos JavaScript](#modulos-javascript)
7. [Guia de Integracion](#guia-de-integracion)

---

## Arquitectura General

```
+------------------------------------------------------------------+
|                         CAPA DE PRESENTACION                      |
|  +------------------------------------------------------------+  |
|  |                    EditorFunciones.aspx                     |  |
|  |  +----------------+  +----------------+  +---------------+  |  |
|  |  | Panel Config   |  | Paleta Operadores | Paleta Funciones|  |
|  |  | (Formulario)   |  | (Drag Source)  |  | (Drag Source) |  |  |
|  |  +----------------+  +----------------+  +---------------+  |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                      CAPA DE LOGICA (JavaScript)                  |
|  +-------------+  +---------------+  +------------------+        |
|  | DragDrop    |  | VariableCard  |  | ExpressionBuilder|        |
|  | Manager     |  | Manager       |  |                  |        |
|  +-------------+  +---------------+  +------------------+        |
|  +-------------+  +---------------+  +------------------+        |
|  | ConfigPanel |  | MiniBuilder   |  | FunctionRegistry |        |
|  |             |  | Manager       |  |                  |        |
|  +-------------+  +---------------+  +------------------+        |
|  +-------------+  +---------------+                              |
|  | Navigation  |  | Factores      |                              |
|  | Stack       |  | Manager       |                              |
|  +-------------+  +---------------+                              |
+------------------------------------------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                      CAPA DE DATOS (Server-Side)                  |
|  +------------------------------------------------------------+  |
|  |                 EditorFunciones.aspx.cs                     |  |
|  |  - btnGuardar_Click()                                       |  |
|  |  - btnValidar_Click()                                       |  |
|  |  - Serializacion JSON de Variables                          |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## Estructura de Archivos

```
engineValidador/
├── EditorFunciones.aspx          # Pagina principal (UI + CSS inline)
├── EditorFunciones.aspx.cs       # Code-behind (C#)
├── Site.Master                   # Master page
│
├── Scripts/
│   ├── core/                     # Modulos core (IIFE Pattern)
│   │   ├── Namespace.js          # Namespace EF global
│   │   ├── DragDropManager.js    # Sistema drag & drop
│   │   ├── VariableCardManager.js # Gestion de tarjetas de variables
│   │   ├── ExpressionBuilder.js  # Constructor de expresiones
│   │   ├── MiniBuilderManager.js # Mini-builders en modales
│   │   ├── ConfigPanel.js        # Panel de configuracion
│   │   ├── NavigationStack.js    # Navegacion de funciones anidadas
│   │   ├── LogicExpressionBuilder.js # Expresion logica final
│   │   ├── AutocompleteManager.js # Autocompletado
│   │   ├── InputHandlers.js      # Manejadores de inputs
│   │   └── FunctionCatalog.js    # Catalogo de funciones
│   │
│   ├── functions/                # Funciones modulares (auto-registro)
│   │   ├── Minimo.js
│   │   ├── Maximo.js
│   │   ├── Suma.js
│   │   ├── Promedio.js
│   │   ├── Conteo.js
│   │   ├── ConteoCaracteres.js
│   │   ├── SiEntonces.js
│   │   ├── CalcularEdad.js
│   │   ├── ExpresionRegular.js
│   │   └── DifFechaHoy.js
│   │
│   ├── FunctionBase.js           # Clase base para funciones
│   ├── FunctionRegistry.js       # Registro central de funciones
│   └── EditorFunciones.js        # Core principal del editor
│
├── Content/
│   └── EditorReglas.css          # Estilos adicionales
│
└── docs/
    └── DocumentacionTecnica.md   # Este archivo
```

---

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              INTERFAZ DE USUARIO                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   PANEL PRINCIPAL    │    │   PALETA     │    │     PALETA       │  │
│  │                      │    │  OPERADORES  │    │    FUNCIONES     │  │
│  │  ┌────────────────┐  │    │              │    │                  │  │
│  │  │ Nombre Factor  │  │    │  + - * /     │    │  Minimo          │  │
│  │  ├────────────────┤  │    │  > < = !=    │    │  Maximo          │  │
│  │  │ Descripcion    │  │    │  AND OR      │    │  Suma            │  │
│  │  ├────────────────┤  │    │  ( ) # where │    │  Promedio        │  │
│  │  │ Acciones       │  │    │              │    │  Si entonces     │  │
│  │  │ [Aprobado]     │  │    └──────────────┘    │  Calcular edad   │  │
│  │  │ [Denegado]     │  │           │            │  ...             │  │
│  │  │ [Next]         │  │           │            └──────────────────┘  │
│  │  ├────────────────┤  │           │                    │             │
│  │  │ Variables      │  │           │   DRAG & DROP      │             │
│  │  │ ┌────────────┐ │  │           ▼                    ▼             │
│  │  │ │ Variable 1 │◄├──┼───────────────────────────────────           │
│  │  │ │ [ExprBuild]│ │  │                                              │
│  │  │ └────────────┘ │  │                                              │
│  │  ├────────────────┤  │                                              │
│  │  │ Expresion      │  │                                              │
│  │  │ Logica Final   │  │                                              │
│  │  └────────────────┘  │                                              │
│  └──────────────────────┘                                              │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    FLUJO DE LA EVALUACION                         │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                           │  │
│  │  │Factor 1 │  │Factor 2 │  │Factor 3 │  ...                      │  │
│  │  └─────────┘  └─────────┘  └─────────┘                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

### Flujo General de Creacion de Factor

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Usuario    │     │  Agregar    │     │  Configurar │     │   Guardar   │
│  Inicia     │────►│  Variable   │────►│  Expresion  │────►│   Factor    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │VariableCard │     │ Expression  │     │  Factores   │
                    │  Manager    │     │  Builder    │     │  Manager    │
                    └─────────────┘     └─────────────┘     └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │   Origen    │     │   Drag &    │     │   JSON      │
                    │   Datos     │     │   Drop      │     │ Serializar  │
                    └─────────────┘     └─────────────┘     └─────────────┘
```

### Flujo de Drag & Drop

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DRAG & DROP                                 │
└──────────────────────────────────────────────────────────────────────────┘

     ORIGEN                    PROCESO                      DESTINO
  (Drag Source)               (Transfer)                 (Drop Target)
       │                          │                           │
       ▼                          ▼                           ▼
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│  Paleta     │  dragstart │  EF.State   │  drop      │ Expression  │
│  Operadores │───────────►│  .dragged   │───────────►│  Builder    │
│  + - * /    │            │  Operator   │            │             │
└─────────────┘            └─────────────┘            └─────────────┘
                                  │
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│  Paleta     │  dragstart │  EF.State   │  drop      │ Expression  │
│  Funciones  │───────────►│  .dragged   │───────────►│  Builder    │
│  Minimo...  │            │  Function   │            │ (abre modal)│
└─────────────┘            └─────────────┘            └─────────────┘
                                  │
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│  Origen     │  dragstart │  EF.State   │  drop      │ Expression  │
│  Datos      │───────────►│  .dragged   │───────────►│  Builder    │
│  [campos]   │            │  Field      │            │             │
└─────────────┘            └─────────────┘            └─────────────┘
                                  │
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│  Variables  │  dragstart │  EF.State   │  drop      │ Expression  │
│  Existentes │───────────►│  .dragged   │───────────►│  Builder    │
│  [Var1...]  │            │  Variable   │            │             │
└─────────────┘            └─────────────┘            └─────────────┘
```

---

## Diagramas de Secuencia

### 1. Secuencia: Agregar Variable

```
┌────────┐     ┌────────────────┐     ┌────────────────┐     ┌─────────────┐
│Usuario │     │ agregarVariable│     │VariableCard    │     │    DOM      │
│        │     │     ()         │     │   Manager      │     │             │
└───┬────┘     └───────┬────────┘     └───────┬────────┘     └──────┬──────┘
    │                  │                      │                     │
    │ click [+]        │                      │                     │
    │─────────────────►│                      │                     │
    │                  │                      │                     │
    │                  │ crearVariableCard()  │                     │
    │                  │─────────────────────►│                     │
    │                  │                      │                     │
    │                  │                      │ generarHTML()       │
    │                  │                      │────────────────────►│
    │                  │                      │                     │
    │                  │                      │ insertarEnDOM()     │
    │                  │                      │────────────────────►│
    │                  │                      │                     │
    │                  │                      │ inicializarOrigen() │
    │                  │                      │────────────────────►│
    │                  │                      │                     │
    │                  │ actualizarContador() │                     │
    │                  │─────────────────────►│                     │
    │                  │                      │                     │
    │◄─────────────────┼──────────────────────┼─────────────────────│
    │  Variable creada │                      │                     │
```

### 2. Secuencia: Drag & Drop de Campo

```
┌────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│Usuario │     │ DragDrop    │     │  EF.State   │     │ Expression   │
│        │     │ Manager     │     │             │     │ Builder      │
└───┬────┘     └──────┬──────┘     └──────┬──────┘     └──────┬───────┘
    │                 │                   │                   │
    │ dragstart       │                   │                   │
    │ [campo]         │                   │                   │
    │────────────────►│                   │                   │
    │                 │                   │                   │
    │                 │ dragFieldStart()  │                   │
    │                 │──────────────────►│                   │
    │                 │                   │                   │
    │                 │                   │ draggedField =    │
    │                 │                   │ "NombreCampo"     │
    │                 │                   │                   │
    │ drag [campo]    │                   │                   │
    │ sobre builder   │                   │                   │
    │────────────────────────────────────────────────────────►│
    │                 │                   │                   │
    │                 │                   │                   │ allowItemDrop()
    │                 │                   │                   │ addClass('drag-over')
    │                 │                   │                   │
    │ drop [campo]    │                   │                   │
    │────────────────────────────────────────────────────────►│
    │                 │                   │                   │
    │                 │                   │                   │ dropItem()
    │                 │                   │◄──────────────────│ get draggedField
    │                 │                   │                   │
    │                 │                   │                   │ addExprComponent()
    │                 │                   │                   │ (tipo: 'field')
    │                 │                   │                   │
    │                 │ dragFieldEnd()    │                   │
    │                 │──────────────────►│                   │
    │                 │                   │ draggedField=null │
    │                 │                   │                   │
    │◄────────────────┼───────────────────┼───────────────────│
    │ Campo agregado  │                   │                   │
```

### 3. Secuencia: Drag & Drop de Funcion (con Modal)

```
┌────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Usuario │    │ DragDrop │    │ EF.State │    │ ExprBuild│    │ConfigPane│
│        │    │ Manager  │    │          │    │          │    │          │
└───┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
    │              │               │               │               │
    │ dragstart    │               │               │               │
    │ [Minimo]     │               │               │               │
    │─────────────►│               │               │               │
    │              │               │               │               │
    │              │ dragFunction  │               │               │
    │              │ Start()       │               │               │
    │              │──────────────►│               │               │
    │              │               │ draggedFunc   │               │
    │              │               │ ="Minimo"     │               │
    │              │               │               │               │
    │ drop         │               │               │               │
    │─────────────────────────────────────────────►│               │
    │              │               │               │               │
    │              │               │               │ dropItem()    │
    │              │               │◄──────────────│ get dragFunc  │
    │              │               │               │               │
    │              │               │               │ openFunction  │
    │              │               │               │ Modal()       │
    │              │               │               │──────────────►│
    │              │               │               │               │
    │              │               │               │               │ generateForm()
    │              │               │               │               │ (FunctionRegistry)
    │              │               │               │               │
    │◄─────────────┼───────────────┼───────────────┼───────────────│
    │ Modal abierto│               │               │               │
    │              │               │               │               │
    │ Configura    │               │               │               │
    │ parametros   │               │               │               │
    │─────────────────────────────────────────────────────────────►│
    │              │               │               │               │
    │ click        │               │               │               │
    │ [Aceptar]    │               │               │               │
    │─────────────────────────────────────────────────────────────►│
    │              │               │               │               │
    │              │               │               │               │ acceptFunction()
    │              │               │               │               │ buildExpression()
    │              │               │               │◄──────────────│
    │              │               │               │ addExprComp() │
    │              │               │               │               │
    │◄─────────────┼───────────────┼───────────────┼───────────────│
    │ Funcion      │               │               │               │
    │ agregada     │               │               │               │
```

### 4. Secuencia: Guardar Factor

```
┌────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Usuario │    │ btnGuard │    │ Factores │    │  DOM     │    │ Server   │
│        │    │ Click    │    │ Manager  │    │          │    │ (C#)     │
└───┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
    │              │               │               │               │
    │ click        │               │               │               │
    │ [Guardar]    │               │               │               │
    │─────────────►│               │               │               │
    │              │               │               │               │
    │              │ serializarVar │               │               │
    │              │ iables()      │               │               │
    │              │──────────────►│               │               │
    │              │               │               │               │
    │              │               │ querySelectorAll               │
    │              │               │ ('.variable-card')             │
    │              │               │──────────────►│               │
    │              │               │               │               │
    │              │               │◄──────────────│               │
    │              │               │ [cards]       │               │
    │              │               │               │               │
    │              │               │ forEach card: │               │
    │              │               │ - get varId   │               │
    │              │               │ - get exprBuild               │
    │              │               │ - get origen  │               │
    │              │               │ - get buro    │               │
    │              │               │               │               │
    │              │               │ JSON.stringify│               │
    │              │               │ (variables)   │               │
    │              │               │               │               │
    │              │               │ hfVariablesData               │
    │              │               │ .value = json │               │
    │              │               │──────────────►│               │
    │              │               │               │               │
    │              │ guardarFactor │               │               │
    │              │ ()            │               │               │
    │              │──────────────►│               │               │
    │              │               │               │               │
    │              │               │ crear objeto  │               │
    │              │               │ factor        │               │
    │              │               │               │               │
    │              │               │ agregarFactor │               │
    │              │               │ ALista()      │               │
    │              │               │──────────────►│               │
    │              │               │               │ insertHTML    │
    │              │               │               │               │
    │              │               │ limpiarForm() │               │
    │              │               │──────────────►│               │
    │              │               │               │               │
    │◄─────────────┼───────────────┼───────────────┼───────────────│
    │ Factor       │               │               │               │
    │ guardado     │               │               │               │
```

---

## Modulos JavaScript

### Patron IIFE (Immediately Invoked Function Expression)

Todos los modulos siguen el patron Arrow IIFE:

```javascript
const ModuleName = (() => {
    'use strict';

    // Asegurar namespace
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // Estado privado
    let privateVar = null;

    // Funciones privadas
    const privateFunction = () => {
        // ...
    };

    // Funciones publicas
    const publicFunction = () => {
        // ...
    };

    // API publica
    const publicAPI = {
        publicFunction
    };

    // Exponer al scope global (compatibilidad HTML)
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.ModuleName = publicAPI;

    return publicAPI;
})();
```

### Namespace Global EF

```javascript
window.EF = {
    Core: {
        DragDrop: { /* DragDropManager API */ },
        VariableCard: { /* VariableCardManager API */ },
        Expression: { /* ExpressionBuilder API */ },
        MiniBuilder: { /* MiniBuilderManager API */ },
        Config: { /* ConfigPanel API */ },
        Navigation: { /* NavigationStack API */ }
    },
    Functions: {
        // Funciones registradas via FunctionRegistry
    },
    State: {
        draggedFunctionName: null,
        draggedOperator: null,
        draggedField: null,
        draggedValue: null,
        draggedParenthesis: null,
        draggedVariableId: null,
        draggedVariableName: '',
        draggedLogicOperator: null,
        draggedElement: null,
        targetVarId: null
    }
};
```

### FunctionRegistry (Registro de Funciones)

```javascript
// Registrar una funcion
FunctionRegistry.register(FunctionMinimo);

// Obtener funcion por nombre
const func = FunctionRegistry.get('Minimo');

// Generar formulario
const html = FunctionRegistry.generateForm('Minimo');

// Construir expresion
const expr = FunctionRegistry.buildExpression('Minimo', params);

// Listar todas las funciones
const allFuncs = FunctionRegistry.getAll();

// Listar por categoria
const agregacion = FunctionRegistry.getByCategory('agregacion');
```

---

## Guia de Integracion

### Agregar Nueva Funcion

1. **Crear archivo en `/Scripts/functions/`**

```javascript
// Scripts/functions/MiFuncion.js
const FunctionMiFuncion = (() => {
    'use strict';

    class MiFuncionClass extends FunctionBase {
        static functionName = 'Mi Funcion';
        static functionId = 'MiFuncion';
        static icon = 'fa-star';
        static description = 'Descripcion de mi funcion';
        static category = 'general';

        getParameters() {
            return [
                { id: 'param1', label: 'Parametro 1', type: 'miniBuilder', required: true }
            ];
        }

        generateForm() {
            return this.getMiniBuilder('param1', 'Parametro 1', 'Arrastra campos');
        }

        buildExpression(params) {
            return `#MiFuncion(${params.join(',')})#`;
        }
    }

    // Auto-registro
    if (window.FunctionRegistry) {
        FunctionRegistry.register(MiFuncionClass);
    }

    return MiFuncionClass;
})();
```

2. **Agregar referencia en EditorFunciones.aspx**

```html
<script src="Scripts/functions/MiFuncion.js"></script>
```

3. **Agregar a la paleta de funciones (si no se auto-genera)**

```html
<div class="function-item draggable-function-item"
     draggable="true"
     data-function="Mi Funcion"
     ondragstart="dragFunctionStart(event)"
     ondragend="dragFunctionEnd(event)">
    <i class="fas fa-star function-icon"></i>
    <span>Mi Funcion</span>
</div>
```

### Agregar Nuevo Campo al Origen de Datos

Modificar `VariableCardManager.js`:

```javascript
const datosDemo = {
    buro: {
        'transunion': {
            nombre: 'TransUnion',
            segmentos: {
                'PN10': {
                    nombre: 'PN10 - Score',
                    campos: [
                        // Agregar aqui nuevos campos
                        { nombre: 'NuevoCampo', descripcion: 'Descripcion del campo' }
                    ]
                }
            }
        }
    }
};
```

### Agregar Nuevo Operador

1. Agregar HTML en la paleta:

```html
<div class="op-pill arithmetic draggable-operator-item"
     draggable="true"
     data-operator="%"
     ondragstart="dragOperatorStart(event)"
     ondragend="dragOperatorEnd(event)"
     title="Modulo">%</div>
```

2. El DragDropManager ya maneja cualquier operador automaticamente.

---

## Estructura de Datos

### Factor (JavaScript)

```javascript
{
    id: 1,
    nombre: "KO-EDAD-CALCULADA",
    descripcion: "Valida edad minima del cliente",
    accionAprobado: "verde",
    accionDenegado: "rojo",
    accionNext: "ir_a",
    variables: [
        {
            Orden: 1,
            Variable: "Variable 1",
            Funcion: "",
            Origen: "buro",
            Expresion: "#CalculaEdad([Fecha_Nacimiento],>,18,YYYY)#",
            Buro: "transunion",
            Bloque: "PN10"
        }
    ],
    variablesCount: 1,
    expresionLogica: "[Variable 1] AND [Variable 2]",
    fechaCreacion: "2026-01-15T..."
}
```

### VariableInfo (C#)

```csharp
public class VariableInfo
{
    public int Orden { get; set; }
    public string Variable { get; set; }
    public string Funcion { get; set; }
    public string Origen { get; set; }
    public string Expresion { get; set; }
    public string ExpresionCondicional { get; set; }
    public string ExpresionWhere { get; set; }
    public string MensajeWhere { get; set; }
    public string TipoRespuesta { get; set; }
    public string Buro { get; set; }
    public string Bloque { get; set; }
    public string Accion { get; set; }
}
```

---

## Eventos del Sistema

| Evento | Origen | Handler | Descripcion |
|--------|--------|---------|-------------|
| `dragstart` | Paleta | `dragFieldStart`, `dragOperatorStart`, `dragFunctionStart` | Inicia arrastre |
| `dragend` | Paleta | `dragFieldEnd`, `dragOperatorEnd`, `dragFunctionEnd` | Termina arrastre |
| `dragover` | ExprBuilder | `allowItemDrop` | Permite soltar |
| `dragleave` | ExprBuilder | `dragItemLeave` | Sale de zona |
| `drop` | ExprBuilder | `dropItem` | Procesa elemento |
| `click` | btnGuardar | `FactoresManager.guardarFactor` | Guarda factor |

---

## Notas Importantes

1. **Orden de carga de scripts**: Es critico que los scripts se carguen en el orden correcto:
   - Namespace.js (primero)
   - FunctionBase.js, FunctionRegistry.js
   - Modulos core
   - Funciones modulares
   - EditorFunciones.js (ultimo)

2. **Estado global**: Todo el estado de drag & drop se maneja en `EF.State`

3. **Compatibilidad HTML**: Las funciones se exponen tanto en el namespace como en `window` para llamadas desde atributos HTML

4. **Auto-registro**: Las funciones se registran automaticamente al cargar su archivo JS

---

*Documento generado: Enero 2026*
*Version: 1.0*
