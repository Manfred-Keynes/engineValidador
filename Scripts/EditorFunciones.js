/**
 * EditorFunciones.js - Core del Editor de Funciones
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.Editor
 *
 * ARQUITECTURA MODULAR:
 * Este archivo trabaja en conjunto con los modulos en Scripts/core/:
 * - Namespace.js             - Namespace principal EF
 * - DragDropManager.js       - Sistema de arrastrar y soltar
 * - NavigationStack.js       - Navegacion entre niveles
 * - MiniBuilderManager.js    - Mini expression builders
 * - ExpressionBuilder.js     - Constructor de expresiones
 * - ConfigPanel.js           - Panel de configuracion
 * - FunctionCatalog.js       - Catalogo de funciones
 * - AutocompleteManager.js   - Sistema de autocompletado
 * - LogicExpressionBuilder.js - Expresiones logicas
 * - InputHandlers.js         - Manejo de eventos de input
 * - VariableCardManager.js   - Gestion de tarjetas de variables
 */

const EditorFuncionesModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ==========================================
    // INICIALIZACION DE ESTADO
    // ==========================================

    // Asegurar que EF.State tiene todos los valores necesarios
    EF.State.expressionComponents = EF.State.expressionComponents || {};
    EF.State.componentCounter = EF.State.componentCounter || 0;
    EF.State.miniBuilderComponents = EF.State.miniBuilderComponents || {};
    EF.State.navigationStack = EF.State.navigationStack || { levels: [], currentLevel: -1 };
    EF.State.activeInput = EF.State.activeInput || null;
    EF.State.currentConfigVarId = EF.State.currentConfigVarId || null;
    EF.State.currentFunction = EF.State.currentFunction || null;
    EF.State.draggedFunctionName = EF.State.draggedFunctionName || null;
    EF.State.draggedOperator = EF.State.draggedOperator || null;
    EF.State.draggedField = EF.State.draggedField || null;
    EF.State.targetVarId = EF.State.targetVarId || null;

    // ==========================================
    // FUNCTION UTILS
    // ==========================================

    const FunctionUtils = {
        generateMiniBuilder: (paramId, label, placeholder = 'Arrastra campos, operadores o funciones') => {
            const state = EF.State;
            const levelId = state.navigationStack.currentLevel >= 0 ? state.navigationStack.currentLevel : 0;
            const varId = state.currentConfigVarId || 'default';
            const builderId = `miniBuilder_var${varId}_level${levelId}_${paramId}`;

            console.log('[EF.Editor] Generando mini-builder:', builderId);

            return `
                <div class="mini-builder-container" style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">
                        ${label} <span style="color: var(--danger);">*</span>
                    </label>
                    <div class="mini-expression-builder" id="${builderId}"
                         ondrop="dropIntoMiniBuilder(event, '${builderId}')"
                         ondragover="allowMiniBuilderDrop(event)"
                         ondragleave="dragMiniBuilderLeave(event)"
                         data-param-id="${paramId}">
                        <div class="empty" style="font-size: 13px; color: var(--gray-500); display: flex; align-items: center; justify-content: center; min-height: 60px;">
                            <i class="fas fa-hand-pointer" style="margin-right: 6px;"></i>
                            ${placeholder}
                        </div>
                    </div>
                </div>
            `;
        },

        buildComponentsExpression: (components) => {
            if (typeof buildComponentsExpression === 'function') {
                return buildComponentsExpression(components);
            }
            return '';
        },

        parseExpressionToComponents: (expression) => {
            if (typeof parseExpressionToComponents === 'function') {
                return parseExpressionToComponents(expression);
            }
            return [];
        }
    };

    // ==========================================
    // FUNCIONES DE SIDEBAR
    // ==========================================

    const closeOperatorsSidebar = () => {
        const sidebar = document.querySelector('.operators-sidebar');
        if (sidebar) {
            sidebar.style.display = 'none';
        }
    };

    // ==========================================
    // FUNCIONES DE DROP
    // ==========================================

    const dropFunction = (event, varId) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');

        document.querySelectorAll('.draggable-function-item.dragging').forEach(item => {
            item.classList.remove('dragging');
        });

        if (!EF.State.draggedFunctionName) return;

        const builder = document.getElementById(`exprBuilder${varId}`);
        if (builder) {
            const tempInput = document.createElement('textarea');
            tempInput.style.display = 'none';
            builder.appendChild(tempInput);

            EF.State.activeInput = tempInput;
            EF.State.activeInput.varId = varId;
        }

        openFunctionModal(EF.State.draggedFunctionName, EF.State.activeInput);

        EF.State.draggedFunctionName = null;
        EF.State.targetVarId = null;
    };

    const filterSidebarFunctions = (event) => {
        const query = event.target.value.toLowerCase();
        const items = document.querySelectorAll('.draggable-function-item');

        items.forEach(item => {
            const name = item.querySelector('.draggable-function-name').textContent.toLowerCase();
            const desc = item.querySelector('.draggable-function-desc').textContent.toLowerCase();

            if (name.includes(query) || desc.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    };

    // ==========================================
    // SELECTORES
    // ==========================================

    const openFunctionSelector = (varId) => {
        const builder = document.getElementById(`exprBuilder${varId}`);
        const tempInput = document.createElement('textarea');
        tempInput.style.display = 'none';
        builder.appendChild(tempInput);

        EF.State.activeInput = tempInput;
        EF.State.activeInput.varId = varId;

        const card = builder.closest('.variable-card');
        const functionMenu = card.querySelector('.function-menu');
        if (functionMenu) {
            document.querySelectorAll('.function-menu.active').forEach(m => {
                m.classList.remove('active');
            });

            functionMenu.classList.add('active');

            setTimeout(() => {
                const functionMenuContainer = card.querySelector('.function-menu-container');
                if (functionMenuContainer) {
                    functionMenuContainer.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });

                    functionMenu.style.animation = 'pulse 0.5s ease-in-out';
                    setTimeout(() => {
                        functionMenu.style.animation = '';
                    }, 500);
                }
            }, 100);
        }
    };

    const openFieldSelector = (varId) => {
        const fields = getAvailableFields();
        if (fields.length === 0) {
            alert('No hay campos disponibles\n\nAsegurese de que existen campos configurados en el sistema.');
            return;
        }

        let fieldOptions = 'SELECCIONAR CAMPO\n\n';
        fieldOptions += 'Campos disponibles:\n\n';
        fields.forEach((f, i) => {
            fieldOptions += `  ${i + 1}. ${f.name}${f.description ? ` - ${f.description}` : ''}\n`;
        });
        fieldOptions += '\nIngrese el numero del campo:';

        const fieldName = prompt(fieldOptions);
        if (fieldName) {
            const fieldIndex = parseInt(fieldName) - 1;
            if (fieldIndex >= 0 && fieldIndex < fields.length) {
                addExprComponent(varId, 'field', `[${fields[fieldIndex].name}]`,
                    `<i class="fas fa-database expr-icon"></i><span class="expr-value">[${fields[fieldIndex].name}]</span>`);
            } else {
                alert(`Numero invalido\n\nPor favor ingrese un numero entre 1 y ${fields.length}`);
            }
        }
    };

    const openOperatorSelector = (varId) => {
        const sidebar = document.querySelector('.operators-sidebar');
        if (sidebar) {
            sidebar.style.display = 'flex';
        }

        const functionsSidebar = document.querySelector('.functions-sidebar');
        if (functionsSidebar) {
            functionsSidebar.style.display = 'none';
        }
    };

    // ==========================================
    // CARGA DE PARAMETROS PARA EDICION
    // ==========================================

    const loadParamsIntoConfigPanel = (metadata, varId) => {
        console.log('[EF.Editor] Cargando parametros:', metadata);

        // Manejo especial para "Calcular edad"
        if (metadata.functionName === 'Calcular edad' && metadata.blocks && EF.Functions.CalcularEdad) {
            console.log('   Restaurando bloques de Calcular edad:', metadata.blocks);
            EF.State.droppedBlocks = JSON.parse(JSON.stringify(metadata.blocks));

            setTimeout(() => {
                if (EF.Functions.CalcularEdad.renderBlocks) {
                    EF.Functions.CalcularEdad.renderBlocks();
                }
                if (EF.Functions.CalcularEdad.updatePreview) {
                    EF.Functions.CalcularEdad.updatePreview();
                }
            }, 100);

            return;
        }

        // Manejo especial para "Si entonces"
        if (metadata.functionName === 'Si entonces' && metadata.siEntonces) {
            console.log('   Cargando Si entonces:', metadata.siEntonces);

            const body = document.getElementById(`configPanelBody${varId}`);
            if (!body) return;

            const miniBuilders = body.querySelectorAll('.mini-expression-builder');

            if (miniBuilders[0] && metadata.siEntonces.ifContent) {
                const builderId0 = miniBuilders[0].id;
                const components0 = parseExpressionToComponents(metadata.siEntonces.ifContent);
                if (components0.length > 0) {
                    EF.State.miniBuilderComponents[builderId0] = components0;
                    renderMiniBuilder(builderId0);
                }
            }

            if (miniBuilders[1] && metadata.siEntonces.thenContent) {
                const builderId1 = miniBuilders[1].id;
                const components1 = parseExpressionToComponents(metadata.siEntonces.thenContent);
                if (components1.length > 0) {
                    EF.State.miniBuilderComponents[builderId1] = components1;
                    renderMiniBuilder(builderId1);
                }
            }

            if (miniBuilders[2] && metadata.siEntonces.elseContent) {
                const builderId2 = miniBuilders[2].id;
                const components2 = parseExpressionToComponents(metadata.siEntonces.elseContent);
                if (components2.length > 0) {
                    EF.State.miniBuilderComponents[builderId2] = components2;
                    renderMiniBuilder(builderId2);
                }
            }

            setTimeout(() => {
                updateCurrentLevelPreview();
            }, 100);

            return;
        }

        if (!metadata.params || metadata.params.length === 0) {
            return;
        }

        const body2 = document.getElementById(`configPanelBody${varId}`);
        if (!body2) return;

        const miniBuilders2 = body2.querySelectorAll('.mini-expression-builder');

        metadata.params.forEach((paramExpression, index) => {
            if (index >= miniBuilders2.length) return;

            const builder = miniBuilders2[index];
            const builderId = builder.id;
            const components = parseExpressionToComponents(paramExpression);

            if (components.length > 0) {
                EF.State.miniBuilderComponents[builderId] = components;
                renderMiniBuilder(builderId);

                components.forEach(comp => {
                    if (comp.type === 'function' && comp.configured && comp.params) {
                        recreateNestedLevel(comp.value, builderId, comp.functionId, comp.params, varId);
                    }
                });
            }
        });

        setTimeout(() => {
            updateCurrentLevelPreview();
        }, 100);
    };

    const recreateNestedLevel = (functionName, parentBuilderId, functionId, params, varId) => {
        console.log('      Recreando nivel:', functionName, 'con params:', params);

        const state = EF.State;
        const existingLevel = state.navigationStack.levels.find(level =>
            level.functionId === functionId && level.parentBuilderId === parentBuilderId
        );

        if (existingLevel) return;

        const levelIndex = state.navigationStack.levels.length;
        const newLevel = createConfigLevel(functionName, parentBuilderId, functionId, varId);

        params.forEach((paramExpression, paramIndex) => {
            const paramBuilderId = `miniBuilder_var${varId || state.currentConfigVarId || 'default'}_level${levelIndex}_param${paramIndex + 1}`;

            const paramComponents = parseExpressionToComponents(paramExpression);

            if (paramComponents.length > 0) {
                newLevel.miniBuilderStates[paramBuilderId] = paramComponents;

                paramComponents.forEach(comp => {
                    if (comp.type === 'function' && comp.configured && comp.params) {
                        state.navigationStack.levels.push(newLevel);
                        recreateNestedLevel(comp.value, paramBuilderId, comp.functionId, comp.params, varId);
                        return;
                    }
                });
            }
        });

        if (!state.navigationStack.levels.find(l => l.functionId === functionId)) {
            state.navigationStack.levels.push(newLevel);
        }
    };

    // ==========================================
    // DRAG & DROP HELPERS
    // ==========================================

    const allowExprDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
    };

    const dragExprLeave = (event) => {
        event.currentTarget.classList.remove('drag-over');
    };

    const dropExprComponent = (event, varId) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');
    };

    // ==========================================
    // MODAL
    // ==========================================

    const createModalInBody = () => {
        if (document.getElementById('functionModalOverlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'functionModalOverlay';
        overlay.className = 'function-modal-overlay';

        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.5) !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 2147483647 !important;
            backdrop-filter: blur(4px) !important;
        `;

        overlay.innerHTML = `
            <div class="function-modal" onclick="event.stopPropagation()" style="background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 90%; max-width: 900px; max-height: 90vh; overflow: hidden; position: relative; z-index: 2147483647;">
                <div style="padding: 24px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700;">
                        <i class="fas fa-magic" id="modalIcon"></i>
                        <span id="modalTitle">Configurar Funcion</span>
                    </div>
                    <button type="button" onclick="closeFunctionModal()" style="width: 36px; height: 36px; border: none; background: rgba(255, 255, 255, 0.2); color: white; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="modalBody" style="padding: 24px; max-height: calc(90vh - 180px); overflow-y: auto;"></div>
                <div style="padding: 20px 24px; background: var(--gray-50); border-top: 1px solid var(--gray-200); display: flex; justify-content: flex-end; gap: 12px;">
                    <button type="button" onclick="closeFunctionModal()" style="padding: 10px 24px; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; background: white; color: var(--gray-700);">
                        Cancelar
                    </button>
                    <button type="button" onclick="insertFunctionFromModal()" style="padding: 10px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <i class="fas fa-check"></i> Insertar Funcion
                    </button>
                </div>
            </div>
        `;

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeFunctionModal();
            }
        });

        document.body.appendChild(overlay);
    };

    // ==========================================
    // CLOSE CONFIG PANEL
    // ==========================================

    const editorCloseConfigPanel = (varId) => {
        const state = EF.State;
        const targetVarId = varId || state.currentConfigVarId;
        if (!targetVarId) return;

        if (state.navigationStack.levels.length > 1) {
            if (!confirm('Cerrar sin guardar? Hay funciones anidadas sin configurar.')) {
                return;
            }
        }

        const panel = document.getElementById(`configPanel${targetVarId}`);
        if (panel) {
            panel.classList.remove('active');
        }

        state.navigationStack.levels.forEach(level => {
            Object.keys(level.miniBuilderStates).forEach(builderId => {
                delete state.miniBuilderComponents[builderId];
            });
        });

        state.navigationStack.levels = [];
        state.navigationStack.currentLevel = -1;

        if (EF.State.droppedBlocks) {
            EF.State.droppedBlocks = [];
        }

        state.currentConfigVarId = null;
        state.currentFunction = null;

        if (state.activeInput && state.activeInput.editMode) {
            delete state.activeInput.editMode;
        }
        if (window.editingComponent) {
            delete window.editingComponent;
        }
    };

    // ==========================================
    // INSERTAR FUNCION DESDE MODAL
    // ==========================================

    const insertFunctionFromModal = () => {
        const state = EF.State;
        const previewEl = document.getElementById('modalPreviewCode');
        const preview = previewEl ? previewEl.textContent : '#CalculaEdad()#';

        let savedValue = preview;
        if (state.currentFunction === 'Calcular edad' && EF.Functions.CalcularEdad) {
            const instance = new EF.Functions.CalcularEdad();
            savedValue = instance.buildExpression();
        }

        if (state.activeInput && state.activeInput.varId) {
            const varId = state.activeInput.varId;
            const icon = '<i class="fas fa-function expr-icon"></i>';
            const shortPreview = preview.length > 40 ? `${preview.substring(0, 37)}...` : preview;

            const blocks = EF.State.droppedBlocks || [];
            const metadata = {
                functionName: state.currentFunction,
                blocks: blocks.map(b => ({ type: b.type, value: b.value, order: b.order }))
            };

            if (state.activeInput.editMode && window.editingComponent) {
                initExpressionComponents(varId);
                const comp = state.expressionComponents[varId].find(c => c.id === window.editingComponent.compId);
                if (comp) {
                    comp.value = savedValue;
                    comp.html = `${icon}<span class="expr-value">${shortPreview}</span>`;
                    comp.metadata = metadata;
                    renderExpression(varId);
                    updateExpressionPreview(varId);
                }
                window.editingComponent = null;
            } else {
                addExprComponent(varId, 'function', savedValue,
                    `${icon}<span class="expr-value">${shortPreview}</span>`, metadata);
            }

            state.activeInput.remove();
            state.activeInput = null;
        } else if (state.activeInput) {
            if (typeof insertAtCursor === 'function') {
                insertAtCursor(state.activeInput, preview);
            }

            const card = state.activeInput.closest('.variable-card');
            if (card) {
                const cardId = card.id.replace('varCard', '');
                updatePreview(cardId, 'expr', state.activeInput.value);
            }
        }

        closeFunctionModal();
    };

    // ==========================================
    // INICIALIZACION
    // ==========================================

    const init = () => {
        document.addEventListener('DOMContentLoaded', () => {
            createModalInBody();

            if (typeof createAutocompletePopup === 'function') {
                createAutocompletePopup();
            }

            const logicBuilder = document.getElementById('logicExprBuilder');
            if (logicBuilder) {
                console.log('[EF.Editor] Logic expression builder encontrado');
            }

            document.addEventListener('focus', (e) => {
                if (e.target.classList.contains('variable-field-input') ||
                    (e.target.tagName === 'TEXTAREA' && e.target.classList.contains('variable-field-input'))) {
                    EF.State.activeInput = e.target;
                }
            }, true);
        });

        // Prevencion de drops
        document.addEventListener('dragover', (e) => {
            const state = EF.State;
            if (state.draggedFunctionName || state.draggedOperator || state.draggedField) {
                const target = e.target;
                const isValidZone = target.closest('.expression-builder') ||
                    target.closest('.mini-expression-builder') ||
                    target.closest('.logic-expression-builder') ||
                    target.closest('.drop-zone');

                if (!isValidZone) {
                    e.dataTransfer.effectAllowed = 'none';
                    e.dataTransfer.dropEffect = 'none';
                }
            }
        }, false);

        document.addEventListener('drop', (e) => {
            const state = EF.State;
            const target = e.target;
            const isValidZone = target.closest('.expression-builder') ||
                target.closest('.mini-expression-builder') ||
                target.closest('.logic-expression-builder') ||
                target.closest('.drop-zone');

            if (!isValidZone && (state.draggedFunctionName || state.draggedOperator || state.draggedField)) {
                console.log('[EF.Editor] Drop bloqueado fuera de zona valida');
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, false);
    };

    // Inicializar
    init();

    // ==========================================
    // API PUBLICA
    // ==========================================

    const publicAPI = {
        FunctionUtils,
        closeOperatorsSidebar,
        dropFunction,
        filterSidebarFunctions,
        openFunctionSelector,
        openFieldSelector,
        openOperatorSelector,
        loadParamsIntoConfigPanel,
        recreateNestedLevel,
        allowExprDrop,
        dragExprLeave,
        dropExprComponent,
        createModalInBody,
        closeConfigPanel: editorCloseConfigPanel,
        insertFunctionFromModal,
        init
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.Editor = publicAPI;

    // Legacy aliases para compatibilidad con variables globales
    window.expressionComponents = EF.State.expressionComponents;
    window.componentCounter = EF.State.componentCounter;
    window.miniBuilderComponents = EF.State.miniBuilderComponents;
    window.navigationStack = EF.State.navigationStack;
    window.activeInput = EF.State.activeInput;
    window.currentConfigVarId = EF.State.currentConfigVarId;
    window.currentFunction = EF.State.currentFunction;
    window.draggedFunctionName = EF.State.draggedFunctionName;
    window.draggedOperator = EF.State.draggedOperator;
    window.draggedField = EF.State.draggedField;
    window.targetVarId = EF.State.targetVarId;

    console.log('[EF] Editor cargado');

    return publicAPI;
})();
