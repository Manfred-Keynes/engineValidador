/**
 * ExpressionBuilder.js - Constructor de Expresiones Principal
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.Expression
 *
 * Maneja el constructor de expresiones para variables:
 * - Componentes de expresion (campos, operadores, funciones, valores)
 * - Parseadores de expresiones
 * - Vista previa de expresiones
 */

const ExpressionBuilderModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== INICIALIZAR ESTADO =====
    EF.State.expressionComponents = EF.State.expressionComponents || {};
    EF.State.componentCounter = EF.State.componentCounter || 0;
    EF.State.activeInput = EF.State.activeInput || null;
    EF.State.availableFields = EF.State.availableFields || [];

    // Catalogo de funciones (legacy - para referencia)
    EF.State.functionCatalog = EF.State.functionCatalog || {
        'CalculaEdad': {
            icon: 'fa-birthday-cake',
            name: 'Calcular Edad',
            desc: 'Calcula la edad en anos desde una fecha de nacimiento.',
            params: [
                { name: 'campo_fecha', type: 'field', required: true, hint: 'Campo con fecha de nacimiento' },
                { name: 'operador', type: 'select', required: false, hint: 'Operador de comparacion', options: ['', '>', '<', '>=', '<=', '=', '!='] },
                { name: 'valor', type: 'text', required: false, hint: 'Valor a comparar (ej: 18)' },
                { name: 'formato', type: 'select', required: true, hint: 'Formato de ano', options: ['YYYY', 'YY'] }
            ],
            template: '#CalculaEdad([?campo_fecha],[?operador],[?valor],[?formato])#'
        },
        'SiEntonces': {
            icon: 'fa-code-branch',
            name: 'Si Entonces',
            desc: 'Evaluacion condicional',
            params: [
                { name: 'condicion', type: 'text', required: true, hint: 'Expresion logica' },
                { name: 'valor_verdadero', type: 'text', required: true, hint: 'Valor si verdadero' },
                { name: 'valor_falso', type: 'text', required: true, hint: 'Valor si falso' }
            ],
            template: '#SiEntonces([?condicion], [?valor_verdadero], [?valor_falso])#'
        }
    };

    // ===== FUNCIONES PUBLICAS =====

    /**
     * Inicializa componentes de expresion para una variable
     */
    const initExpressionComponents = (varId) => {
        if (!EF.State.expressionComponents[varId]) {
            EF.State.expressionComponents[varId] = [];
        }
    };

    /**
     * Agrega componente a la expresion
     */
    const addExprComponent = (varId, type, value, html, metadata = null) => {
        initExpressionComponents(varId);
        const componentId = `comp_${++EF.State.componentCounter}`;
        const component = {
            id: componentId,
            type: type,
            value: value,
            html: html,
            order: EF.State.expressionComponents[varId].length,
            metadata: metadata
        };
        EF.State.expressionComponents[varId].push(component);
        renderExpression(varId);
        updateExpressionPreview(varId);
    };

    /**
     * Renderiza expresion visual
     */
    const renderExpression = (varId) => {
        const builder = document.getElementById(`exprBuilder${varId}`);
        if (!builder) return;

        initExpressionComponents(varId);
        const components = EF.State.expressionComponents[varId];

        if (components.length === 0) {
            builder.classList.add('empty');
            builder.innerHTML = `
                <div class="empty">
                    <i class="fas fa-puzzle-piece" style="margin-right: 8px;"></i>
                    Arrastra componentes aqui para construir la expresion
                </div>
            `;
            return;
        }

        builder.classList.remove('empty');
        let html = '<div class="expression-components">';

        components.forEach((comp, index) => {
            html += `<div class="expr-component" data-type="${comp.type}" data-comp-id="${comp.id}">`;
            html += `<div class="expr-content">${comp.html}</div>`;
            html += '<div class="expr-actions">';

            if (comp.type === 'function') {
                html += `<button type="button" class="expr-btn edit" onclick="editExprComponent('${comp.id}', ${varId})" title="Editar"><i class="fas fa-edit"></i></button>`;
            }
            if (comp.type === 'value') {
                html += `<button type="button" class="expr-btn edit" onclick="editExprValue('${comp.id}', ${varId})" title="Editar"><i class="fas fa-edit"></i></button>`;
            }
            html += `<button type="button" class="expr-btn delete" onclick="deleteExprComponent('${comp.id}', ${varId})" title="Eliminar"><i class="fas fa-trash"></i></button>`;
            html += '</div></div>';
        });

        html += '</div>';
        builder.innerHTML = html;
    };

    /**
     * Elimina componente con confirmacion
     */
    const deleteExprComponent = (compId, varId) => {
        initExpressionComponents(varId);
        const comp = EF.State.expressionComponents[varId].find(c => c.id === compId);
        if (!comp) return;

        const simpleTypes = ['operator', 'value', 'parenthesis'];

        if (simpleTypes.includes(comp.type)) {
            EF.State.expressionComponents[varId] = EF.State.expressionComponents[varId].filter(c => c.id !== compId);
            renderExpression(varId);
            updateExpressionPreview(varId);
            return;
        }

        const componentTypes = {
            'function': 'Funcion',
            'field': 'Campo'
        };

        const typeLabel = componentTypes[comp.type] || comp.type;
        const shortValue = comp.value.length > 30 ? `${comp.value.substring(0, 27)}...` : comp.value;

        let mensaje = 'Eliminar este componente?\n\n';
        mensaje += `Tipo: ${typeLabel}\n`;
        mensaje += `Valor: ${shortValue}`;

        if (comp.type === 'function' && comp.metadata) {
            mensaje += `\n\nEsta funcion tiene ${comp.metadata.blocks ? comp.metadata.blocks.length : 0} bloque(s) configurado(s)`;
        }

        if (confirm(mensaje)) {
            EF.State.expressionComponents[varId] = EF.State.expressionComponents[varId].filter(c => c.id !== compId);
            renderExpression(varId);
            updateExpressionPreview(varId);
        }
    };

    /**
     * Edita valor de componente
     */
    const editExprValue = (compId, varId) => {
        initExpressionComponents(varId);
        const comp = EF.State.expressionComponents[varId].find(c => c.id === compId);
        if (!comp) return;

        const newValue = prompt('Editar valor:', comp.value);
        if (newValue !== null && newValue.trim() !== '') {
            comp.value = newValue.trim();
            comp.html = `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${newValue.trim()}</span>`;
            renderExpression(varId);
            updateExpressionPreview(varId);
        }
    };

    /**
     * Edita componente de funcion desde expression builder
     */
    const editExprComponent = (compId, varId) => {
        initExpressionComponents(varId);
        const comp = EF.State.expressionComponents[varId].find(c => c.id === compId);
        if (!comp || comp.type !== 'function') return;

        console.log('Editando funcion:', comp);

        if (!comp.metadata || !comp.metadata.functionName) {
            alert('No se puede editar esta funcion. Por favor eliminela y creela de nuevo.');
            return;
        }

        EF.State.editingComponent = { compId: compId, varId: varId, originalComponent: comp };

        const builder = document.getElementById(`exprBuilder${varId}`);
        const tempInput = document.createElement('textarea');
        tempInput.style.display = 'none';
        builder.appendChild(tempInput);

        EF.State.activeInput = tempInput;
        EF.State.activeInput.varId = varId;
        EF.State.activeInput.editMode = true;

        openConfigPanel(comp.metadata.functionName, tempInput);

        setTimeout(() => {
            loadParamsIntoConfigPanel(comp.metadata, varId);
        }, 300);
    };

    /**
     * Actualiza preview de la expresion
     */
    const updateExpressionPreview = (varId) => {
        initExpressionComponents(varId);
        const components = EF.State.expressionComponents[varId];
        let exprText = '';

        components.forEach(comp => {
            if (comp.type === 'field' || comp.type === 'value' || comp.type === 'function' || comp.type === 'parenthesis') {
                exprText += comp.value;
            } else if (comp.type === 'operator') {
                exprText += ` ${comp.value} `;
            }
        });

        updatePreview(varId, 'expr', exprText);
    };

    /**
     * Parsea expresion a componentes
     */
    const parseExpressionToComponents = (expression) => {
        const components = [];

        if (!expression || expression.trim() === '') {
            return components;
        }

        console.log('      Parseando expresion:', expression);

        let i = 0;
        while (i < expression.length) {
            const char = expression[i];

            if (char === ' ') {
                i++;
                continue;
            }

            // Detectar campo: [nombre]
            if (char === '[') {
                const endIdx = expression.indexOf(']', i);
                if (endIdx !== -1) {
                    const fieldName = expression.substring(i + 1, endIdx);
                    components.push({
                        type: 'field',
                        value: fieldName,
                        html: `<i class="fas fa-database expr-icon"></i><span class="expr-value">${fieldName}</span>`
                    });
                    i = endIdx + 1;
                    continue;
                }
            }

            // Detectar funcion anidada: #Nombre(...)#
            if (char === '#') {
                let depth = 0;
                let inFunction = false;
                let endIdx = i + 1;

                for (let j = i + 1; j < expression.length; j++) {
                    if (expression[j] === '(') {
                        depth++;
                        inFunction = true;
                    } else if (expression[j] === ')') {
                        depth--;
                    } else if (expression[j] === '#' && inFunction && depth === 0) {
                        endIdx = j;
                        break;
                    }
                }

                if (endIdx > i + 1) {
                    const token = expression.substring(i, endIdx + 1);
                    const funcNameMatch = token.match(/#([^(]+)\(/);
                    if (funcNameMatch) {
                        const funcName = funcNameMatch[1];
                        const startIdx = token.indexOf('(') + 1;
                        const lastIdx = token.lastIndexOf(')');
                        const paramsStr = token.substring(startIdx, lastIdx);
                        const funcParams = parseNestedParams(paramsStr);
                        const functionId = `func_${Date.now()}_${i}`;

                        components.push({
                            type: 'function',
                            value: funcName,
                            functionId: functionId,
                            configured: true,
                            fullExpression: token,
                            params: funcParams,
                            html: `<i class="fas fa-magic expr-icon"></i><span class="expr-value">${token}</span>`
                        });
                    }
                    i = endIdx + 1;
                    continue;
                }
            }

            // Detectar parentesis
            if (char === '(' || char === ')') {
                components.push({
                    type: 'parenthesis',
                    value: char,
                    html: `<span class="expr-value">${char}</span>`
                });
                i++;
                continue;
            }

            // Detectar operadores
            const remaining = expression.substring(i);
            const operatorMatch = remaining.match(/^(AND|OR|>=|<=|!=|[+\-*/=<>!])/i);
            if (operatorMatch) {
                const operator = operatorMatch[1];
                components.push({
                    type: 'operator',
                    value: operator,
                    html: `<span class="expr-operator">${operator}</span>`
                });
                i += operator.length;
                continue;
            }

            // Detectar valores simples
            const valueMatch = remaining.match(/^([^\s\[\]#(),]+)/);
            if (valueMatch) {
                const value = valueMatch[1];
                if (value !== ',') {
                    components.push({
                        type: 'value',
                        value: value,
                        html: `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${value}</span>`
                    });
                }
                i += value.length;
                continue;
            }

            i++;
        }

        return components;
    };

    /**
     * Parsea parametros anidados
     */
    const parseNestedParams = (paramsStr) => {
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
    };

    /**
     * Parsea expresion "Si entonces" en tokens IF, THEN, ELSE
     */
    const parseSiEntoncesExpression = (fullExpression) => {
        console.log('   Parseando expresion Si entonces:', fullExpression);

        const result = {
            ifContent: '',
            thenContent: '',
            elseContent: ''
        };

        try {
            const extractContent = (text, startPattern, endPattern) => {
                const startIdx = text.indexOf(startPattern);
                if (startIdx === -1) return '';

                const parenStart = startIdx + startPattern.length;
                if (text[parenStart] !== '(') return '';

                let depth = 0;
                let endIdx = -1;

                for (let i = parenStart; i < text.length; i++) {
                    if (text[i] === '(') depth++;
                    if (text[i] === ')') depth--;

                    if (depth === 0) {
                        endIdx = i;
                        break;
                    }
                }

                if (endIdx === -1) return '';

                return text.substring(parenStart + 1, endIdx);
            };

            result.ifContent = extractContent(fullExpression, '#IF', ')');
            result.thenContent = extractContent(fullExpression, '#THEN', ')');
            result.elseContent = extractContent(fullExpression, '#ELSE', ')');

            console.log('   Resultado del parseo:');
            console.log('      IF:', result.ifContent);
            console.log('      THEN:', result.thenContent);
            console.log('      ELSE:', result.elseContent);

        } catch (error) {
            console.error('   Error parseando Si entonces:', error);
        }

        return result;
    };

    /**
     * Agrega componente de valor
     */
    const addValueComponent = (varId) => {
        const builder = document.getElementById(`exprBuilder${varId}`);
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
                addExprComponent(varId, 'value', value, `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${value}</span>`);
            }
            inlineInputContainer.remove();

            if (!EF.State.expressionComponents[varId] || EF.State.expressionComponents[varId].length === 0) {
                if (emptyDiv) emptyDiv.style.display = 'flex';
            }
        };

        const cancelInput = () => {
            inlineInputContainer.remove();

            if (!EF.State.expressionComponents[varId] || EF.State.expressionComponents[varId].length === 0) {
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

    /**
     * Agrega parentesis
     */
    const addParenthesis = (varId, type) => {
        const choice = prompt('SELECCIONAR PARENTESIS\n\nOpciones:\n\n  1. ( Abrir parentesis\n  2. ) Cerrar parentesis\n\nIngrese el numero:');
        if (choice === '1') {
            addExprComponent(varId, 'parenthesis', '(', '<span class="expr-value">(</span>');
        } else if (choice === '2') {
            addExprComponent(varId, 'parenthesis', ')', '<span class="expr-value">)</span>');
        } else if (choice !== null && choice.trim() !== '') {
            alert('Opcion invalida\n\nPor favor ingrese 1 o 2');
        }
    };

    /**
     * Obtiene campos disponibles
     */
    const getAvailableFields = () => {
        const fields = [];
        document.querySelectorAll('.draggable-field-item').forEach(item => {
            const nameEl = item.querySelector('.field-pill-name');
            const name = nameEl ? nameEl.textContent : null;
            const desc = item.getAttribute('title') || '';
            if (name) {
                fields.push({ name: name.trim(), desc: desc.trim() });
            }
        });
        console.log('Campos disponibles encontrados:', fields.length, fields);
        return fields;
    };

    /**
     * Genera opciones de campos
     */
    const generateFieldOptions = () => {
        let options = '<option value="">-- Seleccione un campo --</option>';
        EF.State.availableFields.forEach(field => {
            options += `<option value="${field.name}">${field.name} - ${field.desc}</option>`;
        });
        return options;
    };

    /**
     * Genera items de paleta de campos
     */
    const generateFieldPaletteItems = () => {
        const fields = getAvailableFields();
        if (!fields || fields.length === 0) {
            return '<div style="padding: 20px; text-align: center; color: var(--gray-500);">No hay campos disponibles</div>';
        }

        return fields.map(field => `
            <div class="palette-item" data-type="field" data-value="${field.name}"
                 draggable="true" ondragstart="dragStart(event)">
                <i class="fas fa-database"></i>
                <span>${field.name}</span>
            </div>
        `).join('');
    };

    /**
     * Carga bloques guardados en el modal para edicion
     */
    const loadBlocksIntoModal = (blocks) => {
        if (!blocks || blocks.length === 0) return;
        if (!window.FunctionCalcularEdad) return;

        FunctionCalcularEdad.droppedBlocks = [];

        blocks.forEach(block => {
            FunctionCalcularEdad.droppedBlocks.push({
                id: `block_${Date.now()}_${Math.random()}`,
                type: block.type,
                value: block.value,
                order: block.order
            });
        });

        FunctionCalcularEdad.renderBlocks();
        FunctionCalcularEdad.updatePreview();
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        initExpressionComponents,
        addExprComponent,
        renderExpression,
        deleteExprComponent,
        editExprValue,
        editExprComponent,
        updateExpressionPreview,
        parseExpressionToComponents,
        parseNestedParams,
        parseSiEntoncesExpression,
        addValueComponent,
        addParenthesis,
        getAvailableFields,
        generateFieldOptions,
        generateFieldPaletteItems,
        loadBlocksIntoModal
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.Expression = publicAPI;

    // Legacy compatibility
    window.ExpressionBuilder = publicAPI;

    console.log('[EF] Expression cargado');

    return publicAPI;
})();
