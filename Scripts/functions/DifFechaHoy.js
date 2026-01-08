/**
 * DifFechaHoy.js - Funcion Diferencia de Fecha con Hoy
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Functions.DifFechaHoy
 *
 * Calcula la diferencia en dias entre una fecha y la fecha actual.
 * Ejemplo: #DifFechaHoy([FechaVencimiento])#
 */

const FunctionDifFechaHoyModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== CLASE DE FUNCION =====
    class FunctionDifFechaHoy extends EF.Core.FunctionBase {
        // Metadata estatica
        static functionName = 'DifFechaHoy';
        static functionId = 'DifFechaHoy';
        static icon = 'fa-calendar-day';
        static description = 'Calcula la diferencia en dias entre una fecha y hoy';
        static category = 'fecha';

        /**
         * Define los parametros de la funcion
         */
        getParameters() {
            return [
                {
                    id: 'param1',
                    label: 'Campo de fecha',
                    type: 'miniBuilder',
                    required: true,
                    placeholder: 'Arrastra el campo de fecha'
                }
            ];
        }

        /**
         * Genera el formulario HTML
         */
        generateForm() {
            const params = this.getParameters();
            let html = '';

            params.forEach(param => {
                html += this.getMiniBuilder(param.id, param.label, param.placeholder);
            });

            return html;
        }

        /**
         * Construye la expresion final
         */
        buildExpression(params) {
            const value = (params && params[0]) ? params[0].toString().trim() : '';
            return `#DifFechaHoy(${value})#`;
        }

        /**
         * Vista previa corta
         */
        buildPreview(params) {
            const value = (params && params[0]) ? params[0].toString().trim() : '';
            if (!value) return '#DifFechaHoy(...)#';

            if (value.length > 25) {
                return `#DifFechaHoy(${value.substring(0, 22)}...)#`;
            }
            return `#DifFechaHoy(${value})#`;
        }

        /**
         * Valida los parametros
         */
        validate(params) {
            const value = (params && params[0]) ? params[0].toString().trim() : '';

            if (!value) {
                return {
                    valid: false,
                    errors: ['Debe especificar un campo de fecha']
                };
            }

            return { valid: true, errors: [] };
        }

        /**
         * Parsea una expresion guardada
         */
        parseExpression(expression) {
            const match = expression.match(/#DifFechaHoy\((.*)\)#/);
            if (!match) return null;

            return {
                param1: match[1] || ''
            };
        }
    }

    // Registrar en FunctionRegistry
    EF.Core.Registry.register(FunctionDifFechaHoy);

    // Registrar en namespace
    EF.Functions.DifFechaHoy = FunctionDifFechaHoy;

    // Compatibilidad global
    window.FunctionDifFechaHoy = FunctionDifFechaHoy;

    console.log('[EF] FunctionDifFechaHoy cargado');

    return FunctionDifFechaHoy;
})();
