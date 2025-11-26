/**
 * reglas.js
 * Funciones de validación reutilizables
 * 
 * Cada función recibe un control HTML y retorna:
 * { valido: boolean, mensaje: string }
 */
const reglas = (() => {
    
    // Función auxiliar para obtener el nombre del campo desde el label
    const obtenerNombreCampo = (control) => {
        const label = document.querySelector(`label[for="${control.id}"]`);
        if (!label) return control.id;
        
        const labelText = Array.from(label.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join(" ");
        
        return labelText || control.id;
    };

    // Validar que el campo no esté vacío
    const validarNoNulo = (control) => {
        const valido = control.value.trim() !== "";
        return {
            valido,
            mensaje: valido ? "" : `El campo ${obtenerNombreCampo(control)} es requerido`
        };
    };

    // Validar longitud máxima (función de orden superior)
    const validarLongitudMaxima = (max) => (control) => {
        if (control.value.length > max) {
            control.value = control.value.slice(0, max);
        }
        return {
            valido: control.value.length <= max,
            mensaje: `El campo ${obtenerNombreCampo(control)} permite un máximo de ${max} caracteres`
        };
    };

    // Validar longitud mínima
    const validarLongitudMinima = (min) => (control) => {
        const valido = control.value.length >= min;
        return {
            valido,
            mensaje: valido ? "" : `El campo ${obtenerNombreCampo(control)} requiere un mínimo de ${min} caracteres`
        };
    };

    // Validar solo números
    const validarSoloNumeros = (control) => {
        const valor = control.value;
        const esNumero = /^\d*$/.test(valor);
        
        if (!esNumero) {
            control.value = valor.replace(/\D/g, '');
        }
        
        return {
            valido: esNumero,
            mensaje: `El campo ${obtenerNombreCampo(control)} solo acepta números`
        };
    };

    // Validar solo texto (letras y espacios)
    const validarSoloTexto = (control) => {
        const valor = control.value;
        const esTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor);
        
        if (!esTexto) {
            control.value = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        }
        
        return {
            valido: esTexto,
            mensaje: `El campo ${obtenerNombreCampo(control)} solo acepta letras y espacios`
        };
    };

    // Validar alfanumérico
    const validarAlfanumerico = (control) => {
        const valor = control.value;
        const esAlfanumerico = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(valor);
        
        if (!esAlfanumerico) {
            control.value = valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
        }
        
        return {
            valido: esAlfanumerico,
            mensaje: `El campo ${obtenerNombreCampo(control)} solo acepta letras, números y espacios`
        };
    };

    // Validar email
    const validarEmail = (control) => {
        const valor = control.value.trim();
        if (valor === "") return { valido: true, mensaje: "" };
        
        const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
        return {
            valido: esEmailValido,
            mensaje: esEmailValido ? "" : `El campo ${obtenerNombreCampo(control)} debe ser un email válido`
        };
    };

    // Validar DPI guatemalteco
    const validarDPI = (control) => {
        const valor = control.value.replace(/\s/g, '');
        const nombreCampo = obtenerNombreCampo(control);

        // Validar formato (13 dígitos)
        if (!/^[0-9]{13}$/.test(valor)) {
            return { valido: false, mensaje: `${nombreCampo} debe tener 13 dígitos` };
        }

        const depto = parseInt(valor.substring(9, 11), 10);
        const muni = parseInt(valor.substring(11, 13), 10);
        const numero = valor.substring(0, 8);
        const verificador = parseInt(valor.substring(8, 9), 10);

        // Municipios por departamento (Guatemala)
        const munisPorDepto = [17, 8, 16, 16, 13, 14, 19, 8, 24, 21, 9, 30, 32, 21, 8, 17, 14, 5, 11, 11, 7, 17];
        
        if (!(depto >= 1 && depto <= munisPorDepto.length && muni >= 1 && muni <= munisPorDepto[depto - 1])) {
            return { valido: false, mensaje: `${nombreCampo} tiene código de municipio/departamento inválido` };
        }

        // Validar verificador (módulo 11)
        let total = 0;
        for (let i = 0; i < numero.length; i++) {
            total += parseInt(numero[i], 10) * (i + 2);
        }
        
        if (total % 11 !== verificador) {
            return { valido: false, mensaje: `${nombreCampo} es inválido` };
        }

        return { valido: true, mensaje: "" };
    };

    // Validar NIT guatemalteco
    const validarNIT = (control) => {
        const valor = control.value.replace(/[-\s]/g, '').toUpperCase();
        const nombreCampo = obtenerNombreCampo(control);

        if (valor === "") return { valido: true, mensaje: "" };

        // Validar formato
        if (!/^[0-9]+[0-9K]$/.test(valor)) {
            return { valido: false, mensaje: `${nombreCampo} tiene un formato inválido` };
        }

        const verificador = valor.slice(-1);
        const numeros = valor.slice(0, -1);

        let total = 0;
        for (let i = 0; i < numeros.length; i++) {
            total += parseInt(numeros[i], 10) * (numeros.length + 1 - i);
        }

        const modulo = (11 - (total % 11)) % 11;
        const verificadorCalculado = modulo === 10 ? 'K' : modulo.toString();

        const valido = verificador === verificadorCalculado;
        return {
            valido,
            mensaje: valido ? "" : `${nombreCampo} es inválido`
        };
    };

    // Validar select no vacío
    const validarSeleccion = (control) => {
        const valido = control.value !== "" && control.value !== "0";
        return {
            valido,
            mensaje: valido ? "" : `Debe seleccionar una opción en ${obtenerNombreCampo(control)}`
        };
    };

    // Validar solo decimales
    const validarSoloDecimales = (control) => {
        const valor = control.value.trim();
        const esDecimalValido = /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(valor) || /^\d+(\.\d{1,2})?$/.test(valor);
        return {
            valido: esDecimalValido || valor === "",
            mensaje: esDecimalValido || valor === "" ? "" : `El campo ${obtenerNombreCampo(control)} debe ser un número decimal válido`
        };
    };

    // Validar fechas futuras
    const soloFechasFuturas = (control) => {
        const fechaIngresada = new Date(control.value);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const nombreCampo = obtenerNombreCampo(control);

        if (isNaN(fechaIngresada.getTime())) {
            return { valido: false, mensaje: `${nombreCampo} tiene un formato inválido` };
        }

        if (fechaIngresada <= hoy) {
            return { valido: false, mensaje: `${nombreCampo} debe ser una fecha futura` };
        }

        return { valido: true, mensaje: "" };
    };

    // Validar fechas pasadas
    const soloFechasPasadas = (control) => {
        const fechaIngresada = new Date(control.value);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const nombreCampo = obtenerNombreCampo(control);

        if (isNaN(fechaIngresada.getTime())) {
            return { valido: false, mensaje: `${nombreCampo} tiene un formato inválido` };
        }

        if (fechaIngresada >= hoy) {
            return { valido: false, mensaje: `${nombreCampo} debe ser una fecha pasada` };
        }

        return { valido: true, mensaje: "" };
    };

    // Exponer funciones públicas
    return {
        obtenerNombreCampo,
        validarNoNulo,
        validarLongitudMaxima,
        validarLongitudMinima,
        validarSoloNumeros,
        validarSoloTexto,
        validarAlfanumerico,
        validarEmail,
        validarDPI,
        validarNIT,
        validarSeleccion,
        validarSoloDecimales,
        soloFechasFuturas,
        soloFechasPasadas
    };
})();
