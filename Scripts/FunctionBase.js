/**
 * FunctionBase.js - Clase base abstracta para todas las funciones del Editor
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.FunctionBase
 */

const FunctionBaseModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== CLASE BASE =====
    class FunctionBase {
        // Metadata estatica - Cada funcion DEBE sobrescribir
        static functionName = '';
        static functionId = '';
        static icon = 'fa-cog';
        static description = '';
        static category = 'general';
        static allowMultipleParams = false;
        static usesBlocks = false;

        constructor(varId, builderId) {
            this.varId = varId || null;
            this.builderId = builderId || null;
            this.params = {};
            this.isEditMode = false;
            this.editingComponentId = null;
        }

        // ===== METODOS ABSTRACTOS =====

        getParameters() {
            throw new Error('Debe implementar getParameters()');
        }

        generateForm() {
            throw new Error('Debe implementar generateForm()');
        }

        buildExpression(params) {
            throw new Error('Debe implementar buildExpression()');
        }

        // ===== METODOS OPCIONALES =====

        buildPreview(params) {
            return this.buildExpression(params);
        }

        validate(params) {
            return { valid: true, errors: [] };
        }

        parseExpression(expression) {
            return null;
        }

        onFormReady() {}
        onAccept() { return true; }
        onClose() {}

        // ===== METODOS UTILITARIOS =====

        getMiniBuilder(paramId, label, placeholder) {
            placeholder = placeholder || 'Arrastra campos, operadores o funciones';
            const state = EF.State;
            const levelId = state.navigationStack.currentLevel >= 0 ? state.navigationStack.currentLevel : 0;
            const varId = state.currentConfigVarId || 'default';
            const builderId = `miniBuilder_var${varId}_level${levelId}_${paramId}`;

            return `
                <div class="mini-builder-container" style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">
                        ${label} <span style="color: var(--danger);">*</span>
                    </label>
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
                </div>`;
        }

        getMiniBuilderComponents(builderId) {
            return EF.State.miniBuilderComponents[builderId] || [];
        }

        buildComponentsExpression(components) {
            if (EF.Core.MiniBuilder && EF.Core.MiniBuilder.buildComponentsExpression) {
                return EF.Core.MiniBuilder.buildComponentsExpression(components);
            }
            return components.map(c => {
                if (c.type === 'field') return `[${c.value}]`;
                if (c.type === 'function') return c.fullExpression || c.value;
                return c.value;
            }).join(' ');
        }

        getCurrentLevel() {
            return EF.State.navigationStack.currentLevel >= 0 ? EF.State.navigationStack.currentLevel : 0;
        }

        generateBuilderId(paramId) {
            const varId = EF.State.currentConfigVarId || 'default';
            return `miniBuilder_var${varId}_level${this.getCurrentLevel()}_${paramId}`;
        }

        getAvailableFields() {
            return EF.State.availableFields || [];
        }

        generateFieldsPalette() {
            const fields = this.getAvailableFields();
            const items = fields.map(f =>
                `<div class="palette-item" data-type="field" data-value="${f}"
                      draggable="true" ondragstart="dragStart(event)">
                    <i class="fas fa-database"></i> ${f}
                </div>`
            ).join('');

            return `
                <div class="palette-section">
                    <div class="palette-title"><i class="fas fa-database" style="color: #3b82f6;"></i> Campos</div>
                    <div class="palette-items" id="fieldsContainer">${items}</div>
                </div>`;
        }

        generateOperatorsPalette(operators) {
            operators = operators || ['>', '<', '>=', '<=', '=', '!='];
            const items = operators.map(op => {
                const escaped = this._escapeHtml(op);
                return `<div class="palette-item" data-type="operator" data-value="${escaped}"
                             draggable="true" ondragstart="dragStart(event)">${escaped}</div>`;
            }).join('');

            return `
                <div class="palette-section">
                    <div class="palette-title"><i class="fas fa-calculator" style="color: #8b5cf6;"></i> Operadores</div>
                    <div class="palette-items">${items}</div>
                </div>`;
        }

        generateNestedFunctionsPalette(functionNames) {
            functionNames = functionNames || ['Conteo', 'Maximo', 'Minimo', 'Suma'];
            const items = functionNames.map(name => {
                const FuncClass = EF.Functions[name];
                const icon = FuncClass ? FuncClass.icon : 'fa-cog';
                return `<div class="palette-item palette-item-function" data-type="function" data-value="${name}"
                             draggable="true" ondragstart="dragStart(event)">
                            <i class="fas ${icon}"></i> ${name}
                        </div>`;
            }).join('');

            return `
                <div class="palette-section">
                    <div class="palette-title"><i class="fas fa-layer-group" style="color: #ec4899;"></i> Funciones Anidadas</div>
                    <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">Arrastra para anidar funciones</div>
                    <div class="palette-items">${items}</div>
                </div>`;
        }

        _escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        collectParams() {
            const params = [];
            const paramDefs = this.getParameters();

            paramDefs.forEach(paramDef => {
                const builderId = this.generateBuilderId(paramDef.id);
                const components = this.getMiniBuilderComponents(builderId);
                const expression = this.buildComponentsExpression(components);
                params.push(expression);
            });

            return params;
        }

        createMetadata(params) {
            return {
                functionName: this.constructor.functionName,
                functionId: this.constructor.functionId,
                params: params,
                fullExpression: this.buildExpression(params)
            };
        }
    }

    // ===== REGISTRO DEL MODULO =====
    EF.Core.FunctionBase = FunctionBase;

    // Compatibilidad global
    window.FunctionBase = FunctionBase;

    console.log('[EF] FunctionBase cargado');

    return FunctionBase;
})();
