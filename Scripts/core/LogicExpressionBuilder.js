/**
 * LogicExpressionBuilder.js - Constructor de expresiones logicas
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.LogicExpression
 */

const LogicExpressionModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== INICIALIZAR ESTADO =====
    EF.State.logicComponents = EF.State.logicComponents || [];

    // ===== FUNCIONES PUBLICAS =====

    const dropIntoLogicExpression = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');

        console.log('DROP en expresion logica');

        let component = null;

        // Variables
        if (EF.State.draggedVariableId !== null && EF.State.draggedVariableId !== undefined) {
            const nameElement = document.getElementById(`varName${EF.State.draggedVariableId}`);
            const varName = nameElement ? nameElement.textContent : `Variable ${EF.State.draggedVariableId}`;

            component = {
                type: 'variable',
                id: EF.State.draggedVariableId,
                name: varName,
                html: varName
            };

            EF.State.draggedVariableId = null;
            EF.State.draggedVariableName = '';
        }
        // Operadores logicos (AND, OR, etc)
        else if (EF.State.draggedLogicOperator !== null && EF.State.draggedLogicOperator !== undefined) {
            const isParenthesis = EF.State.draggedLogicOperator === '(' || EF.State.draggedLogicOperator === ')';

            component = {
                type: isParenthesis ? 'parenthesis' : 'operator',
                value: EF.State.draggedLogicOperator,
                html: EF.State.draggedLogicOperator
            };

            EF.State.draggedLogicOperator = null;
        }
        // Operadores regulares (>, <, =, etc)
        else if (EF.State.draggedOperator !== null && EF.State.draggedOperator !== undefined) {
            const isParenthesisOp = EF.State.draggedOperator === '(' || EF.State.draggedOperator === ')';

            component = {
                type: isParenthesisOp ? 'parenthesis' : 'operator',
                value: EF.State.draggedOperator,
                html: EF.State.draggedOperator
            };

            EF.State.draggedOperator = null;
        }
        // Parentesis (arrastrados desde paleta de parentesis)
        else if (EF.State.draggedParenthesis !== null && EF.State.draggedParenthesis !== undefined) {
            component = {
                type: 'parenthesis',
                value: EF.State.draggedParenthesis,
                html: EF.State.draggedParenthesis
            };

            EF.State.draggedParenthesis = null;
        }
        // Valor (arrastrado desde boton #valor)
        else if (EF.State.draggedValue !== null && EF.State.draggedValue !== undefined) {
            EF.State.draggedValue = null;
            // Mostrar input para ingresar valor
            document.querySelectorAll('.dragging').forEach(el => {
                el.classList.remove('dragging');
            });
            mostrarInputValorLogico();
            return;
        }

        if (component) {
            EF.State.logicComponents.push(component);
            renderLogicExpression();
        }

        document.querySelectorAll('.dragging').forEach(el => {
            el.classList.remove('dragging');
        });
    };

    const mostrarInputValorLogico = () => {
        const inputContainer = document.getElementById('inlineValueInputLogico');
        const input = document.getElementById('inputValorLogicoExpr');

        if (inputContainer && input) {
            inputContainer.style.display = 'inline-flex';
            input.value = '';
            input.focus();
        }
    };

    const aceptarValorLogicoExpr = () => {
        const input = document.getElementById('inputValorLogicoExpr');
        let value = input.value.trim();

        if (!value) {
            alert('Por favor ingrese un valor');
            return;
        }

        let displayText = value;

        if (!/^-?\d+(\.\d+)?$/.test(value)) {
            value = `"${value}"`;
            displayText = `"${value.replace(/"/g, '')}"`;
        }

        const component = {
            type: 'value',
            value: value,
            html: displayText
        };

        EF.State.logicComponents.push(component);

        cancelarValorLogicoExpr();
        renderLogicExpression();
    };

    const cancelarValorLogicoExpr = () => {
        const inputContainer = document.getElementById('inlineValueInputLogico');

        if (inputContainer) {
            inputContainer.style.display = 'none';
        }
    };

    const renderLogicExpression = () => {
        const builder = document.getElementById('logicExprBuilder');
        if (!builder) {
            console.error('No se encontro el contenedor logicExprBuilder');
            return;
        }

        if (EF.State.logicComponents.length === 0) {
            builder.innerHTML = `
                <div class="empty">
                    <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                    Arrastra variables y operadores para construir la expresion logica
                </div>
            `;
            updateLogicExpressionString();
            return;
        }

        builder.innerHTML = '';

        EF.State.logicComponents.forEach((comp, index) => {
            const pill = document.createElement('div');
            pill.className = `logic-component ${comp.type}`;
            pill.innerHTML = `
                <span>${comp.html}</span>
                <button class="remove-btn" onclick="removeLogicComponent(${index})" type="button">
                    <i class="fas fa-times"></i>
                </button>
            `;

            builder.appendChild(pill);
        });

        updateLogicExpressionString();
    };

    const removeLogicComponent = (index) => {
        EF.State.logicComponents.splice(index, 1);
        renderLogicExpression();
    };

    const updateLogicExpressionString = () => {
        const expression = EF.State.logicComponents.map(comp => {
            if (comp.type === 'variable') {
                return `{${comp.name}}`;
            } else if (comp.type === 'operator' || comp.type === 'parenthesis') {
                return comp.value;
            } else if (comp.type === 'value') {
                return comp.value;
            }
            return '';
        }).join(' ');

        const hiddenField = document.querySelector('input[id*="hdnExpresionLogica"]');
        if (hiddenField) {
            hiddenField.value = expression;
        }

        const preview = document.getElementById('logicExpressionPreview');
        if (preview) {
            if (expression.trim() === '') {
                preview.innerHTML = '<span class="preview-empty">Sin expresion configurada</span>';
            } else {
                preview.textContent = expression;
            }
        }

        return expression;
    };

    const clearLogicExpression = () => {
        EF.State.logicComponents = [];
        renderLogicExpression();
    };

    const getLogicExpressionString = () => updateLogicExpressionString();

    // ===== API PUBLICA =====
    const publicAPI = {
        dropIntoLogicExpression,
        mostrarInputValorLogico,
        aceptarValorLogicoExpr,
        cancelarValorLogicoExpr,
        renderLogicExpression,
        removeLogicComponent,
        updateLogicExpressionString,
        clearLogicExpression,
        getLogicExpressionString
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.LogicExpression = publicAPI;

    // Legacy compatibility
    window.logicComponents = EF.State.logicComponents;

    console.log('[EF] LogicExpression cargado');

    return publicAPI;
})();
