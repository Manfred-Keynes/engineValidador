/**
 * Conteo.js - Funcion Conteo
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Functions.Conteo
 *
 * Cuenta la cantidad de elementos/valores proporcionados.
 * Ejemplo: #Conteo([Campo1],[Campo2],[Campo3])#
 */

const FunctionConteoModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== CLASE DE FUNCION =====
    class FunctionConteo extends EF.Core.FunctionBase {
        // Metadata estatica
        static functionName = 'Conteo';
        static functionId = 'Conteo';
        static icon = 'fa-hashtag';
        static description = 'Cuenta la cantidad de valores proporcionados';
        static category = 'agregacion';
        static allowMultipleParams = true;

        constructor(varId, builderId) {
            super(varId, builderId);
            this.paramCount = 1;
        }

        /**
         * Define los parametros de la funcion
         */
        getParameters() {
            const params = [];
            for (let i = 1; i <= this.paramCount; i++) {
                params.push({
                    id: `param${i}`,
                    label: i === 1 ? 'Campo o Expresion' : `Campo ${i}`,
                    type: 'miniBuilder',
                    required: i === 1,
                    placeholder: 'Arrastra campos, operadores o funciones'
                });
            }
            return params;
        }

        /**
         * Genera el formulario HTML con boton para agregar campos
         */
        generateForm() {
            let html = this.getMiniBuilder('param1', 'Campo o Expresion', 'Arrastra campos, operadores o funciones');

            // Boton para agregar mas parametros
            html += `
            <div style="text-align: center; margin: 12px 0;">
                <button type="button" onclick="FunctionConteo.addParam()"
                        style="padding: 8px 16px; background: var(--primary-light);
                               border: 2px solid var(--primary); border-radius: 6px;
                               color: var(--primary-dark); font-weight: 600; cursor: pointer; font-size: 12px;">
                    <i class="fas fa-plus"></i> Agregar Campo
                </button>
            </div>
            <div id="additionalParams"></div>
            `;

            return html;
        }

        /**
         * Metodo estatico para agregar parametros dinamicamente
         */
        static addParam() {
            const container = document.getElementById('additionalParams');
            if (!container) return;

            const existingParams = container.querySelectorAll('.mini-builder-container').length;
            const paramNumber = existingParams + 2;

            const levelId = EF.State.navigationStack && EF.State.navigationStack.currentLevel >= 0 ? EF.State.navigationStack.currentLevel : 0;
            const varId = EF.State.currentConfigVarId || 'default';
            const builderId = `miniBuilder_var${varId}_level${levelId}_param${paramNumber}`;

            const html = `
            <div class="mini-builder-container" style="margin-bottom: 20px; position: relative;">
                <label style="display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">
                    Campo ${paramNumber}
                </label>
                <div class="mini-expression-builder"
                     id="${builderId}"
                     ondrop="dropIntoMiniBuilder(event, '${builderId}')"
                     ondragover="allowMiniBuilderDrop(event)"
                     ondragleave="dragMiniBuilderLeave(event)"
                     data-param-id="param${paramNumber}">
                    <div class="empty" style="font-size: 13px; color: var(--gray-500); display: flex; align-items: center; justify-content: center; min-height: 60px;">
                        <i class="fas fa-hand-pointer" style="margin-right: 6px;"></i>
                        Arrastra campos
                    </div>
                </div>
                <button type="button" onclick="FunctionConteo.removeParam(this)"
                        style="position: absolute; top: 0; right: 0; background: #fee2e2;
                               border: 1px solid #fecaca; border-radius: 4px; padding: 4px 8px;
                               cursor: pointer; font-size: 11px; color: #dc2626;">
                    <i class="fas fa-times"></i> Quitar
                </button>
            </div>
            `;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const newParam = tempDiv.firstElementChild;

            newParam.style.opacity = '0';
            newParam.style.transform = 'translateY(-10px)';
            container.appendChild(newParam);

            setTimeout(() => {
                newParam.style.transition = 'all 0.3s ease';
                newParam.style.opacity = '1';
                newParam.style.transform = 'translateY(0)';
            }, 10);
        }

        /**
         * Metodo estatico para quitar un parametro
         */
        static removeParam(button) {
            const container = button.closest('.mini-builder-container');
            if (container) {
                container.style.transition = 'all 0.2s ease';
                container.style.opacity = '0';
                container.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    container.remove();
                }, 200);
            }
        }

        /**
         * Construye la expresion final
         */
        buildExpression(params) {
            const values = (params || []).filter(p => p && p.toString().trim() !== '');
            return `#Conteo(${values.join(',')})#`;
        }

        /**
         * Vista previa corta
         */
        buildPreview(params) {
            const values = (params || []).filter(p => p && p.toString().trim() !== '');
            if (values.length === 0) return '#Conteo(...)#';

            const preview = values.join(',');
            if (preview.length > 28) {
                return `#Conteo(${preview.substring(0, 25)}...)#`;
            }
            return `#Conteo(${preview})#`;
        }

        /**
         * Valida los parametros
         */
        validate(params) {
            const values = (params || []).filter(p => p && p.toString().trim() !== '');

            if (values.length < 1) {
                return {
                    valid: false,
                    errors: ['Conteo requiere al menos 1 parametro']
                };
            }

            return { valid: true, errors: [] };
        }

        /**
         * Parsea una expresion guardada
         */
        parseExpression(expression) {
            const match = expression.match(/#Conteo\((.*)\)#/);
            if (!match) return null;

            const paramsStr = match[1];
            const params = this._parseParams(paramsStr);

            const result = {};
            params.forEach((p, i) => {
                result[`param${i + 1}`] = p;
            });

            return result;
        }

        _parseParams(paramsStr) {
            const params = [];
            let current = '';
            let depth = 0;

            for (let i = 0; i < paramsStr.length; i++) {
                const char = paramsStr[i];

                if (char === '(' || char === '[') {
                    depth++;
                    current += char;
                } else if (char === ')' || char === ']') {
                    depth--;
                    current += char;
                } else if (char === ',' && depth === 0) {
                    params.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }

            if (current.trim()) {
                params.push(current.trim());
            }

            return params;
        }
    }

    // Registrar en FunctionRegistry
    EF.Core.Registry.register(FunctionConteo);

    // Registrar en namespace
    EF.Functions.Conteo = FunctionConteo;

    // Compatibilidad global
    window.FunctionConteo = FunctionConteo;

    console.log('[EF] FunctionConteo cargado');

    return FunctionConteo;
})();
