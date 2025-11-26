/**
 * ValidadorFrontendWebForms.js
 * Motor de validaciones para ASP.NET WebForms
 * 
 * Funciones principales:
 * - triggerButtonClick(formularioId): Para usar en OnClientClick de asp:Button
 * - validateForm(formularioId): Valida un formulario completo
 * - mostrarError(campo, mensaje): Muestra error en un campo
 * - limpiarError(campo): Limpia error de un campo
 */

/**
 * Motor que ejecuta las reglas de validación sobre un campo
 * @param {HTMLElement} campo - El campo a validar
 * @param {Array} reglasArray - Array de funciones de validación
 * @returns {Object} - { valido: boolean, mensaje: string }
 */
function motorDeValidaciones(campo, reglasArray) {
    for (const regla of reglasArray) {
        const resultado = regla(campo);
        if (!resultado.valido) {
            return { valido: false, mensaje: resultado.mensaje };
        }
    }
    return { valido: true, mensaje: "" };
}

/**
 * Muestra mensaje de error en un campo
 * @param {HTMLElement} campo - El campo con error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(campo, mensaje) {
    const errorLabel = document.getElementById(campo.id + "ErrorLabel");
    if (errorLabel) {
        errorLabel.textContent = mensaje;
        errorLabel.style.display = 'block';
    }
    campo.classList.add('is-invalid');
    campo.classList.remove('is-valid');
}

/**
 * Limpia el error de un campo
 * @param {HTMLElement} campo - El campo a limpiar
 */
function limpiarError(campo) {
    const errorLabel = document.getElementById(campo.id + "ErrorLabel");
    if (errorLabel) {
        errorLabel.style.display = 'none';
        errorLabel.textContent = '';
    }
    campo.classList.remove('is-invalid');
    campo.classList.add('is-valid');
}

/**
 * Obtiene el contexto de la página desde data-page
 * @returns {string|null} - El valor de data-page o null
 */
function obtenerContextoPagina() {
    const elementoConDataPage = document.querySelector('[data-page]');
    return elementoConDataPage ? elementoConDataPage.getAttribute('data-page') : null;
}

/**
 * Valida un formulario completo
 * @param {string} formularioId - ID del contenedor del formulario
 * @returns {boolean} - true si válido, false si hay errores
 */
function validateForm(formularioId) {
    const form = document.getElementById(formularioId);
    if (!form) {
        console.error(`Formulario no encontrado: ${formularioId}`);
        return false;
    }

    const inputs = form.querySelectorAll('input[data-validacion="true"], textarea[data-validacion="true"]');
    const selects = form.querySelectorAll('select[data-validacion="true"]');

    let isValid = true;
    let firstInvalidElement = null;

    // Obtener contexto de página
    const page = obtenerContextoPagina();
    if (!page) {
        console.error("No se encontró el contexto de la página (data-page).");
        return false;
    }

    // Obtener reglas de validación
    if (!validaciones[page]) {
        console.error(`No se encontró configuración para la página: ${page}`);
        return false;
    }

    const validationRules = validaciones[page]();
    if (!validationRules) {
        console.error(`No se encontraron reglas para la página: ${page}`);
        return false;
    }

    // Validar inputs y textareas
    inputs.forEach(function(input) {
        const reglasArray = validationRules.reglasXCampo(input.id);
        
        // Verificar si está oculto o deshabilitado
        const isHidden = input.offsetParent === null || window.getComputedStyle(input).display === 'none';
        if (input.disabled || isHidden || !reglasArray || reglasArray.length === 0) {
            return;
        }

        const resultado = motorDeValidaciones(input, reglasArray);
        if (!resultado.valido) {
            mostrarError(input, resultado.mensaje);
            isValid = false;
            if (!firstInvalidElement) {
                firstInvalidElement = input;
            }
        } else {
            limpiarError(input);
        }
    });

    // Validar selects
    selects.forEach(function(select) {
        const reglasArray = validationRules.reglasXCampo(select.id);
        
        const isHidden = select.offsetParent === null || window.getComputedStyle(select).display === 'none';
        if (select.disabled || isHidden || !reglasArray || reglasArray.length === 0) {
            return;
        }

        const resultado = motorDeValidaciones(select, reglasArray);
        if (!resultado.valido) {
            mostrarError(select, resultado.mensaje);
            isValid = false;
            if (!firstInvalidElement) {
                firstInvalidElement = select;
            }
        } else {
            limpiarError(select);
        }
    });

    // Scroll al primer error
    if (!isValid && firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidElement.focus();
    }

    return isValid;
}

/**
 * Función para integrar con botones ASP.NET (OnClientClick)
 * Uso: OnClientClick="return triggerButtonClick('miFormulario');"
 * 
 * @param {string} formularioId - ID del contenedor div.form
 * @returns {boolean} - true para continuar postback, false para detenerlo
 */
function triggerButtonClick(formularioId) {
    const isValid = validateForm(formularioId);
    
    if (!isValid) {
        console.log('❌ Validación fallida - Postback detenido');
        return false; // Detiene el postback
    }
    
    console.log('✓ Validación exitosa - Continuando al servidor...');
    return true; // Permite el postback
}

/**
 * Valida un campo individual
 * @param {string} campoId - ID del campo a validar
 * @returns {boolean} - true si válido, false si hay error
 */
function validarCampoIndividual(campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return true;

    const page = obtenerContextoPagina();
    if (!page || !validaciones[page]) return true;

    const validationRules = validaciones[page]();
    const reglasArray = validationRules.reglasXCampo(campoId);
    
    if (!reglasArray || reglasArray.length === 0) return true;

    const resultado = motorDeValidaciones(campo, reglasArray);
    
    if (!resultado.valido) {
        mostrarError(campo, resultado.mensaje);
        return false;
    } else {
        limpiarError(campo);
        return true;
    }
}

/**
 * Auto-inicialización al cargar el DOM
 */
document.addEventListener("DOMContentLoaded", function() {
    const forms = document.querySelectorAll('div.form');
    
    forms.forEach(function(form) {
        const page = obtenerContextoPagina();
        if (!page) {
            console.warn("No se encontró data-page en la página");
            return;
        }

        if (!validaciones[page]) {
            console.warn(`No se encontró configuración para: ${page}`);
            return;
        }

        const validationRules = validaciones[page]();
        if (!validationRules) {
            console.warn(`No se encontraron reglas para: ${page}`);
            return;
        }

        const inputs = form.querySelectorAll('input[data-validacion="true"], textarea[data-validacion="true"]');
        const selects = form.querySelectorAll('select[data-validacion="true"]');

        // Eventos para inputs
        inputs.forEach(function(input) {
            const reglasArray = validationRules.reglasXCampo(input.id);
            if (!reglasArray || reglasArray.length === 0) return;

            // Validar mientras escribe
            input.addEventListener('input', function() {
                const resultado = motorDeValidaciones(input, reglasArray);
                resultado.valido ? limpiarError(input) : mostrarError(input, resultado.mensaje);
            });

            // Validar al perder foco
            input.addEventListener('blur', function() {
                const resultado = motorDeValidaciones(input, reglasArray);
                resultado.valido ? limpiarError(input) : mostrarError(input, resultado.mensaje);
            });
        });

        // Eventos para selects
        selects.forEach(function(select) {
            const reglasArray = validationRules.reglasXCampo(select.id);
            if (!reglasArray || reglasArray.length === 0) return;

            select.addEventListener('change', function() {
                const resultado = motorDeValidaciones(select, reglasArray);
                resultado.valido ? limpiarError(select) : mostrarError(select, resultado.mensaje);
            });
        });
    });

    console.log('✓ Motor de validaciones inicializado');
});
