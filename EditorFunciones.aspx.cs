using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json; // Necesitarás instalar: Install-Package Newtonsoft.Json

namespace enginevalidator
{
    public partial class EditorFunciones : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Los campos ahora se cargan dinámicamente desde JavaScript (VariableCardManager.js)
            // con datos demo, no se requiere carga desde el servidor
        }

        // NOTA: Los siguientes métodos fueron deshabilitados porque los campos
        // ahora se manejan en el cliente con JavaScript (origen de datos en cada variable)

        /*
        private void CargarSegmentos()
        {
            ddlSegmentos.Items.Clear();
            ddlSegmentos.Items.Add(new ListItem("-- Seleccione --", ""));
            ddlSegmentos.Items.Add(new ListItem("Campos del producto", "producto"));
            ddlSegmentos.Items.Add(new ListItem("Campos del cliente", "cliente"));
            ddlSegmentos.Items.Add(new ListItem("Datos de buró", "bureau"));
        }

        private void CargarCampos()
        {
            var campos = new List<CampoInfo>
            {
                new CampoInfo { Campo = "NIT", Descripcion = "Número de Identificación Tributaria" },
                new CampoInfo { Campo = "DPI", Descripcion = "Documento Personal de Identificación" },
                new CampoInfo { Campo = "Primer_Nombre", Descripcion = "Primer Nombre" },
                new CampoInfo { Campo = "Segundo_Nombre", Descripcion = "Segundo Nombre" },
                new CampoInfo { Campo = "Primer_Apellido", Descripcion = "Primer Apellido" },
                new CampoInfo { Campo = "Segundo_Apellido", Descripcion = "Segundo Apellido" },
                new CampoInfo { Campo = "Fecha_Nacimiento", Descripcion = "Fecha de Nacimiento" },
                new CampoInfo { Campo = "Pasaporte", Descripcion = "Número de Pasaporte" }
            };

            rptCampos.DataSource = campos;
            rptCampos.DataBind();

            lblCantidadCampos.Text = campos.Count.ToString();
        }

        protected void ddlSegmentos_SelectedIndexChanged(object sender, EventArgs e)
        {
            string segmento = ddlSegmentos.SelectedValue;

            if (!string.IsNullOrEmpty(segmento))
            {
                CargarCampos();
            }
        }
        */

        protected void btnGuardar_Click(object sender, EventArgs e)
        {
            try
            {
                // Validar campos requeridos
                if (string.IsNullOrWhiteSpace(txtNombre.Text))
                {
                    MostrarMensaje("El nombre del factor es requerido", "warning");
                    return;
                }

                // Leer variables del HiddenField (JavaScript las serializa como JSON)
                List<VariableInfo> variables = new List<VariableInfo>();

                if (!string.IsNullOrEmpty(hfVariablesData.Value))
                {
                    try
                    {
                        variables = JsonConvert.DeserializeObject<List<VariableInfo>>(hfVariablesData.Value);
                    }
                    catch (Exception ex)
                    {
                        MostrarMensaje($"Error al leer variables: {ex.Message}", "error");
                        return;
                    }
                }

                // Crear objeto factor
                var factor = new
                {
                    Nombre = txtNombre.Text,
                    Descripcion = txtDescripcion.Text,
                    Variables = variables,
                    ExpresionLogica = hdnExpresionLogica.Value
                };

                // Aquí guardarías en la BD
                // GuardarFactorEnBD(factor);

                MostrarMensaje($"Factor guardado exitosamente con {variables.Count} variables", "success");

                // Log para debug
                System.Diagnostics.Debug.WriteLine($"Factor: {JsonConvert.SerializeObject(factor, Formatting.Indented)}");
            }
            catch (Exception ex)
            {
                MostrarMensaje($"Error al guardar: {ex.Message}", "error");
            }
        }

        protected void btnCancelar_Click(object sender, EventArgs e)
        {
            Response.Redirect(Request.RawUrl);
        }

        protected void btnValidar_Click(object sender, EventArgs e)
        {
            try
            {
                string expresion = hdnExpresionLogica.Value;

                if (string.IsNullOrWhiteSpace(expresion))
                {
                    MostrarMensaje("No hay expresión para validar", "warning");
                    return;
                }

                // Aquí llamarías a tu motor de validación
                bool esValida = true;

                if (esValida)
                {
                    MostrarMensaje("La expresión es válida", "success");
                }
                else
                {
                    MostrarMensaje("La expresión contiene errores", "error");
                }
            }
            catch (Exception ex)
            {
                MostrarMensaje($"Error al validar: {ex.Message}", "error");
            }
        }

        #region Métodos Auxiliares

        private void MostrarMensaje(string mensaje, string tipo)
        {
            string script = $"alert('{mensaje.Replace("'", "\\'")}');";
            ClientScript.RegisterStartupScript(this.GetType(), "mensaje", script, true);
        }

        #endregion

        #region Clases Internas

        [Serializable]
        public class CampoInfo
        {
            public string Campo { get; set; }
            public string Descripcion { get; set; }
        }

        [Serializable]
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

        #endregion
    }
}
