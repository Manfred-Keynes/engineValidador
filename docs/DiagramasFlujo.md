# Diagramas de Flujo - Editor de Funciones

## 1. Flujo Principal del Usuario

```
                                    ┌─────────────────┐
                                    │     INICIO      │
                                    │   Pagina carga  │
                                    └────────┬────────┘
                                             │
                                             ▼
                        ┌────────────────────────────────────────┐
                        │         FORMULARIO PRINCIPAL           │
                        │                                        │
                        │  ┌──────────────────────────────────┐ │
                        │  │ 1. Nombre del Factor             │ │
                        │  │ 2. Descripcion                   │ │
                        │  │ 3. Accion Aprobado [▼]           │ │
                        │  │ 4. Accion Denegado [▼]           │ │
                        │  │ 5. Accion Next [▼]               │ │
                        │  └──────────────────────────────────┘ │
                        └────────────────────┬───────────────────┘
                                             │
                                             ▼
                               ┌─────────────────────────┐
                               │  [+ Agregar Variable]   │
                               └────────────┬────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
          ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
          │   Variable 1    │    │   Variable 2    │    │   Variable N    │
          │                 │    │                 │    │                 │
          │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
          │ │Origen Datos │ │    │ │Origen Datos │ │    │ │Origen Datos │ │
          │ │[Buro|Segm]  │ │    │ │[Buro|Segm]  │ │    │ │[Buro|Segm]  │ │
          │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
          │                 │    │                 │    │                 │
          │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
          │ │ Expression  │ │    │ │ Expression  │ │    │ │ Expression  │ │
          │ │  Builder    │ │    │ │  Builder    │ │    │ │  Builder    │ │
          │ │ [zona drop] │ │    │ │ [zona drop] │ │    │ │ [zona drop] │ │
          │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
          └─────────────────┘    └─────────────────┘    └─────────────────┘
                    │                       │                       │
                    └───────────────────────┼───────────────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │        EXPRESION LOGICA FINAL          │
                        │                                        │
                        │   [Variable 1] AND [Variable 2] OR ... │
                        │                                        │
                        └────────────────────┬───────────────────┘
                                             │
                                             ▼
                               ┌─────────────────────────┐
                               │    [Guardar Factor]     │
                               └────────────┬────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │        FLUJO DE LA EVALUACION          │
                        │                                        │
                        │  ┌────────┐ ┌────────┐ ┌────────┐     │
                        │  │Factor 1│ │Factor 2│ │Factor 3│ ... │
                        │  └────────┘ └────────┘ └────────┘     │
                        └────────────────────────────────────────┘
```

---

## 2. Flujo de Creacion de Variable

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO: CREAR VARIABLE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌───────────┐
    │  Usuario  │
    │  click    │
    │ [+Variable]
    └─────┬─────┘
          │
          ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                      agregarVariable()                               │
    │                                                                      │
    │   variableCounter++                                                  │
    │   varId = variableCounter                                            │
    │                                                                      │
    └─────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                    Generar HTML de Variable Card                     │
    │                                                                      │
    │   ┌─────────────────────────────────────────────────────────────┐   │
    │   │                      VARIABLE CARD                           │   │
    │   │                                                              │   │
    │   │  ┌────────────────────────────────────────────────────────┐ │   │
    │   │  │ HEADER: "Variable {n}" [expandir/colapsar] [eliminar]  │ │   │
    │   │  └────────────────────────────────────────────────────────┘ │   │
    │   │                                                              │   │
    │   │  ┌────────────────────────────────────────────────────────┐ │   │
    │   │  │ ORIGEN DE DATOS                                        │ │   │
    │   │  │                                                        │ │   │
    │   │  │  [Buro de Credito]  [Segmento]  [Variables Existentes] │ │   │
    │   │  │       ●                 ○               ○              │ │   │
    │   │  │                                                        │ │   │
    │   │  │  ┌──────────────────────────────────────────────────┐ │ │   │
    │   │  │  │ TIMELINE SELECTOR                                │ │ │   │
    │   │  │  │                                                  │ │ │   │
    │   │  │  │  [TransUnion]  [Equifax]  [Infornet]            │ │ │   │
    │   │  │  │       │            │           │                │ │ │   │
    │   │  │  │       ▼            ▼           ▼                │ │ │   │
    │   │  │  │  [PN10] [PN20]  [EQ01]     [IN01]              │ │ │   │
    │   │  │  │                                                  │ │ │   │
    │   │  │  └──────────────────────────────────────────────────┘ │ │   │
    │   │  │                                                        │ │   │
    │   │  │  ┌──────────────────────────────────────────────────┐ │ │   │
    │   │  │  │ CAMPOS DISPONIBLES                               │ │ │   │
    │   │  │  │  [NIT] [DPI] [Nombre] [Fecha_Nac] ...           │ │ │   │
    │   │  │  └──────────────────────────────────────────────────┘ │ │   │
    │   │  └────────────────────────────────────────────────────────┘ │   │
    │   │                                                              │   │
    │   │  ┌────────────────────────────────────────────────────────┐ │   │
    │   │  │ EXPRESSION BUILDER                                     │ │   │
    │   │  │                                                        │ │   │
    │   │  │  ┌──────────────────────────────────────────────────┐ │ │   │
    │   │  │  │  [zona de drop para expresiones]                 │ │ │   │
    │   │  │  │                                                  │ │ │   │
    │   │  │  │  Arrastra campos, operadores o funciones aqui   │ │ │   │
    │   │  │  └──────────────────────────────────────────────────┘ │ │   │
    │   │  └────────────────────────────────────────────────────────┘ │   │
    │   │                                                              │   │
    │   └─────────────────────────────────────────────────────────────┘   │
    │                                                                      │
    └─────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                      Insertar en DOM                                 │
    │                                                                      │
    │   variablesContainer.appendChild(variableCard)                       │
    │   actualizarContadorVariables()                                      │
    │   cargarVariablesExistentes(varId)                                   │
    │                                                                      │
    └─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Flujo de Drag & Drop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO: DRAG & DROP                                   │
└─────────────────────────────────────────────────────────────────────────────┘


    PALETA ORIGEN                                          EXPRESSION BUILDER
    ─────────────                                          ──────────────────

    ┌─────────────┐                                        ┌─────────────────┐
    │  OPERADORES │                                        │                 │
    │             │                                        │                 │
    │  [+] [-]    │ ──── dragOperatorStart() ────────────► │  allowItemDrop()│
    │  [*] [/]    │      EF.State.draggedOperator = "+"    │  drag-over      │
    │  [>] [<]    │                                        │                 │
    │  [AND] [OR] │ ──── drop ───────────────────────────► │  dropItem()     │
    │             │      addExprComponent('operator','+')  │                 │
    └─────────────┘                                        │  ┌───────────┐  │
                                                           │  │ [+]       │  │
    ┌─────────────┐                                        │  └───────────┘  │
    │  FUNCIONES  │                                        │                 │
    │             │                                        │                 │
    │  [Minimo]   │ ──── dragFunctionStart() ────────────► │  allowItemDrop()│
    │  [Maximo]   │      EF.State.draggedFunctionName      │                 │
    │  [Suma]     │      = "Minimo"                        │                 │
    │  [Promedio] │                                        │                 │
    │             │ ──── drop ───────────────────────────► │  dropItem()     │
    └─────────────┘      openFunctionModal("Minimo")       │                 │
                              │                            │                 │
                              ▼                            │                 │
                   ┌────────────────────┐                  │                 │
                   │   MODAL FUNCION    │                  │                 │
                   │                    │                  │                 │
                   │  Configurar params │                  │                 │
                   │  [mini-builders]   │                  │                 │
                   │                    │                  │                 │
                   │  [Aceptar]         │ ────────────────►│  ┌───────────┐  │
                   └────────────────────┘                  │  │#Minimo()# │  │
                         addExprComponent('function')      │  └───────────┘  │
                                                           │                 │
    ┌─────────────┐                                        │                 │
    │   CAMPOS    │                                        │                 │
    │             │                                        │                 │
    │  [NIT]      │ ──── dragFieldStart() ───────────────► │                 │
    │  [DPI]      │      EF.State.draggedField = "NIT"     │                 │
    │  [Fecha]    │                                        │                 │
    │             │ ──── drop ───────────────────────────► │  ┌───────────┐  │
    └─────────────┘      addExprComponent('field','NIT')   │  │ [NIT]     │  │
                                                           │  └───────────┘  │
    ┌─────────────┐                                        │                 │
    │  VARIABLES  │                                        │                 │
    │  EXISTENTES │                                        │                 │
    │             │                                        │                 │
    │  [Var 1]    │ ──── drag ──────────────────────────► │                 │
    │  [Var 2]    │      EF.State.draggedVariable          │                 │
    │             │      = "Variable 1"                    │                 │
    │             │                                        │                 │
    │             │ ──── drop ───────────────────────────► │  ┌───────────┐  │
    └─────────────┘      addExprComponent('variable')      │  │[Variable1]│  │
                                                           │  └───────────┘  │
                                                           │                 │
                                                           └─────────────────┘
```

---

## 4. Flujo de Funciones Anidadas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUJO: FUNCIONES ANIDADAS                                 │
└─────────────────────────────────────────────────────────────────────────────┘


    NIVEL 0 (Expression Builder)
    ────────────────────────────

    ┌─────────────────────────────────────────────────────────────────────┐
    │                                                                      │
    │   Usuario arrastra [Si entonces] al Expression Builder              │
    │                                                                      │
    └─────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                      NIVEL 1: Modal "Si entonces"                    │
    │                                                                      │
    │   ┌─────────────────────────────────────────────────────────────┐   │
    │   │  [Condicion]  [Verdadero]  [Falso]                          │   │
    │   │      ●            ○           ○                             │   │
    │   │                                                             │   │
    │   │   ┌─────────────────────────────────────────────────────┐   │   │
    │   │   │  MINI-BUILDER (Condicion)                           │   │   │
    │   │   │                                                     │   │   │
    │   │   │  Usuario arrastra [Calcular edad] aqui             │   │   │
    │   │   │                                                     │   │   │
    │   │   └────────────────────────┬────────────────────────────┘   │   │
    │   └────────────────────────────┼────────────────────────────────┘   │
    │                                │                                     │
    └────────────────────────────────┼────────────────────────────────────┘
                                     │
                                     ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                      NIVEL 2: Modal "Calcular edad"                  │
    │                                                                      │
    │   ┌─────────────────────────────────────────────────────────────┐   │
    │   │  PALETA LOCAL           │  ZONA DE DROP                     │   │
    │   │                         │                                   │   │
    │   │  [Campos]               │  [Fecha_Nac] [>] [18] [YYYY]     │   │
    │   │  [Operadores]           │                                   │   │
    │   │  [Valores]              │                                   │   │
    │   │  [Formato]              │                                   │   │
    │   │                         │                                   │   │
    │   │  [Aceptar] [Cancelar]   │                                   │   │
    │   └─────────────────────────┴───────────────────────────────────┘   │
    │                                                                      │
    └─────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      │ click [Aceptar]
                                      │ buildExpression()
                                      │ = "#CalculaEdad([Fecha_Nac],>,18,YYYY)#"
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                      VOLVER A NIVEL 1                                │
    │                                                                      │
    │   Mini-builder ahora contiene:                                       │
    │   ┌─────────────────────────────────────────────────────────────┐   │
    │   │  [#CalculaEdad([Fecha_Nac],>,18,YYYY)#]                     │   │
    │   └─────────────────────────────────────────────────────────────┘   │
    │                                                                      │
    │   Usuario puede seguir agregando: [>] [0]                            │
    │   ┌─────────────────────────────────────────────────────────────┐   │
    │   │  [#CalculaEdad(...)#] [>] [0]                               │   │
    │   └─────────────────────────────────────────────────────────────┘   │
    │                                                                      │
    │   [Aceptar]                                                          │
    └─────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      │ click [Aceptar]
                                      │ buildExpression()
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                      VOLVER A NIVEL 0                                │
    │                                                                      │
    │   Expression Builder ahora contiene:                                 │
    │   ┌─────────────────────────────────────────────────────────────┐   │
    │   │  [#IF(#CalculaEdad(...)#>0)# #THEN(verde)TH# #ELSE(rojo)EL#]│   │
    │   └─────────────────────────────────────────────────────────────┘   │
    │                                                                      │
    └─────────────────────────────────────────────────────────────────────┘


    NAVIGATION STACK (Pila de navegacion)
    ─────────────────────────────────────

    ┌────────────────────────────────────────────────────────────────────┐
    │                                                                     │
    │   Level 0: Expression Builder (varId: 1)                           │
    │      │                                                              │
    │      └──► Level 1: Si entonces (functionName: "Si entonces")       │
    │              │                                                      │
    │              └──► Level 2: Calcular edad (functionName: "Calcular")│
    │                                                                     │
    │   navigationStack.push(level)  // al entrar                        │
    │   navigationStack.pop()        // al aceptar/cancelar              │
    │                                                                     │
    └────────────────────────────────────────────────────────────────────┘
```

---

## 5. Flujo de Guardado

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO: GUARDAR FACTOR                                │
└─────────────────────────────────────────────────────────────────────────────┘


                    ┌───────────────┐
                    │    Usuario    │
                    │    click      │
                    │ [Guardar]     │
                    └───────┬───────┘
                            │
                            ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                                                                        │
    │                    btnGuardar.addEventListener('click')                │
    │                                                                        │
    │   1. e.preventDefault()  // Evitar postback                           │
    │                                                                        │
    └───────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                                                                        │
    │                    FactoresManager.serializarVariables()               │
    │                                                                        │
    │   ┌─────────────────────────────────────────────────────────────────┐ │
    │   │                                                                  │ │
    │   │   const variablesCards = querySelectorAll('.variable-card')     │ │
    │   │   const variables = []                                          │ │
    │   │                                                                  │ │
    │   │   variablesCards.forEach(card => {                              │ │
    │   │       const varId = card.id.replace('varCard', '')              │ │
    │   │       const nameEl = getElementById('varName' + varId)          │ │
    │   │       const exprBuilder = getElementById('exprBuilder' + varId) │ │
    │   │                                                                  │ │
    │   │       // Obtener expresion                                       │ │
    │   │       let expresion = ''                                         │ │
    │   │       exprBuilder.querySelectorAll('.expr-component')           │ │
    │   │           .forEach(comp => {                                     │ │
    │   │               expresion += comp.getAttribute('data-value')      │ │
    │   │           })                                                     │ │
    │   │                                                                  │ │
    │   │       // Obtener origen, buro, segmento                         │ │
    │   │       const origen = card.querySelector('.active[data-origen]') │ │
    │   │       const buro = card.querySelector('.buro-card.selected')    │ │
    │   │       const segmento = card.querySelector('.segmento-card.sel') │ │
    │   │                                                                  │ │
    │   │       variables.push({                                          │ │
    │   │           Orden: index + 1,                                      │ │
    │   │           Variable: nameEl.textContent,                          │ │
    │   │           Origen: origen?.getAttribute('data-origen'),          │ │
    │   │           Expresion: expresion,                                  │ │
    │   │           Buro: buro?.getAttribute('data-buro'),                │ │
    │   │           Bloque: segmento?.getAttribute('data-segmento')       │ │
    │   │       })                                                         │ │
    │   │   })                                                             │ │
    │   │                                                                  │ │
    │   │   hfVariablesData.value = JSON.stringify(variables)             │ │
    │   │                                                                  │ │
    │   └─────────────────────────────────────────────────────────────────┘ │
    │                                                                        │
    └───────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                                                                        │
    │                    FactoresManager.guardarFactor()                     │
    │                                                                        │
    │   ┌─────────────────────────────────────────────────────────────────┐ │
    │   │                                                                  │ │
    │   │   const factor = {                                               │ │
    │   │       id: factorIdCounter++,                                     │ │
    │   │       nombre: txtNombre.value,                                   │ │
    │   │       descripcion: txtDescripcion.value,                         │ │
    │   │       accionAprobado: ddlAccionAprobado.value,                   │ │
    │   │       accionDenegado: ddlAccionDenegado.value,                   │ │
    │   │       accionNext: ddlAccionNext.value,                           │ │
    │   │       variables: variables,                                      │ │
    │   │       variablesCount: variables.length,                          │ │
    │   │       expresionLogica: logicExpressionPreview.textContent,       │ │
    │   │       fechaCreacion: new Date().toISOString()                    │ │
    │   │   }                                                              │ │
    │   │                                                                  │ │
    │   │   factoresGuardados.push(factor)                                 │ │
    │   │                                                                  │ │
    │   └─────────────────────────────────────────────────────────────────┘ │
    │                                                                        │
    └───────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                                                                        │
    │                    agregarFactorALista(factor)                         │
    │                                                                        │
    │   ┌─────────────────────────────────────────────────────────────────┐ │
    │   │                                                                  │ │
    │   │   const factorHtml = `                                          │ │
    │   │       <div class="factor-item" data-factor-id="${factor.id}">   │ │
    │   │           <div class="factor-item-left">                        │ │
    │   │               <div class="factor-item-icon">                    │ │
    │   │                   <i class="fas fa-shield-alt"></i>             │ │
    │   │               </div>                                            │ │
    │   │               <div class="factor-item-info">                    │ │
    │   │                   <div class="factor-item-name">                │ │
    │   │                       ${factor.nombre}                          │ │
    │   │                   </div>                                        │ │
    │   │                   <div class="factor-item-description">         │ │
    │   │                       ${factor.descripcion} -                   │ │
    │   │                       ${factor.variablesCount} variable(s)      │ │
    │   │                   </div>                                        │ │
    │   │               </div>                                            │ │
    │   │           </div>                                                │ │
    │   │           <div class="factor-item-actions">                     │ │
    │   │               <button onclick="editarFactor(${factor.id})">     │ │
    │   │               <button onclick="eliminarFactor(${factor.id})">   │ │
    │   │           </div>                                                │ │
    │   │       </div>                                                    │ │
    │   │   `                                                             │ │
    │   │                                                                  │ │
    │   │   factoresList.insertAdjacentHTML('beforeend', factorHtml)      │ │
    │   │   factoresCount.textContent = factoresGuardados.length          │ │
    │   │                                                                  │ │
    │   └─────────────────────────────────────────────────────────────────┘ │
    │                                                                        │
    └───────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                                                                        │
    │                    limpiarFormulario()                                 │
    │                                                                        │
    │   - txtNombre.value = ''                                              │
    │   - txtDescripcion.value = ''                                         │
    │   - ddlAccionAprobado.selectedIndex = 0                               │
    │   - ddlAccionDenegado.selectedIndex = 0                               │
    │   - ddlAccionNext.selectedIndex = 0                                   │
    │   - variablesContainer.innerHTML = ''                                 │
    │   - logicExprBuilder reset                                            │
    │   - variablesCount = '0 variables'                                    │
    │                                                                        │
    └───────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    ▼
                         ┌────────────────────┐
                         │  alert('Factor     │
                         │  guardado          │
                         │  exitosamente')    │
                         └────────────────────┘
```

---

## 6. Estructura de Datos JSON

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ESTRUCTURA: FACTOR                                   │
└─────────────────────────────────────────────────────────────────────────────┘

{
    "id": 1,
    "nombre": "KO-EDAD-MINIMA",
    "descripcion": "Valida que el cliente tenga edad minima",
    "accionAprobado": "verde",
    "accionDenegado": "rojo",
    "accionNext": "ir_a",
    "variables": [
        {
            "Orden": 1,
            "Variable": "Variable 1",
            "Funcion": "",
            "Origen": "buro",
            "Expresion": "#CalculaEdad([Fecha_Nacimiento],>,18,YYYY)#",
            "ExpresionCondicional": "",
            "ExpresionWhere": "",
            "MensajeWhere": "",
            "TipoRespuesta": "",
            "Buro": "transunion",
            "Bloque": "PN10",
            "Accion": ""
        },
        {
            "Orden": 2,
            "Variable": "Variable 2",
            "Funcion": "",
            "Origen": "segmento",
            "Expresion": "[Monto_Solicitado]>[Monto_Maximo]",
            "Buro": "",
            "Bloque": "creditos",
            "Accion": ""
        }
    ],
    "variablesCount": 2,
    "expresionLogica": "[Variable 1] AND [Variable 2]",
    "fechaCreacion": "2026-01-15T10:30:00.000Z"
}


┌─────────────────────────────────────────────────────────────────────────────┐
│                    ESTRUCTURA: EF.State (Estado Global)                      │
└─────────────────────────────────────────────────────────────────────────────┘

EF.State = {
    // Elementos arrastrados actualmente
    draggedFunctionName: "Minimo" | null,
    draggedOperator: "+" | null,
    draggedField: "NIT" | null,
    draggedValue: "value" | null,
    draggedParenthesis: "(" | ")" | null,
    draggedVariableId: 1 | null,
    draggedVariableName: "Variable 1" | "",
    draggedLogicOperator: "AND" | "OR" | null,
    draggedElement: HTMLElement | null,

    // Destino del drop
    targetVarId: 1 | null,

    // Input activo para funciones
    activeInput: HTMLElement | null
}
```

---

## 7. Mapa de Eventos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAPA DE EVENTOS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

ELEMENTO                    EVENTO          HANDLER                 ACCION
────────────────────────────────────────────────────────────────────────────────

[Paleta Operadores]
├── .op-pill               dragstart       dragOperatorStart()     Set EF.State.draggedOperator
├── .op-pill               dragend         dragOperatorEnd()       Clear state, remove class
└── .draggable-value-item  dragstart       dragValueStart()        Set EF.State.draggedValue

[Paleta Funciones]
├── .function-item         dragstart       dragFunctionStart()     Set EF.State.draggedFunctionName
└── .function-item         dragend         dragFunctionEnd()       Clear state

[Origen Datos - Campos]
├── .campo-item            dragstart       dragFieldStart()        Set EF.State.draggedField
└── .campo-item            dragend         dragFieldEnd()          Clear state

[Origen Datos - Variables]
├── .origen-variable-item  dragstart       (inline)                Set window.draggedVariable
└── .origen-variable-item  dragend         (inline)                Clear state

[Expression Builder]
├── #exprBuilder{n}        dragover        allowItemDrop()         Add class 'drag-over'
├── #exprBuilder{n}        dragleave       dragItemLeave()         Remove class 'drag-over'
└── #exprBuilder{n}        drop            dropItem()              Process dropped item

[Logic Expression Builder]
├── #logicExprBuilder      dragover        allowLogicDrop()        Add class 'drag-over'
├── #logicExprBuilder      dragleave       dragLogicLeave()        Remove class
└── #logicExprBuilder      drop            dropIntoLogicExpr()     Process logic item

[Botones Principales]
├── #btnGuardar            click           FactoresManager...      Serializar y guardar
├── #btnCancelar           click           Response.Redirect()     Recargar pagina
└── #btnValidar            click           (server-side)           Validar expresion

[Variable Card]
├── .btn-add-variable      click           agregarVariable()       Crear nueva card
├── .btn-delete-variable   click           eliminarVariable()      Eliminar card
└── .variable-card-header  click           toggleVariable()        Expandir/colapsar

[Origen Selector]
├── .origen-selector-btn   click           cambiarOrigenDatos()    Cambiar vista
├── .buro-card             click           seleccionarBuroCard()   Seleccionar buro
└── .segmento-card         click           seleccionarSegmento()   Seleccionar segmento

[Flujo Evaluacion]
├── .factor-item-btn.edit  click           editarFactor()          Cargar en formulario
└── .factor-item-btn.delete click          eliminarFactor()        Eliminar de lista
```

---

*Documento generado: Enero 2026*
*Version: 1.0*
