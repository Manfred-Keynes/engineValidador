/**
 * SiEntonces.js - Funcion Si Entonces (Condicional)
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Functions.SiEntonces
 *
 * Implementa logica condicional: Si condicion entonces valor_verdadero sino valor_falso
 * Usa interfaz de tabs para los 3 parametros.
 * Ejemplo: #IF([edad] > 18)# #THEN([activo])TH# #ELSE([inactivo])EL#
 */

const FunctionSiEntoncesModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== CLASE DE FUNCION =====
    class FunctionSiEntonces extends EF.Core.FunctionBase {
        // Metadata estatica
        static functionName = 'Si entonces';
        static functionId = 'SiEntonces';
        static icon = 'fa-code-branch';
        static description = 'Condicional: Si condicion entonces valor, sino otro valor';
        static category = 'condicional';

        /**
         * Define los parametros de la funcion
         */
        getParameters() {
            return [
                {
                    id: 'param1',
                    label: 'Condicion',
                    icon: '?',
                    type: 'miniBuilder',
                    required: true,
                    placeholder: 'Arrastra campos y operadores de comparacion'
                },
                {
                    id: 'param2',
                    label: 'Verdadero',
                    icon: 'V',
                    type: 'miniBuilder',
                    required: true,
                    placeholder: 'Valor si la condicion es verdadera'
                },
                {
                    id: 'param3',
                    label: 'Falso',
                    icon: 'X',
                    type: 'miniBuilder',
                    required: true,
                    placeholder: 'Valor si la condicion es falsa'
                }
            ];
        }

        /**
         * Genera el formulario HTML con interfaz de tabs
         */
        generateForm() {
            const levelId = this.getCurrentLevel();
            const params = this.getParameters();

            // Headers de tabs
            let tabHeaders = '<div class="si-entonces-tabs-header">';
            params.forEach((param, index) => {
                const activeClass = index === 0 ? 'active' : '';
                tabHeaders += `
                    <button type="button" class="si-entonces-tab-button ${activeClass}"
                            onclick="FunctionSiEntonces.switchTab('${param.id}')"
                            data-tab="${param.id}">
                        <span style="font-size: 16px; margin-right: 6px;">${param.icon}</span>
                        ${param.label}
                    </button>
                `;
            });
            tabHeaders += '</div>';

            // Contenido de tabs
            const varId = EF.State.currentConfigVarId || 'default';
            let tabContent = '<div class="si-entonces-tabs-content">';
            params.forEach((param, index) => {
                const activeClass = index === 0 ? 'active' : '';
                const builderId = `miniBuilder_var${varId}_level${levelId}_${param.id}`;

                tabContent += `
                    <div class="si-entonces-tab-panel ${activeClass}" data-tab="${param.id}">
                        <div id="breadcrumb_${builderId}" class="mini-builder-breadcrumb" style="display: none;">
                        </div>
                        <div class="mini-expression-builder"
                             id="${builderId}"
                             ondrop="dropIntoMiniBuilder(event, '${builderId}')"
                             ondragover="allowMiniBuilderDrop(event)"
                             ondragleave="dragMiniBuilderLeave(event)"
                             data-param-id="${param.id}">
                            <div class="empty" style="font-size: 13px; color: var(--gray-500);
                                        display: flex; align-items: center; justify-content: center; min-height: 60px;">
                                <i class="fas fa-hand-pointer" style="margin-right: 6px;"></i>
                                ${param.placeholder}
                            </div>
                        </div>
                    </div>
                `;
            });
            tabContent += '</div>';

            return `
                <div class="si-entonces-tabs-container">
                    ${tabHeaders}
                    ${tabContent}
                </div>
            `;
        }

        /**
         * Metodo estatico para cambiar entre tabs
         */
        static switchTab(tabId) {
            // Actualizar botones
            document.querySelectorAll('.si-entonces-tab-button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabId);
            });

            // Actualizar paneles
            document.querySelectorAll('.si-entonces-tab-panel').forEach(panel => {
                panel.classList.toggle('active', panel.dataset.tab === tabId);
            });

            console.log('SiEntonces: Cambiado a tab', tabId);
        }

        /**
         * Construye la expresion final
         * Formato: #IF(condicion)# #THEN(verdadero)TH# #ELSE(falso)EL#
         */
        buildExpression(params) {
            const condition = (params && params[0]) ? params[0].toString().trim() : '';
            const trueVal = (params && params[1]) ? params[1].toString().trim() : '';
            const falseVal = (params && params[2]) ? params[2].toString().trim() : '';

            return `#IF(${condition})# #THEN(${trueVal})TH# #ELSE(${falseVal})EL#`;
        }

        /**
         * Vista previa corta
         */
        buildPreview(params) {
            const condition = (params && params[0]) ? params[0].toString().trim() : '';
            const trueVal = (params && params[1]) ? params[1].toString().trim() : '';
            const falseVal = (params && params[2]) ? params[2].toString().trim() : '';

            let preview = '#Si entonces(';

            if (condition) {
                preview += condition.length > 15 ? `${condition.substring(0, 12)}...` : condition;
            } else {
                preview += '...';
            }

            if (trueVal || falseVal) {
                preview += ' -> ';
                if (trueVal) {
                    preview += trueVal.length > 10 ? `${trueVal.substring(0, 7)}...` : trueVal;
                }
                if (falseVal) {
                    preview += ' | ';
                    preview += falseVal.length > 10 ? `${falseVal.substring(0, 7)}...` : falseVal;
                }
            }

            return preview + ')#';
        }

        /**
         * Valida los parametros
         */
        validate(params) {
            const errors = [];

            const condition = (params && params[0]) ? params[0].toString().trim() : '';
            const trueVal = (params && params[1]) ? params[1].toString().trim() : '';
            const falseVal = (params && params[2]) ? params[2].toString().trim() : '';

            if (!condition) {
                errors.push('Debe especificar una condicion');
            }

            if (!trueVal) {
                errors.push('Debe especificar un valor para cuando la condicion sea verdadera');
            }

            if (!falseVal) {
                errors.push('Debe especificar un valor para cuando la condicion sea falsa');
            }

            return {
                valid: errors.length === 0,
                errors: errors
            };
        }

        /**
         * Parsea una expresion guardada
         * Formato: #IF(condicion)# #THEN(verdadero)TH# #ELSE(falso)EL#
         */
        parseExpression(expression) {
            const ifMatch = expression.match(/#IF\((.*?)\)#/);
            const thenMatch = expression.match(/#THEN\((.*?)\)TH#/);
            const elseMatch = expression.match(/#ELSE\((.*?)\)EL#/);

            if (!ifMatch && !thenMatch && !elseMatch) {
                return null;
            }

            return {
                param1: ifMatch ? ifMatch[1] : '',
                param2: thenMatch ? thenMatch[1] : '',
                param3: elseMatch ? elseMatch[1] : ''
            };
        }

        /**
         * Recolecta parametros de los tres tabs
         */
        collectParams() {
            const params = [];
            const paramIds = ['param1', 'param2', 'param3'];

            paramIds.forEach(paramId => {
                const builderId = this.generateBuilderId(paramId);
                const components = this.getMiniBuilderComponents(builderId);
                params.push(this.buildComponentsExpression(components));
            });

            return params;
        }
    }

    // Registrar en FunctionRegistry
    EF.Core.Registry.register(FunctionSiEntonces);

    // Registrar en namespace
    EF.Functions.SiEntonces = FunctionSiEntonces;

    // Compatibilidad global
    window.FunctionSiEntonces = FunctionSiEntonces;

    console.log('[EF] FunctionSiEntonces cargado');

    return FunctionSiEntonces;
})();
