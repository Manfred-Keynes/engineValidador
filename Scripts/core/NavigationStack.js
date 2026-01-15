/**
 * NavigationStack.js - Sistema de Navegacion entre Niveles
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.Navigation
 */

const NavigationStackModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== INICIALIZAR ESTADO =====
    EF.State.navigationStack = {
        levels: [],
        currentLevel: -1
    };
    EF.State.currentFunction = null;
    EF.State.currentConfigVarId = null;

    // ===== FUNCIONES PUBLICAS =====

    const createConfigLevel = (functionName, parentBuilderId, functionId, varId) => ({
        functionName: functionName,
        parentBuilderId: parentBuilderId,
        functionId: functionId,
        varId: varId,
        savedHTML: null,
        miniBuilderStates: {}
    });

    const openNestedFunctionConfig = (functionName, parentBuilderId, functionId, functionComponent = null) => {
        console.log('Navegando a funcion anidada:', functionName);

        if (!functionName) {
            console.error('ERROR: functionName es null o undefined');
            return;
        }

        const varId = EF.State.currentConfigVarId;
        if (!varId) {
            console.error('ERROR: currentConfigVarId es null');
            return;
        }

        saveCurrentLevelState();

        const existingLevelIndex = EF.State.navigationStack.levels.findIndex(level =>
            level.functionId === functionId && level.parentBuilderId === parentBuilderId
        );

        if (existingLevelIndex !== -1) {
            navigateToLevel(existingLevelIndex);
            return;
        }

        const newLevel = createConfigLevel(functionName, parentBuilderId, functionId, varId);

        if (functionComponent && functionComponent.configured && functionComponent.params) {
            functionComponent.params.forEach((paramExpression, index) => {
                if (paramExpression && paramExpression.trim() !== '') {
                    const builderId = `miniBuilder_var${EF.State.currentConfigVarId || 'default'}_level${EF.State.navigationStack.levels.length}_param${index + 1}`;
                    const components = parseExpressionToComponents(paramExpression);
                    if (components.length > 0) {
                        newLevel.miniBuilderStates[builderId] = components;
                    }
                }
            });
        }

        EF.State.navigationStack.levels.push(newLevel);
        EF.State.navigationStack.currentLevel = EF.State.navigationStack.levels.length - 1;
        EF.State.currentFunction = functionName;

        renderCurrentConfigLevel();
    };

    const renderCurrentConfigLevel = () => {
        const currentLevel = EF.State.navigationStack.levels[EF.State.navigationStack.currentLevel];
        if (!currentLevel) return;

        const varId = currentLevel.varId;
        const body = document.getElementById(`configPanelBody${varId}`);
        const title = document.getElementById(`configPanelTitle${varId}`);
        const breadcrumb = document.getElementById(`configBreadcrumb${varId}`);

        if (!body || !title) return;

        const icons = {
            'Conteo': 'fa-hashtag',
            'Maximo': 'fa-arrow-up',
            'Minimo': 'fa-arrow-down',
            'Suma': 'fa-plus',
            'Si entonces': 'fa-code-branch',
            'Calcular edad': 'fa-birthday-cake',
            'Promedio': 'fa-chart-line',
            'Conteo caracteres': 'fa-text-width',
            'Expresion regular': 'fa-code',
            'Cualquier fecha': 'fa-calendar-alt'
        };

        const levelIndicator = EF.State.navigationStack.currentLevel > 0
            ? `<span style="color: var(--primary); font-size: 12px; margin-left: 8px;">(Nivel ${EF.State.navigationStack.currentLevel + 1})</span>`
            : '';

        title.innerHTML = `<i class="fas ${icons[currentLevel.functionName] || 'fa-cog'}"></i> ${currentLevel.functionName} ${levelIndicator}`;

        updateNavigationBreadcrumb(breadcrumb);

        if (currentLevel.savedHTML) {
            body.innerHTML = currentLevel.savedHTML;
            Object.keys(currentLevel.miniBuilderStates).forEach(builderId => {
                EF.State.miniBuilderComponents[builderId] = JSON.parse(JSON.stringify(currentLevel.miniBuilderStates[builderId]));
                renderMiniBuilder(builderId);
            });
        } else {
            EF.State.availableFields = getAvailableFields();
            body.innerHTML = generateFunctionForm(currentLevel.functionName);

            if (Object.keys(currentLevel.miniBuilderStates).length > 0) {
                Object.keys(currentLevel.miniBuilderStates).forEach(builderId => {
                    EF.State.miniBuilderComponents[builderId] = JSON.parse(JSON.stringify(currentLevel.miniBuilderStates[builderId]));
                    renderMiniBuilder(builderId);
                });
            }
        }

        const panel = document.getElementById(`configPanel${varId}`);
        if (panel) {
            const panelBody = panel.querySelector('.config-panel-body');
            if (panelBody) panelBody.scrollTop = 0;
        }

        setTimeout(() => {
            updateCurrentLevelPreview();

            const rootLevel = EF.State.navigationStack.levels[0];
            if (rootLevel && rootLevel.functionName === 'Si entonces') {
                for (let levelIndex = 0; levelIndex < EF.State.navigationStack.levels.length; levelIndex++) {
                    const level = EF.State.navigationStack.levels[levelIndex];
                    if (level.functionName === 'Si entonces') {
                        for (let paramNum = 1; paramNum <= 3; paramNum++) {
                            const builderId = `miniBuilder_var${EF.State.currentConfigVarId || 'default'}_level${levelIndex}_param${paramNum}`;
                            updateMiniBreadcrumb(builderId);
                        }
                    }
                }
            }
        }, 100);
    };

    const getParameterLabel = (parentBuilderId, parentFunctionName) => {
        if (!parentBuilderId) return null;

        const paramMatch = parentBuilderId.match(/param(\d+)$/);
        if (!paramMatch) return null;

        const paramNum = parseInt(paramMatch[1]);

        const paramLabels = {
            'Si entonces': { 1: 'Condicion', 2: 'Valor si es Verdadero', 3: 'Valor si es Falso' },
            'Conteo': { 1: 'Campo o Expresion' },
            'Maximo': { 1: 'Campo o Expresion' },
            'Minimo': { 1: 'Campo o Expresion' },
            'Suma': { 1: 'Campo o Expresion' },
            'Promedio': { 1: 'Campo o Expresion' },
            'Conteo caracteres': { 1: 'Texto' },
            'Expresion regular': { 1: 'Texto', 2: 'Patron' },
            'Cualquier fecha': { 1: 'Fecha', 2: 'Formato Entrada', 3: 'Formato Salida' }
        };

        const labels = paramLabels[parentFunctionName];
        return labels ? labels[paramNum] : `Parametro ${paramNum}`;
    };

    const updateMiniBreadcrumb = (builderId) => {
        const breadcrumb = document.getElementById(`breadcrumb_${builderId}`);
        if (!breadcrumb) return;

        let parentLevel = null;
        for (let i = 0; i < EF.State.navigationStack.levels.length; i++) {
            const level = EF.State.navigationStack.levels[i];
            if (level.miniBuilderStates && level.miniBuilderStates[builderId]) {
                parentLevel = level;
                break;
            }
        }

        if (!parentLevel) {
            breadcrumb.style.display = 'none';
            return;
        }

        const componentArray = parentLevel.miniBuilderStates[builderId];
        if (!componentArray || !Array.isArray(componentArray) || componentArray.length === 0) {
            breadcrumb.style.display = 'none';
            return;
        }

        const firstComponent = componentArray[0];
        if (!firstComponent || firstComponent.type !== 'function') {
            breadcrumb.style.display = 'none';
            return;
        }

        const functionId = firstComponent.functionId;
        const relevantLevels = [];

        const buildChainFromLevel = (startFunctionId, currentBuilderId) => {
            for (let i = 0; i < EF.State.navigationStack.levels.length; i++) {
                const level = EF.State.navigationStack.levels[i];
                if (level.functionId === startFunctionId && level.parentBuilderId === currentBuilderId) {
                    relevantLevels.push(level);
                    if (level.miniBuilderStates) {
                        for (const childBuilderId in level.miniBuilderStates) {
                            const childData = level.miniBuilderStates[childBuilderId];
                            if (childData.type === 'function' && childData.functionId) {
                                buildChainFromLevel(childData.functionId, childBuilderId);
                            }
                        }
                    }
                    break;
                }
            }
        };

        buildChainFromLevel(functionId, builderId);

        if (relevantLevels.length === 0) {
            breadcrumb.style.display = 'none';
            return;
        }

        breadcrumb.style.display = 'flex';

        let html = '<i class="fas fa-sitemap" style="color: var(--gray-400); margin-right: 4px; font-size: 11px;"></i>';

        relevantLevels.forEach((level, index) => {
            const isLast = index === relevantLevels.length - 1;
            const globalIndex = EF.State.navigationStack.levels.indexOf(level);

            let displayLabel = level.functionName;
            if (level.parentBuilderId && index > 0) {
                const parentLevelItem = relevantLevels[index - 1];
                if (parentLevelItem) {
                    const paramLabel = getParameterLabel(level.parentBuilderId, parentLevelItem.functionName);
                    if (paramLabel) {
                        displayLabel = `${level.functionName} <span style="color: var(--gray-500); font-size: 10px;">(${paramLabel})</span>`;
                    }
                }
            }

            html += `
                <span style="
                    color: ${isLast ? 'var(--primary)' : 'var(--gray-600)'};
                    font-weight: ${isLast ? '600' : '500'};
                    font-size: 11px;
                    cursor: ${isLast ? 'default' : 'pointer'};
                    padding: 2px 6px;
                    border-radius: 4px;
                    background: ${isLast ? 'var(--primary-light)' : 'transparent'};
                    transition: all 0.2s;
                " ${!isLast ? `onclick="navigateToLevel(${globalIndex})"` : ''}
                ${!isLast ? 'onmouseover="this.style.background=\'var(--gray-100)\'"' : ''}
                ${!isLast ? 'onmouseout="this.style.background=\'transparent\'"' : ''}>
                    ${displayLabel}
                </span>
            `;

            if (!isLast) {
                html += '<i class="fas fa-chevron-right" style="color: var(--gray-400); font-size: 9px;"></i>';
            }
        });

        breadcrumb.innerHTML = html;
    };

    const updateNavigationBreadcrumb = (breadcrumb) => {
        if (!breadcrumb) return;

        if (EF.State.navigationStack.levels.length === 0) {
            breadcrumb.style.display = 'none';
            return;
        }

        breadcrumb.style.display = 'flex';
        breadcrumb.style.alignItems = 'center';
        breadcrumb.style.gap = '4px';
        breadcrumb.style.flexWrap = 'wrap';

        const ancestorChain = [];
        let currentLevelIndex = EF.State.navigationStack.currentLevel;

        while (currentLevelIndex >= 0 && currentLevelIndex < EF.State.navigationStack.levels.length) {
            ancestorChain.unshift(currentLevelIndex);
            const currentLevel = EF.State.navigationStack.levels[currentLevelIndex];

            if (!currentLevel.parentBuilderId) break;

            const levelMatch = currentLevel.parentBuilderId.match(/level(\d+)_/);
            if (!levelMatch) break;

            const parentLevelIndex = parseInt(levelMatch[1]);
            if (parentLevelIndex < 0 || parentLevelIndex >= currentLevelIndex) break;

            currentLevelIndex = parentLevelIndex;
        }

        let html = '<i class="fas fa-layer-group" style="color: var(--gray-400); margin-right: 8px; font-size: 14px;"></i>';

        ancestorChain.forEach((levelIndex, chainIndex) => {
            const level = EF.State.navigationStack.levels[levelIndex];
            const isLast = levelIndex === EF.State.navigationStack.currentLevel;
            const isCurrent = levelIndex === EF.State.navigationStack.currentLevel;

            let displayLabel = level.functionName;
            if (level.parentBuilderId && chainIndex > 0) {
                const parentLevelIdx = ancestorChain[chainIndex - 1];
                const parentLevel = EF.State.navigationStack.levels[parentLevelIdx];
                const paramLabel = getParameterLabel(level.parentBuilderId, parentLevel.functionName);
                if (paramLabel) {
                    displayLabel = `${level.functionName} <span style="color: ${isCurrent ? 'rgba(255,255,255,0.7)' : 'var(--gray-500)'}; font-size: 10px;">(${paramLabel})</span>`;
                }
            }

            html += `
                <button type="button"
                        class="breadcrumb-nav-item ${isCurrent ? 'active' : ''}"
                        onclick="navigateToLevel(${levelIndex})"
                        style="
                            background: ${isCurrent ? 'var(--primary)' : 'var(--gray-100)'};
                            color: ${isCurrent ? 'white' : 'var(--gray-700)'};
                            border: 2px solid ${isCurrent ? 'var(--primary)' : 'var(--gray-300)'};
                            border-radius: 6px;
                            padding: 6px 12px;
                            font-size: 12px;
                            font-weight: 600;
                            cursor: ${isCurrent ? 'default' : 'pointer'};
                            transition: all 0.2s;
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                        "
                        ${isCurrent ? 'disabled' : ''}
                        onmouseover="if(!this.disabled) this.style.borderColor='var(--primary)'; if(!this.disabled) this.style.background='var(--primary-light)';"
                        onmouseout="if(!this.disabled) this.style.borderColor='var(--gray-300)'; if(!this.disabled) this.style.background='var(--gray-100)';">
                    <span style="
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 18px;
                        height: 18px;
                        background: ${isCurrent ? 'rgba(255,255,255,0.3)' : 'var(--gray-300)'};
                        border-radius: 50%;
                        font-size: 10px;
                        font-weight: 700;
                    ">${levelIndex + 1}</span>
                    ${displayLabel}
                </button>
            `;

            if (!isLast) {
                html += '<i class="fas fa-chevron-right" style="color: var(--gray-400); font-size: 10px; margin: 0 4px;"></i>';
            }
        });

        breadcrumb.innerHTML = html;
    };

    const navigateToLevel = (targetLevel) => {
        if (targetLevel < 0 || targetLevel >= EF.State.navigationStack.levels.length) return;
        if (targetLevel === EF.State.navigationStack.currentLevel) return;

        saveCurrentLevelState();

        if (targetLevel < EF.State.navigationStack.currentLevel) {
            for (let levelIndex = EF.State.navigationStack.currentLevel; levelIndex > targetLevel; levelIndex--) {
                const childLevel = EF.State.navigationStack.levels[levelIndex];

                if (childLevel.parentBuilderId && childLevel.functionId) {
                    let parentLevel = null;
                    let parentLevelIndex = -1;

                    const levelMatch = childLevel.parentBuilderId.match(/level(\d+)_/);
                    if (levelMatch) {
                        parentLevelIndex = parseInt(levelMatch[1]);
                        parentLevel = EF.State.navigationStack.levels[parentLevelIndex];
                    }

                    if (!parentLevel) continue;

                    const childExpression = buildLevelExpression(childLevel);

                    if (!EF.State.miniBuilderComponents[childLevel.parentBuilderId] && parentLevel.miniBuilderStates[childLevel.parentBuilderId]) {
                        EF.State.miniBuilderComponents[childLevel.parentBuilderId] = JSON.parse(
                            JSON.stringify(parentLevel.miniBuilderStates[childLevel.parentBuilderId])
                        );
                    }

                    const parentComponents = EF.State.miniBuilderComponents[childLevel.parentBuilderId];
                    if (parentComponents) {
                        const functionComp = parentComponents.find(c => c.functionId === childLevel.functionId);
                        if (functionComp) {
                            functionComp.fullExpression = childExpression;
                            functionComp.configured = true;

                            const paramsPreview = childExpression.length > 50 ? `${childExpression.substring(0, 47)}...` : childExpression;
                            functionComp.html = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${paramsPreview}</span>`;

                            if (parentLevel && parentLevel.miniBuilderStates[childLevel.parentBuilderId]) {
                                const savedComponents = parentLevel.miniBuilderStates[childLevel.parentBuilderId];
                                const savedFunctionComp = savedComponents.find(c => c.functionId === childLevel.functionId);
                                if (savedFunctionComp) {
                                    savedFunctionComp.fullExpression = childExpression;
                                    savedFunctionComp.configured = true;
                                    savedFunctionComp.html = functionComp.html;
                                }
                                parentLevel.savedHTML = null;
                            }
                        }
                    }
                }
            }
        }

        EF.State.navigationStack.currentLevel = targetLevel;

        const level = EF.State.navigationStack.levels[targetLevel];
        EF.State.currentFunction = level.functionName;

        renderCurrentConfigLevel();
    };

    const saveCurrentLevelState = () => {
        if (EF.State.navigationStack.currentLevel < 0) return;

        const currentLevel = EF.State.navigationStack.levels[EF.State.navigationStack.currentLevel];
        if (!currentLevel) return;

        const varId = currentLevel.varId;
        const body = document.getElementById(`configPanelBody${varId}`);

        if (body) {
            currentLevel.savedHTML = body.innerHTML;

            const levelPrefix = `_level${EF.State.navigationStack.currentLevel}_`;
            const miniBuilders = body.querySelectorAll('.mini-expression-builder');

            miniBuilders.forEach(builder => {
                const builderId = builder.id;
                if (builderId.includes(levelPrefix) && EF.State.miniBuilderComponents[builderId]) {
                    currentLevel.miniBuilderStates[builderId] = JSON.parse(
                        JSON.stringify(EF.State.miniBuilderComponents[builderId])
                    );
                }
            });
        }
    };

    const showNestedConfigPanel = (functionName, parentBuilderId, functionId) => {
        const varId = EF.State.currentConfigVarId;
        if (!varId) return;

        const body = document.getElementById(`configPanelBody${varId}`);
        const title = document.getElementById(`configPanelTitle${varId}`);
        const breadcrumb = document.getElementById(`configBreadcrumb${varId}`);

        if (!body || !title) return;

        updateNavigationBreadcrumb(breadcrumb);

        const icons = {
            'Conteo': 'fa-hashtag',
            'Maximo': 'fa-arrow-up',
            'Minimo': 'fa-arrow-down',
            'Suma': 'fa-plus',
            'Si entonces': 'fa-code-branch',
            'Calcular edad': 'fa-birthday-cake'
        };

        title.innerHTML = `<i class="fas ${icons[functionName] || 'fa-cog'}"></i> ${functionName} <span style="color: var(--primary); font-size: 12px;">(Anidada)</span>`;

        EF.State.availableFields = getAvailableFields();
        body.innerHTML = generateFunctionForm(functionName);

        const panel = document.getElementById(`configPanel${varId}`);
        if (panel) {
            const panelBody = panel.querySelector('.config-panel-body');
            if (panelBody) panelBody.scrollTop = 0;
        }
    };

    const removeMiniBuilderComponent = (builderId, index) => {
        if (!EF.State.miniBuilderComponents[builderId]) return;

        const component = EF.State.miniBuilderComponents[builderId][index];

        if (component.type === 'function' && component.functionId) {
            const functionId = component.functionId;

            const levelIndex = EF.State.navigationStack.levels.findIndex(level =>
                level.functionId === functionId && level.parentBuilderId === builderId
            );

            if (levelIndex !== -1) {
                const levelToDelete = EF.State.navigationStack.levels[levelIndex];

                const varPrefix = `miniBuilder_var${EF.State.currentConfigVarId || 'default'}_level${levelIndex}_`;
                const buildersToDelete = Object.keys(EF.State.miniBuilderComponents).filter(key =>
                    key.startsWith(varPrefix)
                );

                buildersToDelete.forEach(builderKey => {
                    delete EF.State.miniBuilderComponents[builderKey];
                });

                if (levelToDelete.miniBuilderStates) {
                    Object.keys(levelToDelete.miniBuilderStates).forEach(builderKey => {
                        delete levelToDelete.miniBuilderStates[builderKey];
                    });
                }

                if (EF.State.navigationStack.currentLevel >= levelIndex) {
                    const parentLevelIndex = EF.State.navigationStack.levels.findIndex(level =>
                        !level.parentBuilderId || level.parentBuilderId !== builderId
                    );
                    if (parentLevelIndex !== -1 && parentLevelIndex < levelIndex) {
                        navigateToLevel(parentLevelIndex);
                    }
                }

                EF.State.navigationStack.levels.splice(levelIndex, 1);

                if (EF.State.navigationStack.currentLevel >= levelIndex) {
                    EF.State.navigationStack.currentLevel = Math.max(0, EF.State.navigationStack.currentLevel - 1);
                }

                const currentLevel = EF.State.navigationStack.levels[EF.State.navigationStack.currentLevel];
                if (currentLevel && currentLevel.varId) {
                    const breadcrumb = document.getElementById(`configBreadcrumb${currentLevel.varId}`);
                    if (breadcrumb) {
                        updateNavigationBreadcrumb(breadcrumb);
                    }
                }
            }
        }

        EF.State.miniBuilderComponents[builderId].splice(index, 1);

        renderMiniBuilder(builderId);
        saveCurrentLevelState();
    };

    const updateCurrentLevelPreview = () => {
        if (EF.State.navigationStack.currentLevel < 0) return;

        const currentLevel = EF.State.navigationStack.levels[EF.State.navigationStack.currentLevel];
        if (!currentLevel) return;

        const varId = currentLevel.varId;
        const previewElement = document.getElementById(`globalPreview${varId}`);
        const previewContainer = document.getElementById(`globalPreview${varId}Container`);

        if (!previewElement || !previewContainer) return;

        const body = document.getElementById(`configPanelBody${varId}`);
        if (!body) return;

        const params = [];
        let fullExpression;

        if (currentLevel.functionName === 'Calcular edad' && window.FunctionCalcularEdad) {
            const instance = new FunctionCalcularEdad();
            fullExpression = instance.buildPreview();
        } else {
            const miniBuilders = body.querySelectorAll('.mini-expression-builder');

            miniBuilders.forEach(builder => {
                const builderId = builder.id;
                const components = EF.State.miniBuilderComponents[builderId] || [];

                if (components.length > 0) {
                    const expression = buildComponentsExpression(components);
                    params.push(expression);
                } else {
                    params.push('');
                }
            });

            if (currentLevel.functionName === 'Si entonces') {
                const ifContent = params[0] || '';
                const thenContent = params[1] || '';
                const elseContent = params[2] || '';
                fullExpression = `#IF(${ifContent})# #THEN(${thenContent})TH# #ELSE(${elseContent})EL#`;
            } else if (params.length > 0) {
                const paramsText = params.filter(p => p.trim() !== '').join(',');
                fullExpression = `#${currentLevel.functionName}(${paramsText})#`;
            } else {
                fullExpression = `#${currentLevel.functionName}()#`;
            }
        }

        previewElement.textContent = fullExpression;
    };

    const reset = () => {
        EF.State.navigationStack = {
            levels: [],
            currentLevel: -1
        };
        EF.State.currentFunction = null;
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        createConfigLevel,
        openNestedFunctionConfig,
        renderCurrentConfigLevel,
        getParameterLabel,
        updateMiniBreadcrumb,
        updateNavigationBreadcrumb,
        navigateToLevel,
        saveCurrentLevelState,
        showNestedConfigPanel,
        removeMiniBuilderComponent,
        updateCurrentLevelPreview,
        reset
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.Navigation = publicAPI;

    // Legacy compatibility
    window.NavigationStackManager = publicAPI;
    window.navigationStack = EF.State.navigationStack;

    console.log('[EF] Navigation cargado');

    return publicAPI;
})();
