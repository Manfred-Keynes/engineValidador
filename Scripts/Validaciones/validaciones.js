/**
 * validaciones.js
 * Configuración de reglas por página/formulario
 * 
 * NOTA: Los IDs usan el prefijo "cphBody_" porque es el ID 
 * del ContentPlaceHolder en la Master Page
 * 
 * Para agregar una nueva página:
 * 1. Crear una función con el nombre que usarás en data-page
 * 2. Definir reglasXCampo con los IDs de los campos
 * 3. Agregar la función al return del módulo
 */
const validaciones = (() => {
    
    // =============================================
    // Validaciones para: RegistroCliente.aspx
    // data-page="registroCliente"
    // =============================================
    const registroCliente = () => {
        const reglasXCampo = {
            cphBody_txtNombre: [
                reglas.validarNoNulo, 
                reglas.validarSoloTexto, 
                reglas.validarLongitudMaxima(50)
            ],
            cphBody_txtApellido: [
                reglas.validarNoNulo, 
                reglas.validarSoloTexto, 
                reglas.validarLongitudMaxima(50)
            ],
            cphBody_txtDPI: [
                reglas.validarNoNulo, 
                reglas.validarDPI
            ],
            cphBody_txtEmail: [
                reglas.validarNoNulo, 
                reglas.validarEmail
            ],
            cphBody_txtTelefono: [
                reglas.validarNoNulo, 
                reglas.validarSoloNumeros, 
                reglas.validarLongitudMaxima(8)
            ],
            cphBody_ddlDepartamento: [
                reglas.validarSeleccion
            ],
            cphBody_txtDireccion: [
                reglas.validarNoNulo, 
                reglas.validarLongitudMaxima(200)
            ]
        };

        return {
            reglasXCampo: (campo) => reglasXCampo[campo] || []
        };
    };

    // =============================================
    // Validaciones para: RegistroProducto.aspx
    // data-page="registroProducto"
    // =============================================
    const registroProducto = () => {
        const reglasXCampo = {
            cphBody_txtCodigoProducto: [
                reglas.validarNoNulo, 
                reglas.validarAlfanumerico,
                reglas.validarLongitudMaxima(20)
            ],
            cphBody_txtNombreProducto: [
                reglas.validarNoNulo, 
                reglas.validarLongitudMaxima(100)
            ],
            cphBody_ddlCategoria: [
                reglas.validarSeleccion
            ],
            cphBody_txtPrecio: [
                reglas.validarNoNulo, 
                reglas.validarSoloDecimales
            ],
            cphBody_txtDescripcion: [
                reglas.validarLongitudMaxima(500)
            ]
        };

        return {
            reglasXCampo: (campo) => reglasXCampo[campo] || []
        };
    };

    // =============================================
    // Validaciones para: RegistroProveedor.aspx
    // data-page="registroProveedor"
    // =============================================
    const registroProveedor = () => {
        const reglasXCampo = {
            cphBody_txtNombreEmpresa: [
                reglas.validarNoNulo, 
                reglas.validarLongitudMaxima(100)
            ],
            cphBody_txtNIT: [
                reglas.validarNoNulo, 
                reglas.validarNIT
            ],
            cphBody_txtContacto: [
                reglas.validarNoNulo, 
                reglas.validarSoloTexto,
                reglas.validarLongitudMaxima(100)
            ],
            cphBody_txtTelefono: [
                reglas.validarNoNulo, 
                reglas.validarSoloNumeros, 
                reglas.validarLongitudMaxima(8)
            ],
            cphBody_txtEmail: [
                reglas.validarEmail
            ],
            cphBody_ddlTipoProveedor: [
                reglas.validarSeleccion
            ]
        };

        return {
            reglasXCampo: (campo) => reglasXCampo[campo] || []
        };
    };

    // Exponer las configuraciones
    return {
        registroCliente,
        registroProducto,
        registroProveedor
    };
})();
