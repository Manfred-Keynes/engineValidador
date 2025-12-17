# Plan de Implementación - Editor Visual de Reglas

## Resumen Ejecutivo

### Problema Actual
El editor de reglas existente requiere que los usuarios finales escriban manualmente expresiones lógicas complejas, generando:
- **Alto índice de errores**: Sintaxis incorrecta, paréntesis mal balanceados, nombres de campos incorrectos
- **Curva de aprendizaje pronunciada**: Los usuarios deben aprender sintaxis específica
- **Tiempo de configuración elevado**: Debugging manual de expresiones
- **Mantenimiento difícil**: Difícil entender expresiones complejas creadas por otros usuarios

### Solución Propuesta
Editor visual drag-and-drop que:
- ✅ Elimina errores de sintaxis mediante construcción visual
- ✅ Interfaz intuitiva sin conocimiento técnico requerido
- ✅ Configuración 70% más rápida que escritura manual
- ✅ Visualización clara y mantenible de la lógica

### Duración Total: **30 días laborales (6 semanas / 1.5 meses)**

---

## Stack Tecnológico

- **Frontend**: JavaScript Vanilla (ES5/ES6)
- **Backend**: ASP.NET WebForms (.NET Framework)
- **Drag & Drop**: HTML5 Drag and Drop API
- **Estilos**: CSS3 con variables CSS
- **Persistencia**: SQL Server + JSON serialization

---

## Estructura de Archivos

```
proyecto/
├── EditorReglas.aspx              # Página principal
├── EditorReglas.aspx.cs           # Code-behind
├── Scripts/
│   └── EditorReglas.js            # Lógica principal (~4200 líneas)
├── Content/
│   └── EditorReglas.css           # Estilos (~800 líneas)
├── Models/
│   └── ReglaValidacion.cs         # Modelo de datos
└── Services/
    └── ReglasService.cs           # Servicio de negocio
```

---

## Plan de Implementación (30 días - 6 semanas)

### 🎯 Beneficios del Tiempo Adicional

Con 10 días extra (50% más tiempo), podemos:
- ✅ **Testing más exhaustivo** entre fases
- ✅ **Code reviews** después de cada componente mayor
- ✅ **Refactoring** para mejor calidad de código
- ✅ **Documentación** más detallada
- ✅ **Buffer** para imprevistos y bugs complejos
- ✅ **Optimización de performance** antes del deployment

### Semana 1: Fundamentos y Configuración (Días 1-5)

#### Día 1 - Configuración de Proyecto y Arquitectura
⏱️ **8 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Setup inicial** (3 horas):
  - Crear estructura de carpetas y archivos base
  - Agregar referencias NuGet (Newtonsoft.Json v13.0+)
  - Configurar routing en `Web.config`
  - Crear archivo de documentación `CLAUDE.md`
- [ ] **Layout HTML** (3 horas):
  - Crear página `EditorReglas.aspx` con estructura completa
  - Definir contenedores: sidebar, variablesContainer, logicExpressionPanel
  - Agregar toolbar con botones principales
- [ ] **Estructura JavaScript** (2 horas):
  - Crear `EditorReglas.js` con estructura comentada
  - Definir secciones: variables globales, inicialización, funciones principales

**Entregables**: Página accesible con estructura HTML completa, JS y CSS vacíos pero organizados

**🔍 Code Review**: Revisar estructura de carpetas y naming conventions

---

#### Día 2 - Modelos de Datos y Base de Datos
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Modelos C#** (3 horas):
  - Crear clase `ReglaValidacion.cs` con todas las propiedades
  - Crear clase `Variable.cs` con metadata para funciones
  - Agregar validaciones en modelos (DataAnnotations)
- [ ] **Scripts SQL** (3 horas):
  - Diseñar tabla `Reglas` con campos completos
  - Diseñar tabla `Variables` (opcional, para normalización futura)
  - Diseñar tabla `ReglasAuditoria` para tracking
  - Crear índices en columnas de búsqueda y foreign keys
- [ ] **Ejecución y Verificación** (2 horas):
  - Ejecutar scripts en base de datos de desarrollo
  - Verificar tablas, índices y constraints
  - Insertar datos de prueba

**Entregables**: Modelos C# completos, tablas DB creadas y verificadas, datos de prueba insertados

**🔍 Code Review**: Revisar diseño de BD y modelos C#

---

#### Día 3 - Servicios Backend (Parte 1)
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **ReglasService** (5 horas):
  - Crear `ReglasService.cs` con constructor y connection string
  - Implementar `ObtenerRegla(int id)` con SqlDataReader
  - Implementar `GuardarRegla()` (insert si Id=0, update si Id>0)
  - Implementar `EliminarRegla()` (soft delete)
  - Agregar `RegistrarAuditoria()` privado
- [ ] **Validaciones** (2 horas):
  - Implementar `ValidarRegla()` con todas las validaciones
  - Validar JSON con try-catch de deserialización
- [ ] **Testing Manual** (1 hora):
  - Probar cada método con breakpoints
  - Verificar inserts/updates en SQL Server Management Studio

**Entregables**: ReglasService con CRUD completo, validaciones funcionales

**🔍 Code Review**: Revisar manejo de errores y SQL injection prevention

---

#### Día 4 - Servicios Backend (Parte 2) y Web Methods
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Web Methods** (4 horas):
  - Implementar `GuardarRegla(string jsonData)` en EditorReglas.aspx.cs
  - Implementar `CargarRegla(int id)`
  - Implementar `ObtenerCamposDisponibles()`
  - Implementar `ListarReglas(string filtro)`
  - Implementar `EliminarRegla(int id)`
  - Agregar manejo de excepciones y logging en cada método
- [ ] **Testing con Postman/Fiddler** (2 horas):
  - Probar cada Web Method independientemente
  - Verificar formato JSON de respuestas
  - Testear casos de error (IDs inválidos, JSON malformado)
- [ ] **Documentación** (2 horas):
  - Documentar API de Web Methods (parámetros, respuestas)
  - Agregar ejemplos de JSON en comentarios

**Entregables**: Web Methods funcionales y testeados, documentación API completa

**🔍 Code Review**: Revisar seguridad y validación server-side

---

#### Día 5 - CSS Completo y Testing de Fundamentos
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Sistema de Estilos** (5 horas):
  - Definir todas las variables CSS en `:root` (~100 líneas)
  - Implementar layout Grid/Flexbox (~200 líneas)
  - Estilos para pills de componentes (~150 líneas)
  - Estilos para variable cards (~150 líneas)
  - Estilos para sidebar (~100 líneas)
  - Estilos para panel de configuración (~100 líneas)
  - Estilos para mini-builders (~100 líneas)
  - Utilidades: toasts, modals, breadcrumbs (~100 líneas)
- [ ] **Testing Visual** (2 horas):
  - Verificar layout en Chrome, Firefox, Edge
  - Probar en resoluciones 1920x1080 y 1366x768
  - Verificar animaciones y transitions
- [ ] **Ajustes Finales** (1 hora):
  - Corregir problemas visuales detectados
  - Optimizar CSS (remover duplicados)

**Entregables**: CSS completo (~800 líneas), sistema visual funcionando correctamente

**🎯 Milestone 1**: Fundamentos completados - Backend funcional y UI base lista

### Semana 2: Sistema de Variables y Expression Builder (Días 6-10)

#### Día 6 - Sistema de Variables
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Contador y Variables** (3 horas):
  - Implementar contador global `variablesCounter`
  - Crear función `addVariable()` para generar cards
  - Generar HTML de variable card con estructura completa
  - Inicializar `expressionComponents[varId] = []`
  - Insertar en DOM con animación
- [ ] **Edición de Variables** (3 horas):
  - Implementar edición de nombre de variable (inline edit)
  - Implementar eliminación de variable con modal de confirmación
  - Agregar validación de nombres duplicados
  - Implementar drag de variable desde header para logic expression
- [ ] **Estilos y UX** (2 horas):
  - Estilizar variable cards con animaciones
  - Agregar iconos y estados hover
  - Implementar contador visual de componentes en cada variable

**Entregables**: Sistema de gestión de variables completo y funcional

**🔍 Code Review**: Revisar manejo de IDs únicos y memory leaks

---

#### Día 7 - Expression Builder Base
⏱️ **8 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Estructura de Datos** (2 horas):
  - Crear estructura de datos `expressionComponents[varId]`
  - Definir formato de componente: `{id, type, value, html, metadata}`
  - Implementar variables globales de estado drag: `draggedField`, `draggedOperator`, `draggedValue`
- [ ] **Drag & Drop** (4 horas):
  - Implementar funciones de drag desde sidebar:
    - `dragField(event, fieldName)`
    - `dragOperator(event, operator)`
    - `dragValue(event, value)`
  - Implementar `dropIntoBuilder(event, varId)` para detectar tipo arrastrado
  - Agregar visual feedback durante drag (clases CSS)
- [ ] **Componentes** (2 horas):
  - Implementar `addExprComponent(varId, type, value, html, metadata)`
  - Implementar generación de IDs únicos con timestamp

**Entregables**: Sistema de drag & drop base funcional para campos, operadores y valores

**🔍 Code Review**: Revisar prevención de drops duplicados

---

#### Día 8 - Expression Builder Completo
⏱️ **8 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Renderizado** (3 horas):
  - Implementar `renderExpression(varId)` para generar pills HTML
  - Crear pills con botones editar/eliminar
  - Implementar placeholder cuando builder está vacío
  - Agregar animaciones de entrada/salida de componentes
- [ ] **CRUD de Componentes** (2 horas):
  - Implementar `deleteExprComponent(compId, varId)`
  - Agregar confirmación antes de eliminar
- [ ] **Preview de Expresión** (2 horas):
  - Crear `updateExpressionPreview(varId)` para construir string
  - Implementar `buildComponentsExpression(components)` para iterar y concatenar
  - Mostrar preview textual en tiempo real
- [ ] **Testing Manual** (1 hora):
  - Probar drag & drop de diferentes tipos
  - Verificar renderizado correcto de pills

**Entregables**: Expression builder completamente funcional sin funciones aún

**🔍 Code Review**: Revisar performance de renderizado con muchos componentes

---

#### Día 9 - Refactoring y Code Review
⏱️ **8 horas** | 🟢 Complejidad: Baja-Media

**Tareas**:
- [ ] **Refactoring** (4 horas):
  - Extraer funciones duplicadas a utilidades
  - Optimizar código del expression builder
  - Agregar comentarios y JSDoc a funciones principales
  - Estandarizar naming conventions
- [ ] **Validaciones** (2 horas):
  - Agregar validación visual básica (resaltar errores)
  - Implementar tooltips explicativos en sidebar
  - Agregar mensajes de ayuda contextuales
- [ ] **Testing y Bugs** (2 horas):
  - Testear casos edge (arrays vacíos, drops inválidos)
  - Corregir bugs encontrados en días 6-8
  - Probar en diferentes navegadores

**Entregables**: Código limpio, bien documentado y sin bugs conocidos

**🔍 Code Review**: Sesión de revisión exhaustiva del código de Semana 2

---

#### Día 10 - Panel de Configuración de Funciones
⏱️ **8 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **HTML del Panel** (2 horas):
  - Crear HTML del panel de configuración inline dentro de cada variable
  - Estructura: header (título + breadcrumb), body (contenido dinámico), footer (botones)
  - Agregar animaciones CSS para expansión del panel
- [ ] **Apertura y Cierre** (3 horas):
  - Implementar `openConfigPanel(functionName, input)`:
    - Guardar contexto: `activeInput`, `currentFunction`, `currentConfigVarId`
    - Mostrar panel con animación slide-down
    - Generar formulario dinámico según función
  - Implementar `closeConfigPanel(varId)`:
    - Limpiar estado global
    - Ocultar panel con animación
    - Resetear variables de contexto
- [ ] **Estilos** (2 horas):
  - Estilizar panel de configuración (~150 líneas CSS)
  - Estados: colapsado, expandido, hover
  - Responsive design
- [ ] **Testing** (1 hora):
  - Probar apertura/cierre múltiples veces
  - Verificar limpieza de estado

**Entregables**: Panel de configuración inline funcional

**🎯 Milestone 2**: Expression Builder y Panel de Configuración completos

---

### Semana 3: Mini-Builders y Funciones (Días 11-15)

#### Día 11 - Mini-Builders (Parámetros)
⏱️ **8 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Generación de Mini-Builders** (3 horas):
  - Crear función `generateMiniBuilder(paramId, label, placeholder, includeBreadcrumb)`
  - Generar ID único con formato: `miniBuilder_level{N}_param{M}`
  - Crear HTML con label, drop zone y breadcrumb opcional
  - Agregar al DOM dentro del panel de configuración
- [ ] **Drag & Drop** (3 horas):
  - Implementar `dropIntoMiniBuilder(event, builderId)`
  - Crear estructura de datos `miniBuilderComponents[builderId] = []`
  - Implementar `addMiniComponent(builderId, type, value, html)`
  - Implementar `deleteMiniComponent(compId, builderId)`
- [ ] **Renderizado** (2 horas):
  - Crear `renderMiniBuilder(builderId)` para generar pills (80% del tamaño normal)
  - Agregar botones eliminar en pills
  - Implementar placeholder cuando mini-builder está vacío

**Entregables**: Mini-builders completamente funcionales

**🔍 Code Review**: Revisar gestión de IDs de mini-builders

---

#### Día 12 - Funciones Matemáticas
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Formularios** (4 horas):
  - Crear función `generateFunctionForm(functionName)` con switch case
  - Implementar formulario para **Mínimo**: 2 mini-builders
  - Implementar formulario para **Máximo**: 2 mini-builders
  - Implementar formulario para **Suma**: N mini-builders con botón "Agregar Campo"
  - Implementar formulario para **Promedio**: N mini-builders con botón "Agregar Campo"
  - Implementar formulario para **Conteo**: N mini-builders con botón "Agregar Campo"
- [ ] **Recolección de Parámetros** (2 horas):
  - Implementar `collectParams()` para iterar mini-builders y construir array
  - Manejar mini-builders vacíos (parámetro vacío "[]")
- [ ] **Aceptar Configuración** (2 horas):
  - Implementar `acceptFunctionConfig(varId)`:
    - Recopilar parámetros con `collectParams()`
    - Construir expresión: `#NombreFuncion(param1,param2)#`
    - Crear metadata con `functionName` y `params`
    - Agregar componente al expression builder principal
    - Cerrar panel

**Entregables**: Funciones matemáticas operativas (Mínimo, Máximo, Suma, Promedio, Conteo)

**🔍 Code Review**: Revisar construcción de expresiones

---

#### Día 13 - Funciones de Texto
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Formularios de Texto** (3 horas):
  - Implementar formulario para **Conteo caracteres**: 1 mini-builder
  - Implementar formulario para **Expresión regular**: 2 mini-builders (patrón + texto)
  - Agregar placeholders descriptivos en cada mini-builder
- [ ] **Botón "Valor"** (3 horas):
  - Crear botón "Insertar Valor" en cada mini-builder
  - Crear modal para ingresar valores literales (números, textos)
  - Implementar inserción de valor como componente tipo "value"
  - Validar formato según contexto (número vs texto)
- [ ] **Testing** (2 horas):
  - Probar todas las funciones implementadas (matemáticas + texto)
  - Verificar expresiones generadas
  - Testear casos edge (parámetros vacíos, valores especiales)

**Entregables**: Funciones de texto completas, modal de valores funcional

**🔍 Code Review**: Revisar validación de valores ingresados

---

#### Día 14 - Función "Si entonces"
⏱️ **8 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Formulario Condicional** (3 horas):
  - Crear formulario específico para "Si entonces" con 3 secciones:
    - Parámetro 1: "Condición" (mini-builder con breadcrumb)
    - Parámetro 2: "Valor si es Verdadero" (mini-builder con breadcrumb)
    - Parámetro 3: "Valor si es Falso" (mini-builder con breadcrumb)
  - Generar los 3 mini-builders con `includeBreadcrumb=true`
  - Estilizar con separadores visuales entre secciones
- [ ] **Recolección de 3 Parámetros** (2 horas):
  - Adaptar `collectParams()` para mantener orden de los 3 parámetros
  - Construir expresión: `#SiEntonces(condicion,verdadero,falso)#`
  - Crear metadata con los 3 params
- [ ] **Testing sin Anidación** (3 horas):
  - Probar función "Si entonces" con valores simples
  - Verificar expresión generada
  - Probar casos: parámetros vacíos, diferentes tipos de valores
  - **NO testear anidación aún** (será en Semana 4)

**Entregables**: Función "Si entonces" operativa sin anidación

**🔍 Code Review**: Revisar lógica de breadcrumbs individuales

---

#### Día 15 - Testing de Funciones y Buffer
⏱️ **8 horas** | 🟢 Complejidad: Baja-Media

**Tareas**:
- [ ] **Testing Exhaustivo** (4 horas):
  - Probar todas las funciones implementadas (8 funciones en total)
  - Verificar construcción correcta de expresiones
  - Testear apertura/cierre múltiple de paneles
  - Probar drag & drop intensivo
  - Verificar limpieza de estado al cerrar paneles
- [ ] **Corrección de Bugs** (3 horas):
  - Corregir bugs encontrados en testing
  - Ajustar estilos CSS si es necesario
  - Optimizar performance de renderizado
- [ ] **Documentación** (1 hora):
  - Documentar cada función con ejemplos
  - Agregar comentarios en funciones clave

**Entregables**: Todas las funciones simples testeadas y funcionales

**🎯 Milestone 3**: Funciones simples completas y testeadas

---

### Semana 4: Funciones Avanzadas y Anidación (Días 16-20)

#### Día 16 - Función "Calcular edad" (Blocks)
⏱️ **8 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Sistema de Blocks** (3 horas):
  - Crear estructura de datos `droppedBlocks = [{id, type, value, order}]`
  - Crear zona de drop para bloques (visual diferente a mini-builders)
  - Implementar `dropBlock(event)` para agregar bloques con orden secuencial
- [ ] **Renderizado de Blocks** (2 horas):
  - Implementar `renderBlocks()`:
    - Ordenar por `order`
    - Generar cards numerados (1, 2, 3, 4)
    - Mostrar etiquetas: "Fecha", "Operador", "Valor", "Formato"
    - Botones eliminar con re-numeración automática
  - Implementar `deleteBlock(blockId)` con re-ordenamiento
- [ ] **Construcción de Expresión** (2 horas):
  - Crear `buildCalculaEdadExpression()`: SIEMPRE 4 parámetros en formato `#CalculaEdad([p1],[p2],[p3],YYYY)#`
  - Crear `buildCalculaEdadPreview()`: muestra solo lo arrastrado
  - Implementar actualización de preview en tiempo real
- [ ] **Testing** (1 hora):
  - Probar arrastre de diferentes tipos a blocks
  - Verificar construcción de expresión
  - Testear eliminación y re-numeración

**Entregables**: Función "Calcular edad" con sistema de blocks funcional

**🔍 Code Review**: Revisar lógica de construcción de expresión con 4 params

---

#### Día 17 - Navigation Stack (Anidación Parte 1)
⏱️ **8 horas** | 🔴 Complejidad: Muy Alta

**Tareas**:
- [ ] **Diseño del Stack** (2 horas):
  - Diseñar estructura `navigationStack`:
    ```javascript
    {
      currentLevel: 0,
      levels: [{
        functionName, parentBuilderId, functionId, varId,
        miniBuilderStates: {}, savedHTML: null
      }]
    }
    ```
  - Documentar flujo de navegación entre niveles
- [ ] **Crear Función Anidada** (3 horas):
  - Implementar `createNestedFunction(functionName, parentBuilderId, varId)`:
    - **CRÍTICO**: Calcular `levelIndex = navigationStack.levels.length` ANTES de push
    - Crear nuevo nivel en stack con levelIndex correcto
    - Generar functionId único
    - Insertar placeholder en mini-builder padre
    - Navegar al nuevo nivel (`currentLevel = levelIndex`)
  - Agregar botón "Función" en cada mini-builder para anidar
- [ ] **Guardar Estado** (2 horas):
  - Implementar `saveCurrentLevelState()`:
    - Guardar HTML completo: `currentLevel.savedHTML`
    - Filtrar mini-builders del nivel actual por prefijo `_level{N}_`
    - Guardar componentes en `miniBuilderStates`
- [ ] **Renderizar Nivel** (1 hora):
  - Implementar `renderCurrentConfigLevel()`:
    - Si existe `savedHTML`: restaurar
    - Si no: generar nuevo formulario
    - Restaurar componentes de mini-builders

**Entregables**: Creación básica de funciones anidadas

**🔍 Code Review**: Revisar cálculo de levelIndex (bug crítico conocido)

---

#### Día 18 - Navegación Completa (Anidación Parte 2)
⏱️ **8 horas** | 🔴 Complejidad: Muy Alta

**Tareas**:
- [ ] **Navegación entre Niveles** (3 horas):
  - Implementar `navigateToLevel(targetLevel)`:
    - Guardar estado del nivel actual
    - Si va a nivel padre: actualizar expresión del hijo en placeholder
    - Cambiar `currentLevel = targetLevel`
    - Renderizar nivel objetivo
  - Implementar `buildLevelExpression(level)` para construir expresión completa del nivel
- [ ] **Aceptar Todos los Niveles** (4 horas):
  - Implementar `acceptAllNestedLevels(varId)`:
    - **CRÍTICO**: Restaurar mini-builders de TODOS los niveles antes de procesar
    - Procesar del más profundo al más superficial (reverse order)
    - Para cada nivel anidado: actualizar componente en mini-builder padre
    - Para nivel raíz: insertar en expression builder principal
    - Limpiar stack y cerrar panel
  - Manejar casos edge: múltiples niveles, parámetros vacíos
- [ ] **Breadcrumb General** (1 hora):
  - Crear breadcrumb general de navegación en header del panel
  - Implementar click en breadcrumb para saltar niveles
  - Actualizar breadcrumb al navegar

**Entregables**: Funciones anidadas completamente funcionales

**🔍 Code Review**: Revisar `acceptAllNestedLevels` (función más crítica)

---

#### Día 19 - Breadcrumbs Individuales
⏱️ **8 horas** | 🟡 Complejidad: Media-Alta

**Tareas**:
- [ ] **Actualización de Breadcrumbs** (4 horas):
  - Crear función `updateMiniBreadcrumb(builderId)`:
    - Parsear builderId para extraer levelIndex y paramIndex
    - Filtrar niveles relevantes (desde profundo hasta el padre de este builder)
    - Seguir cadena de `parentBuilderId` hacia atrás
    - Construir cadena: "Si entonces > Condición > Mínimo > Param 1"
    - Generar HTML del breadcrumb
    - Ocultar si no hay anidación (solo 1 nivel)
- [ ] **Etiquetas de Parámetros** (2 horas):
  - Crear función `getParameterLabel(parentBuilderId, parentFunctionName)`:
    - Mapear número de parámetro a etiqueta humana
    - Ejemplos: "Si entonces" param1 → "Condición", param2 → "Verdadero", param3 → "Falso"
    - "Mínimo" param1 → "Primer valor", param2 → "Segundo valor"
  - Integrar en `updateMiniBreadcrumb`
- [ ] **Integración** (2 horas):
  - Integrar actualización en `renderCurrentConfigLevel()`:
    - Loop por todos los mini-builders del nivel
    - Llamar `updateMiniBreadcrumb(builderId)` para cada uno
  - Implementar navegación al hacer click en breadcrumbs individuales
  - Testing con 3 niveles de anidación

**Entregables**: Breadcrumbs individuales por mini-builder funcionales

**🔍 Code Review**: Revisar parseo de builderIds y construcción de cadenas

---

#### Día 20 - Testing de Anidación y Refactoring
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Testing Exhaustivo de Anidación** (4 horas):
  - Probar funciones anidadas 2 niveles
  - Probar funciones anidadas 3 niveles
  - Probar "Si entonces" con funciones anidadas en los 3 params
  - Probar navegación entre niveles múltiples veces
  - Probar aceptar/cancelar en diferentes niveles
  - Verificar limpieza de stack al cerrar
- [ ] **Corrección de Bugs** (3 horas):
  - Corregir bugs encontrados en testing
  - Ajustar cálculo de levelIndex si hay problemas
  - Optimizar performance de navegación
- [ ] **Refactoring** (1 hora):
  - Limpiar código de anidación
  - Agregar comentarios explicativos
  - Extraer constantes mágicas

**Entregables**: Sistema de anidación completamente funcional y testeado

**🎯 Milestone 4**: Funciones avanzadas y anidación completas

---

### Semana 5: Persistencia e Integración (Días 21-25)

#### Día 21 - Logic Expression Builder
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Estructura de Datos** (2 horas):
  - Crear estructura `logicComponents = [{type, id, name, value}]`
  - Diseñar panel fijo inferior con drop zone grande
  - Estilizar panel de expresión lógica
- [ ] **Drag de Variables** (2 horas):
  - Implementar drag de variables desde header del card
  - Implementar `dropIntoLogicExpression(event)` para detectar variable u operador
  - Agregar variable a `logicComponents`
- [ ] **Operadores y Paréntesis** (2 horas):
  - Agregar operadores lógicos al sidebar: AND, OR, NOT
  - Agregar paréntesis: (, )
  - Implementar drag de operadores y paréntesis
- [ ] **Renderizado** (2 horas):
  - Implementar `renderLogicExpression()`:
    - Generar pills: variable (morado), operador (rosa), paréntesis (gris)
    - Botones eliminar
  - Implementar `updateLogicExpressionString()` para construir: `{Variable 1} AND {Variable 2}`
  - Implementar `deleteLogicComponent(index)`

**Entregables**: Logic expression builder completo

**🔍 Code Review**: Revisar construcción de expresión lógica

---

#### Día 22 - Guardar Reglas
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Serialización** (4 horas):
  - Implementar función `guardarRegla()`:
    - Validar que haya al menos 1 variable
    - Recopilar todas las variables con nombres y expresiones
    - Serializar `expressionComponents` a JSON
    - Serializar `logicComponents` a JSON
  - Implementar serialización de metadata:
    - Para funciones con mini-builders: guardar `params`
    - Para "Calcular edad": guardar `blocks`
    - Para funciones anidadas: preservar estructura completa de niveles
  - Crear objeto JSON completo para enviar
- [ ] **Llamada Backend** (2 horas):
  - Llamar a WebMethod `GuardarRegla(jsonData)` con AJAX
  - Implementar manejo de respuesta:
    - Success: toast verde "Guardado exitosamente", actualizar ID de regla
    - Error: toast rojo con mensaje descriptivo
  - Agregar spinner durante guardado
- [ ] **UI** (2 horas):
  - Agregar botón "Guardar" en toolbar
  - Implementar shortcut Ctrl+S
  - Deshabilitar botón durante guardado

**Entregables**: Guardado de reglas completamente funcional

**🔍 Code Review**: Revisar estructura de JSON y validaciones

---

#### Día 23 - Cargar Reglas (Parte 1)
⏱️ **8 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Carga de Regla** (3 horas):
  - Implementar función `cargarRegla(id)`:
    - Llamar a WebMethod `CargarRegla(id)`
    - Deserializar JSON
    - Limpiar estado actual (variables, componentes, stack)
  - Implementar `loadVariable(variableData)`:
    - Crear variable card
    - Deserializar `expressionComponents`
    - Renderizar expression con pills
- [ ] **Parser Manual** (4 horas):
  - Crear parser `parseExpressionToComponents(expression)`:
    - **CRÍTICO**: Parser manual carácter por carácter (NO regex)
    - Estados: normal, in_field, in_function, in_value
    - Para funciones: depth counter de paréntesis
    - Para campos: buscar cierre `]`
    - Para valores: detectar números vs strings (quotes)
    - Retornar array de componentes con metadata
  - Manejar casos complejos: funciones anidadas en string, paréntesis dentro de strings
- [ ] **Testing del Parser** (1 hora):
  - Testear con expresiones simples
  - Testear con funciones simples
  - Testear con funciones anidadas (2-3 niveles)

**Entregables**: Carga básica de reglas funcional

**🔍 Code Review**: Revisar robustez del parser

---

#### Día 24 - Cargar y Editar Reglas (Parte 2)
⏱️ **8 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Restauración de Metadata** (4 horas):
  - Implementar `loadParamsIntoConfigPanel(metadata, varId)`:
    - Detectar tipo de función desde `metadata.functionName`
    - Para funciones con mini-builders: parsear cada param, recrear componentes
    - Para "Calcular edad": restaurar `droppedBlocks` desde `metadata.blocks`
    - Para funciones anidadas: llamar `recreateNestedLevel()` recursivamente
  - Implementar `recreateNestedLevel(functionName, params, parentBuilderId, varId)`:
    - **CRÍTICO**: Calcular `levelIndex` correctamente ANTES de agregar al stack
    - Parsear cada parámetro recursivamente
    - Si parámetro contiene función (#...#): crear nivel anidado recursivamente
    - Si parámetro es simple: crear componentes directamente
    - Crear nivel con `miniBuilderStates` ya poblados
- [ ] **Edición de Funciones** (3 horas):
  - Implementar `editExprComponent(compId, varId)`:
    - Encontrar componente en `expressionComponents[varId]`
    - Marcar modo edición: `window.editingComponent = {compId, varId, originalComponent}`
    - Marcar `activeInput.editMode = true`
    - Abrir panel de configuración para esa función
    - Cargar parámetros guardados con `loadParamsIntoConfigPanel`
    - Al aceptar: actualizar componente existente (NO crear nuevo)
- [ ] **Testing** (1 hora):
  - Probar edición de funciones simples
  - Probar edición de funciones anidadas

**Entregables**: Edición de funciones funcional

**🔍 Code Review**: Revisar modo edición y actualización de componentes

---

#### Día 25 - Testing de Persistencia y UI de Listado
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **UI de Listado** (3 horas):
  - Crear página o modal de listado de reglas
  - Implementar tabla o lista con: ID, Nombre, Fecha Modificación, Acciones
  - Llamar a WebMethod `ListarReglas(filtro)`
  - Implementar botones: Editar, Eliminar, Nuevo
  - Agregar búsqueda/filtrado básico
- [ ] **Testing de Persistencia** (4 horas):
  - Probar guardar regla simple
  - Probar guardar regla con funciones simples
  - Probar guardar regla con funciones anidadas (2-3 niveles)
  - Probar cargar cada tipo de regla guardada
  - Probar editar función y re-guardar
  - Verificar integridad de datos en BD
- [ ] **Corrección de Bugs** (1 hora):
  - Corregir bugs encontrados en persistencia
  - Ajustar serialización/deserialización si es necesario

**Entregables**: Sistema de persistencia completo y testeado

**🎯 Milestone 5**: Persistencia completa - Sistema end-to-end funcional

---

### Semana 6: Testing Final, Optimización y Deployment (Días 26-30)

#### Día 26 - Testing Funcional Completo
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Testing Sistemático** (6 horas):
  - **Variables**: CRUD completo, drag de headers, renombrar, eliminar
  - **Expression Builder**: Drag & drop de campos, operadores, valores
  - **Funciones Matemáticas**: Mínimo, Máximo, Suma, Promedio, Conteo
  - **Funciones de Texto**: Conteo caracteres, Expresión regular
  - **Si entonces**: 3 parámetros, sin anidación
  - **Calcular edad**: Sistema de blocks, 4 parámetros
  - **Funciones Anidadas**: 2 niveles, 3 niveles, múltiples funciones
  - **Navegación**: Breadcrumbs, saltos entre niveles
  - **Logic Expression**: Drag de variables, operadores, paréntesis
  - **Persistencia**: Guardar, cargar, editar, eliminar
- [ ] **Casos Edge** (2 horas):
  - Parámetros vacíos
  - Eliminación de componentes en uso
  - Cancelar configuración a mitad
  - Navegación rápida entre niveles
  - Múltiples funciones anidadas del mismo tipo

**Entregables**: Lista completa de casos de prueba ejecutados

**🔍 Code Review**: Revisar comportamiento en casos edge

---

#### Día 27 - Testing Cross-Browser y Performance
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Testing en Navegadores** (4 horas):
  - Chrome (última versión): testing completo
  - Edge (última versión): testing completo
  - Firefox (última versión): testing completo
  - Verificar drag & drop en cada navegador
  - Verificar animaciones y transitions
  - Probar en resoluciones: 1920x1080, 1366x768, 1280x720
- [ ] **Performance** (3 horas):
  - Medir tiempo de renderizado con muchas variables (10+)
  - Medir tiempo de renderizado con funciones anidadas profundas
  - Optimizar loops pesados (renderizado, parseo)
  - Usar `requestAnimationFrame` para animaciones si es necesario
  - Minimizar reflows/repaints
- [ ] **Reporte** (1 hora):
  - Documentar resultados de testing por navegador
  - Listar bugs encontrados con severidad (crítico/alto/medio/bajo)

**Entregables**: Reporte de compatibilidad y performance

**🔍 Code Review**: Revisar optimizaciones de performance

---

#### Día 28 - Corrección de Bugs y Optimización
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Corrección de Bugs** (5 horas):
  - Corregir todos los bugs críticos encontrados
  - Corregir bugs de alta prioridad
  - Corregir bugs de media prioridad si hay tiempo
  - Re-testear después de cada corrección
- [ ] **Optimización de Código** (2 horas):
  - Eliminar código duplicado
  - Extraer constantes mágicas
  - Optimizar CSS (remover duplicados, combinar reglas)
  - Minimizar archivos JS y CSS para producción
- [ ] **Accesibilidad Básica** (1 hora):
  - Agregar atributos `aria-label` en botones sin texto
  - Verificar contraste de colores (WCAG AA)
  - Probar navegación con teclado (Tab, Enter, Esc)

**Entregables**: Sistema sin bugs críticos, código optimizado

**🔍 Code Review**: Revisión final del código

---

#### Día 29 - Documentación y Preparación para Deployment
⏱️ **8 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Documentación Técnica** (3 horas):
  - Actualizar `CLAUDE.md` con cambios realizados
  - Documentar funciones principales con JSDoc
  - Agregar comentarios explicativos en código crítico (navigation stack, parser, acceptAllNestedLevels)
  - Crear diagrama de flujo de navegación entre niveles
- [ ] **Documentación de Usuario** (2 horas):
  - Crear README con instrucciones de uso del editor
  - Crear guía rápida con capturas de pantalla
  - Documentar cada función disponible con ejemplos
- [ ] **Preparación Deployment** (3 horas):
  - Crear scripts SQL para producción (tablas, índices)
  - Verificar connection strings en Web.config
  - Crear checklist de deployment
  - Preparar archivos para publicar (build de release)
  - Crear backup de BD de desarrollo

**Entregables**: Documentación completa, archivos listos para deployment

---

#### Día 30 - Deployment y Cierre
⏱️ **8 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Deployment a Staging** (3 horas):
  - Ejecutar scripts SQL en BD de staging
  - Publicar archivos a servidor de staging
  - Configurar Web.config de staging
  - Verificar referencias y dependencias
  - Smoke testing en staging
- [ ] **Testing en Staging** (3 horas):
  - Testing funcional básico end-to-end
  - Probar guardar/cargar reglas en BD de staging
  - Verificar performance en servidor real
  - Corregir problemas menores si aparecen
- [ ] **Documentación de Deployment** (1 hora):
  - Documentar proceso de deployment seguido
  - Documentar configuraciones específicas de servidor
  - Crear guía de rollback en caso de problemas
- [ ] **Cierre** (1 hora):
  - Demostración del sistema completo
  - Entregar documentación al cliente/equipo
  - Crear lista de mejoras futuras (backlog)

**Entregables**: Sistema desplegado en staging y funcionando

**🎯 Milestone Final**: Sistema completo desplegado y documentado

---

---

## Recursos Necesarios

### Equipo
- **1 Desarrollador Full-Stack** (.NET + JavaScript avanzado)
- Dedicación: **100% (Full-time)**
- **Skills requeridos**:
  - JavaScript ES6+ (manejo avanzado de arrays, objetos, eventos)
  - HTML5 Drag & Drop API
  - CSS3 (Flexbox, Grid, Variables, Animations)
  - ASP.NET WebForms, C#
  - SQL Server
  - JSON serialization

### Opcional (Recomendado)
- **QA Tester** (última semana, 50%)
- **Tech Lead** (revisiones, 20%)

---

## Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| **Complejidad de funciones anidadas** | Implementar navigation stack desde el inicio, testing continuo |
| **Bugs en parseo de expresiones** | Parser manual robusto con tests exhaustivos |
| **Tiempo ajustado (20 días)** | Enfoque en MVP, eliminar features no críticas si es necesario |
| **Scope creep** | Definir MVP claro, backlog para post-launch |

---

## Criterios de Éxito

### Funcionales
- [x] CRUD de variables completo
- [x] Drag & drop fluido y sin errores
- [x] Todas las funciones implementadas (matemáticas, texto, "Si entonces", "Calcular edad")
- [x] Funciones anidadas (mínimo 3 niveles)
- [x] Guardar/Cargar/Editar reglas completas
- [x] Logic expression builder funcional
- [x] 0 bugs críticos

### De Negocio
- [x] Reducción de errores de sintaxis >80%
- [x] Reducción de tiempo de configuración >60%
- [x] Interfaz intuitiva (usuario promedio puede usar sin capacitación extensa)

---

## Notas Importantes

### Prioridades si hay Retrasos
Si algún día se retrasa, eliminar en este orden:
1. Breadcrumbs individuales por mini-builder (usar solo breadcrumb general)
2. Función "Calcular edad" (blocks) - diferir para v1.1
3. Más de 2 niveles de anidación (limitar a 2 niveles en MVP)
4. Migración de reglas legacy (hacer manual por ahora)

### Post-Launch (Backlog)
- Migración automática de reglas legacy
- Auto-save en localStorage
- Undo/Redo
- Snippets de expresiones comunes
- Testing automatizado
- Optimización avanzada de performance

---

**Duración**: 20 días laborales (1 mes)
**Esfuerzo**: 1 FTE (Full-Time)
**Versión**: 1.0 - MVP
**Fecha**: Diciembre 2025
**Estado**: Plan de Implementación Aprobado
