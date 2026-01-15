/**
 * Minimo.js - Funcion Minimo
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Functions.Minimo
 *
 * Retorna el valor minimo entre los parametros proporcionados.
 * Ejemplo: #Minimo([Campo1],[Campo2])#
 */

const FunctionMinimoModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== CLASE DE FUNCION =====
    class FunctionMinimo extends EF.Core.FunctionBase {
        // Metadata estatica
        static functionName = 'Minimo';
        static functionId = 'Minimo';
        static icon = 'fa-arrow-down';
        static description = 'Retorna el valor minimo entre los parametros';
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
            return `#Minimo(${values.join(',')})#`;
        }

        /**
         * Vista previa corta
         */
        buildPreview(params) {
            const values = (params || []).filter(p => p && p.toString().trim() !== '');
            if (values.length === 0) return '#Minimo(...)#';

            const preview = values.join(',');
            if (preview.length > 30) {
                return `#Minimo(${preview.substring(0, 27)}...)#`;
            }
            return `#Minimo(${preview})#`;
        }

        /**
         * Valida los parametros
         */
        validate(params) {
            const values = (params || []).filter(p => p && p.toString().trim() !== '');

            if (values.length < 1) {
                return {
                    valid: false,
                    errors: ['Minimo requiere al menos 1 parametro']
                };
            }

            return { valid: true, errors: [] };
        }

        /**
         * Parsea una expresion guardada
         */
        parseExpression(expression) {
            const match = expression.match(/#Minimo\((.*)\)#/);
            if (!match) return null;

            return {
                param1: match[1] || ''
            };
        }
    }

    // Registrar en FunctionRegistry
    EF.Core.Registry.register(FunctionMinimo);

    // Registrar en namespace
    EF.Functions.Minimo = FunctionMinimo;

    // Compatibilidad global
    window.FunctionMinimo = FunctionMinimo;

    console.log('[EF] FunctionMinimo cargado');

    return FunctionMinimo;
})();
