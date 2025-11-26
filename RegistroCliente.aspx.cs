using System;
using System.Web.UI;

namespace enginevalidator
{
    public partial class RegistroCliente : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Inicialización si es necesario
                pnlResultado.Visible = false;
            }
        }

        /// <summary>
        /// Este método SOLO se ejecuta si la validación JavaScript retorna true
        /// Es decir, si triggerButtonClick('formRegistroCliente') retorna true
        /// </summary>
        protected void btnGuardar_Click(object sender, EventArgs e)
        {
            // Validación adicional del lado del servidor (buena práctica)
            if (!ValidarDatosServidor())
            {
                MostrarError("Error de validación en el servidor");
                return;
            }

            // Obtener los valores de los campos
            string nombre = txtNombre.Text.Trim();
            string apellido = txtApellido.Text.Trim();
            string dpi = txtDPI.Text.Trim();
            string email = txtEmail.Text.Trim();
            string telefono = txtTelefono.Text.Trim();
            string departamento = ddlDepartamento.SelectedValue;
            string nombreDepartamento = ddlDepartamento.SelectedItem.Text;
            string direccion = txtDireccion.Text.Trim();

            try
            {
                // =============================================
                // AQUÍ VA TU LÓGICA DE NEGOCIO
                // Por ejemplo: guardar en base de datos
                // =============================================
                
                // Ejemplo:
                // var cliente = new Cliente {
                //     Nombre = nombre,
                //     Apellido = apellido,
                //     DPI = dpi,
                //     Email = email,
                //     Telefono = telefono,
                //     DepartamentoId = int.Parse(departamento),
                //     Direccion = direccion
                // };
                // _clienteService.Guardar(cliente);

                // Mostrar resultado exitoso
                pnlResultado.Visible = true;
                pnlResultado.CssClass = "mt-3";
                litResultado.Text = $@"
                    <div class='alert alert-success'>
                        <h5>✓ Cliente Guardado Exitosamente</h5>
                        <p><strong>Nombre:</strong> {Server.HtmlEncode(nombre)} {Server.HtmlEncode(apellido)}</p>
                        <p><strong>DPI:</strong> {Server.HtmlEncode(dpi)}</p>
                        <p><strong>Email:</strong> {Server.HtmlEncode(email)}</p>
                        <p><strong>Teléfono:</strong> {Server.HtmlEncode(telefono)}</p>
                        <p><strong>Departamento:</strong> {Server.HtmlEncode(nombreDepartamento)}</p>
                        <p><strong>Dirección:</strong> {Server.HtmlEncode(direccion)}</p>
                    </div>
                ";

                // Limpiar formulario después de guardar
                LimpiarFormulario();
            }
            catch (Exception ex)
            {
                // Manejo de errores
                MostrarError($"Error al guardar: {ex.Message}");
            }
        }

        protected void btnLimpiar_Click(object sender, EventArgs e)
        {
            LimpiarFormulario();
            pnlResultado.Visible = false;
        }

        /// <summary>
        /// Limpia todos los campos del formulario
        /// </summary>
        private void LimpiarFormulario()
        {
            txtNombre.Text = string.Empty;
            txtApellido.Text = string.Empty;
            txtDPI.Text = string.Empty;
            txtEmail.Text = string.Empty;
            txtTelefono.Text = string.Empty;
            ddlDepartamento.SelectedIndex = 0;
            txtDireccion.Text = string.Empty;
        }

        /// <summary>
        /// Muestra un mensaje de error
        /// </summary>
        private void MostrarError(string mensaje)
        {
            pnlResultado.Visible = true;
            litResultado.Text = $@"
                <div class='alert alert-danger'>
                    <h5>❌ Error</h5>
                    <p>{Server.HtmlEncode(mensaje)}</p>
                </div>
            ";
        }

        /// <summary>
        /// Validación del lado del servidor (complementa la validación JS)
        /// IMPORTANTE: Siempre validar en el servidor también por seguridad
        /// </summary>
        private bool ValidarDatosServidor()
        {
            // Validar nombre
            if (string.IsNullOrWhiteSpace(txtNombre.Text))
            {
                return false;
            }

            // Validar apellido
            if (string.IsNullOrWhiteSpace(txtApellido.Text))
            {
                return false;
            }

            // Validar DPI (13 dígitos)
            if (string.IsNullOrWhiteSpace(txtDPI.Text) || txtDPI.Text.Length != 13)
            {
                return false;
            }

            // Validar email
            if (string.IsNullOrWhiteSpace(txtEmail.Text) || !txtEmail.Text.Contains("@"))
            {
                return false;
            }

            // Validar teléfono (8 dígitos)
            if (string.IsNullOrWhiteSpace(txtTelefono.Text) || txtTelefono.Text.Length != 8)
            {
                return false;
            }

            // Validar departamento seleccionado
            if (string.IsNullOrWhiteSpace(ddlDepartamento.SelectedValue))
            {
                return false;
            }

            // Validar dirección
            if (string.IsNullOrWhiteSpace(txtDireccion.Text))
            {
                return false;
            }

            return true;
        }
    }
}
