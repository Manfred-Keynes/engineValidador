/**
 * ConfigPanel.js - Panel de Configuracion de Funciones
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.ConfigPanel
 *
 * Maneja el panel de configuracion para funciones:
 * - Apertura/cierre del panel
 * - Procesamiento de niveles anidados
 * - Aceptacion de configuracion
 */

const ConfigPanelModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== FUNCIONES PUBLICAS =====

    /**
     * Abre modal de configuracion (redirige a panel)
     */
    const openFunctionModal = (functionName, input) => {
        openConfigPanel(functionName, input);
    };

    /**
     * Abre panel de configuracion
     */
    const openConfigPanel = (functionName, input) => {
        console.log('Abriendo panel de configuracion:', functionName);

        if (input) {
            EF.State.activeInput = input;
            EF.State.currentConfigVarId = input.varId;
        }

        const isEditMode = input && input.editMode;

        // SIEMPRE reiniciar el navigationStack al abrir un panel nuevo
        EF.State.navigationStack.levels = [];
        EF.State.navigationStack.currentLevel = -1;

        // Limpiar miniBuilderComponents para esta variable si NO estamos editando
        if (!isEditMode) {
            const varId = EF.State.currentConfigVarId || 'default';
            const keysToDelete = Object.keys(EF.State.miniBuilderComponents).filter(key =>
                key.includes(`_var${varId}_`)
            );
            keysToDelete.forEach(key => {
                delete EF.State.miniBuilderComponents[key];
            });
            console.log(`Limpiados miniBuilderComponents para var ${varId}: ${keysToDelete.length} builders`);

            // Limpiar droppedBlocks de Calcular edad
            if (window.FunctionCalcularEdad) {
                FunctionCalcularEdad.droppedBlocks = [];
            }
        }

        const newLevel = createConfigLevel(functionName, null, null, EF.State.currentConfigVarId);
        EF.State.navigationStack.levels.push(newLevel);
        EF.State.navigationStack.currentLevel = 0;

        EF.State.currentFunction = functionName;

        const panel = document.getElementById(`configPanel${EF.State.currentConfigVarId}`);
        if (panel) {
            panel.classList.add('active');
        }

        renderCurrentConfigLevel();
    };

    /**
     * Actualiza preview de configuracion
     */
    const updateConfigPreview = () => {
        const preview = document.getElementById('configPanelPreview');
        if (preview && EF.State.navigationStack.currentLevel >= 0) {
            const currentLevel = EF.State.navigationStack.levels[EF.State.navigationStack.currentLevel];
            if (!currentLevel) return;

            const inputs = document.querySelectorAll('#configPanelBody input, #configPanelBody select');
            const params = [];
            inputs.forEach(input => {
                if (input.value) params.push(input.value);
            });
            preview.textContent = `#${currentLevel.functionName}(${params.join(', ')})#`;
        }
    };

    /**
     * Cierra panel de configuracion
     */
    const closeConfigPanel = (varId) => {
        const targetVarId = varId || EF.State.currentConfigVarId;
        if (!targetVarId) return;

        if (EF.State.navigationStack.levels.length > 1) {
            if (!confirm('Cerrar sin guardar? Hay funciones anidadas sin configurar.')) {
                return;
            }
        }

        const panel = document.getElementById(`configPanel${targetVarId}`);
        if (panel) {
            panel.classList.remove('active');
        }

        EF.State.navigationStack.levels.forEach(level => {
            Object.keys(level.miniBuilderStates).forEach(builderId => {
                delete EF.State.miniBuilderComponents[builderId];
            });
        });

        EF.State.navigationStack.levels = [];
        EF.State.navigationStack.currentLevel = -1;

        if (window.FunctionCalcularEdad) {
            FunctionCalcularEdad.droppedBlocks = [];
        }

        EF.State.currentConfigVarId = null;
        EF.State.currentFunction = null;

        if (EF.State.activeInput && EF.State.activeInput.editMode) {
            delete EF.State.activeInput.editMode;
        }
        if (EF.State.editingComponent) {
            delete EF.State.editingComponent;
        }
    };

    /**
     * Agrega boton de retroceso al panel
     */
    const addBackButtonToPanel = (varId) => {
        const header = document.querySelector(`#configPanel${varId} .config-panel-header`);
        if (!header) return;

        if (header.querySelector('.back-button')) return;

        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.type = 'button';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
        backButton.title = 'Volver al nivel anterior';
        backButton.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            border-radius: 6px;
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: all 0.2s;
            display: none;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        `;

        backButton.onclick = () => {
            if (EF.State.navigationStack.currentLevel > 0) {
                navigateToLevel(EF.State.navigationStack.currentLevel - 1);
            }
        };

        const headerLeft = header.querySelector('.config-panel-header-left');
        if (headerLeft) {
            headerLeft.insertBefore(backButton, headerLeft.firstChild);
        }
    };

    /**
     * Guarda toda la estructura con niveles anidados
     */
    const acceptAllNestedLevels = (varId) => {
        console.log('Procesando todos los niveles anidados...');
        console.log('   Estado inicial del navigationStack:');
        EF.State.navigationStack.levels.forEach((level, idx) => {
            console.log(`      Nivel ${idx} (${level.functionName}):`, Object.keys(level.miniBuilderStates));
        });

        saveCurrentLevelState();

        // Restaurar TODOS los mini-builders de TODOS los niveles
        console.log('Restaurando todos los mini-builders desde estados guardados...');
        EF.State.navigationStack.levels.forEach((level, idx) => {
            console.log(`   Restaurando mini-builders del nivel ${idx}:`, Object.keys(level.miniBuilderStates));
            Object.keys(level.miniBuilderStates).forEach(builderId => {
                console.log(`      ${builderId}: ${level.miniBuilderStates[builderId].length} componentes`);
                EF.State.miniBuilderComponents[builderId] = JSON.parse(
                    JSON.stringify(level.miniBuilderStates[builderId])
                );
            });
        });

        // Procesar todos los niveles desde el mas profundo hacia arriba
        for (let levelIndex = EF.State.navigationStack.levels.length - 1; levelIndex > 0; levelIndex--) {
            const currentLevel = EF.State.navigationStack.levels[levelIndex];

            console.log(`   Procesando nivel ${levelIndex}: ${currentLevel.functionName}`);

            let parentLevel = null;
            let parentLevelIndex = -1;

            if (currentLevel.parentBuilderId) {
                const levelMatch = currentLevel.parentBuilderId.match(/level(\d+)_/);
                if (levelMatch) {
                    parentLevelIndex = parseInt(levelMatch[1]);
                    parentLevel = EF.State.navigationStack.levels[parentLevelIndex];
                    console.log(`      Padre real encontrado: nivel ${parentLevelIndex} (${parentLevel ? parentLevel.functionName : 'null'})`);
                }
            }

            if (!parentLevel) {
                console.warn(`      No se encontro nivel padre para ${currentLevel.functionName}`);
                continue;
            }

            const levelExpression = buildLevelExpression(currentLevel);
            console.log(`      Expresion: ${levelExpression}`);

            if (currentLevel.parentBuilderId && currentLevel.functionId) {
                const parentComponents = EF.State.miniBuilderComponents[currentLevel.parentBuilderId];

                if (parentComponents) {
                    const functionComp = parentComponents.find(c => c.functionId === currentLevel.functionId);
                    if (functionComp) {
                        functionComp.fullExpression = levelExpression;
                        functionComp.configured = true;

                        const shortPreview = levelExpression.length > 40 ?
                            `${levelExpression.substring(0, 37)}...` : levelExpression;
                        functionComp.html = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${shortPreview}</span>`;

                        console.log(`      Componente actualizado: ${functionComp.value}`);

                        if (parentLevel.miniBuilderStates[currentLevel.parentBuilderId]) {
                            parentLevel.miniBuilderStates[currentLevel.parentBuilderId] = JSON.parse(
                                JSON.stringify(EF.State.miniBuilderComponents[currentLevel.parentBuilderId])
                            );
                        }
                    }
                }
            }
        }

        // Procesar nivel raiz (0)
        const rootLevel = EF.State.navigationStack.levels[0];
        if (!rootLevel) return;

        let rootExpression;
        let displayPreview;

        if (rootLevel.functionName === 'Si entonces') {
            const params = [];
            Object.keys(rootLevel.miniBuilderStates).sort().forEach(builderId => {
                const components = EF.State.miniBuilderComponents[builderId] || rootLevel.miniBuilderStates[builderId] || [];
                if (components.length > 0) {
                    params.push(buildComponentsExpression(components));
                } else {
                    params.push('');
                }
            });

            const ifContent = params[0] || '';
            const thenContent = params[1] || '';
            const elseContent = params[2] || '';
            rootExpression = `#IF(${ifContent})# #THEN(${thenContent})TH# #ELSE(${elseContent})EL#`;
            displayPreview = rootExpression;
        } else {
            rootExpression = buildLevelExpression(rootLevel);
            displayPreview = rootExpression;
        }

        console.log('Expresion raiz final:', rootExpression);

        if (displayPreview.length > 60) {
            displayPreview = `${displayPreview.substring(0, 50)}...${displayPreview.substring(displayPreview.length - 7)}`;
        }

        const displayHtml = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${displayPreview}</span>`;

        // Recopilar params para poder restaurarlos despues
        const finalParams = [];
        Object.keys(rootLevel.miniBuilderStates).sort().forEach(builderId => {
            const components = EF.State.miniBuilderComponents[builderId] || rootLevel.miniBuilderStates[builderId] || [];
            if (components.length > 0) {
                finalParams.push(buildComponentsExpression(components));
            } else {
                finalParams.push('');
            }
        });

        const metadata = {
            functionName: rootLevel.functionName,
            fullExpression: rootExpression,
            params: finalParams
        };

        // Para "Si entonces", guardar estructura especial para restauracion
        if (rootLevel.functionName === 'Si entonces') {
            metadata.siEntonces = {
                ifContent: finalParams[0] || '',
                thenContent: finalParams[1] || '',
                elseContent: finalParams[2] || ''
            };
            console.log('Guardando siEntonces:', metadata.siEntonces);
        }

        if (EF.State.activeInput && EF.State.activeInput.editMode && EF.State.editingComponent) {
            console.log('Actualizando funcion editada:', rootExpression);

            initExpressionComponents(EF.State.editingComponent.varId);
            const comp = EF.State.expressionComponents[EF.State.editingComponent.varId].find(
                c => c.id === EF.State.editingComponent.compId
            );

            if (comp) {
                comp.value = rootExpression;
                comp.html = displayHtml;
                comp.metadata = metadata;

                renderExpression(EF.State.editingComponent.varId);
                updateExpressionPreview(EF.State.editingComponent.varId);
            }

            delete EF.State.editingComponent;
            delete EF.State.activeInput.editMode;
        } else {
            console.log('Funcion raiz aceptada:', rootExpression);
            addExprComponent(varId, 'function', rootExpression, displayHtml, metadata);
        }

        EF.State.navigationStack.levels = [];
        EF.State.navigationStack.currentLevel = -1;

        closeConfigPanel(varId);
    };

    /**
     * Acepta configuracion de funcion
     */
    const acceptFunctionConfig = (varId) => {
        const targetVarId = varId || EF.State.currentConfigVarId;
        if (!targetVarId) return;

        // Si estamos en nivel raiz y hay niveles anidados, guardar todo
        if (EF.State.navigationStack.currentLevel === 0 && EF.State.navigationStack.levels.length > 1) {
            console.log('Guardando toda la estructura con niveles anidados');
            acceptAllNestedLevels(targetVarId);
            return;
        }

        const body = document.getElementById(`configPanelBody${targetVarId}`);
        if (!body) return;

        const params = [];
        const miniBuilders = body.querySelectorAll('.mini-expression-builder');

        if (miniBuilders.length > 0) {
            miniBuilders.forEach(builder => {
                const builderId = builder.id;
                const components = EF.State.miniBuilderComponents[builderId] || [];

                if (components.length > 0) {
                    const expression = buildComponentsExpression(components);
                    params.push(expression);
                }
            });
        }

        // Si estamos en nivel anidado
        if (EF.State.navigationStack.currentLevel > 0) {
            const currentLevel = EF.State.navigationStack.levels[EF.State.navigationStack.currentLevel];
            const parentBuilderId = currentLevel.parentBuilderId;
            const functionId = currentLevel.functionId;

            let parentLevelIndex = -1;
            if (parentBuilderId) {
                const levelMatch = parentBuilderId.match(/level(\d+)_/);
                if (levelMatch) {
                    parentLevelIndex = parseInt(levelMatch[1]);
                }
            }

            if (parentLevelIndex === -1 || parentLevelIndex >= EF.State.navigationStack.levels.length) {
                console.error('No se pudo encontrar el nivel padre para', parentBuilderId);
                return;
            }

            const parentLevel = EF.State.navigationStack.levels[parentLevelIndex];
            console.log(`Nivel padre encontrado: ${parentLevelIndex} (${parentLevel.functionName})`);

            console.log('Guardando funcion anidada:', {
                functionName: currentLevel.functionName,
                params: params,
                parentBuilderId: parentBuilderId,
                functionId: functionId
            });

            const parentComponents = EF.State.miniBuilderComponents[parentBuilderId];
            if (parentComponents) {
                const funcComponent = parentComponents.find(c => c.functionId === functionId);
                if (funcComponent) {
                    funcComponent.configured = true;
                    funcComponent.params = params;

                    const paramsText = params.filter(p => p.trim() !== '').join(',');
                    const functionText = `#${funcComponent.value}(${paramsText})#`;
                    funcComponent.fullExpression = functionText;

                    const shortPreview = functionText.length > 40 ? `${functionText.substring(0, 37)}...` : functionText;
                    funcComponent.html = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${shortPreview}</span>`;

                    console.log('Funcion configurada:', funcComponent);

                    if (parentLevel.miniBuilderStates[parentBuilderId]) {
                        parentLevel.miniBuilderStates[parentBuilderId] = JSON.parse(
                            JSON.stringify(EF.State.miniBuilderComponents[parentBuilderId])
                        );
                    }
                }
            }

            saveCurrentLevelState();
            navigateToLevel(parentLevelIndex);

            setTimeout(() => {
                renderMiniBuilder(parentBuilderId);
            }, 100);

            return;
        }

        // Nivel raiz - insertar en el constructor principal
        let functionText;
        let displayPreview;

        if (EF.State.currentFunction === 'Calcular edad' && window.FunctionCalcularEdad) {
            console.log('Calcular edad detectado, usando FunctionCalcularEdad modular');
            const instance = new FunctionCalcularEdad();
            functionText = instance.buildExpression();
            displayPreview = instance.buildPreview();
            console.log('Valor guardado:', functionText);
            console.log('Vista previa:', displayPreview);
        } else {
            const paramsText = params.filter(p => p.trim() !== '').join(',');
            functionText = `#${EF.State.currentFunction}(${paramsText})#`;
            displayPreview = functionText;
        }

        if (displayPreview.length > 60) {
            displayPreview = `${displayPreview.substring(0, 50)}...${displayPreview.substring(displayPreview.length - 7)}`;
        }

        const displayHtml = `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${displayPreview}</span>`;

        const metadata = {
            functionName: EF.State.currentFunction,
            params: params,
            fullExpression: functionText
        };

        if (EF.State.currentFunction === 'Calcular edad' && window.FunctionCalcularEdad && FunctionCalcularEdad.droppedBlocks.length > 0) {
            metadata.blocks = JSON.parse(JSON.stringify(FunctionCalcularEdad.droppedBlocks));
            console.log('Guardando blocks en metadata:', metadata.blocks);
        }

        console.log('Metadata final:', metadata);

        if (EF.State.activeInput && EF.State.activeInput.editMode && EF.State.editingComponent) {
            console.log('Actualizando funcion editada:', functionText);

            initExpressionComponents(EF.State.editingComponent.varId);
            const comp = EF.State.expressionComponents[EF.State.editingComponent.varId].find(
                c => c.id === EF.State.editingComponent.compId
            );

            if (comp) {
                comp.value = functionText;
                comp.html = displayHtml;
                comp.metadata = metadata;

                console.log('   Componente actualizado:', comp);

                renderExpression(EF.State.editingComponent.varId);
                updateExpressionPreview(EF.State.editingComponent.varId);
            }

            delete EF.State.editingComponent;
            delete EF.State.activeInput.editMode;
        } else {
            console.log('Funcion raiz aceptada:', functionText);
            addExprComponent(targetVarId, 'function', functionText, displayHtml, metadata);
        }

        miniBuilders.forEach(builder => {
            delete EF.State.miniBuilderComponents[builder.id];
        });

        EF.State.navigationStack.levels = [];
        EF.State.navigationStack.currentLevel = -1;

        closeConfigPanel(targetVarId);
    };

    /**
     * Construye expresion de un nivel
     */
    const buildLevelExpression = (level) => {
        console.log('Construyendo expresion para nivel:', level.functionName);
        console.log('   miniBuilderStates disponibles:', Object.keys(level.miniBuilderStates));

        const params = [];

        for (const builderId in level.miniBuilderStates) {
            const components = level.miniBuilderStates[builderId];
            console.log(`   Procesando ${builderId}:`, components);
            if (components && components.length > 0) {
                const expression = buildComponentsExpression(components);
                console.log(`   Builder ${builderId} -> ${expression} (${components.length} componentes)`);
                params.push(expression);
            } else {
                console.log(`   Builder ${builderId} esta vacio o no tiene componentes`);
                params.push('');
            }
        }

        const paramsText = params.filter(p => p.trim() !== '').join(',');
        const fullExpression = `#${level.functionName}(${paramsText})#`;

        console.log('   Expresion completa:', fullExpression);
        return fullExpression;
    };

    /**
     * Genera formulario de funcion
     */
    const generateFunctionForm = (functionName) => {
        // Usar FunctionRegistry (modular)
        if (window.FunctionRegistry && window.FunctionRegistry.has(functionName)) {
            console.log('generateFunctionForm: Usando FunctionRegistry para', functionName);
            return window.FunctionRegistry.generateForm(functionName, EF.State.currentConfigVarId);
        }

        // Fallback para funciones no registradas
        console.warn('generateFunctionForm: Funcion no encontrada en registry:', functionName);
        return window.FunctionUtils.generateMiniBuilder('param1', 'Campo o Expresion', 'Arrastra campos, operadores o funciones');
    };

    /**
     * Cierra el modal de funcion
     */
    const closeFunctionModal = () => {
        const modal = document.getElementById('functionModalOverlay');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        openFunctionModal,
        openConfigPanel,
        updateConfigPreview,
        closeConfigPanel,
        addBackButtonToPanel,
        acceptAllNestedLevels,
        acceptFunctionConfig,
        buildLevelExpression,
        generateFunctionForm,
        closeFunctionModal
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.ConfigPanel = publicAPI;

    // Legacy compatibility
    window.ConfigPanelManager = publicAPI;

    console.log('[EF] ConfigPanel cargado');

    return publicAPI;
})();
