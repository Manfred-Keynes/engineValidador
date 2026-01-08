/**
 * Maximo.js - Funcion Maximo
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Functions.Maximo
 *
 * Retorna el valor maximo entre los parametros proporcionados.
 * Ejemplo: #Maximo([Campo1],[Campo2])#
 */

const FunctionMaximoModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== CLASE DE FUNCION =====
    class FunctionMaximo extends EF.Core.FunctionBase {
        // Metadata estatica
        static functionName = 'Maximo';
        static functionId = 'Maximo';
        static icon = 'fa-arrow-up';
        static description = 'Retorna el valor maximo entre los parametros';
        static category = 'agregacion';

        /**
         * Define los parametros de la funcion
         */
        getParameters() {
            return [
                {
                    id: 'param1',
                    label: 'Campo',
                    type: 'miniBuilder',
                    required: true,
                    placeholder: 'Arrastra un campo o expresion'
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
            const values = (params || []).filter(p => p && p.toString().trim() !== '');
            return `#Maximo(${values.join(',')})#`;
        }

        /**
         * Vista previa corta
         */
        buildPreview(params) {
            const values = (params || []).filter(p => p && p.toString().trim() !== '');
            if (values.length === 0) return '#Maximo(...)#';

            const preview = values.join(',');
            if (preview.length > 30) {
                return `#Maximo(${preview.substring(0, 27)}...)#`;
            }
            return `#Maximo(${preview})#`;
        }

        /**
         * Valida los parametros
         */
        validate(params) {
            const values = (params || []).filter(p => p && p.toString().trim() !== '');

            if (values.length < 1) {
                return {
                    valid: false,
                    errors: ['Maximo requiere al menos 1 parametro']
                };
            }

            return { valid: true, errors: [] };
        }

        /**
         * Parsea una expresion guardada
         */
        parseExpression(expression) {
            const match = expression.match(/#Maximo\((.*)\)#/);
            if (!match) return null;

            return {
                param1: match[1] || ''
            };
        }
    }

    // Registrar en FunctionRegistry
    EF.Core.Registry.register(FunctionMaximo);

    // Registrar en namespace
    EF.Functions.Maximo = FunctionMaximo;

    // Compatibilidad global
    window.FunctionMaximo = FunctionMaximo;

    console.log('[EF] FunctionMaximo cargado');

    return FunctionMaximo;
})();
