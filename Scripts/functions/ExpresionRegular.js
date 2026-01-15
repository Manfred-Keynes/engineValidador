/**
 * ExpresionRegular.js - Funcion Expresion Regular
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Functions.ExpresionRegular
 *
 * Valida un campo contra una expresion regular.
 * Ejemplo: #ExpresionRegular([Email],^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)#
 */

const FunctionExpresionRegularModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== CLASE DE FUNCION =====
    class FunctionExpresionRegular extends EF.Core.FunctionBase {
        // Metadata estatica
        static functionName = 'Expresion regular';
        static functionId = 'ExpresionRegular';
        static icon = 'fa-code';
        static description = 'Valida un campo contra una expresion regular';
        static category = 'texto';

        /**
         * Define los parametros de la funcion
         */
        getParameters() {
            return [
                {
                    id: 'param1',
                    label: 'Campo a validar',
                    type: 'miniBuilder',
                    required: true,
                    placeholder: 'Arrastra el campo a validar'
                },
                {
                    id: 'param2',
                    label: 'Patron (Regex)',
                    type: 'text',
                    required: true,
                    placeholder: 'Ej: ^[a-zA-Z]+$'
                }
            ];
        }

        /**
         * Genera el formulario HTML
         */
        generateForm() {
            let html = '';

            // Mini-builder para el campo
            html += this.getMiniBuilder('param1', 'Campo a validar', 'Arrastra el campo a validar');

            // Input de texto para el patron regex
            html += `
            <div class="regex-input-container" style="margin-bottom: 20px;">
                <label style="display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">
                    Patron (Expresion Regular) <span style="color: var(--danger);">*</span>
                </label>
                <input type="text" id="regexPattern"
                       style="width: 100%; padding: 10px 14px; border: 2px solid var(--gray-300);
                              border-radius: 8px; font-size: 14px; font-family: 'Courier New', monospace;"
                       placeholder="Ej: ^[a-zA-Z0-9]+$"
                       onchange="FunctionExpresionRegular.validatePattern(this)">
                <div id="regexError" style="color: var(--danger); font-size: 11px; margin-top: 4px; display: none;"></div>
            </div>
            `;

            // Patrones comunes predefinidos
            html += `
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 12px; font-weight: 600; color: var(--gray-600); margin-bottom: 8px;">
                    <i class="fas fa-magic" style="margin-right: 4px;"></i> Patrones comunes
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <button type="button" onclick="FunctionExpresionRegular.setPattern('^[a-zA-Z]+$')"
                            class="regex-preset-btn" style="padding: 4px 8px; background: var(--gray-100);
                            border: 1px solid var(--gray-300); border-radius: 4px; font-size: 11px; cursor: pointer;">
                        Solo letras
                    </button>
                    <button type="button" onclick="FunctionExpresionRegular.setPattern('^[0-9]+$')"
                            class="regex-preset-btn" style="padding: 4px 8px; background: var(--gray-100);
                            border: 1px solid var(--gray-300); border-radius: 4px; font-size: 11px; cursor: pointer;">
                        Solo numeros
                    </button>
                    <button type="button" onclick="FunctionExpresionRegular.setPattern('^[a-zA-Z0-9]+$')"
                            class="regex-preset-btn" style="padding: 4px 8px; background: var(--gray-100);
                            border: 1px solid var(--gray-300); border-radius: 4px; font-size: 11px; cursor: pointer;">
                        Alfanumerico
                    </button>
                    <button type="button" onclick="FunctionExpresionRegular.setPattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$')"
                            class="regex-preset-btn" style="padding: 4px 8px; background: var(--gray-100);
                            border: 1px solid var(--gray-300); border-radius: 4px; font-size: 11px; cursor: pointer;">
                        Email
                    </button>
                    <button type="button" onclick="FunctionExpresionRegular.setPattern('^[0-9]{8}$')"
                            class="regex-preset-btn" style="padding: 4px 8px; background: var(--gray-100);
                            border: 1px solid var(--gray-300); border-radius: 4px; font-size: 11px; cursor: pointer;">
                        8 digitos
                    </button>
                </div>
            </div>
            `;

            return html;
        }

        /**
         * Establece un patron predefinido
         */
        static setPattern(pattern) {
            const input = document.getElementById('regexPattern');
            if (input) {
                input.value = pattern;
                this.validatePattern(input);
            }
        }

        /**
         * Valida que el patron regex sea valido
         */
        static validatePattern(input) {
            const errorDiv = document.getElementById('regexError');
            try {
                new RegExp(input.value);
                input.style.borderColor = 'var(--success, #10b981)';
                if (errorDiv) errorDiv.style.display = 'none';
            } catch (e) {
                input.style.borderColor = 'var(--danger, #ef4444)';
                if (errorDiv) {
                    errorDiv.textContent = `Patron regex invalido: ${e.message}`;
                    errorDiv.style.display = 'block';
                }
            }
        }

        /**
         * Construye la expresion final
         */
        buildExpression(params) {
            const campo = (params && params[0]) ? params[0].toString().trim() : '';
            const patron = (params && params[1]) ? params[1].toString().trim() : '';
            return `#ExpresionRegular(${campo},${patron})#`;
        }

        /**
         * Vista previa corta
         */
        buildPreview(params) {
            const campo = (params && params[0]) ? params[0].toString().trim() : '';
            if (!campo) return '#ExpresionRegular(...)#';
            return `#ExpresionRegular(${campo},...)#`;
        }

        /**
         * Valida los parametros
         */
        validate(params) {
            const errors = [];

            const campo = (params && params[0]) ? params[0].toString().trim() : '';
            const patron = (params && params[1]) ? params[1].toString().trim() : '';

            if (!campo) {
                errors.push('Debe especificar un campo a validar');
            }

            if (!patron) {
                errors.push('Debe especificar un patron regex');
            } else {
                try {
                    new RegExp(patron);
                } catch (e) {
                    errors.push(`El patron regex es invalido: ${e.message}`);
                }
            }

            return {
                valid: errors.length === 0,
                errors: errors
            };
        }

        /**
         * Parsea una expresion guardada
         */
        parseExpression(expression) {
            const match = expression.match(/#ExpresionRegular\(([^,]+),(.+)\)#/);
            if (!match) return null;

            return {
                param1: match[1] || '',
                param2: match[2] || ''
            };
        }

        /**
         * Recolecta parametros incluyendo el input de texto
         */
        collectParams() {
            const params = [];

            // Param1 del mini-builder
            const builderId = this.generateBuilderId('param1');
            const components = this.getMiniBuilderComponents(builderId);
            params.push(this.buildComponentsExpression(components));

            // Param2 del input de texto
            const regexInput = document.getElementById('regexPattern');
            params.push(regexInput ? regexInput.value : '');

            return params;
        }
    }

    // Registrar en FunctionRegistry
    EF.Core.Registry.register(FunctionExpresionRegular);

    // Registrar en namespace
    EF.Functions.ExpresionRegular = FunctionExpresionRegular;

    // Compatibilidad global
    window.FunctionExpresionRegular = FunctionExpresionRegular;

    console.log('[EF] FunctionExpresionRegular cargado');

    return FunctionExpresionRegular;
})();
