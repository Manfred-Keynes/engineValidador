/**
 * DragDropManager.js - Sistema de Drag & Drop
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.DragDrop
 */

const DragDropManager = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== INICIALIZAR ESTADO =====
    EF.State.draggedFunctionName = null;
    EF.State.draggedOperator = null;
    EF.State.draggedField = null;
    EF.State.draggedValue = null;
    EF.State.draggedParenthesis = null;
    EF.State.draggedVariableId = null;
    EF.State.draggedVariableName = '';
    EF.State.draggedLogicOperator = null;
    EF.State.draggedElement = null;
    EF.State.targetVarId = null;

    // ===== FUNCIONES PRIVADAS =====

    const limpiarClaseDragging = (selector) => {
        document.querySelectorAll(selector).forEach(item => item.classList.remove('dragging'));
    };

    // ===== FUNCIONES PUBLICAS =====

    const dragFieldStart = (event) => {
        const fieldItem = event.target.closest('.draggable-field-item');
        if (!fieldItem) {
            console.error('No se encontro .draggable-field-item');
            return;
        }
        const fieldName = fieldItem.getAttribute('data-field');
        console.log('DRAG START Campo:', fieldName);
        EF.State.draggedField = fieldName;
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', fieldName);
        fieldItem.classList.add('dragging');
    };

    const dragFieldEnd = (event) => {
        console.log('DRAG END Campo');
        const fieldItem = event.target.closest('.draggable-field-item');
        if (fieldItem) fieldItem.classList.remove('dragging');
    };

    const dragOperatorStart = (event) => {
        const operatorSymbol = event.target.closest('.draggable-operator-item').getAttribute('data-operator');
        EF.State.draggedOperator = operatorSymbol;
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', operatorSymbol);
        event.target.closest('.draggable-operator-item').classList.add('dragging');
    };

    const dragOperatorEnd = (event) => {
        console.log('DRAG END Operador');
        const operatorItem = event.target.closest('.draggable-operator-item');
        if (operatorItem) operatorItem.classList.remove('dragging');
    };

    const dragValueStart = (event) => {
        EF.State.draggedValue = 'value';
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', 'value');
        event.target.closest('.draggable-value-item').classList.add('dragging');
        console.log('DRAG START Valor');
    };

    const dragValueEnd = (event) => {
        console.log('DRAG END Valor');
        const valueItem = event.target.closest('.draggable-value-item');
        if (valueItem) valueItem.classList.remove('dragging');
    };

    const dragParenthesisStart = (event) => {
        const parenthesisValue = event.target.closest('.draggable-parenthesis-item').getAttribute('data-value') || '(';
        EF.State.draggedParenthesis = parenthesisValue;
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', parenthesisValue);
        event.target.closest('.draggable-parenthesis-item').classList.add('dragging');
        console.log('DRAG START Parentesis:', parenthesisValue);
    };

    const dragParenthesisEnd = (event) => {
        console.log('DRAG END Parentesis');
        const parenthesisItem = event.target.closest('.draggable-parenthesis-item');
        if (parenthesisItem) parenthesisItem.classList.remove('dragging');
    };

    const dragStart = (event) => {
        const type = event.target.getAttribute('data-type');
        const value = event.target.getAttribute('data-value');

        console.log('Drag started - Palette item:', type, value);

        if (type === 'field') {
            EF.State.draggedField = value;
        } else if (type === 'operator') {
            EF.State.draggedOperator = value;
        } else if (type === 'function') {
            EF.State.draggedFunctionName = value;
        }

        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('type', type);
        event.dataTransfer.setData('value', value);
        event.target.classList.add('dragging');
    };

    const dragFunctionStart = (event) => {
        const functionName = event.target.closest('.draggable-function-item').getAttribute('data-function');
        EF.State.draggedFunctionName = functionName;
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', functionName);
        event.target.closest('.draggable-function-item').classList.add('dragging');
    };

    const dragFunctionEnd = (event) => {
        console.log('DRAG END Funcion');
        const functionItem = event.target.closest('.draggable-function-item');
        if (functionItem) functionItem.classList.remove('dragging');
    };

    const dragVariable = (event, varId) => {
        console.log('DRAG START Variable:', varId);
        EF.State.draggedVariableId = varId;

        const nameElement = document.getElementById('varName' + varId);
        EF.State.draggedVariableName = nameElement ? nameElement.textContent : 'Variable ' + varId;

        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', EF.State.draggedVariableName);
        event.target.classList.add('dragging');
    };

    const dragEnd = (event) => {
        console.log('DRAG END Variable');
        event.target.classList.remove('dragging');
    };

    const dragLogicOperator = (event, operator) => {
        console.log('DRAG START Logic Operator:', operator);
        EF.State.draggedLogicOperator = operator;
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', operator);
        event.target.classList.add('dragging');
    };

    const dragLogicOperatorEnd = (event) => {
        console.log('DRAG END Logic Operator');
        event.target.classList.remove('dragging');
    };

    const dragBlockStart = (event) => {
        console.log('DRAG START Block (Calcular edad)');
        EF.State.draggedElement = event.target;
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/html', event.target.innerHTML);
        event.dataTransfer.setData('type', event.target.getAttribute('data-type'));
        event.dataTransfer.setData('value', event.target.getAttribute('data-value'));

        setTimeout(() => event.target.classList.add('dragging'), 0);
    };

    const allowOperatorDrop = (event, varId) => {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
        EF.State.targetVarId = varId;
    };

    const dragOperatorLeave = (event) => {
        event.currentTarget.classList.remove('drag-over');
    };

    const dropOperator = (event, varId) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');

        limpiarClaseDragging('.draggable-operator-item.dragging');

        if (!EF.State.draggedOperator) return;

        addExprComponent(varId, 'operator', EF.State.draggedOperator, `<span class="expr-value">${EF.State.draggedOperator}</span>`);

        EF.State.draggedOperator = null;
        EF.State.targetVarId = null;
    };

    const allowItemDrop = (event, varId) => {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
        EF.State.targetVarId = varId;
    };

    const dragItemLeave = (event) => {
        event.currentTarget.classList.remove('drag-over');
    };

    const dropItem = (event, varId) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');

        limpiarClaseDragging('.draggable-function-item.dragging, .draggable-operator-item.dragging, .draggable-field-item.dragging, .draggable-value-item.dragging, .draggable-parenthesis-item.dragging');

        if (EF.State.draggedField) {
            addExprComponent(varId, 'field', EF.State.draggedField, `<i class="fas fa-database expr-icon"></i><span class="expr-value">${EF.State.draggedField}</span>`);
            EF.State.draggedField = null;
            EF.State.targetVarId = null;
            return;
        }

        if (EF.State.draggedFunctionName) {
            const builder = document.getElementById('exprBuilder' + varId);
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
            return;
        }

        if (EF.State.draggedOperator) {
            addExprComponent(varId, 'operator', EF.State.draggedOperator, `<span class="expr-value">${EF.State.draggedOperator}</span>`);
            EF.State.draggedOperator = null;
            EF.State.targetVarId = null;
            return;
        }

        if (EF.State.draggedValue) {
            addValueComponent(varId);
            EF.State.draggedValue = null;
            EF.State.targetVarId = null;
            return;
        }

        if (EF.State.draggedParenthesis) {
            addExprComponent(varId, 'parenthesis', EF.State.draggedParenthesis, `<span class="expr-value">${EF.State.draggedParenthesis}</span>`);
            EF.State.draggedParenthesis = null;
            EF.State.targetVarId = null;
            return;
        }
    };

    const allowFunctionDrop = (event, varId) => {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
        EF.State.targetVarId = varId;
    };

    const dragFunctionLeave = (event) => {
        event.currentTarget.classList.remove('drag-over');
    };

    const allowLogicDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('DRAGOVER expresion logica');
        event.currentTarget.classList.add('drag-over');
    };

    const dragLogicLeave = (event) => {
        console.log('DRAG LEAVE expresion logica');
        event.currentTarget.classList.remove('drag-over');
    };

    const allowDrop = (event) => {
        event.preventDefault();
        const dropZone = document.getElementById('dropZone');
        if (dropZone) dropZone.classList.add('drag-over');
    };

    const dragLeave = (event) => {
        const dropZone = document.getElementById('dropZone');
        if (dropZone && event.target === dropZone) {
            dropZone.classList.remove('drag-over');
        }
    };

    const allowMiniBuilderDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('DRAGOVER en mini-builder:', event.currentTarget ? event.currentTarget.id : 'unknown');
        const target = event.currentTarget;
        if (target) target.classList.add('drag-over');
    };

    const dragMiniBuilderLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.currentTarget;
        if (target && event.target === target) {
            target.classList.remove('drag-over');
        }
    };

    const clearAllDraggingStates = () => {
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    };

    const resetDraggedItems = () => {
        EF.State.draggedFunctionName = null;
        EF.State.draggedOperator = null;
        EF.State.draggedField = null;
        EF.State.draggedValue = null;
        EF.State.draggedParenthesis = null;
        EF.State.draggedVariableId = null;
        EF.State.draggedVariableName = '';
        EF.State.draggedLogicOperator = null;
        EF.State.draggedElement = null;
        EF.State.targetVarId = null;
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        dragFieldStart,
        dragFieldEnd,
        dragOperatorStart,
        dragOperatorEnd,
        dragValueStart,
        dragValueEnd,
        dragParenthesisStart,
        dragParenthesisEnd,
        dragStart,
        dragFunctionStart,
        dragFunctionEnd,
        dragVariable,
        dragEnd,
        dragLogicOperator,
        dragLogicOperatorEnd,
        dragBlockStart,
        allowOperatorDrop,
        dragOperatorLeave,
        dropOperator,
        allowItemDrop,
        dragItemLeave,
        dropItem,
        allowFunctionDrop,
        dragFunctionLeave,
        allowLogicDrop,
        dragLogicLeave,
        allowDrop,
        dragLeave,
        allowMiniBuilderDrop,
        dragMiniBuilderLeave,
        clearAllDraggingStates,
        resetDraggedItems
    };

    // Exponer cada funcion al scope global para compatibilidad con HTML
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.DragDrop = publicAPI;

    // Legacy compatibility
    window.DragDropManager = publicAPI;

    console.log('[EF] DragDrop cargado');

    return publicAPI;
})();
