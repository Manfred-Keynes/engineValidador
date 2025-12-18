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

---

## Cronograma General

| Parámetro | Valor |
|-----------|-------|
| **Fecha de Inicio** | Lunes, 5 de enero de 2026 |
| **Fecha de Fin** | Miércoles, 1 de abril de 2026 |
| **Duración Total** | 63 días laborales (13 semanas) |
| **Días por Semana** | 5 días (Lunes a Viernes) |
| **Jornada** | 7.5 horas por día |
| **Esfuerzo Total** | 472.5 horas |

---

## Calendario de Semanas Laborales

| Semana | Fechas | Días del Plan |
|--------|--------|---------------|
| Semana 1 | 05-Ene - 09-Ene | Días 1-5 |
| Semana 2 | 12-Ene - 16-Ene | Días 6-10 |
| Semana 3 | 19-Ene - 23-Ene | Días 11-15 |
| Semana 4 | 26-Ene - 30-Ene | Días 16-20 |
| Semana 5 | 02-Feb - 06-Feb | Días 21-25 |
| Semana 6 | 09-Feb - 13-Feb | Días 26-30 |
| Semana 7 | 16-Feb - 20-Feb | Días 31-35 |
| Semana 8 | 23-Feb - 27-Feb | Días 36-40 |
| Semana 9 | 02-Mar - 06-Mar | Días 41-45 |
| Semana 10 | 09-Mar - 13-Mar | Días 46-50 |
| Semana 11 | 16-Mar - 20-Mar | Días 51-55 |
| Semana 12 | 23-Mar - 27-Mar | Días 56-60 |
| Semana 13 | 30-Mar - 01-Abr | Días 61-63 |

---

## Calendario de Fases

| Fase | Descripción | Fecha Inicio | Fecha Fin | Días |
|------|-------------|--------------|-----------|------|
| **Fase 1** | Fundamentos y Configuración | Lun 05-Ene | Mar 13-Ene | 1-7 |
| **Fase 2** | Backend y Servicios | Mié 14-Ene | Jue 22-Ene | 8-14 |
| **Fase 3** | Sistema de Variables | Vie 23-Ene | Lun 02-Feb | 15-21 |
| **Fase 4** | Panel de Configuración | Mar 03-Feb | Mié 11-Feb | 22-28 |
| **Fase 5** | Funciones Simples | Jue 12-Feb | Vie 20-Feb | 29-35 |
| **Fase 6** | Funciones Anidadas | Lun 23-Feb | Mar 03-Mar | 36-42 |
| **Fase 7** | Logic Expression y Persistencia | Mié 04-Mar | Jue 12-Mar | 43-49 |
| **Fase 8** | Testing y Optimización | Vie 13-Mar | Lun 23-Mar | 50-56 |
| **Fase 9** | Deployment | Mar 24-Mar | Mié 01-Abr | 57-63 |

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

## Plan de Implementación Detallado

### 🎯 Beneficios del Tiempo Extendido (1.5 meses)

Con 63 días laborales, podemos:
- ✅ **Testing exhaustivo** entre cada fase
- ✅ **Code reviews** detallados después de cada componente
- ✅ **Refactoring** continuo para mejor calidad de código
- ✅ **Documentación** completa y detallada
- ✅ **Buffer generoso** para imprevistos y bugs complejos
- ✅ **Optimización de performance** antes del deployment
- ✅ **Capacitación** y transferencia de conocimiento
- ✅ **Testing de usuario (UAT)** antes del deployment final

---

## FASE 1: FUNDAMENTOS Y CONFIGURACIÓN
📅 **Lunes 5 de enero - Martes 13 de enero de 2026** | Días 1-7

---

#### Día 1 - Configuración de Proyecto
📅 **Lunes, 5 de enero de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Setup inicial** (3 horas):
  - Crear estructura de carpetas y archivos base
  - Agregar referencias NuGet (Newtonsoft.Json v13.0+)
  - Configurar routing en `Web.config`
  - Crear archivo de documentación `CLAUDE.md`
- [ ] **Verificación de entorno** (2 horas):
  - Verificar conexión a base de datos de desarrollo
  - Configurar Visual Studio con snippets personalizados
  - Configurar debugging para JavaScript
- [ ] **Layout HTML base** (2.5 horas):
  - Crear página `EditorReglas.aspx` con estructura básica
  - Definir contenedores principales: header, main, footer
  - Agregar referencias a CSS y JS

**Entregables**: Proyecto configurado y página base accesible

---

#### Día 2 - Estructura HTML Completa
📅 **Martes, 6 de enero de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Layout principal** (3 horas):
  - Crear sidebar con secciones colapsables
  - Crear área principal `variablesContainer`
  - Crear panel inferior `logicExpressionPanel`
- [ ] **Toolbar** (2 horas):
  - Crear barra de herramientas con botones principales
  - Agregar botones: Nueva Variable, Guardar, Cargar, Vista Previa
  - Estilizar botones con estados hover/active
- [ ] **Estructura JavaScript** (2.5 horas):
  - Crear `EditorReglas.js` con estructura comentada
  - Definir secciones: variables globales, inicialización, funciones principales
  - Agregar event listener `DOMContentLoaded`

**Entregables**: Página con estructura HTML completa y JS organizado

---

#### Día 3 - Sidebar y Componentes Visuales
📅 **Miércoles, 7 de enero de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Sidebar - Sección Campos** (2.5 horas):
  - Crear lista de campos disponibles (mockup inicial)
  - Implementar campos con íconos según tipo de dato
  - Agregar atributos `draggable="true"`
- [ ] **Sidebar - Sección Operadores** (2.5 horas):
  - Crear botones de operadores: `==`, `!=`, `>`, `<`, `>=`, `<=`
  - Crear operadores especiales: `LIKE`, `IN`, `BETWEEN`
  - Agregar atributos drag
- [ ] **Sidebar - Sección Funciones** (2.5 horas):
  - Crear lista de funciones disponibles agrupadas por categoría
  - Categorías: Matemáticas, Texto, Condicionales, Fecha
  - Agregar íconos descriptivos por función

**Entregables**: Sidebar completo con todos los elementos arrastrables

---

#### Día 4 - Modelos de Datos C#
📅 **Jueves, 8 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Modelo ReglaValidacion** (3 horas):
  - Crear clase `ReglaValidacion.cs` con propiedades:
    - `Id`, `Nombre`, `Descripcion`, `Activa`
    - `ExpresionLogica`, `VariablesJson`, `ComponentesJson`
    - `FechaCreacion`, `FechaModificacion`, `UsuarioCreador`
  - Agregar DataAnnotations para validación
- [ ] **Modelo Variable** (2 horas):
  - Crear clase `Variable.cs` con propiedades:
    - `Id`, `Nombre`, `Expresion`, `ComponentesJson`
  - Agregar metadata para funciones
- [ ] **Modelos auxiliares** (2.5 horas):
  - Crear clase `Componente.cs` para deserialización
  - Crear clase `FuncionMetadata.cs` para parámetros de funciones
  - Crear enums para tipos de componentes y operadores

**Entregables**: Modelos C# completos con validaciones

---

#### Día 5 - Scripts SQL Base de Datos
📅 **Viernes, 9 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Tabla Reglas** (2.5 horas):
  - Diseñar tabla `Reglas` con campos completos
  - Definir tipos de datos óptimos (NVARCHAR(MAX) para JSON)
  - Crear primary key y campos de auditoría
- [ ] **Tabla ReglasAuditoria** (2 horas):
  - Diseñar tabla para tracking de cambios
  - Campos: `Id`, `ReglaId`, `Accion`, `Usuario`, `Fecha`, `ValorAnterior`, `ValorNuevo`
- [ ] **Índices y Constraints** (2 horas):
  - Crear índices en columnas de búsqueda frecuente
  - Agregar foreign keys donde corresponda
  - Agregar constraints de validación
- [ ] **Ejecución y Verificación** (1 hora):
  - Ejecutar scripts en base de datos de desarrollo
  - Verificar tablas, índices y constraints
  - Insertar datos de prueba básicos

**Entregables**: Base de datos configurada y verificada

**🔍 Code Review**: Revisar diseño de BD y naming conventions

---

#### Día 6 - CSS Base y Variables
📅 **Lunes, 12 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Variables CSS** (2.5 horas):
  - Definir todas las variables en `:root`:
    - Colores primarios, secundarios, estados
    - Tipografía: fonts, tamaños, line-heights
    - Espaciado: padding, margin, gaps
    - Bordes: radius, widths
    - Sombras: box-shadows
    - Transiciones: durations, easings
- [ ] **Layout Grid/Flexbox** (3 horas):
  - Implementar layout principal con CSS Grid
  - Sidebar con Flexbox vertical
  - Área principal responsive
  - Panel inferior fijo
- [ ] **Reset y Base** (2 horas):
  - CSS reset/normalize
  - Estilos base para body, headings, buttons
  - Estilos para inputs y forms

**Entregables**: Sistema de estilos base configurado (~200 líneas)

---

#### Día 7 - CSS Componentes y Testing Visual
📅 **Martes, 13 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Estilos Sidebar** (2 horas):
  - Estilos para contenedor sidebar
  - Secciones colapsables con animación
  - Estilos para items draggables (campos, operadores, funciones)
- [ ] **Estilos Pills** (2.5 horas):
  - Diseñar pills para campos (azul)
  - Pills para operadores (verde)
  - Pills para valores (naranja)
  - Pills para funciones (morado)
  - Estados: normal, hover, active, dragging
- [ ] **Testing Visual** (2 horas):
  - Verificar layout en Chrome, Firefox, Edge
  - Probar en resoluciones 1920x1080 y 1366x768
  - Ajustar problemas de responsive
- [ ] **Buffer y Ajustes** (1 hora):
  - Corregir problemas visuales detectados
  - Documentar decisiones de diseño

**Entregables**: CSS para sidebar y pills completo (~300 líneas)

**🎯 Milestone 1**: Fundamentos visuales completados - **Martes, 13 de enero de 2026**

---

## FASE 2: BACKEND Y SERVICIOS
📅 **Miércoles 14 de enero - Jueves 22 de enero de 2026** | Días 8-14

---

#### Día 8 - ReglasService CRUD (Parte 1)
📅 **Miércoles, 14 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Constructor y Configuración** (1.5 horas):
  - Crear `ReglasService.cs`
  - Configurar connection string desde Web.config
  - Implementar disposable pattern para conexiones
- [ ] **Método ObtenerRegla** (3 horas):
  - Implementar `ObtenerRegla(int id)` con SqlDataReader
  - Mapear resultado a modelo `ReglaValidacion`
  - Agregar manejo de excepciones y logging
- [ ] **Método ListarReglas** (3 horas):
  - Implementar `ListarReglas(string filtro, int pagina, int tamano)`
  - Agregar paginación
  - Filtrado por nombre/descripción

**Entregables**: Service con métodos de lectura funcionales

---

#### Día 9 - ReglasService CRUD (Parte 2)
📅 **Jueves, 15 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Método GuardarRegla** (3.5 horas):
  - Implementar `GuardarRegla(ReglaValidacion regla)`
  - Lógica: INSERT si Id=0, UPDATE si Id>0
  - Usar parámetros SQL para prevenir injection
  - Retornar ID de regla guardada
- [ ] **Método EliminarRegla** (2 horas):
  - Implementar `EliminarRegla(int id)`
  - Soft delete (marcar como inactiva) vs Hard delete
  - Agregar validaciones previas
- [ ] **Método RegistrarAuditoria** (2 horas):
  - Implementar método privado `RegistrarAuditoria()`
  - Registrar todas las operaciones CRUD
  - Capturar usuario actual y timestamp

**Entregables**: Service con CRUD completo

**🔍 Code Review**: Revisar SQL injection prevention

---

#### Día 10 - Validaciones Backend
📅 **Viernes, 16 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **ValidarRegla** (3 horas):
  - Implementar `ValidarRegla(ReglaValidacion regla)`
  - Validar campos obligatorios
  - Validar longitudes máximas
  - Validar formato de nombre (sin caracteres especiales)
- [ ] **ValidarJSON** (2.5 horas):
  - Validar JSON de variables con try-catch deserialización
  - Validar JSON de componentes
  - Validar estructura esperada
- [ ] **ValidarExpresion** (2 horas):
  - Validar sintaxis básica de expresión lógica
  - Verificar paréntesis balanceados
  - Verificar operadores válidos

**Entregables**: Sistema de validaciones completo

---

#### Día 11 - Web Methods (Parte 1)
📅 **Lunes, 19 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Configuración Page Methods** (1 hora):
  - Configurar `EditorReglas.aspx.cs` para Web Methods
  - Agregar using statements necesarios
  - Configurar ScriptManager en ASPX
- [ ] **GuardarRegla WebMethod** (3 horas):
  - Implementar `[WebMethod] GuardarRegla(string jsonData)`
  - Deserializar JSON a modelo
  - Llamar a ReglasService
  - Retornar resultado con ID o errores
- [ ] **CargarRegla WebMethod** (3.5 horas):
  - Implementar `[WebMethod] CargarRegla(int id)`
  - Obtener regla de BD
  - Serializar a JSON para frontend
  - Manejar caso de regla no encontrada

**Entregables**: Web Methods de guardar y cargar funcionales

---

#### Día 12 - Web Methods (Parte 2)
📅 **Martes, 20 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **ListarReglas WebMethod** (2.5 horas):
  - Implementar `[WebMethod] ListarReglas(string filtro)`
  - Retornar lista con paginación
  - Incluir campos para mostrar en grid
- [ ] **EliminarRegla WebMethod** (2 horas):
  - Implementar `[WebMethod] EliminarRegla(int id)`
  - Verificar permisos
  - Retornar confirmación o error
- [ ] **ObtenerCamposDisponibles WebMethod** (3 horas):
  - Implementar método para obtener campos del sistema
  - Retornar lista con: nombre, tipo, descripción
  - Agregar metadata para validaciones frontend

**Entregables**: Todos los Web Methods implementados

**🔍 Code Review**: Revisar seguridad y validación server-side

---

#### Día 13 - Testing Backend
📅 **Miércoles, 21 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Testing Manual con Postman/Fiddler** (4 horas):
  - Probar cada Web Method independientemente
  - Probar con datos válidos
  - Probar con datos inválidos (casos de error)
  - Probar con JSON malformado
  - Documentar respuestas de cada endpoint
- [ ] **Testing de BD** (2 horas):
  - Verificar inserts/updates en SQL Server Management Studio
  - Verificar auditoría registrada
  - Verificar integridad de datos
- [ ] **Corrección de bugs** (1.5 horas):
  - Corregir bugs encontrados en testing
  - Ajustar validaciones si es necesario

**Entregables**: Backend testeado y funcional

---

#### Día 14 - Documentación Backend y Buffer
📅 **Jueves, 22 de enero de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Documentación API** (3 horas):
  - Documentar cada Web Method:
    - Parámetros de entrada
    - Formato de respuesta
    - Códigos de error
  - Agregar ejemplos de JSON para cada endpoint
- [ ] **Comentarios en código** (2 horas):
  - Agregar XML comments en métodos públicos
  - Documentar lógica compleja
  - Agregar TODOs para mejoras futuras
- [ ] **Buffer y Refactoring** (2.5 horas):
  - Corregir bugs pendientes
  - Refactorizar código duplicado
  - Optimizar queries SQL si es necesario

**Entregables**: Backend documentado y optimizado

**🎯 Milestone 2**: Backend completo y testeado - **Jueves, 22 de enero de 2026**

---

## FASE 3: SISTEMA DE VARIABLES
📅 **Viernes 23 de enero - Lunes 2 de febrero de 2026** | Días 15-21

---

#### Día 15 - Sistema de Variables Base
📅 **Viernes, 23 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Contador y Estado Global** (2 horas):
  - Implementar contador global `variablesCounter`
  - Crear objeto `expressionComponents = {}`
  - Crear objeto `variableNames = {}`
- [ ] **Función addVariable** (3 horas):
  - Crear función `addVariable()` para generar cards
  - Generar ID único: `var_${variablesCounter++}`
  - Generar HTML de variable card con estructura completa
  - Inicializar `expressionComponents[varId] = []`
- [ ] **Inserción en DOM** (2.5 horas):
  - Insertar variable en `variablesContainer`
  - Agregar animación de entrada (CSS)
  - Actualizar contador visual en header

**Entregables**: Creación básica de variables funcional

---

#### Día 16 - CRUD de Variables
📅 **Lunes, 26 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Edición de nombre** (2.5 horas):
  - Implementar edición inline de nombre de variable
  - Double-click o botón edit para activar
  - Validar nombre único
  - Guardar con Enter, cancelar con Escape
- [ ] **Eliminación de variable** (2.5 horas):
  - Implementar `deleteVariable(varId)`
  - Mostrar modal de confirmación
  - Limpiar `expressionComponents[varId]`
  - Remover del DOM con animación
- [ ] **Validaciones** (2.5 horas):
  - Validar nombres duplicados
  - Validar caracteres permitidos en nombre
  - Mostrar mensajes de error inline

**Entregables**: CRUD completo de variables

---

#### Día 17 - Estilos de Variable Cards
📅 **Martes, 27 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **CSS Variable Cards** (3.5 horas):
  - Estilizar variable card completa
  - Header con nombre, contador de componentes, acciones
  - Body con expression builder zone
  - Footer con preview de expresión
  - Estados: normal, hover, focused, error
- [ ] **Animaciones** (2 horas):
  - Animación de entrada (fade + slide)
  - Animación de eliminación (fade out)
  - Animación de actualización (pulse)
- [ ] **Responsive** (2 horas):
  - Ajustar cards para diferentes anchos
  - Grid de 1-2-3 columnas según viewport
  - Probar en diferentes resoluciones

**Entregables**: Variable cards estilizadas completamente

---

#### Día 18 - Expression Builder Base
📅 **Miércoles, 28 de enero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Estructura de Datos** (2 horas):
  - Definir formato de componente:
    ```javascript
    {
      id: 'comp_123',
      type: 'field|operator|value|function',
      value: '[Campo]',
      displayHtml: '<span>...</span>',
      metadata: {}
    }
    ```
  - Crear variables de estado drag
- [ ] **Funciones de Drag** (3 horas):
  - Implementar `dragField(event, fieldName)`
  - Implementar `dragOperator(event, operator)`
  - Implementar `dragValue(event, value)`
  - Agregar datos al dataTransfer
- [ ] **Drop Zone** (2.5 horas):
  - Implementar `dropIntoBuilder(event, varId)`
  - Detectar tipo de elemento arrastrado
  - Agregar visual feedback (clases CSS)

**Entregables**: Sistema de drag básico funcional

---

#### Día 19 - Expression Builder Completo
📅 **Jueves, 29 de enero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Agregar Componentes** (2.5 horas):
  - Implementar `addExprComponent(varId, type, value, html, metadata)`
  - Generar ID único con timestamp
  - Agregar al array `expressionComponents[varId]`
  - Trigger renderizado
- [ ] **Renderizado de Pills** (3 horas):
  - Implementar `renderExpression(varId)`
  - Generar HTML de pills según tipo
  - Agregar botones editar/eliminar en cada pill
  - Placeholder cuando builder está vacío
- [ ] **Eliminación de Componentes** (2 horas):
  - Implementar `deleteExprComponent(compId, varId)`
  - Confirmar antes de eliminar (opcional)
  - Actualizar renderizado

**Entregables**: Expression builder con pills funcional

---

#### Día 20 - Preview de Expresión
📅 **Viernes, 30 de enero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Construcción de String** (3 horas):
  - Implementar `updateExpressionPreview(varId)`
  - Crear `buildComponentsExpression(components)`
  - Iterar componentes y concatenar valores
  - Manejar espaciado correcto
- [ ] **UI de Preview** (2.5 horas):
  - Mostrar preview textual en footer de card
  - Estilizar área de preview
  - Agregar botón para copiar expresión
- [ ] **Testing Manual** (2 horas):
  - Probar drag & drop de diferentes tipos
  - Verificar renderizado correcto
  - Probar eliminación de componentes

**Entregables**: Preview de expresión en tiempo real

---

#### Día 21 - Testing y Refactoring Semana 3
📅 **Lunes, 2 de febrero de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja-Media

**Tareas**:
- [ ] **Testing Exhaustivo** (3.5 horas):
  - Probar crear múltiples variables
  - Probar renombrar variables
  - Probar eliminar variables
  - Probar drag & drop intensivo
  - Probar en diferentes navegadores
- [ ] **Corrección de Bugs** (2.5 horas):
  - Corregir bugs encontrados
  - Ajustar comportamientos inesperados
- [ ] **Refactoring** (1.5 horas):
  - Extraer funciones duplicadas
  - Agregar comentarios
  - Estandarizar naming

**Entregables**: Sistema de variables testeado y limpio

**🎯 Milestone 3**: Sistema de variables y expression builder funcional - **Lunes, 2 de febrero de 2026**

---

## FASE 4: PANEL DE CONFIGURACIÓN
📅 **Martes 3 de febrero - Miércoles 11 de febrero de 2026** | Días 22-28

---

#### Día 22 - Panel de Configuración Base
📅 **Martes, 3 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **HTML del Panel** (2.5 horas):
  - Crear estructura HTML inline dentro de cada variable
  - Secciones: header (título + breadcrumb), body (contenido dinámico), footer (botones)
  - Panel oculto por defecto
- [ ] **Apertura del Panel** (3 horas):
  - Implementar `openConfigPanel(functionName, input, varId)`:
    - Guardar contexto: `activeInput`, `currentFunction`, `currentConfigVarId`
    - Mostrar panel con animación slide-down
    - Generar formulario dinámico según función
- [ ] **Cierre del Panel** (2 horas):
  - Implementar `closeConfigPanel(varId)`
  - Limpiar estado global
  - Ocultar panel con animación
  - Resetear variables de contexto

**Entregables**: Panel de configuración con apertura/cierre

---

#### Día 23 - Estilos del Panel
📅 **Miércoles, 4 de febrero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **CSS Panel Base** (3 horas):
  - Estilizar contenedor del panel
  - Header con título y breadcrumb
  - Body con scroll si contenido excede
  - Footer con botones Aceptar/Cancelar
- [ ] **Animaciones** (2 horas):
  - Animación slide-down para apertura
  - Animación slide-up para cierre
  - Transiciones suaves
- [ ] **Estados** (2.5 horas):
  - Estado colapsado
  - Estado expandido
  - Estado hover en elementos interactivos
  - Estado disabled durante procesamiento

**Entregables**: Panel estilizado completamente

---

#### Día 24 - Mini-Builders Base
📅 **Jueves, 5 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Generación de Mini-Builders** (3.5 horas):
  - Crear función `generateMiniBuilder(paramId, label, placeholder, includeBreadcrumb)`
  - Generar ID único: `miniBuilder_level{N}_param{M}`
  - Crear HTML con label, drop zone, breadcrumb opcional
  - Agregar al DOM dentro del panel
- [ ] **Estructura de Datos** (2 horas):
  - Crear `miniBuilderComponents = {}` para almacenar componentes
  - Estructura: `miniBuilderComponents[builderId] = []`
- [ ] **Estilos Mini-Builder** (2 horas):
  - Pills al 80% del tamaño normal
  - Drop zone compacta
  - Placeholder descriptivo

**Entregables**: Generación de mini-builders funcional

---

#### Día 25 - Mini-Builders Drag & Drop
📅 **Viernes, 6 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Drop en Mini-Builder** (3 horas):
  - Implementar `dropIntoMiniBuilder(event, builderId)`
  - Detectar tipo de elemento arrastrado
  - Agregar a `miniBuilderComponents[builderId]`
- [ ] **CRUD de Componentes** (2.5 horas):
  - Implementar `addMiniComponent(builderId, type, value, html)`
  - Implementar `deleteMiniComponent(compId, builderId)`
  - Actualizar renderizado
- [ ] **Renderizado** (2 horas):
  - Crear `renderMiniBuilder(builderId)`
  - Generar pills compactas
  - Placeholder cuando vacío

**Entregables**: Mini-builders con drag & drop funcional

---

#### Día 26 - Botón Insertar Valor
📅 **Lunes, 9 de febrero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Botón en Mini-Builder** (2 horas):
  - Agregar botón "Insertar Valor" en cada mini-builder
  - Posicionar junto a drop zone
  - Estilizar botón
- [ ] **Modal de Valor** (3.5 horas):
  - Crear modal para ingresar valores literales
  - Input para números
  - Input para textos (con quotes automáticas)
  - Validación según contexto esperado
- [ ] **Inserción de Valor** (2 horas):
  - Implementar inserción de valor como componente tipo "value"
  - Formatear según tipo (número vs string)
  - Cerrar modal y actualizar mini-builder

**Entregables**: Sistema de inserción de valores funcional

---

#### Día 27 - Formularios de Funciones Base
📅 **Martes, 10 de febrero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Generator de Formularios** (2.5 horas):
  - Crear función `generateFunctionForm(functionName)`
  - Implementar switch case por función
  - Retornar HTML del formulario
- [ ] **Recolección de Parámetros** (2.5 horas):
  - Implementar `collectParams()`
  - Iterar mini-builders del formulario actual
  - Construir array de parámetros
  - Manejar parámetros vacíos
- [ ] **Aceptar Configuración** (2.5 horas):
  - Implementar `acceptFunctionConfig(varId)`
  - Recopilar parámetros
  - Construir expresión: `#NombreFuncion(param1,param2)#`
  - Crear metadata
  - Agregar al expression builder
  - Cerrar panel

**Entregables**: Sistema base de formularios de funciones

---

#### Día 28 - Testing Panel y Buffer
📅 **Miércoles, 11 de febrero de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja-Media

**Tareas**:
- [ ] **Testing del Panel** (3.5 horas):
  - Probar apertura/cierre múltiples veces
  - Probar mini-builders drag & drop
  - Probar inserción de valores
  - Probar en diferentes navegadores
- [ ] **Corrección de Bugs** (2.5 horas):
  - Corregir bugs encontrados
  - Ajustar comportamientos
  - Optimizar rendimiento
- [ ] **Documentación** (1.5 horas):
  - Documentar flujo del panel
  - Agregar comentarios en código

**Entregables**: Panel testeado y documentado

**🎯 Milestone 4**: Panel de configuración y mini-builders funcionales - **Miércoles, 11 de febrero de 2026**

---

## FASE 5: FUNCIONES SIMPLES
📅 **Jueves 12 de febrero - Viernes 20 de febrero de 2026** | Días 29-35

---

#### Día 29 - Funciones Matemáticas (Parte 1)
📅 **Jueves, 12 de febrero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Función Mínimo** (2.5 horas):
  - Crear formulario con 2 mini-builders
  - Labels: "Primer valor", "Segundo valor"
  - Construir expresión: `#Minimo(param1,param2)#`
- [ ] **Función Máximo** (2.5 horas):
  - Crear formulario con 2 mini-builders
  - Labels: "Primer valor", "Segundo valor"
  - Construir expresión: `#Maximo(param1,param2)#`
- [ ] **Testing** (2.5 horas):
  - Probar ambas funciones
  - Verificar expresiones generadas
  - Probar con diferentes tipos de valores

**Entregables**: Funciones Mínimo y Máximo operativas

---

#### Día 30 - Funciones Matemáticas (Parte 2)
📅 **Viernes, 13 de febrero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Función Suma** (2.5 horas):
  - Crear formulario con N mini-builders
  - Botón "Agregar Campo" para agregar más
  - Construir expresión: `#Suma(p1,p2,p3,...)#`
- [ ] **Función Promedio** (2.5 horas):
  - Similar a Suma con N mini-builders
  - Construir expresión: `#Promedio(p1,p2,...)#`
- [ ] **Función Conteo** (2.5 horas):
  - Similar estructura
  - Construir expresión: `#Conteo(p1,p2,...)#`

**Entregables**: Funciones Suma, Promedio y Conteo operativas

---

#### Día 31 - Funciones de Texto
📅 **Lunes, 16 de febrero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Función Conteo Caracteres** (3 horas):
  - Crear formulario con 1 mini-builder
  - Label: "Texto a contar"
  - Construir expresión: `#ConteoCaracteres(param1)#`
- [ ] **Función Expresión Regular** (3 horas):
  - Crear formulario con 2 mini-builders
  - Labels: "Patrón regex", "Texto a evaluar"
  - Construir expresión: `#ExpresionRegular(patron,texto)#`
- [ ] **Testing** (1.5 horas):
  - Probar ambas funciones
  - Verificar expresiones

**Entregables**: Funciones de texto operativas

---

#### Día 32 - Función Si Entonces
📅 **Martes, 17 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Formulario Condicional** (3.5 horas):
  - Crear formulario con 3 secciones:
    - "Condición" (mini-builder con breadcrumb)
    - "Valor si es Verdadero" (mini-builder con breadcrumb)
    - "Valor si es Falso" (mini-builder con breadcrumb)
  - Estilizar con separadores visuales
- [ ] **Recolección de 3 Parámetros** (2 horas):
  - Adaptar `collectParams()` para mantener orden
  - Construir: `#SiEntonces(condicion,verdadero,falso)#`
- [ ] **Testing** (2 horas):
  - Probar con valores simples
  - Verificar expresión generada
  - Probar casos edge

**Entregables**: Función Si entonces operativa (sin anidación)

---

#### Día 33 - Función Calcular Edad (Blocks)
📅 **Miércoles, 18 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Sistema de Blocks** (3.5 horas):
  - Crear estructura `droppedBlocks = []`
  - Crear zona de drop para bloques
  - Implementar `dropBlock(event)`
  - Agregar bloques con orden secuencial
- [ ] **Renderizado de Blocks** (2.5 horas):
  - Implementar `renderBlocks()`
  - Ordenar por orden
  - Generar cards numerados (1, 2, 3, 4)
  - Mostrar etiquetas: "Fecha", "Operador", "Valor", "Formato"
  - Implementar `deleteBlock(blockId)` con re-numeración
- [ ] **Construcción de Expresión** (1.5 horas):
  - Crear `buildCalculaEdadExpression()`
  - Formato: `#CalculaEdad([p1],[p2],[p3],YYYY)#`

**Entregables**: Función Calcular edad con blocks funcional

---

#### Día 34 - Testing de Funciones
📅 **Jueves, 19 de febrero de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Testing Exhaustivo** (4.5 horas):
  - Probar todas las funciones implementadas (8 total)
  - Verificar construcción de expresiones
  - Probar apertura/cierre múltiple de paneles
  - Probar drag & drop intensivo
  - Verificar limpieza de estado
- [ ] **Corrección de Bugs** (2.5 horas):
  - Corregir bugs encontrados
  - Ajustar comportamientos
- [ ] **Documentación** (0.5 horas):
  - Documentar cada función con ejemplos

**Entregables**: Todas las funciones simples testeadas

---

#### Día 35 - Buffer y Optimización Funciones
📅 **Viernes, 20 de febrero de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Refactoring** (3 horas):
  - Extraer código duplicado entre funciones
  - Crear helpers reutilizables
  - Optimizar generación de formularios
- [ ] **UX Improvements** (2.5 horas):
  - Mejorar tooltips y ayudas
  - Agregar validaciones visuales
  - Mejorar mensajes de error
- [ ] **Testing Final** (2 horas):
  - Re-testear después de refactoring
  - Verificar que todo sigue funcionando

**Entregables**: Funciones simples optimizadas

**🎯 Milestone 5**: Funciones simples completas - **Viernes, 20 de febrero de 2026**

---

## FASE 6: FUNCIONES ANIDADAS
📅 **Lunes 23 de febrero - Martes 3 de marzo de 2026** | Días 36-42

---

#### Día 36 - Navigation Stack (Diseño)
📅 **Lunes, 23 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Muy Alta

**Tareas**:
- [ ] **Diseño del Stack** (3 horas):
  - Diseñar estructura `navigationStack`:
    ```javascript
    {
      currentLevel: 0,
      levels: [{
        functionName,
        parentBuilderId,
        functionId,
        varId,
        miniBuilderStates: {},
        savedHTML: null
      }]
    }
    ```
  - Documentar flujo de navegación
  - Crear diagrama de estados
- [ ] **Inicialización** (2 horas):
  - Implementar `initNavigationStack(varId)`
  - Crear nivel 0 al abrir panel
  - Reset al cerrar panel
- [ ] **Helpers** (2.5 horas):
  - Implementar `getCurrentLevel()`
  - Implementar `getLevelCount()`
  - Implementar `isNestedLevel()`

**Entregables**: Diseño y estructura del navigation stack

---

#### Día 37 - Crear Función Anidada
📅 **Martes, 24 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Muy Alta

**Tareas**:
- [ ] **Botón Función en Mini-Builder** (2 horas):
  - Agregar botón "Función" en cada mini-builder
  - Al hacer click, mostrar lista de funciones disponibles
  - Seleccionar función inicia anidación
- [ ] **createNestedFunction** (4 horas):
  - Implementar `createNestedFunction(functionName, parentBuilderId, varId)`:
    - **CRÍTICO**: Calcular `levelIndex = navigationStack.levels.length` ANTES de push
    - Crear nuevo nivel en stack
    - Generar functionId único
    - Insertar placeholder en mini-builder padre
    - Navegar al nuevo nivel
- [ ] **Testing Básico** (1.5 horas):
  - Probar creación de nivel anidado
  - Verificar stack state

**Entregables**: Creación de funciones anidadas funcional

---

#### Día 38 - Guardar y Restaurar Estado
📅 **Miércoles, 25 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Muy Alta

**Tareas**:
- [ ] **Guardar Estado** (3.5 horas):
  - Implementar `saveCurrentLevelState()`:
    - Guardar HTML completo del panel
    - Filtrar mini-builders del nivel actual por prefijo
    - Guardar componentes en `miniBuilderStates`
- [ ] **Restaurar Estado** (3 horas):
  - Implementar `restoreLevelState(level)`:
    - Restaurar HTML guardado
    - Restaurar componentes de mini-builders
    - Actualizar breadcrumbs
- [ ] **Testing** (1 hora):
  - Probar guardar/restaurar entre niveles
  - Verificar integridad de datos

**Entregables**: Sistema de guardar/restaurar estado

---

#### Día 39 - Navegación entre Niveles
📅 **Jueves, 26 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Muy Alta

**Tareas**:
- [ ] **navigateToLevel** (3.5 horas):
  - Implementar `navigateToLevel(targetLevel)`:
    - Guardar estado del nivel actual
    - Si va a nivel padre: actualizar expresión del hijo
    - Cambiar `currentLevel = targetLevel`
    - Restaurar o renderizar nivel objetivo
- [ ] **buildLevelExpression** (2.5 horas):
  - Implementar `buildLevelExpression(level)`
  - Construir expresión completa del nivel
  - Manejar parámetros vacíos
- [ ] **Breadcrumb General** (1.5 horas):
  - Crear breadcrumb de navegación en header
  - Implementar click para saltar niveles
  - Actualizar al navegar

**Entregables**: Navegación entre niveles funcional

---

#### Día 40 - Aceptar Todos los Niveles
📅 **Viernes, 27 de febrero de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Muy Alta

**Tareas**:
- [ ] **acceptAllNestedLevels** (5 horas):
  - Implementar `acceptAllNestedLevels(varId)`:
    - **CRÍTICO**: Restaurar mini-builders de TODOS los niveles
    - Procesar del más profundo al más superficial
    - Para cada nivel anidado: actualizar componente en padre
    - Para nivel raíz: insertar en expression builder
    - Limpiar stack y cerrar panel
- [ ] **Casos Edge** (2.5 horas):
  - Manejar múltiples niveles vacíos
  - Manejar cancelación a mitad
  - Manejar errores de estructura

**Entregables**: Proceso de aceptar anidación completo

**🔍 Code Review**: Revisar `acceptAllNestedLevels` - función crítica

---

#### Día 41 - Breadcrumbs Individuales
📅 **Lunes, 2 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media-Alta

**Tareas**:
- [ ] **updateMiniBreadcrumb** (3.5 horas):
  - Crear función `updateMiniBreadcrumb(builderId)`:
    - Parsear builderId para extraer levelIndex y paramIndex
    - Filtrar niveles relevantes
    - Seguir cadena de `parentBuilderId`
    - Construir cadena: "Si entonces > Condición > Mínimo > Param 1"
- [ ] **getParameterLabel** (2 horas):
  - Crear función `getParameterLabel(parentBuilderId, parentFunctionName)`
  - Mapear número de parámetro a etiqueta humana
  - Ejemplos: param1 → "Condición", param2 → "Verdadero"
- [ ] **Integración** (2 horas):
  - Integrar en `renderCurrentConfigLevel()`
  - Loop por mini-builders del nivel
  - Llamar `updateMiniBreadcrumb` para cada uno

**Entregables**: Breadcrumbs individuales funcionales

---

#### Día 42 - Testing de Anidación
📅 **Martes, 3 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Testing Exhaustivo** (4.5 horas):
  - Probar 2 niveles de anidación
  - Probar 3 niveles de anidación
  - Probar "Si entonces" con funciones anidadas en los 3 params
  - Probar navegación entre niveles múltiples veces
  - Probar aceptar/cancelar en diferentes niveles
- [ ] **Corrección de Bugs** (2.5 horas):
  - Corregir bugs encontrados
  - Ajustar cálculo de levelIndex si hay problemas
- [ ] **Documentación** (0.5 horas):
  - Documentar flujo de anidación

**Entregables**: Sistema de anidación testeado

**🎯 Milestone 6**: Funciones anidadas completas - **Martes, 3 de marzo de 2026**

---

## FASE 7: LOGIC EXPRESSION Y PERSISTENCIA
📅 **Miércoles 4 de marzo - Jueves 12 de marzo de 2026** | Días 43-49

---

#### Día 43 - Logic Expression Builder
📅 **Miércoles, 4 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Estructura de Datos** (2 horas):
  - Crear `logicComponents = []`
  - Diseñar panel fijo inferior
  - Estilizar drop zone grande
- [ ] **Drag de Variables** (2.5 horas):
  - Implementar drag desde header de variable card
  - Implementar `dropIntoLogicExpression(event)`
  - Agregar variable a `logicComponents`
- [ ] **Operadores y Paréntesis** (3 horas):
  - Agregar operadores: AND, OR, NOT
  - Agregar paréntesis: (, )
  - Implementar drag de cada uno

**Entregables**: Logic expression builder base

---

#### Día 44 - Logic Expression Completo
📅 **Jueves, 5 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Renderizado** (3 horas):
  - Implementar `renderLogicExpression()`
  - Pills de variable (morado)
  - Pills de operador (rosa)
  - Pills de paréntesis (gris)
  - Botones eliminar
- [ ] **Construcción de String** (2.5 horas):
  - Implementar `updateLogicExpressionString()`
  - Construir: `{Variable 1} AND {Variable 2}`
  - Manejar espaciado correcto
- [ ] **CRUD** (2 horas):
  - Implementar `deleteLogicComponent(index)`
  - Implementar reordenamiento (opcional)

**Entregables**: Logic expression builder completo

---

#### Día 45 - Guardar Reglas
📅 **Viernes, 6 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Serialización** (4 horas):
  - Implementar `guardarRegla()`:
    - Validar mínimo 1 variable
    - Recopilar variables con nombres y expresiones
    - Serializar `expressionComponents` a JSON
    - Serializar `logicComponents` a JSON
    - Serializar metadata de funciones
  - Crear objeto JSON completo
- [ ] **Llamada Backend** (2 horas):
  - Llamar a WebMethod con AJAX
  - Manejar respuesta success/error
  - Mostrar toast con resultado
- [ ] **UI** (1.5 horas):
  - Botón "Guardar" en toolbar
  - Shortcut Ctrl+S
  - Spinner durante guardado

**Entregables**: Guardado de reglas funcional

---

#### Día 46 - Parser de Expresiones
📅 **Lunes, 9 de marzo de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Parser Manual** (5.5 horas):
  - Crear `parseExpressionToComponents(expression)`:
    - **CRÍTICO**: Parser manual carácter por carácter
    - Estados: normal, in_field, in_function, in_value
    - Depth counter de paréntesis para funciones
    - Detectar cierre de campos `]`
    - Detectar números vs strings
  - Manejar funciones anidadas
- [ ] **Testing del Parser** (2 horas):
  - Testear expresiones simples
  - Testear funciones simples
  - Testear funciones anidadas 2-3 niveles

**Entregables**: Parser robusto para expresiones

---

#### Día 47 - Cargar Reglas
📅 **Martes, 10 de marzo de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **cargarRegla** (3.5 horas):
  - Implementar `cargarRegla(id)`:
    - Llamar WebMethod
    - Deserializar JSON
    - Limpiar estado actual
  - Implementar `loadVariable(variableData)`:
    - Crear variable card
    - Deserializar componentes
    - Renderizar expression
- [ ] **Cargar Logic Expression** (2 horas):
  - Deserializar `logicComponents`
  - Renderizar expresión lógica
- [ ] **Testing** (2 horas):
  - Probar cargar reglas simples
  - Probar cargar reglas con funciones

**Entregables**: Carga de reglas funcional

---

#### Día 48 - Editar Funciones
📅 **Miércoles, 11 de marzo de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **loadParamsIntoConfigPanel** (3.5 horas):
  - Implementar carga de parámetros al panel:
    - Detectar tipo de función
    - Para mini-builders: parsear y recrear componentes
    - Para "Calcular edad": restaurar blocks
    - Para anidadas: llamar recursivamente
- [ ] **editExprComponent** (3 horas):
  - Implementar `editExprComponent(compId, varId)`:
    - Encontrar componente
    - Marcar modo edición
    - Abrir panel con parámetros cargados
    - Al aceptar: actualizar (no crear nuevo)
- [ ] **Testing** (1 hora):
  - Probar edición de funciones
  - Verificar actualización correcta

**Entregables**: Edición de funciones funcional

---

#### Día 49 - UI Listado y Testing Persistencia
📅 **Jueves, 12 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **UI de Listado** (3.5 horas):
  - Crear modal/página de listado de reglas
  - Tabla con: ID, Nombre, Fecha, Acciones
  - Botones: Editar, Eliminar, Nuevo
  - Búsqueda/filtrado básico
- [ ] **Testing de Persistencia** (3 horas):
  - Probar guardar regla simple
  - Probar guardar con funciones
  - Probar guardar con anidación
  - Probar cargar cada tipo
  - Verificar integridad en BD
- [ ] **Corrección de Bugs** (1 hora):
  - Corregir bugs de persistencia

**Entregables**: Sistema de persistencia completo

**🎯 Milestone 7**: Persistencia completa - Sistema end-to-end - **Jueves, 12 de marzo de 2026**

---

## FASE 8: TESTING Y OPTIMIZACIÓN
📅 **Viernes 13 de marzo - Lunes 23 de marzo de 2026** | Días 50-56

---

#### Día 50 - Testing Funcional Completo
📅 **Viernes, 13 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Testing Sistemático** (5.5 horas):
  - Variables: CRUD completo
  - Expression Builder: Drag & drop
  - Funciones Matemáticas: 5 funciones
  - Funciones de Texto: 2 funciones
  - Si entonces: 3 parámetros
  - Calcular edad: Sistema de blocks
  - Anidación: 2-3 niveles
  - Navegación: Breadcrumbs
  - Logic Expression: Variables y operadores
  - Persistencia: CRUD completo
- [ ] **Casos Edge** (2 horas):
  - Parámetros vacíos
  - Eliminación de componentes en uso
  - Cancelar a mitad de configuración
  - Navegación rápida

**Entregables**: Lista de casos de prueba ejecutados

---

#### Día 51 - Testing Cross-Browser
📅 **Lunes, 16 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Chrome** (2 horas):
  - Testing completo de funcionalidad
  - Verificar drag & drop
  - Verificar animaciones
- [ ] **Edge** (2 horas):
  - Testing completo de funcionalidad
  - Verificar compatibilidad
- [ ] **Firefox** (2 horas):
  - Testing completo de funcionalidad
  - Verificar compatibilidad
- [ ] **Resoluciones** (1.5 horas):
  - 1920x1080
  - 1366x768
  - 1280x720

**Entregables**: Reporte de compatibilidad por navegador

---

#### Día 52 - Testing de Performance
📅 **Martes, 17 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Mediciones** (3 horas):
  - Medir renderizado con 10+ variables
  - Medir anidación profunda (5+ niveles)
  - Medir tiempo de guardado/carga
  - Identificar cuellos de botella
- [ ] **Optimización** (3.5 horas):
  - Optimizar loops pesados
  - Usar `requestAnimationFrame` si necesario
  - Minimizar reflows/repaints
  - Implementar debounce donde aplique
- [ ] **Re-Testing** (1 hora):
  - Verificar mejoras de performance

**Entregables**: Sistema optimizado para performance

---

#### Día 53 - Corrección de Bugs
📅 **Miércoles, 18 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Bugs Críticos** (3 horas):
  - Corregir todos los bugs críticos encontrados
  - Re-testear después de cada corrección
- [ ] **Bugs de Alta Prioridad** (2.5 horas):
  - Corregir bugs de alta prioridad
  - Verificar regresiones
- [ ] **Bugs de Media Prioridad** (2 horas):
  - Corregir bugs restantes si hay tiempo
  - Documentar bugs diferidos

**Entregables**: Sistema sin bugs críticos

---

#### Día 54 - Accesibilidad y UX Final
📅 **Jueves, 19 de marzo de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Accesibilidad** (3 horas):
  - Agregar `aria-label` en botones sin texto
  - Verificar contraste de colores (WCAG AA)
  - Probar navegación con teclado
  - Agregar focus states visibles
- [ ] **UX Improvements** (3 horas):
  - Mejorar mensajes de error
  - Agregar tooltips faltantes
  - Mejorar feedback visual
- [ ] **Testing Final** (1.5 horas):
  - Verificar mejoras de accesibilidad
  - Testing de experiencia de usuario

**Entregables**: Sistema accesible y pulido

---

#### Día 55 - Documentación Técnica
📅 **Viernes, 20 de marzo de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **CLAUDE.md** (2 horas):
  - Actualizar con cambios realizados
  - Documentar arquitectura final
  - Documentar decisiones de diseño
- [ ] **JSDoc** (2.5 horas):
  - Documentar funciones principales
  - Agregar ejemplos en comentarios
  - Documentar navigation stack
- [ ] **Diagramas** (3 horas):
  - Crear diagrama de flujo de navegación
  - Crear diagrama de estructura de datos
  - Crear diagrama de componentes

**Entregables**: Documentación técnica completa

---

#### Día 56 - Documentación de Usuario
📅 **Lunes, 23 de marzo de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **README** (2.5 horas):
  - Crear README con instrucciones de uso
  - Agregar screenshots
  - Documentar requisitos
- [ ] **Guía de Usuario** (3.5 horas):
  - Crear guía rápida paso a paso
  - Documentar cada función con ejemplos
  - Agregar tips y mejores prácticas
- [ ] **FAQ** (1.5 horas):
  - Crear lista de preguntas frecuentes
  - Documentar troubleshooting común

**Entregables**: Documentación de usuario completa

**🎯 Milestone 8**: Testing y documentación completados - **Lunes, 23 de marzo de 2026**

---

## FASE 9: DEPLOYMENT
📅 **Martes 24 de marzo - Miércoles 1 de abril de 2026** | Días 57-63

---

#### Día 57 - Preparación para Deployment
📅 **Martes, 24 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Scripts SQL Producción** (2.5 horas):
  - Revisar y finalizar scripts de BD
  - Crear script de rollback
  - Documentar orden de ejecución
- [ ] **Web.config Producción** (2 horas):
  - Configurar connection strings
  - Configurar settings de producción
  - Remover settings de debug
- [ ] **Build de Release** (3 horas):
  - Compilar en modo Release
  - Minimizar JS y CSS
  - Verificar referencias

**Entregables**: Archivos listos para deployment

---

#### Día 58 - Deployment a Staging
📅 **Miércoles, 25 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Ejecución de Scripts** (2 horas):
  - Ejecutar scripts SQL en staging
  - Verificar tablas creadas
  - Insertar datos de prueba
- [ ] **Publicación de Archivos** (2.5 horas):
  - Publicar a servidor de staging
  - Verificar estructura de carpetas
  - Verificar permisos
- [ ] **Configuración** (1.5 horas):
  - Configurar Web.config de staging
  - Verificar connection strings
  - Verificar referencias
- [ ] **Smoke Testing** (1.5 horas):
  - Verificar acceso a la página
  - Verificar conexión a BD
  - Probar funcionalidad básica

**Entregables**: Aplicación desplegada en staging

---

#### Día 59 - Testing en Staging
📅 **Jueves, 26 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Testing Funcional** (4 horas):
  - Testing end-to-end en staging
  - Probar todos los flujos principales
  - Verificar persistencia en BD real
- [ ] **Testing de Performance** (2 horas):
  - Verificar tiempos de respuesta
  - Verificar carga de archivos
  - Identificar problemas de servidor
- [ ] **Corrección de Problemas** (1.5 horas):
  - Corregir problemas encontrados
  - Re-deploy si necesario

**Entregables**: Staging testeado y funcional

---

#### Día 60 - UAT (User Acceptance Testing)
📅 **Viernes, 27 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Preparación UAT** (1.5 horas):
  - Preparar casos de prueba para usuarios
  - Crear datos de ejemplo
  - Preparar documentación de soporte
- [ ] **Sesión UAT** (4 horas):
  - Ejecutar sesión con usuarios finales
  - Documentar feedback
  - Documentar bugs encontrados
- [ ] **Análisis de Feedback** (2 horas):
  - Priorizar feedback recibido
  - Identificar cambios críticos
  - Planificar correcciones

**Entregables**: Reporte de UAT con feedback

---

#### Día 61 - Correcciones Post-UAT
📅 **Lunes, 30 de marzo de 2026**
⏱️ **7.5 horas** | 🟡 Complejidad: Media

**Tareas**:
- [ ] **Correcciones Críticas** (4 horas):
  - Implementar correcciones críticas del UAT
  - Re-testear cada corrección
- [ ] **Mejoras de UX** (2.5 horas):
  - Implementar mejoras de UX solicitadas
  - Ajustar textos y mensajes
- [ ] **Re-Deploy a Staging** (1 hora):
  - Deploy de correcciones
  - Verificación rápida

**Entregables**: Correcciones post-UAT implementadas

---

#### Día 62 - Deployment a Producción
📅 **Martes, 31 de marzo de 2026**
⏱️ **7.5 horas** | 🔴 Complejidad: Alta

**Tareas**:
- [ ] **Backup** (1 hora):
  - Backup de BD de producción
  - Backup de archivos actuales
- [ ] **Ejecución de Scripts** (1.5 horas):
  - Ejecutar scripts SQL en producción
  - Verificar ejecución correcta
- [ ] **Publicación** (2 horas):
  - Publicar archivos a producción
  - Verificar estructura
  - Verificar permisos
- [ ] **Verificación** (2 horas):
  - Smoke testing en producción
  - Verificar funcionalidad crítica
  - Verificar conexión a BD
- [ ] **Monitoreo** (1 hora):
  - Configurar alertas si disponible
  - Monitorear logs iniciales

**Entregables**: Sistema desplegado en producción

---

#### Día 63 - Monitoreo y Cierre
📅 **Miércoles, 1 de abril de 2026**
⏱️ **7.5 horas** | 🟢 Complejidad: Baja

**Tareas**:
- [ ] **Monitoreo Post-Deploy** (3 horas):
  - Monitorear sistema en producción
  - Revisar logs de errores
  - Atender incidentes si los hay
- [ ] **Documentación Final** (2 horas):
  - Documentar proceso de deployment
  - Documentar configuraciones de servidor
  - Crear guía de rollback
- [ ] **Cierre del Proyecto** (1.5 horas):
  - Demostración del sistema
  - Entregar documentación
  - Transferencia de conocimiento
- [ ] **Backlog** (1 hora):
  - Crear lista de mejoras futuras
  - Documentar features diferidos
  - Planificar próximas versiones

**Entregables**: Sistema en producción y proyecto cerrado

**🎯 Milestone Final**: Sistema completo desplegado y documentado - **Miércoles, 1 de abril de 2026**

---

## RESUMEN EJECUTIVO DEL CRONOGRAMA

### Calendario Visual por Semanas

| Semana | Lunes | Martes | Miércoles | Jueves | Viernes | Días |
|--------|-------|--------|-----------|--------|---------|------|
| Sem 1 (05-09 Ene) | Día 1 | Día 2 | Día 3 | Día 4 | Día 5 | 1-5 |
| Sem 2 (12-16 Ene) | Día 6 | Día 7 ✅M1 | Día 8 | Día 9 | Día 10 | 6-10 |
| Sem 3 (19-23 Ene) | Día 11 | Día 12 | Día 13 | Día 14 ✅M2 | Día 15 | 11-15 |
| Sem 4 (26-30 Ene) | Día 16 | Día 17 | Día 18 | Día 19 | Día 20 | 16-20 |
| Sem 5 (02-06 Feb) | Día 21 ✅M3 | Día 22 | Día 23 | Día 24 | Día 25 | 21-25 |
| Sem 6 (09-13 Feb) | Día 26 | Día 27 | Día 28 ✅M4 | Día 29 | Día 30 | 26-30 |
| Sem 7 (16-20 Feb) | Día 31 | Día 32 | Día 33 | Día 34 | Día 35 ✅M5 | 31-35 |
| Sem 8 (23-27 Feb) | Día 36 | Día 37 | Día 38 | Día 39 | Día 40 | 36-40 |
| Sem 9 (02-06 Mar) | Día 41 | Día 42 ✅M6 | Día 43 | Día 44 | Día 45 | 41-45 |
| Sem 10 (09-13 Mar) | Día 46 | Día 47 | Día 48 | Día 49 ✅M7 | Día 50 | 46-50 |
| Sem 11 (16-20 Mar) | Día 51 | Día 52 | Día 53 | Día 54 | Día 55 | 51-55 |
| Sem 12 (23-27 Mar) | Día 56 ✅M8 | Día 57 | Día 58 | Día 59 | Día 60 | 56-60 |
| Sem 13 (30 Mar-03 Abr) | Día 61 | Día 62 | Día 63 ✅MF | - | - | 61-63 |

### Milestones

| Milestone | Descripción | Fecha |
|-----------|-------------|-------|
| ✅ M1 | Fundamentos visuales | Mar 13-Ene-2026 |
| ✅ M2 | Backend completo | Jue 22-Ene-2026 |
| ✅ M3 | Sistema de variables | Lun 02-Feb-2026 |
| ✅ M4 | Panel de configuración | Mié 11-Feb-2026 |
| ✅ M5 | Funciones simples | Vie 20-Feb-2026 |
| ✅ M6 | Funciones anidadas | Mar 03-Mar-2026 |
| ✅ M7 | Persistencia completa | Jue 12-Mar-2026 |
| ✅ M8 | Testing y documentación | Lun 23-Mar-2026 |
| ✅ MF | Deployment producción | Mié 01-Abr-2026 |

### Resumen de Horas

| Fase | Días | Horas |
|------|------|-------|
| Fase 1: Fundamentos | 7 | 52.5 |
| Fase 2: Backend | 7 | 52.5 |
| Fase 3: Variables | 7 | 52.5 |
| Fase 4: Panel Config | 7 | 52.5 |
| Fase 5: Funciones Simples | 7 | 52.5 |
| Fase 6: Anidación | 7 | 52.5 |
| Fase 7: Persistencia | 7 | 52.5 |
| Fase 8: Testing | 7 | 52.5 |
| Fase 9: Deployment | 7 | 52.5 |
| **TOTAL** | **63** | **472.5** |

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
- **QA Tester** (Fase 8-9, 50%)
- **Tech Lead** (revisiones, 20%)

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Complejidad de anidación** | Alta | Alto | Implementar navigation stack desde el inicio, testing continuo |
| **Bugs en parser** | Media | Alto | Parser manual robusto con tests exhaustivos |
| **Problemas de compatibilidad** | Media | Medio | Testing cross-browser temprano |
| **Scope creep** | Alta | Medio | Definir MVP claro, backlog para post-launch |
| **Problemas de deployment** | Baja | Alto | Staging environment, scripts de rollback |

---

## Criterios de Éxito

### Funcionales
- [ ] CRUD de variables completo
- [ ] Drag & drop fluido y sin errores
- [ ] Todas las funciones implementadas (8 funciones)
- [ ] Funciones anidadas (mínimo 3 niveles)
- [ ] Guardar/Cargar/Editar reglas completas
- [ ] Logic expression builder funcional
- [ ] 0 bugs críticos

### De Negocio
- [ ] Reducción de errores de sintaxis >80%
- [ ] Reducción de tiempo de configuración >60%
- [ ] Interfaz intuitiva (usuario promedio puede usar sin capacitación extensa)

### De Calidad
- [ ] Code coverage básico documentado
- [ ] Documentación técnica completa
- [ ] Documentación de usuario completa
- [ ] Performance aceptable (<2s para operaciones comunes)

---

## Post-Launch (Backlog)

- Migración automática de reglas legacy
- Auto-save en localStorage
- Undo/Redo
- Snippets de expresiones comunes
- Testing automatizado
- Optimización avanzada de performance
- Modo oscuro
- Exportar/Importar reglas

---

## Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Fecha de Inicio** | Lunes, 5 de enero de 2026 |
| **Fecha de Fin** | Miércoles, 1 de abril de 2026 |
| **Duración** | 63 días laborales (13 semanas) |
| **Días por Semana** | 5 días (Lunes a Viernes) |
| **Jornada** | 7.5 horas por día |
| **Esfuerzo Total** | 472.5 horas |
| **Versión** | 1.0 - MVP |
| **Estado** | Plan de Implementación Aprobado |
