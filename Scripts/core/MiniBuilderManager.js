/**
 * MiniBuilderManager.js - Gestor de Mini Expression Builders
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.MiniBuilder
 */

const MiniBuilderModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== INICIALIZAR ESTADO =====
    EF.State.miniBuilderComponents = EF.State.miniBuilderComponents || {};
    EF.State.paramBuilderCounter = 0;

    // ===== FUNCIONES PUBLICAS =====

    const dropIntoMiniBuilder = (event, builderId) => {
        event.preventDefault();
        event.stopPropagation();

        console.log('DROP en mini-builder:', builderId);

        const builder = document.getElementById(builderId);
        if (!builder) {
            console.error('Builder no encontrado:', builderId);
            return;
        }

        builder.classList.remove('drag-over');

        document.querySelectorAll('.draggable-function-item.dragging, .draggable-operator-item.dragging, .draggable-field-item.dragging, .draggable-value-item.dragging, .draggable-parenthesis-item.dragging, .palette-item.dragging').forEach(item => {
            item.classList.remove('dragging');
        });

        if (!EF.State.miniBuilderComponents[builderId]) {
            EF.State.miniBuilderComponents[builderId] = [];
        }

        let componentAdded = false;

        if (EF.State.draggedField) {
            EF.State.miniBuilderComponents[builderId].push({
                type: 'field',
                value: EF.State.draggedField,
                html: `<i class="fas fa-database expr-icon"></i><span class="expr-value">${EF.State.draggedField}</span>`
            });
            componentAdded = true;
            EF.State.draggedField = null;
        }

        if (EF.State.draggedOperator) {
            EF.State.miniBuilderComponents[builderId].push({
                type: 'operator',
                value: EF.State.draggedOperator,
                html: `<span class="expr-value">${EF.State.draggedOperator}</span>`
            });
            componentAdded = true;
            EF.State.draggedOperator = null;
        }

        if (EF.State.draggedFunctionName) {
            const functionNameToOpen = EF.State.draggedFunctionName;
            const functionId = `func_${Date.now()}`;

            EF.State.miniBuilderComponents[builderId].push({
                type: 'function',
                value: functionNameToOpen,
                functionId: functionId,
                configured: false,
                params: [],
                html: `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${functionNameToOpen}(...)</span>`
            });

            componentAdded = true;
            EF.State.draggedFunctionName = null;

            renderMiniBuilder(builderId);

            setTimeout(() => {
                openNestedFunctionConfig(functionNameToOpen, builderId, functionId);
            }, 100);

            return;
        }

        if (EF.State.draggedValue) {
            EF.State.draggedValue = null;
            addValueComponentToMiniBuilder(builderId);
            return;
        }

        if (EF.State.draggedParenthesis) {
            EF.State.miniBuilderComponents[builderId].push({
                type: 'parenthesis',
                value: EF.State.draggedParenthesis,
                html: `<span class="expr-value">${EF.State.draggedParenthesis}</span>`
            });
            componentAdded = true;
            EF.State.draggedParenthesis = null;
        }

        if (componentAdded) {
            renderMiniBuilder(builderId);
            saveCurrentLevelState();
        }
    };

    const renderMiniBuilder = (builderId) => {
        const builder = document.getElementById(builderId);
        if (!builder) return;

        const components = EF.State.miniBuilderComponents[builderId] || [];

        const emptyDiv = builder.querySelector('.empty');
        if (emptyDiv) {
            emptyDiv.style.display = components.length > 0 ? 'none' : 'flex';
        }

        let componentsContainer = builder.querySelector('.expression-components');
        if (!componentsContainer) {
            componentsContainer = document.createElement('div');
            componentsContainer.className = 'expression-components';
            builder.appendChild(componentsContainer);
        }

        componentsContainer.innerHTML = components.map((comp, index) => {
            let badge = `<div class="expr-component" data-type="${comp.type}">`;
            badge += comp.html;

            if (comp.type === 'function') {
                const configuredIcon = comp.configured ? 'fa-check-circle' : 'fa-cog';
                const configuredColor = comp.configured ? 'var(--success)' : 'var(--warning)';

                badge += `
                    <button type="button"
                            onclick="editNestedFunction('${builderId}', ${index})"
                            style="background: none; border: none; color: ${configuredColor}; cursor: pointer; padding: 0; margin-left: 4px;"
                            title="${comp.configured ? 'Reconfigurar funcion' : 'Configurar funcion'}">
                        <i class="fas ${configuredIcon}"></i>
                    </button>
                `;
            }

            badge += `
                <button type="button"
                        onclick="removeMiniBuilderComponent('${builderId}', ${index})"
                        style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 0; margin-left: 4px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;

            return badge;
        }).join('');

        updateCurrentLevelPreview();
    };

    const editNestedFunction = (builderId, componentIndex) => {
        const components = EF.State.miniBuilderComponents[builderId];
        if (!components || !components[componentIndex]) return;

        const funcComponent = components[componentIndex];
        if (funcComponent.type !== 'function') return;

        openNestedFunctionConfig(funcComponent.value, builderId, funcComponent.functionId, funcComponent);
    };

    const addValueComponentToMiniBuilder = (builderId) => {
        const builder = document.getElementById(builderId);
        if (!builder) return;

        const existingInput = builder.querySelector('.inline-value-input');
        if (existingInput) {
            existingInput.querySelector('input').focus();
            return;
        }

        const emptyDiv = builder.querySelector('.empty');
        if (emptyDiv) {
            emptyDiv.style.display = 'none';
        }

        let componentsContainer = builder.querySelector('.expression-components');
        if (!componentsContainer) {
            componentsContainer = document.createElement('div');
            componentsContainer.className = 'expression-components';
            builder.appendChild(componentsContainer);
        }

        const inlineInputContainer = document.createElement('div');
        inlineInputContainer.className = 'inline-value-input';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = '18, "TEXTO", 3.14';
        inputField.autocomplete = 'off';

        const btnAccept = document.createElement('button');
        btnAccept.className = 'btn-accept';
        btnAccept.innerHTML = '&#10003;';
        btnAccept.title = 'Aceptar';

        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-cancel';
        btnCancel.innerHTML = '&#10005;';
        btnCancel.title = 'Cancelar';

        const acceptValue = () => {
            const value = inputField.value.trim();
            if (value !== '') {
                if (!EF.State.miniBuilderComponents[builderId]) {
                    EF.State.miniBuilderComponents[builderId] = [];
                }
                EF.State.miniBuilderComponents[builderId].push({
                    type: 'value',
                    value: value,
                    html: `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${value}</span>`
                });
                renderMiniBuilder(builderId);
                saveCurrentLevelState();
            }
            inlineInputContainer.remove();

            if (!EF.State.miniBuilderComponents[builderId] || EF.State.miniBuilderComponents[builderId].length === 0) {
                if (emptyDiv) emptyDiv.style.display = 'flex';
            }
        };

        const cancelInput = () => {
            inlineInputContainer.remove();
            if (!EF.State.miniBuilderComponents[builderId] || EF.State.miniBuilderComponents[builderId].length === 0) {
                if (emptyDiv) emptyDiv.style.display = 'flex';
            }
        };

        btnAccept.onclick = acceptValue;
        btnCancel.onclick = cancelInput;

        inputField.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                acceptValue();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelInput();
            }
        };

        inlineInputContainer.appendChild(inputField);
        inlineInputContainer.appendChild(btnAccept);
        inlineInputContainer.appendChild(btnCancel);
        componentsContainer.appendChild(inlineInputContainer);

        setTimeout(() => inputField.focus(), 100);
    };

    const toggleMiniBuilder = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.classList.toggle('collapsed');
    };

    const generateCollapsibleMiniBuilder = (paramId, label, placeholder, icon = '') => {
        const levelId = EF.State.navigationStack.currentLevel >= 0 ? EF.State.navigationStack.currentLevel : 0;
        const varId = EF.State.currentConfigVarId || 'default';
        const builderId = `miniBuilder_var${varId}_level${levelId}_${paramId}`;
        const containerId = `collapsible_${builderId}`;

        return `
            <div class="collapsible-mini-builder" id="${containerId}">
                <div class="mini-builder-header" onclick="toggleMiniBuilder('${containerId}')">
                    <div class="mini-builder-header-left">
                        <span style="font-size: 16px;">${icon}</span>
                        <span class="mini-builder-header-title">${label}</span>
                    </div>
                    <button type="button" class="mini-builder-toggle" onclick="event.stopPropagation(); toggleMiniBuilder('${containerId}')">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="mini-builder-content">
                    <div class="mini-expression-builder"
                         id="${builderId}"
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
            </div>
        `;
    };

    const generateMiniBuilder = (paramId, label, placeholder = "Arrastra campos, operadores o funciones", includeBreadcrumb = false) => {
        const levelId = EF.State.navigationStack.currentLevel >= 0 ? EF.State.navigationStack.currentLevel : 0;
        const varId = EF.State.currentConfigVarId || 'default';
        const builderId = `miniBuilder_var${varId}_level${levelId}_${paramId}`;

        const breadcrumbHtml = includeBreadcrumb ? `
            <div id="breadcrumb_${builderId}" class="mini-builder-breadcrumb" style="
                display: none;
                align-items: center;
                gap: 4px;
                flex-wrap: wrap;
                margin-bottom: 8px;
                padding: 8px 12px;
                background: var(--gray-50);
                border-radius: 6px;
                border: 1px solid var(--gray-200);
            "></div>
        ` : '';

        return `
            <div class="mini-builder-container" style="margin-bottom: 20px;">
                <label style="display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">
                    ${label} <span style="color: var(--danger);">*</span>
                </label>
                ${breadcrumbHtml}
                <div class="mini-expression-builder"
                     id="${builderId}"
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
    };

    const addMiniBuilderParam = () => {
        const additionalParamsContainer = document.getElementById('additionalParams');
        if (!additionalParamsContainer) return;

        const existingParams = additionalParamsContainer.querySelectorAll('.mini-builder-container').length;
        const paramNumber = existingParams + 2;

        const newParamHtml = generateMiniBuilder(
            `param${paramNumber}`,
            `Campo ${paramNumber}`,
            'Arrastra campos, operadores o funciones'
        );

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newParamHtml;

        const newParam = tempDiv.firstElementChild;
        newParam.style.opacity = '0';
        newParam.style.transform = 'translateY(-10px)';
        additionalParamsContainer.appendChild(newParam);

        setTimeout(() => {
            newParam.style.transition = 'all 0.3s ease';
            newParam.style.opacity = '1';
            newParam.style.transform = 'translateY(0)';
        }, 10);

        addRemoveButtonToParam(newParam, paramNumber);
    };

    const addRemoveButtonToParam = (paramContainer, paramNumber) => {
        const label = paramContainer.querySelector('label');
        if (!label) return;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove-param';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.title = 'Eliminar este campo';

        removeBtn.style.cssText = `
            background: var(--danger);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            margin-left: 8px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s;
            vertical-align: middle;
        `;

        removeBtn.onmouseenter = () => {
            removeBtn.style.background = '#dc2626';
            removeBtn.style.transform = 'scale(1.05)';
        };
        removeBtn.onmouseleave = () => {
            removeBtn.style.background = 'var(--danger)';
            removeBtn.style.transform = 'scale(1)';
        };

        removeBtn.onclick = () => removeMiniBuilderParam(paramContainer, paramNumber);

        label.appendChild(removeBtn);
    };

    const removeMiniBuilderParam = (paramContainer, paramNumber) => {
        const builder = paramContainer.querySelector('.mini-expression-builder');
        if (builder) {
            const builderId = builder.id;
            delete EF.State.miniBuilderComponents[builderId];
        }

        const components = EF.State.miniBuilderComponents[builder ? builder.id : null] || [];
        if (components.length > 0) {
            if (!confirm(`Eliminar el Campo ${paramNumber}?\n\nTiene ${components.length} componente(s) configurado(s).`)) {
                return;
            }
        }

        paramContainer.style.transition = 'all 0.3s ease';
        paramContainer.style.opacity = '0';
        paramContainer.style.transform = 'translateX(-20px)';
        paramContainer.style.maxHeight = `${paramContainer.offsetHeight}px`;

        setTimeout(() => {
            paramContainer.style.maxHeight = '0';
            paramContainer.style.marginBottom = '0';
            paramContainer.style.padding = '0';
        }, 150);

        setTimeout(() => {
            paramContainer.remove();
            renumberAdditionalParams();
        }, 450);
    };

    const renumberAdditionalParams = () => {
        const additionalParamsContainer = document.getElementById('additionalParams');
        if (!additionalParamsContainer) return;

        const params = additionalParamsContainer.querySelectorAll('.mini-builder-container');

        params.forEach((param, index) => {
            const label = param.querySelector('label');
            if (label) {
                const removeBtn = label.querySelector('.btn-remove-param');
                const newNumber = index + 2;

                if (removeBtn) {
                    removeBtn.remove();
                }

                const labelText = label.childNodes[0];
                if (labelText) {
                    labelText.textContent = `Campo ${newNumber} `;
                }

                if (removeBtn) {
                    removeBtn.onclick = () => removeMiniBuilderParam(param, newNumber);
                    label.appendChild(removeBtn);
                }
            }
        });
    };

    const buildComponentsExpression = (components) => {
        return components.map(comp => {
            if (comp.type === 'field') return `[${comp.value}]`;
            if (comp.type === 'operator') return comp.value;
            if (comp.type === 'value') return comp.value;
            if (comp.type === 'parenthesis') return comp.value;
            if (comp.type === 'function') {
                if (comp.configured && comp.fullExpression) {
                    return comp.fullExpression;
                }
                return `#${comp.value}(...)#`;
            }
            return comp.value;
        }).join(' ');
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        dropIntoMiniBuilder,
        renderMiniBuilder,
        editNestedFunction,
        addValueComponentToMiniBuilder,
        toggleMiniBuilder,
        generateCollapsibleMiniBuilder,
        generateMiniBuilder,
        addMiniBuilderParam,
        addRemoveButtonToParam,
        removeMiniBuilderParam,
        renumberAdditionalParams,
        buildComponentsExpression
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.MiniBuilder = publicAPI;

    // Legacy compatibility
    window.MiniBuilderManager = publicAPI;

    console.log('[EF] MiniBuilder cargado');

    return publicAPI;
})();
