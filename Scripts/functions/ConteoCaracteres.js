/**
 * ConteoCaracteres.js - Funcion Conteo de Caracteres
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Functions.ConteoCaracteres
 *
 * Cuenta la cantidad de caracteres en un campo.
 * Ejemplo: #CuentaCaracteres([NombreCompleto])#
 */

const FunctionConteoCaracteresModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== CLASE DE FUNCION =====
    class FunctionConteoCaracteres extends EF.Core.FunctionBase {
        // Metadata estatica
        static functionName = 'Conteo caracteres';
        static functionId = 'CuentaCaracteres';
        static icon = 'fa-text-width';
        static description = 'Cuenta la cantidad de caracteres en un campo';
        static category = 'texto';

        /**
         * Define los parametros de la funcion
         */
        getParameters() {
            return [
                {
                    id: 'param1',
                    label: 'Campo de texto',
                    type: 'miniBuilder',
                    required: true,
                    placeholder: 'Arrastra el campo a evaluar'
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
            return `#CuentaCaracteres(${value})#`;
        }

        /**
         * Vista previa corta
         */
        buildPreview(params) {
            const value = (params && params[0]) ? params[0].toString().trim() : '';
            if (!value) return '#CuentaCaracteres(...)#';

            if (value.length > 25) {
                return `#CuentaCaracteres(${value.substring(0, 22)}...)#`;
            }
            return `#CuentaCaracteres(${value})#`;
        }

        /**
         * Valida los parametros
         */
        validate(params) {
            const value = (params && params[0]) ? params[0].toString().trim() : '';

            if (!value) {
                return {
                    valid: false,
                    errors: ['Debe especificar un campo para contar caracteres']
                };
            }

            return { valid: true, errors: [] };
        }

        /**
         * Parsea una expresion guardada
         */
        parseExpression(expression) {
            const match = expression.match(/#CuentaCaracteres\((.*)\)#/);
            if (!match) return null;

            return {
                param1: match[1] || ''
            };
        }
    }

    // Registrar en FunctionRegistry
    EF.Core.Registry.register(FunctionConteoCaracteres);

    // Registrar en namespace
    EF.Functions.ConteoCaracteres = FunctionConteoCaracteres;

    // Compatibilidad global
    window.FunctionConteoCaracteres = FunctionConteoCaracteres;

    console.log('[EF] FunctionConteoCaracteres cargado');

    return FunctionConteoCaracteres;
})();
