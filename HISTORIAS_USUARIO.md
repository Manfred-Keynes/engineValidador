# Historias de Usuario Técnicas - Editor Visual de Reglas

## Formato de HU

Cada HU incluye:
- **ID**: Identificador único
- **Título**: Descripción corta
- **Estimación**: Story Points (1, 2, 3, 5, 8)
- **Prioridad**: Crítica, Alta, Media, Baja
- **Dependencias**: IDs de HUs previas requeridas
- **Descripción Técnica**: Qué se implementa exactamente
- **Criterios de Aceptación**: Checklist técnica específica
- **Tareas de Implementación**: Lista detallada de funciones, archivos, código a escribir
- **Definición de Done**: Qué debe estar completo para cerrar la HU
- **Notas de Implementación**: Detalles técnicos, gotchas, warnings

---

## Sprint 1 - Fundamentos y Variables (Días 1-5)

### HU-001: Configuración de Proyecto Base

**Estimación**: 2 SP | **Prioridad**: Crítica | **Dependencias**: Ninguna

#### Descripción Técnica
Crear la estructura de archivos del proyecto, configurar dependencias, y establecer el layout HTML base con todos los contenedores principales requeridos para el editor.

#### Criterios de Aceptación
- [ ] Archivo `EditorReglas.aspx` creado con DOCTYPE HTML5
- [ ] Archivo `EditorReglas.aspx.cs` creado con clase code-behind
- [ ] Archivo `EditorReglas.aspx.designer.cs` generado
- [ ] Archivo `Scripts/EditorReglas.js` creado (vacío con comentario de estructura)
- [ ] Archivo `Content/EditorReglas.css` creado (vacío con comentario de estructura)
- [ ] NuGet package `Newtonsoft.Json` v13.0+ instalado y referenciado
- [ ] Página accesible en `/EditorReglas.aspx` sin errores 404
- [ ] Console del navegador sin errores al cargar la página
- [ ] Layout HTML contiene los 3 contenedores principales: `#sidebar`, `#variablesContainer`, `#logicExpressionPanel`

#### Tareas de Implementación

**Tarea 1.1**: Crear estructura de archivos
```
- Crear carpeta Scripts/ si no existe
- Crear carpeta Content/ si no existe
- Crear EditorReglas.aspx en raíz del proyecto
- Crear EditorReglas.aspx.cs en raíz del proyecto
- Crear Scripts/EditorReglas.js
- Crear Content/EditorReglas.css
```

**Tarea 1.2**: Configurar EditorReglas.aspx
```html
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EditorReglas.aspx.cs"
    Inherits="EngineValidator.EditorReglas" %>

<!DOCTYPE html>
<html>
<head>
    <title>Editor de Reglas</title>
    <link rel="stylesheet" href="Content/EditorReglas.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="editorContainer">
        <!-- Toolbar -->
        <div id="toolbar">
            <button id="btnGuardar" title="Guardar regla (Ctrl+S)">
                <i class="fas fa-save"></i> Guardar
            </button>
            <button id="btnCargar" title="Cargar regla">
                <i class="fas fa-folder-open"></i> Cargar
            </button>
            <input type="text" id="txtNombreRegla" placeholder="Nombre de la regla" />
        </div>

        <!-- Layout principal -->
        <div id="mainLayout">
            <!-- Sidebar izquierdo -->
            <aside id="sidebar">
                <div id="camposSection" class="sidebar-section">
                    <h3>Campos</h3>
                    <div id="camposList"></div>
                </div>
                <div id="operadoresSection" class="sidebar-section">
                    <h3>Operadores</h3>
                    <div id="operadoresList"></div>
                </div>
                <div id="funcionesSection" class="sidebar-section">
                    <h3>Funciones</h3>
                    <div id="funcionesList"></div>
                </div>
            </aside>

            <!-- Área central de variables -->
            <main id="variablesContainer">
                <div id="variablesArea">
                    <!-- Las variables se agregarán aquí dinámicamente -->
                    <div id="emptyState">
                        <i class="fas fa-plus-circle"></i>
                        <p>Haz clic en "Agregar Variable" para comenzar</p>
                    </div>
                </div>
                <button id="btnAddVariable">
                    <i class="fas fa-plus"></i> Agregar Variable
                </button>
            </main>
        </div>

        <!-- Panel inferior: Expresión lógica -->
        <footer id="logicExpressionPanel">
            <h3>Expresión Lógica Final</h3>
            <div id="logicExpressionBuilder" class="drop-zone">
                <div class="placeholder">
                    Arrastra variables y operadores lógicos aquí
                </div>
            </div>
            <div id="logicExpressionPreview"></div>
        </footer>
    </div>

    <script src="Scripts/EditorReglas.js"></script>
</body>
</html>
```

**Tarea 1.3**: Configurar EditorReglas.aspx.cs
```csharp
using System;
using System.Web.Services;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace EngineValidator
{
    public partial class EditorReglas : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Inicialización si es necesario
            }
        }

        [WebMethod]
        public static string ObtenerCamposDisponibles()
        {
            // TODO: Implementar en HU-003
            return JsonConvert.SerializeObject(new List<string>());
        }

        [WebMethod]
        public static string GuardarRegla(string jsonData)
        {
            // TODO: Implementar en HU-017
            return JsonConvert.SerializeObject(new { success = false });
        }

        [WebMethod]
        public static string CargarRegla(int id)
        {
            // TODO: Implementar en HU-018
            return JsonConvert.SerializeObject(new { success = false });
        }
    }
}
```

**Tarea 1.4**: Inicializar Scripts/EditorReglas.js
```javascript
/**
 * EditorReglas.js
 * Editor visual de reglas con drag & drop
 *
 * Estructura:
 * 1. Variables globales
 * 2. Funciones de inicialización
 * 3. Sistema de variables
 * 4. Expression builder
 * 5. Sistema de funciones
 * 6. Logic expression builder
 * 7. Persistencia
 * 8. Utilidades
 */

// ========================================
// 1. VARIABLES GLOBALES
// ========================================

// Contadores
let variablesCounter = 0;

// Estado drag & drop
let draggedField = null;
let draggedOperator = null;
let draggedFunctionName = null;
let draggedVariableId = null;
let draggedLogicOperator = null;

// Componentes
let expressionComponents = {};      // {varId: [componentes]}
let miniBuilderComponents = {};     // {builderId: [componentes]}
let logicComponents = [];           // Componentes de expresión lógica

// Configuración de funciones
let currentFunction = null;
let currentConfigVarId = null;
let activeInput = null;

// Navegación (funciones anidadas)
let navigationStack = {
    currentLevel: -1,
    levels: []
};

// Blocks (Calcular edad)
let droppedBlocks = [];

// Campos disponibles
let availableFields = [];

// ========================================
// 2. INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Editor de Reglas iniciando...');

    // TODO: Implementar inicialización en HUs siguientes

    console.log('✅ Editor de Reglas iniciado');
});
```

**Tarea 1.5**: Configurar Web.config (si es necesario)
```xml
<!-- Agregar en system.web si no existe -->
<httpHandlers>
    <add verb="*" path="EditorReglas.aspx" type="System.Web.UI.PageHandlerFactory" />
</httpHandlers>
```

**Tarea 1.6**: Instalar NuGet package
```bash
Install-Package Newtonsoft.Json -Version 13.0.3
```

#### Definición de Done
- Proyecto compila sin errores
- Página `/EditorReglas.aspx` carga en navegador
- No hay errores 404 para CSS o JS
- Console del navegador no muestra errores
- Layout HTML visible con 3 secciones claramente identificables
- Code-behind responde (puede verificarse con breakpoint en Page_Load)

#### Notas de Implementación
- Usar Font Awesome 6.4.0 CDN para iconos
- Si el proyecto usa Master Pages, adaptar el layout en consecuencia
- Verificar que el namespace en code-behind coincida con el del proyecto
- Si hay sistema de autenticación, agregar atributos `[Authorize]` o verificación en Page_Load

---

### HU-002: Modelos de Datos y Base de Datos

**Estimación**: 3 SP | **Prioridad**: Crítica | **Dependencias**: HU-001

#### Descripción Técnica
Crear las clases de modelo en C# y las tablas correspondientes en SQL Server para persistir reglas de validación con sus variables y componentes.

#### Criterios de Aceptación
- [ ] Clase `ReglaValidacion.cs` creada con todas las propiedades
- [ ] Clase `Variable.cs` creada con todas las propiedades
- [ ] Script SQL de creación de tablas ejecutado exitosamente
- [ ] Tablas `Reglas` y `Variables` existen en base de datos
- [ ] Índices creados en columnas de búsqueda
- [ ] Foreign keys configuradas correctamente
- [ ] Constraints de NOT NULL aplicados
- [ ] Valores por defecto configurados (ej: FechaCreacion)

#### Tareas de Implementación

**Tarea 2.1**: Crear carpeta Models
```
- Crear carpeta Models/ en raíz del proyecto si no existe
```

**Tarea 2.2**: Crear Models/ReglaValidacion.cs
```csharp
using System;
using System.Collections.Generic;

namespace EngineValidator.Models
{
    public class ReglaValidacion
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string ExpresionLogica { get; set; }

        // JSON serializado de las variables
        public string VariablesJson { get; set; }

        // JSON serializado de los componentes de la expresión lógica
        public string ComponentesLogicaJson { get; set; }

        public DateTime FechaCreacion { get; set; }

        public DateTime? FechaModificacion { get; set; }

        public string UsuarioCreador { get; set; }

        public string UsuarioModificador { get; set; }

        public bool Activa { get; set; }

        public bool Eliminada { get; set; }

        // Propiedad de navegación (no persistida)
        public List<Variable> Variables { get; set; }

        public ReglaValidacion()
        {
            Variables = new List<Variable>();
            FechaCreacion = DateTime.Now;
            Activa = true;
            Eliminada = false;
        }
    }
}
```

**Tarea 2.3**: Crear Models/Variable.cs
```csharp
using System;

namespace EngineValidator.Models
{
    public class Variable
    {
        public int Id { get; set; }

        public int Numero { get; set; }

        public string Nombre { get; set; }

        public string Expresion { get; set; }

        // JSON serializado de los componentes de la expresión
        public string ComponentesJson { get; set; }

        // Metadata adicional (para funciones con parámetros complejos)
        public string MetadataJson { get; set; }

        public int ReglaId { get; set; }

        public Variable()
        {
            Nombre = string.Empty;
            Expresion = string.Empty;
            ComponentesJson = "[]";
            MetadataJson = "{}";
        }
    }
}
```

**Tarea 2.4**: Crear script SQL - Scripts/DB_Create_Tables.sql
```sql
-- =============================================
-- Script: Crear tablas para Editor de Reglas
-- Fecha: 2025-12-17
-- =============================================

USE [NombreDeBaseDeDatos]; -- Cambiar por tu BD
GO

-- Tabla: Reglas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reglas')
BEGIN
    CREATE TABLE [dbo].[Reglas] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Nombre] NVARCHAR(200) NOT NULL,
        [ExpresionLogica] NVARCHAR(MAX) NOT NULL,
        [VariablesJson] NVARCHAR(MAX) NOT NULL,
        [ComponentesLogicaJson] NVARCHAR(MAX) NULL,
        [FechaCreacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [FechaModificacion] DATETIME NULL,
        [UsuarioCreador] NVARCHAR(100) NOT NULL,
        [UsuarioModificador] NVARCHAR(100) NULL,
        [Activa] BIT NOT NULL DEFAULT 1,
        [Eliminada] BIT NOT NULL DEFAULT 0,

        CONSTRAINT [PK_Reglas] PRIMARY KEY CLUSTERED ([Id] ASC)
    );

    -- Índices
    CREATE NONCLUSTERED INDEX [IX_Reglas_Nombre]
        ON [dbo].[Reglas] ([Nombre] ASC);

    CREATE NONCLUSTERED INDEX [IX_Reglas_FechaCreacion]
        ON [dbo].[Reglas] ([FechaCreacion] DESC);

    CREATE NONCLUSTERED INDEX [IX_Reglas_UsuarioCreador]
        ON [dbo].[Reglas] ([UsuarioCreador] ASC);

    CREATE NONCLUSTERED INDEX [IX_Reglas_Activa_Eliminada]
        ON [dbo].[Reglas] ([Activa] ASC, [Eliminada] ASC);

    PRINT '✓ Tabla Reglas creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠ Tabla Reglas ya existe';
END
GO

-- Tabla: Variables (opcional, si se quiere normalizar)
-- Nota: En MVP, las variables se guardan en JSON dentro de Reglas.VariablesJson
-- Esta tabla es para futuro si se quiere normalizar

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Variables')
BEGIN
    CREATE TABLE [dbo].[Variables] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [ReglaId] INT NOT NULL,
        [Numero] INT NOT NULL,
        [Nombre] NVARCHAR(100) NOT NULL,
        [Expresion] NVARCHAR(MAX) NOT NULL,
        [ComponentesJson] NVARCHAR(MAX) NOT NULL,
        [MetadataJson] NVARCHAR(MAX) NULL,

        CONSTRAINT [PK_Variables] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_Variables_Reglas] FOREIGN KEY ([ReglaId])
            REFERENCES [dbo].[Reglas] ([Id]) ON DELETE CASCADE
    );

    -- Índices
    CREATE NONCLUSTERED INDEX [IX_Variables_ReglaId]
        ON [dbo].[Variables] ([ReglaId] ASC);

    PRINT '✓ Tabla Variables creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠ Tabla Variables ya existe';
END
GO

-- Tabla: ReglasAuditoria (para tracking de cambios)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ReglasAuditoria')
BEGIN
    CREATE TABLE [dbo].[ReglasAuditoria] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [ReglaId] INT NOT NULL,
        [Accion] NVARCHAR(50) NOT NULL, -- 'Crear', 'Modificar', 'Eliminar'
        [Usuario] NVARCHAR(100) NOT NULL,
        [Fecha] DATETIME NOT NULL DEFAULT GETDATE(),
        [DatosAnteriores] NVARCHAR(MAX) NULL,
        [DatosNuevos] NVARCHAR(MAX) NULL,

        CONSTRAINT [PK_ReglasAuditoria] PRIMARY KEY CLUSTERED ([Id] ASC)
    );

    -- Índices
    CREATE NONCLUSTERED INDEX [IX_ReglasAuditoria_ReglaId]
        ON [dbo].[ReglasAuditoria] ([ReglaId] ASC);

    CREATE NONCLUSTERED INDEX [IX_ReglasAuditoria_Fecha]
        ON [dbo].[ReglasAuditoria] ([Fecha] DESC);

    PRINT '✓ Tabla ReglasAuditoria creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠ Tabla ReglasAuditoria ya existe';
END
GO

PRINT '';
PRINT '================================================';
PRINT 'Script completado exitosamente';
PRINT '================================================';
GO
```

**Tarea 2.5**: Ejecutar script SQL
```bash
# Opción 1: SQL Server Management Studio (SSMS)
- Abrir SSMS
- Conectar a la instancia
- Abrir archivo DB_Create_Tables.sql
- Cambiar nombre de BD en línea 6
- Presionar F5 para ejecutar

# Opción 2: sqlcmd
sqlcmd -S localhost -d NombreDB -i Scripts/DB_Create_Tables.sql
```

**Tarea 2.6**: Verificar tablas creadas
```sql
-- Verificar tablas
SELECT name, create_date
FROM sys.tables
WHERE name IN ('Reglas', 'Variables', 'ReglasAuditoria');

-- Verificar estructura de Reglas
EXEC sp_help 'Reglas';

-- Verificar índices
SELECT
    i.name AS IndexName,
    OBJECT_NAME(i.object_id) AS TableName,
    COL_NAME(ic.object_id, ic.column_id) AS ColumnName
FROM sys.indexes i
INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
WHERE OBJECT_NAME(i.object_id) = 'Reglas';
```

#### Definición de Done
- Modelos C# compilan sin errores
- Script SQL ejecutado sin errores
- Tablas visibles en SQL Server Management Studio
- Todos los índices creados correctamente
- Foreign keys funcionando (inserción en Variables requiere ReglaId válido)
- Query de verificación retorna las 3 tablas

#### Notas de Implementación
- **IMPORTANTE**: Cambiar `[NombreDeBaseDeDatos]` en el script SQL por el nombre real de tu BD
- Si el proyecto usa Entity Framework, agregar `DbContext` y configurar conexión en Web.config
- Si el proyecto usa ADO.NET directo, configurar connection string en Web.config
- La tabla `Variables` es opcional para MVP; las variables pueden guardarse solo en JSON dentro de `Reglas.VariablesJson`
- Para proyectos con múltiples ambientes (dev, staging, prod), crear scripts separados o usar migrations
- Considerar agregar campo `Version` en tabla Reglas para versionado futuro

---

### HU-003: Servicios Backend (CRUD de Reglas)

**Estimación**: 3 SP | **Prioridad**: Alta | **Dependencias**: HU-002

#### Descripción Técnica
Implementar la capa de servicios backend con métodos CRUD para reglas, serialización/deserialización JSON, y Web Methods para comunicación con el frontend.

#### Criterios de Aceptación
- [ ] Clase `ReglasService.cs` creada en carpeta Services
- [ ] Métodos CRUD implementados: Create, Read, Update, Delete, List
- [ ] Web Methods implementados en `EditorReglas.aspx.cs`
- [ ] Serialización JSON funcionando correctamente
- [ ] Manejo de errores con try-catch y logging
- [ ] Validación de datos del lado del servidor
- [ ] Prueba manual exitosa con breakpoints

#### Tareas de Implementación

**Tarea 3.1**: Crear carpeta Services
```bash
mkdir Services
```

**Tarea 3.2**: Crear Services/ReglasService.cs
```csharp
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using Newtonsoft.Json;
using EngineValidator.Models;

namespace EngineValidator.Services
{
    public class ReglasService
    {
        private readonly string connectionString;

        public ReglasService()
        {
            connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        }

        /// <summary>
        /// Obtener regla por ID
        /// </summary>
        public ReglaValidacion ObtenerRegla(int id)
        {
            ReglaValidacion regla = null;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
                    SELECT Id, Nombre, ExpresionLogica, VariablesJson, ComponentesLogicaJson,
                           FechaCreacion, FechaModificacion, UsuarioCreador, UsuarioModificador,
                           Activa, Eliminada
                    FROM Reglas
                    WHERE Id = @Id AND Eliminada = 0";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    regla = new ReglaValidacion
                    {
                        Id = Convert.ToInt32(reader["Id"]),
                        Nombre = reader["Nombre"].ToString(),
                        ExpresionLogica = reader["ExpresionLogica"].ToString(),
                        VariablesJson = reader["VariablesJson"].ToString(),
                        ComponentesLogicaJson = reader["ComponentesLogicaJson"] != DBNull.Value
                            ? reader["ComponentesLogicaJson"].ToString()
                            : "[]",
                        FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"]),
                        FechaModificacion = reader["FechaModificacion"] != DBNull.Value
                            ? (DateTime?)Convert.ToDateTime(reader["FechaModificacion"])
                            : null,
                        UsuarioCreador = reader["UsuarioCreador"].ToString(),
                        UsuarioModificador = reader["UsuarioModificador"] != DBNull.Value
                            ? reader["UsuarioModificador"].ToString()
                            : null,
                        Activa = Convert.ToBoolean(reader["Activa"]),
                        Eliminada = Convert.ToBoolean(reader["Eliminada"])
                    };
                }
            }

            return regla;
        }

        /// <summary>
        /// Guardar regla (insert si Id=0, update si Id>0)
        /// </summary>
        public int GuardarRegla(ReglaValidacion regla, string usuario)
        {
            if (regla.Id == 0)
            {
                return InsertarRegla(regla, usuario);
            }
            else
            {
                return ActualizarRegla(regla, usuario);
            }
        }

        /// <summary>
        /// Insertar nueva regla
        /// </summary>
        private int InsertarRegla(ReglaValidacion regla, string usuario)
        {
            int newId = 0;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
                    INSERT INTO Reglas (Nombre, ExpresionLogica, VariablesJson, ComponentesLogicaJson,
                                        UsuarioCreador, Activa, Eliminada)
                    VALUES (@Nombre, @ExpresionLogica, @VariablesJson, @ComponentesLogicaJson,
                            @Usuario, 1, 0);
                    SELECT CAST(SCOPE_IDENTITY() AS INT);";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Nombre", regla.Nombre ?? "Sin nombre");
                cmd.Parameters.AddWithValue("@ExpresionLogica", regla.ExpresionLogica ?? "");
                cmd.Parameters.AddWithValue("@VariablesJson", regla.VariablesJson ?? "[]");
                cmd.Parameters.AddWithValue("@ComponentesLogicaJson", regla.ComponentesLogicaJson ?? "[]");
                cmd.Parameters.AddWithValue("@Usuario", usuario ?? "Sistema");

                conn.Open();
                newId = (int)cmd.ExecuteScalar();
            }

            // Auditoría
            RegistrarAuditoria(newId, "Crear", usuario, null, JsonConvert.SerializeObject(regla));

            return newId;
        }

        /// <summary>
        /// Actualizar regla existente
        /// </summary>
        private int ActualizarRegla(ReglaValidacion regla, string usuario)
        {
            // Obtener datos anteriores para auditoría
            var reglaAnterior = ObtenerRegla(regla.Id);

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
                    UPDATE Reglas
                    SET Nombre = @Nombre,
                        ExpresionLogica = @ExpresionLogica,
                        VariablesJson = @VariablesJson,
                        ComponentesLogicaJson = @ComponentesLogicaJson,
                        FechaModificacion = GETDATE(),
                        UsuarioModificador = @Usuario
                    WHERE Id = @Id";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", regla.Id);
                cmd.Parameters.AddWithValue("@Nombre", regla.Nombre ?? "Sin nombre");
                cmd.Parameters.AddWithValue("@ExpresionLogica", regla.ExpresionLogica ?? "");
                cmd.Parameters.AddWithValue("@VariablesJson", regla.VariablesJson ?? "[]");
                cmd.Parameters.AddWithValue("@ComponentesLogicaJson", regla.ComponentesLogicaJson ?? "[]");
                cmd.Parameters.AddWithValue("@Usuario", usuario ?? "Sistema");

                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // Auditoría
            RegistrarAuditoria(regla.Id, "Modificar", usuario,
                JsonConvert.SerializeObject(reglaAnterior),
                JsonConvert.SerializeObject(regla));

            return regla.Id;
        }

        /// <summary>
        /// Eliminar regla (soft delete)
        /// </summary>
        public void EliminarRegla(int id, string usuario)
        {
            // Obtener datos para auditoría
            var reglaAnterior = ObtenerRegla(id);

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
                    UPDATE Reglas
                    SET Eliminada = 1,
                        FechaModificacion = GETDATE(),
                        UsuarioModificador = @Usuario
                    WHERE Id = @Id";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Usuario", usuario ?? "Sistema");

                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // Auditoría
            RegistrarAuditoria(id, "Eliminar", usuario, JsonConvert.SerializeObject(reglaAnterior), null);
        }

        /// <summary>
        /// Listar reglas con filtros opcionales
        /// </summary>
        public List<ReglaValidacion> ListarReglas(string filtroNombre = null, bool? activa = null, string usuario = null)
        {
            List<ReglaValidacion> reglas = new List<ReglaValidacion>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
                    SELECT Id, Nombre, ExpresionLogica, FechaCreacion, UsuarioCreador, Activa
                    FROM Reglas
                    WHERE Eliminada = 0";

                if (!string.IsNullOrEmpty(filtroNombre))
                {
                    query += " AND Nombre LIKE @Nombre";
                }

                if (activa.HasValue)
                {
                    query += " AND Activa = @Activa";
                }

                if (!string.IsNullOrEmpty(usuario))
                {
                    query += " AND UsuarioCreador = @Usuario";
                }

                query += " ORDER BY FechaCreacion DESC";

                SqlCommand cmd = new SqlCommand(query, conn);

                if (!string.IsNullOrEmpty(filtroNombre))
                {
                    cmd.Parameters.AddWithValue("@Nombre", "%" + filtroNombre + "%");
                }

                if (activa.HasValue)
                {
                    cmd.Parameters.AddWithValue("@Activa", activa.Value);
                }

                if (!string.IsNullOrEmpty(usuario))
                {
                    cmd.Parameters.AddWithValue("@Usuario", usuario);
                }

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    reglas.Add(new ReglaValidacion
                    {
                        Id = Convert.ToInt32(reader["Id"]),
                        Nombre = reader["Nombre"].ToString(),
                        ExpresionLogica = reader["ExpresionLogica"].ToString(),
                        FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"]),
                        UsuarioCreador = reader["UsuarioCreador"].ToString(),
                        Activa = Convert.ToBoolean(reader["Activa"])
                    });
                }
            }

            return reglas;
        }

        /// <summary>
        /// Registrar cambio en auditoría
        /// </summary>
        private void RegistrarAuditoria(int reglaId, string accion, string usuario, string datosAnteriores, string datosNuevos)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    string query = @"
                        INSERT INTO ReglasAuditoria (ReglaId, Accion, Usuario, DatosAnteriores, DatosNuevos)
                        VALUES (@ReglaId, @Accion, @Usuario, @DatosAnteriores, @DatosNuevos)";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@ReglaId", reglaId);
                    cmd.Parameters.AddWithValue("@Accion", accion);
                    cmd.Parameters.AddWithValue("@Usuario", usuario ?? "Sistema");
                    cmd.Parameters.AddWithValue("@DatosAnteriores", (object)datosAnteriores ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DatosNuevos", (object)datosNuevos ?? DBNull.Value);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                // Log error pero no lanzar excepción (la auditoría no debe bloquear operaciones)
                System.Diagnostics.Debug.WriteLine($"Error en auditoría: {ex.Message}");
            }
        }

        /// <summary>
        /// Validar regla antes de guardar
        /// </summary>
        public List<string> ValidarRegla(ReglaValidacion regla)
        {
            List<string> errores = new List<string>();

            if (string.IsNullOrWhiteSpace(regla.Nombre))
            {
                errores.Add("El nombre de la regla es requerido");
            }

            if (regla.Nombre != null && regla.Nombre.Length > 200)
            {
                errores.Add("El nombre de la regla no puede exceder 200 caracteres");
            }

            if (string.IsNullOrWhiteSpace(regla.ExpresionLogica))
            {
                errores.Add("La expresión lógica es requerida");
            }

            // Validar JSON
            try
            {
                if (!string.IsNullOrEmpty(regla.VariablesJson))
                {
                    JsonConvert.DeserializeObject(regla.VariablesJson);
                }
            }
            catch
            {
                errores.Add("El JSON de variables es inválido");
            }

            return errores;
        }
    }
}
```

**Tarea 3.3**: Actualizar EditorReglas.aspx.cs con Web Methods
```csharp
using System;
using System.Web.Services;
using System.Collections.Generic;
using Newtonsoft.Json;
using EngineValidator.Models;
using EngineValidator.Services;

namespace EngineValidator
{
    public partial class EditorReglas : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Inicialización si es necesario
            }
        }

        [WebMethod]
        public static string ObtenerCamposDisponibles()
        {
            try
            {
                // TODO: Obtener de BD o configuración
                var campos = new List<string>
                {
                    "Nombre", "Apellido", "Edad", "Fecha_Nacimiento", "Salario",
                    "Estado", "Ciudad", "Pais", "Email", "Telefono",
                    "Activo", "Fecha_Registro", "Monto_Credito", "Puntaje"
                };

                return JsonConvert.SerializeObject(new
                {
                    success = true,
                    data = campos
                });
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [WebMethod]
        public static string GuardarRegla(string jsonData)
        {
            try
            {
                // Deserializar datos recibidos
                var regla = JsonConvert.DeserializeObject<ReglaValidacion>(jsonData);

                // Obtener usuario actual (ajustar según tu sistema de autenticación)
                string usuario = System.Web.HttpContext.Current.User?.Identity?.Name ?? "Sistema";

                // Validar
                var service = new ReglasService();
                var errores = service.ValidarRegla(regla);

                if (errores.Count > 0)
                {
                    return JsonConvert.SerializeObject(new
                    {
                        success = false,
                        message = "Errores de validación",
                        errors = errores
                    });
                }

                // Guardar
                int id = service.GuardarRegla(regla, usuario);

                return JsonConvert.SerializeObject(new
                {
                    success = true,
                    id = id,
                    message = regla.Id == 0 ? "Regla creada exitosamente" : "Regla actualizada exitosamente"
                });
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new
                {
                    success = false,
                    message = "Error al guardar: " + ex.Message
                });
            }
        }

        [WebMethod]
        public static string CargarRegla(int id)
        {
            try
            {
                var service = new ReglasService();
                var regla = service.ObtenerRegla(id);

                if (regla == null)
                {
                    return JsonConvert.SerializeObject(new
                    {
                        success = false,
                        message = "Regla no encontrada"
                    });
                }

                return JsonConvert.SerializeObject(new
                {
                    success = true,
                    data = regla
                });
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new
                {
                    success = false,
                    message = "Error al cargar: " + ex.Message
                });
            }
        }

        [WebMethod]
        public static string ListarReglas(string filtro)
        {
            try
            {
                var service = new ReglasService();
                var reglas = service.ListarReglas(filtroNombre: filtro);

                return JsonConvert.SerializeObject(new
                {
                    success = true,
                    data = reglas
                });
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new
                {
                    success = false,
                    message = "Error al listar: " + ex.Message
                });
            }
        }

        [WebMethod]
        public static string EliminarRegla(int id)
        {
            try
            {
                string usuario = System.Web.HttpContext.Current.User?.Identity?.Name ?? "Sistema";

                var service = new ReglasService();
                service.EliminarRegla(id, usuario);

                return JsonConvert.SerializeObject(new
                {
                    success = true,
                    message = "Regla eliminada exitosamente"
                });
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new
                {
                    success = false,
                    message = "Error al eliminar: " + ex.Message
                });
            }
        }
    }
}
```

**Tarea 3.4**: Configurar Web.config (Connection String)
```xml
<configuration>
  <connectionStrings>
    <add name="DefaultConnection"
         connectionString="Data Source=localhost;Initial Catalog=NombreDB;Integrated Security=True"
         providerName="System.Data.SqlClient" />
  </connectionStrings>
</configuration>
```

**Tarea 3.5**: Probar Web Methods manualmente
```javascript
// En console del navegador, probar:

// 1. Obtener campos
PageMethods.ObtenerCamposDisponibles(function(response) {
    console.log('Campos:', JSON.parse(response));
});

// 2. Guardar regla (prueba)
var reglaTest = {
    Id: 0,
    Nombre: "Regla de Prueba",
    ExpresionLogica: "{Variable 1}",
    VariablesJson: "[]",
    ComponentesLogicaJson: "[]"
};
PageMethods.GuardarRegla(JSON.stringify(reglaTest), function(response) {
    console.log('Guardar:', JSON.parse(response));
});
```

#### Definición de Done
- Servicios compilan sin errores
- Web Methods responden (verificable con breakpoints o console.log)
- Conexión a BD funciona correctamente
- INSERT de regla exitoso (verificable en SSMS)
- SELECT de regla retorna datos correctamente
- UPDATE funciona
- Auditoría registra cambios en tabla `ReglasAuditoria`
- Validaciones del lado del servidor funcionan

#### Notas de Implementación
- **IMPORTANTE**: Cambiar connection string en Web.config con tus credenciales reales
- Si usas autenticación Windows, usar `Integrated Security=True`
- Si usas autenticación SQL, usar `User Id=tu_usuario;Password=tu_password`
- Para probar Web Methods, necesitas agregar ScriptManager en el .aspx:
  ```html
  <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true" />
  ```
- Alternativa a PageMethods: Llamadas AJAX con jQuery o fetch()
- Considerar implementar caché para lista de campos disponibles
- Para producción, agregar más validaciones (longitud máxima de JSON, etc.)

---

### HU-004: Layout CSS y Estilos Base

**Estimación**: 3 SP | **Prioridad**: Alta | **Dependencias**: HU-001

#### Descripción Técnica
Implementar el sistema completo de estilos CSS con layout Grid/Flexbox, variables CSS para theming, y estilos para todos los componentes visuales del editor (pills, cards, panels, etc.).

#### Criterios de Aceptación
- [ ] Archivo `Content/EditorReglas.css` con ~800+ líneas de CSS
- [ ] Variables CSS definidas en `:root` para colores, espaciados, fuentes
- [ ] Layout principal con CSS Grid: sidebar (250px) | main (flex) | footer (200px)
- [ ] Estilos para pills (componentes visuales) con colores diferenciados por tipo
- [ ] Estilos para variable cards con animaciones
- [ ] Estilos para drop zones con estado hover
- [ ] Estilos para panel de configuración con animaciones slide
- [ ] Estados hover, active, disabled para todos los elementos interactivos
- [ ] Responsive (opcional para MVP, pero layout debe verse bien en 1920x1080 y 1366x768)
- [ ] Scrollbars customizados (opcional pero recomendado)

#### Tareas de Implementación

**Tarea 4.1**: Definir variables CSS en Content/EditorReglas.css
```css
/* ================================================
   EDITOR DE REGLAS - ESTILOS PRINCIPALES
   ================================================ */

/* ================================================
   1. VARIABLES CSS
   ================================================ */

:root {
    /* Colores principales */
    --primary: #6366f1;           /* Indigo */
    --primary-dark: #4f46e5;
    --primary-light: #e0e7ff;
    --primary-lighter: #f5f7ff;

    /* Colores secundarios */
    --secondary: #8b5cf6;         /* Purple */
    --secondary-light: #ede9fe;

    /* Colores de estado */
    --success: #10b981;           /* Green */
    --success-light: #d1fae5;
    --danger: #ef4444;            /* Red */
    --danger-light: #fee2e2;
    --warning: #f59e0b;           /* Orange */
    --warning-light: #fef3c7;
    --info: #3b82f6;              /* Blue */
    --info-light: #dbeafe;

    /* Grises */
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;

    /* Colores de componentes (pills) */
    --color-field: #3b82f6;       /* Azul */
    --color-field-light: #dbeafe;
    --color-operator: #ec4899;    /* Rosa */
    --color-operator-light: #fce7f3;
    --color-function: #8b5cf6;    /* Morado */
    --color-function-light: #ede9fe;
    --color-value: #10b981;       /* Verde */
    --color-value-light: #d1fae5;
    --color-parenthesis: #6b7280; /* Gris */
    --color-parenthesis-light: #f3f4f6;
    --color-variable: #7c3aed;    /* Morado oscuro */
    --color-variable-light: #ede9fe;

    /* Espaciados */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 24px;
    --spacing-2xl: 32px;
    --spacing-3xl: 48px;

    /* Tipografía */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-size-xs: 10px;
    --font-size-sm: 12px;
    --font-size-base: 14px;
    --font-size-md: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;

    /* Bordes */
    --border-radius-sm: 4px;
    --border-radius-md: 6px;
    --border-radius-lg: 8px;
    --border-radius-xl: 12px;
    --border-radius-pill: 9999px;

    /* Sombras */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    /* Transiciones */
    --transition-fast: 150ms ease;
    --transition-base: 200ms ease;
    --transition-slow: 300ms ease;

    /* Z-indexes */
    --z-dropdown: 1000;
    --z-modal: 1050;
    --z-tooltip: 1100;
    --z-overlay: 1200;
}
```

**Tarea 4.2**: Reset y estilos base
```css
/* ================================================
   2. RESET Y ESTILOS BASE
   ================================================ */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    color: var(--gray-900);
    background: var(--gray-50);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
}

input, textarea {
    font-family: inherit;
    font-size: inherit;
}

h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--gray-100);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--gray-400);
}
```

**Tarea 4.3**: Layout principal
```css
/* ================================================
   3. LAYOUT PRINCIPAL
   ================================================ */

#editorContainer {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

/* Toolbar superior */
#toolbar {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-xl);
    background: white;
    border-bottom: 1px solid var(--gray-200);
    box-shadow: var(--shadow-sm);
    z-index: 10;
}

#toolbar button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--primary);
    color: white;
    border-radius: var(--border-radius-md);
    font-weight: 500;
    font-size: var(--font-size-sm);
    transition: all var(--transition-base);
}

#toolbar button:hover {
    background: var(--primary-dark);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
}

#toolbar button:active {
    transform: translateY(0);
}

#toolbar input[type="text"] {
    flex: 1;
    max-width: 300px;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    transition: border-color var(--transition-base);
}

#toolbar input[type="text"]:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-lighter);
}

/* Layout principal: Grid de 3 columnas */
#mainLayout {
    display: grid;
    grid-template-columns: 250px 1fr;
    flex: 1;
    overflow: hidden;
}

/* Sidebar izquierdo */
#sidebar {
    background: white;
    border-right: 1px solid var(--gray-200);
    overflow-y: auto;
    padding: var(--spacing-lg);
}

.sidebar-section {
    margin-bottom: var(--spacing-xl);
}

.sidebar-section h3 {
    font-size: var(--font-size-base);
    color: var(--gray-700);
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid var(--gray-200);
}

/* Área central de variables */
#variablesContainer {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--gray-50);
}

#variablesArea {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-xl);
}

#emptyState {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--gray-400);
    gap: var(--spacing-md);
}

#emptyState i {
    font-size: 64px;
}

#emptyState p {
    font-size: var(--font-size-md);
}

#btnAddVariable {
    margin: var(--spacing-lg);
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--primary);
    color: white;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    font-size: var(--font-size-base);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    transition: all var(--transition-base);
}

#btnAddVariable:hover {
    background: var(--primary-dark);
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

/* Panel inferior: Expresión lógica */
#logicExpressionPanel {
    height: 200px;
    background: white;
    border-top: 2px solid var(--gray-300);
    padding: var(--spacing-lg) var(--spacing-xl);
    overflow-y: auto;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
}

#logicExpressionPanel h3 {
    font-size: var(--font-size-lg);
    color: var(--gray-800);
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

#logicExpressionBuilder {
    min-height: 80px;
    padding: var(--spacing-lg);
    background: var(--gray-50);
    border: 2px dashed var(--gray-300);
    border-radius: var(--border-radius-lg);
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    align-items: center;
    transition: all var(--transition-base);
}

#logicExpressionBuilder.drag-over {
    background: var(--primary-lighter);
    border-color: var(--primary);
    border-style: solid;
}

#logicExpressionPreview {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--gray-100);
    border-radius: var(--border-radius-md);
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-sm);
    color: var(--gray-700);
}
```

**Tarea 4.4**: Estilos para pills (componentes visuales)
```css
/* ================================================
   4. COMPONENTES VISUALES (PILLS)
   ================================================ */

.expr-component, .logic-component {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 6px 12px;
    border-radius: var(--border-radius-pill);
    font-size: var(--font-size-sm);
    font-weight: 500;
    white-space: nowrap;
    cursor: default;
    transition: all var(--transition-fast);
    position: relative;
}

/* Tipos de componentes - Expression Builder */
.expr-component.field {
    background: var(--color-field-light);
    color: var(--color-field);
    border: 1px solid var(--color-field);
}

.expr-component.operator {
    background: var(--color-operator-light);
    color: var(--color-operator);
    border: 1px solid var(--color-operator);
}

.expr-component.function {
    background: var(--color-function-light);
    color: var(--color-function);
    border: 1px solid var(--color-function);
}

.expr-component.value {
    background: var(--color-value-light);
    color: var(--color-value);
    border: 1px solid var(--color-value);
}

.expr-component.parenthesis {
    background: var(--color-parenthesis-light);
    color: var(--color-parenthesis);
    border: 1px solid var(--color-parenthesis);
}

/* Tipos de componentes - Logic Expression Builder */
.logic-component.variable {
    background: var(--color-variable-light);
    color: var(--color-variable);
    border: 1px solid var(--color-variable);
}

.logic-component.operator {
    background: var(--color-operator-light);
    color: var(--color-operator);
    border: 1px solid var(--color-operator);
}

.logic-component.parenthesis {
    background: var(--color-parenthesis-light);
    color: var(--color-parenthesis);
    border: 1px solid var(--color-parenthesis);
}

/* Iconos dentro de pills */
.expr-icon, .logic-icon {
    font-size: var(--font-size-sm);
}

/* Botones dentro de pills */
.expr-component button, .logic-component button {
    padding: 2px 4px;
    margin-left: var(--spacing-xs);
    background: rgba(0, 0, 0, 0.1);
    border-radius: var(--border-radius-sm);
    color: inherit;
    font-size: 10px;
    opacity: 0.7;
    transition: opacity var(--transition-fast);
}

.expr-component button:hover, .logic-component button:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
}

/* Hover effects */
.expr-component:hover, .logic-component:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
}
```

**Tarea 4.5**: Estilos para variable cards
```css
/* ================================================
   5. VARIABLE CARDS
   ================================================ */

.variable-card {
    background: white;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    margin-bottom: var(--spacing-xl);
    overflow: hidden;
    transition: all var(--transition-base);
}

.variable-card:hover {
    box-shadow: var(--shadow-lg);
}

.variable-card.expanded {
    box-shadow: var(--shadow-xl);
}

/* Header de variable (draggable) */
.variable-card-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background: var(--primary-lighter);
    border-bottom: 2px solid var(--primary-light);
    cursor: move;
    transition: background var(--transition-base);
}

.variable-card-header:hover {
    background: var(--primary-light);
}

.variable-card-header[draggable="true"]:active {
    cursor: grabbing;
    opacity: 0.8;
}

.variable-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    font-weight: 700;
    font-size: var(--font-size-base);
    flex-shrink: 0;
}

.variable-name-preview {
    flex: 1;
    font-weight: 600;
    font-size: var(--font-size-md);
    color: var(--gray-800);
}

.variable-name-edit {
    flex: 1;
    padding: var(--spacing-sm);
    border: 2px solid var(--primary);
    border-radius: var(--border-radius-md);
    font-weight: 600;
    font-size: var(--font-size-md);
}

.variable-card-actions {
    display: flex;
    gap: var(--spacing-xs);
}

.variable-card-actions button {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: var(--border-radius-sm);
    color: var(--gray-600);
    transition: all var(--transition-fast);
}

.variable-card-actions button:hover {
    background: var(--danger);
    color: white;
}

/* Body de variable (expression builder) */
.variable-card-body {
    padding: var(--spacing-lg);
}

.expression-builder {
    min-height: 60px;
    padding: var(--spacing-md);
    background: var(--gray-50);
    border: 2px dashed var(--gray-300);
    border-radius: var(--border-radius-md);
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    align-items: center;
    transition: all var(--transition-base);
}

.expression-builder.drag-over {
    background: var(--primary-lighter);
    border-color: var(--primary);
    border-style: solid;
}

.expression-builder .placeholder {
    color: var(--gray-400);
    font-size: var(--font-size-sm);
    font-style: italic;
    pointer-events: none;
}

.expression-preview {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--gray-100);
    border-left: 4px solid var(--primary);
    border-radius: var(--border-radius-sm);
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-sm);
    color: var(--gray-700);
}
```

**Tarea 4.6**: Estilos para sidebar (campos, operadores, funciones)
```css
/* ================================================
   6. SIDEBAR - RECURSOS ARRASTRABLES
   ================================================ */

/* Lista de campos */
#camposList {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.campo-item {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-field-light);
    color: var(--color-field);
    border: 1px solid var(--color-field);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: move;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.campo-item:hover {
    background: var(--color-field);
    color: white;
    transform: translateX(4px);
    box-shadow: var(--shadow-md);
}

.campo-item i {
    font-size: var(--font-size-xs);
}

/* Grid de operadores */
#operadoresList {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
}

.operador-item {
    padding: var(--spacing-md);
    background: var(--color-operator-light);
    color: var(--color-operator);
    border: 1px solid var(--color-operator);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    font-weight: 700;
    text-align: center;
    cursor: move;
    transition: all var(--transition-base);
}

.operador-item:hover {
    background: var(--color-operator);
    color: white;
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
}

/* Lista de funciones */
#funcionesList {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.funcion-item {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-function-light);
    color: var(--color-function);
    border: 1px solid var(--color-function);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: move;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.funcion-item:hover {
    background: var(--color-function);
    color: white;
    transform: translateX(4px);
    box-shadow: var(--shadow-md);
}

.funcion-item i {
    font-size: var(--font-size-sm);
}

/* Estado dragging */
.dragging {
    opacity: 0.5;
    cursor: grabbing !important;
}
```

**Tarea 4.7**: Estilos para panel de configuración (funciones)
```css
/* ================================================
   7. PANEL DE CONFIGURACIÓN DE FUNCIONES
   ================================================ */

.config-panel {
    position: relative;
    max-height: 0;
    overflow: hidden;
    background: var(--gray-50);
    border-top: 2px solid var(--primary-light);
    transition: max-height var(--transition-slow), padding var(--transition-slow);
}

.config-panel.active {
    max-height: 600px;
    padding: var(--spacing-lg);
    overflow-y: auto;
}

.config-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 2px solid var(--gray-200);
}

.config-panel-header h3 {
    font-size: var(--font-size-lg);
    color: var(--gray-800);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.config-panel-body {
    margin-bottom: var(--spacing-lg);
}

.config-panel-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    padding-top: var(--spacing-lg);
    border-top: 2px solid var(--gray-200);
}

.config-panel-footer button {
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--border-radius-md);
    font-weight: 600;
    font-size: var(--font-size-sm);
    transition: all var(--transition-base);
}

.config-panel-footer button.btn-cancel {
    background: var(--gray-200);
    color: var(--gray-700);
}

.config-panel-footer button.btn-cancel:hover {
    background: var(--gray-300);
}

.config-panel-footer button.btn-accept {
    background: var(--primary);
    color: white;
}

.config-panel-footer button.btn-accept:hover {
    background: var(--primary-dark);
    box-shadow: var(--shadow-md);
}
```

**Tarea 4.8**: Estilos para mini-builders
```css
/* ================================================
   8. MINI-BUILDERS (PARÁMETROS DE FUNCIONES)
   ================================================ */

.mini-builder-container {
    margin-bottom: var(--spacing-lg);
}

.mini-builder-container label {
    display: block;
    font-weight: 600;
    font-size: var(--font-size-sm);
    color: var(--gray-700);
    margin-bottom: var(--spacing-sm);
}

.mini-expression-builder {
    min-height: 50px;
    padding: var(--spacing-sm) var(--spacing-md);
    background: white;
    border: 2px dashed var(--gray-300);
    border-radius: var(--border-radius-md);
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    transition: all var(--transition-base);
}

.mini-expression-builder.drag-over {
    background: var(--primary-lighter);
    border-color: var(--primary);
    border-style: solid;
}

.mini-expression-builder .placeholder {
    color: var(--gray-400);
    font-size: 11px;
    font-style: italic;
}

/* Pills dentro de mini-builders (más pequeños) */
.mini-expression-builder .expr-component {
    padding: 4px 10px;
    font-size: 11px;
}

.mini-expression-builder .expr-component button {
    font-size: 9px;
}

/* Breadcrumb individual por mini-builder */
.mini-builder-breadcrumb {
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--gray-50);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--gray-200);
    font-size: 11px;
}

.mini-builder-breadcrumb i {
    color: var(--gray-400);
    margin-right: 4px;
}
```

**Tarea 4.9**: Estilos para bloques (Calcular edad)
```css
/* ================================================
   9. BLOQUES (FUNCIÓN "CALCULAR EDAD")
   ================================================ */

.drop-zone {
    min-height: 100px;
    padding: var(--spacing-lg);
    background: var(--gray-50);
    border: 2px dashed var(--gray-300);
    border-radius: var(--border-radius-lg);
    transition: all var(--transition-base);
}

.drop-zone.drag-over {
    background: var(--warning-light);
    border-color: var(--warning);
    border-style: solid;
}

.drop-zone .placeholder {
    text-align: center;
    color: var(--gray-400);
    font-size: var(--font-size-sm);
    font-style: italic;
}

.param-block {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: white;
    border: 2px solid var(--gray-200);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-sm);
    transition: all var(--transition-base);
}

.param-block:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-sm);
}

.param-block-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--warning);
    color: white;
    border-radius: 50%;
    font-weight: 700;
    font-size: var(--font-size-sm);
    flex-shrink: 0;
}

.param-block-content {
    flex: 1;
}

.param-block-label {
    font-size: var(--font-size-xs);
    color: var(--gray-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.param-block-value {
    font-size: var(--font-size-base);
    color: var(--gray-800);
    font-weight: 500;
    margin-top: 2px;
}

.param-block-actions button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--danger-light);
    color: var(--danger);
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-fast);
}

.param-block-actions button:hover {
    background: var(--danger);
    color: white;
}
```

**Tarea 4.10**: Estilos para breadcrumb de navegación y utilidades
```css
/* ================================================
   10. BREADCRUMB DE NAVEGACIÓN
   ================================================ */

#configBreadcrumb {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
}

#configBreadcrumb button {
    padding: 4px 8px;
    background: var(--gray-100);
    color: var(--gray-600);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-xs);
    font-weight: 500;
    transition: all var(--transition-fast);
}

#configBreadcrumb button:hover {
    background: var(--gray-200);
    color: var(--gray-800);
}

#configBreadcrumb button.active {
    background: var(--primary);
    color: white;
    cursor: default;
}

#configBreadcrumb i.separator {
    color: var(--gray-400);
    font-size: 10px;
}

/* ================================================
   11. UTILIDADES Y HELPERS
   ================================================ */

.hidden {
    display: none !important;
}

.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed !important;
}

/* Toast notifications */
.toast {
    position: fixed;
    top: var(--spacing-xl);
    right: var(--spacing-xl);
    padding: var(--spacing-md) var(--spacing-lg);
    background: white;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-xl);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    z-index: var(--z-tooltip);
    animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.toast.success {
    border-left: 4px solid var(--success);
}

.toast.error {
    border-left: 4px solid var(--danger);
}

.toast.warning {
    border-left: 4px solid var(--warning);
}

.toast.info {
    border-left: 4px solid var(--info);
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal {
    background: white;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
    max-width: 500px;
    width: 90%;
    padding: var(--spacing-xl);
    animation: scaleIn 0.2s ease;
}

@keyframes scaleIn {
    from {
        transform: scale(0.9);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.modal-header {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: var(--gray-800);
}

.modal-body {
    margin-bottom: var(--spacing-lg);
    color: var(--gray-700);
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
}
```

#### Definición de Done
- ✅ Archivo CSS completo (~800+ líneas)
- ✅ Variables CSS funcionando
- ✅ Layout Grid/Flexbox correcto
- ✅ Pills diferenciadas por tipo con colores correctos
- ✅ Variable cards con animaciones smooth
- ✅ Drop zones con estados hover
- ✅ Panel de configuración con animación slide
- ✅ Mini-builders estilizados (pills 80% del tamaño)
- ✅ Bloques numerados para "Calcular edad"
- ✅ Breadcrumbs navegables
- ✅ Toast notifications
- ✅ Modal básico
- ✅ Scrollbars personalizados
- ✅ Estados hover/active/disabled en todos los elementos interactivos
- ✅ Layout se ve bien en 1920x1080 y 1366x768

#### Notas de Implementación
- **Testing visual**: Probar cada sección individualmente en navegador
- **Performance**: Con 100+ variables, considerar virtualización del scroll
- **Accesibilidad**: Verificar contraste de colores con herramientas como WebAIM
- **Navegadores**: Testear en Chrome, Firefox, Edge
- **Dark mode**: Para implementación futura, duplicar variables en `[data-theme="dark"]`
- **Prefijos vendor**: Agregar si necesitas soporte IE11/Edge legacy
- **Animations**: Todas las animaciones son ligeras (<300ms) para mejor UX
- **Z-indexes**: Organizados en variables CSS para fácil mantenimiento

---## Semana 2: Expression Builder y Funciones Simples (Días 6-10)
