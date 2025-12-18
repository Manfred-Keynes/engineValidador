using System;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Web.UI;

namespace enginevalidator
{
    public partial class EditorReglasSelector : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Inicializacion si es necesario
            }
        }

        /// <summary>
        /// Obtiene los campos disponibles del sistema
        /// </summary>
        [WebMethod]
        public static object ObtenerCampos()
        {
            try
            {
                // TODO: Obtener campos desde base de datos o configuracion
                var campos = new List<object>
                {
                    new { value = "[Nombre]", text = "Nombre", tipo = "texto" },
                    new { value = "[Apellido]", text = "Apellido", tipo = "texto" },
                    new { value = "[Edad]", text = "Edad", tipo = "numero" },
                    new { value = "[FechaNacimiento]", text = "Fecha Nacimiento", tipo = "fecha" },
                    new { value = "[Salario]", text = "Salario", tipo = "numero" },
                    new { value = "[Email]", text = "Email", tipo = "texto" },
                    new { value = "[Telefono]", text = "Telefono", tipo = "texto" },
                    new { value = "[Departamento]", text = "Departamento", tipo = "texto" },
                    new { value = "[CantidadHijos]", text = "Cantidad Hijos", tipo = "numero" },
                    new { value = "[Activo]", text = "Activo", tipo = "booleano" }
                };

                return new { success = true, data = campos };
            }
            catch (Exception ex)
            {
                return new { success = false, message = ex.Message };
            }
        }

        /// <summary>
        /// Guarda una regla en la base de datos
        /// </summary>
        [WebMethod]
        public static object GuardarRegla(string nombre, string descripcion, string expresion, string componentes)
        {
            try
            {
                // Validar datos
                if (string.IsNullOrWhiteSpace(nombre))
                {
                    return new { success = false, message = "El nombre de la regla es requerido" };
                }

                if (string.IsNullOrWhiteSpace(expresion))
                {
                    return new { success = false, message = "La expresion no puede estar vacia" };
                }

                // TODO: Implementar guardado en base de datos
                // Por ahora, simulamos un guardado exitoso
                var reglaId = DateTime.Now.Ticks;

                // Ejemplo de como seria el guardado:
                // using (var conn = new SqlConnection(connectionString))
                // {
                //     conn.Open();
                //     var cmd = new SqlCommand(@"
                //         INSERT INTO Reglas (Nombre, Descripcion, Expresion, ComponentesJson, FechaCreacion)
                //         VALUES (@Nombre, @Descripcion, @Expresion, @Componentes, GETDATE());
                //         SELECT SCOPE_IDENTITY();", conn);
                //     cmd.Parameters.AddWithValue("@Nombre", nombre);
                //     cmd.Parameters.AddWithValue("@Descripcion", descripcion ?? "");
                //     cmd.Parameters.AddWithValue("@Expresion", expresion);
                //     cmd.Parameters.AddWithValue("@Componentes", componentes);
                //     reglaId = Convert.ToInt64(cmd.ExecuteScalar());
                // }

                return new {
                    success = true,
                    message = "Regla guardada exitosamente",
                    reglaId = reglaId
                };
            }
            catch (Exception ex)
            {
                return new { success = false, message = "Error al guardar: " + ex.Message };
            }
        }

        /// <summary>
        /// Obtiene la lista de reglas guardadas
        /// </summary>
        [WebMethod]
        public static object ListarReglas()
        {
            try
            {
                // TODO: Obtener reglas desde base de datos
                var reglas = new List<object>
                {
                    new { id = 1, nombre = "Validacion de edad", descripcion = "Verifica que la edad sea mayor a 18", fechaCreacion = "2026-01-05" },
                    new { id = 2, nombre = "Validacion de salario", descripcion = "Verifica rango de salario", fechaCreacion = "2026-01-06" },
                    new { id = 3, nombre = "Regla compuesta", descripcion = "Multiples validaciones", fechaCreacion = "2026-01-07" }
                };

                return new { success = true, data = reglas };
            }
            catch (Exception ex)
            {
                return new { success = false, message = ex.Message };
            }
        }

        /// <summary>
        /// Carga una regla especifica
        /// </summary>
        [WebMethod]
        public static object CargarRegla(int id)
        {
            try
            {
                // TODO: Cargar regla desde base de datos
                // Por ahora, retornamos datos de ejemplo
                object regla = null;

                if (id == 1)
                {
                    regla = new
                    {
                        id = 1,
                        nombre = "Validacion de edad",
                        descripcion = "Verifica que la edad sea mayor a 18",
                        expresion = "[Edad] > 18",
                        componentes = new[]
                        {
                            new { id = "comp_1", type = "field", value = "[Edad]", displayText = "Edad" },
                            new { id = "comp_2", type = "operator", value = ">", displayText = ">" },
                            new { id = "comp_3", type = "value", value = "18", displayText = "18" }
                        }
                    };
                }
                else if (id == 2)
                {
                    regla = new
                    {
                        id = 2,
                        nombre = "Validacion de salario",
                        descripcion = "Verifica rango de salario",
                        expresion = "[Salario] >= 3000 AND [Salario] <= 50000",
                        componentes = new[]
                        {
                            new { id = "comp_1", type = "field", value = "[Salario]", displayText = "Salario" },
                            new { id = "comp_2", type = "operator", value = ">=", displayText = ">=" },
                            new { id = "comp_3", type = "value", value = "3000", displayText = "3000" },
                            new { id = "comp_4", type = "logic", value = "AND", displayText = "AND" },
                            new { id = "comp_5", type = "field", value = "[Salario]", displayText = "Salario" },
                            new { id = "comp_6", type = "operator", value = "<=", displayText = "<=" },
                            new { id = "comp_7", type = "value", value = "50000", displayText = "50000" }
                        }
                    };
                }

                if (regla == null)
                {
                    return new { success = false, message = "Regla no encontrada" };
                }

                return new { success = true, data = regla };
            }
            catch (Exception ex)
            {
                return new { success = false, message = ex.Message };
            }
        }

        /// <summary>
        /// Elimina una regla
        /// </summary>
        [WebMethod]
        public static object EliminarRegla(int id)
        {
            try
            {
                // TODO: Eliminar regla de base de datos
                // Por ahora, simulamos eliminacion exitosa

                return new { success = true, message = "Regla eliminada exitosamente" };
            }
            catch (Exception ex)
            {
                return new { success = false, message = ex.Message };
            }
        }
    }
}
