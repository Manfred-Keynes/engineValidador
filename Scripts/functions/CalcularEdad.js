/**
 * CalcularEdad.js - Funcion Calcular Edad
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Functions.CalcularEdad
 *
 * Calcula la edad a partir de una fecha. Usa sistema de bloques drag & drop.
 * Ejemplo: #CalculaEdad([FechaNacimiento],>,18,YYYY)#
 */

const FunctionCalcularEdadModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // Inicializar estado de bloques
    EF.State.droppedBlocks = EF.State.droppedBlocks || [];

    // ===== CLASE DE FUNCION =====
    class FunctionCalcularEdad extends EF.Core.FunctionBase {
        // Metadata estatica
        static functionName = 'Calcular edad';
        static functionId = 'CalcularEdad';
        static icon = 'fa-birthday-cake';
        static description = 'Calcula la edad a partir de una fecha';
        static category = 'fecha';
        static usesBlocks = true;

        // Estado de valores personalizados
        static customValues = ['18', '21', '65'];

        constructor(varId, builderId) {
            super(varId, builderId);
        }

        /**
         * Define los parametros de la funcion
         */
        getParameters() {
            return [
                { id: 'fecha', label: 'Campo de Fecha', type: 'block', required: true },
                { id: 'operador', label: 'Operador', type: 'block', required: false },
                { id: 'valor', label: 'Valor a comparar', type: 'block', required: false },
                { id: 'formato', label: 'Formato', type: 'block', required: false, default: 'YYYY' }
            ];
        }

        /**
         * Genera el formulario HTML con layout de 2 columnas
         */
        generateForm() {
            // Reiniciar bloques al abrir
            EF.State.droppedBlocks = [];

            return `
            <div class="two-column-layout">
                <!-- COLUMNA IZQUIERDA: Paleta -->
                <div class="palette-column">
                    <div class="elements-palette">
                        ${this._generateFieldsPalette()}
                        ${this._generateOperatorsPalette()}
                        ${this._generateValuesPalette()}
                        ${this._generateFormatPalette()}
                        ${this._generateNestedFunctionsPalette()}
                    </div>
                </div>

                <!-- COLUMNA DERECHA: Zona de Drop -->
                <div class="drop-column">
                    <div>
                        <div class="block-builder-label">
                            <i class="fas fa-cubes"></i> Zona de Construccion
                        </div>
                        <div class="drop-zone" id="dropZone"
                             ondrop="FunctionCalcularEdad.dropBlock(event)"
                             ondragover="FunctionCalcularEdad.allowDrop(event)"
                             ondragleave="FunctionCalcularEdad.dragLeave(event)"
                             style="min-height: 120px;">
                            <div class="empty">
                                <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                                Arrastra bloques aqui para construir la funcion
                            </div>
                        </div>
                    </div>

                    <!-- Preview de la expresion -->
                    <div style="margin-top: 16px; padding: 12px; background: var(--gray-50);
                                border-radius: 8px; border: 1px solid var(--gray-200);">
                        <div style="font-size: 11px; color: var(--gray-500); margin-bottom: 4px;">
                            <i class="fas fa-code"></i> Vista previa
                        </div>
                        <div id="blockPreview" style="font-family: 'Courier New', monospace;
                                    font-size: 13px; color: var(--gray-700); word-break: break-all;">
                            #Calcular edad(...)#
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        /**
         * Genera paleta de campos
         */
        _generateFieldsPalette() {
            const fields = this.getAvailableFields();
            const items = fields.map(f => `
                <div class="palette-item" data-type="field" data-value="${f}"
                      draggable="true" ondragstart="dragStart(event)">
                    <i class="fas fa-database"></i> ${f}
                </div>
            `).join('');

            const fieldsHtml = items || '<div style="color: var(--gray-400); font-size: 11px; padding: 8px;">No hay campos disponibles</div>';

            return `
            <div class="palette-section">
                <div class="palette-title">
                    <i class="fas fa-database" style="color: #3b82f6;"></i>
                    Campos
                </div>
                <div class="palette-items" id="fieldsContainer">${fieldsHtml}</div>
            </div>
            `;
        }

        /**
         * Genera paleta de operadores
         */
        _generateOperatorsPalette() {
            const operators = ['>', '<', '>=', '<=', '=', '!='];
            const items = operators.map(op => `
                <div class="palette-item" data-type="operator" data-value="${op}"
                      draggable="true" ondragstart="dragStart(event)">${op}</div>
            `).join('');

            return `
            <div class="palette-section">
                <div class="palette-title">
                    <i class="fas fa-calculator" style="color: #8b5cf6;"></i>
                    Operadores
                </div>
                <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">
                    Opcional - para retornar true/false
                </div>
                <div class="palette-items">${items}</div>
            </div>
            `;
        }

        /**
         * Genera paleta de valores
         */
        _generateValuesPalette() {
            const items = FunctionCalcularEdad.customValues.map(v => `
                <div class="palette-item" data-type="value" data-value="${v}"
                      draggable="true" ondragstart="dragStart(event)"
                      onclick="FunctionCalcularEdad.editPaletteValue(this)">${v}</div>
            `).join('');

            return `
            <div class="palette-section">
                <div class="palette-title">
                    <i class="fas fa-sort-numeric-up" style="color: #10b981;"></i>
                    Valores
                </div>
                <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">
                    Click para editar
                </div>
                <div class="palette-items" id="valuesPalette">
                    ${items}
                    <button type="button" onclick="FunctionCalcularEdad.addCustomValue()"
                            style="padding: 6px 10px; background: var(--primary-light);
                                   border: 2px solid var(--primary); border-radius: 6px;
                                   color: var(--primary-dark); font-weight: 600;
                                   cursor: pointer; font-size: 11px;">
                        <i class="fas fa-plus"></i> +
                    </button>
                </div>
            </div>
            `;
        }

        /**
         * Genera paleta de formatos
         */
        _generateFormatPalette() {
            return `
            <div class="palette-section">
                <div class="palette-title">
                    <i class="fas fa-calendar" style="color: #f59e0b;"></i>
                    Formato
                </div>
                <div class="palette-items">
                    <div class="palette-item" data-type="format" data-value="YYYY"
                         draggable="true" ondragstart="dragStart(event)">YYYY</div>
                    <div class="palette-item" data-type="format" data-value="YY"
                         draggable="true" ondragstart="dragStart(event)">YY</div>
                </div>
            </div>
            `;
        }

        /**
         * Genera paleta de funciones anidadas
         */
        _generateNestedFunctionsPalette() {
            const nestedFunctions = ['Conteo', 'Maximo', 'Minimo', 'Suma', 'CuentaCaracteres', 'DifFechaHoy'];
            const items = nestedFunctions.map(name => {
                const FuncClass = EF.Core.Registry.get(name);
                const icon = FuncClass && FuncClass.icon ? FuncClass.icon : 'fa-cog';
                return `
                    <div class="palette-item palette-item-function" data-type="function" data-value="${name}"
                         draggable="true" ondragstart="dragStart(event)">
                        <i class="fas ${icon}"></i> ${name}
                    </div>
                `;
            }).join('');

            return `
            <div class="palette-section">
                <div class="palette-title">
                    <i class="fas fa-layer-group" style="color: #ec4899;"></i>
                    Funciones Anidadas
                </div>
                <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">
                    Arrastra para anidar funciones
                </div>
                <div class="palette-items">${items}</div>
            </div>
            `;
        }

        // ==========================================
        // METODOS ESTATICOS PARA DRAG & DROP
        // ==========================================

        /**
         * Permite drop en la zona
         */
        static allowDrop(event) {
            event.preventDefault();
            event.currentTarget.classList.add('drag-over');
        }

        /**
         * Quita estilo al salir del drag
         */
        static dragLeave(event) {
            event.currentTarget.classList.remove('drag-over');
        }

        /**
         * Maneja el drop de un bloque
         */
        static dropBlock(event) {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.classList.remove('drag-over');

            // Obtener tipo y valor del elemento arrastrado
            let type = event.dataTransfer.getData('type');
            let value = event.dataTransfer.getData('value');

            // Fallback a variables globales si dataTransfer no funciona
            if (!type || !value) {
                if (EF.State.draggedField) {
                    type = 'field';
                    value = EF.State.draggedField;
                    EF.State.draggedField = null;
                } else if (EF.State.draggedOperator) {
                    type = 'operator';
                    value = EF.State.draggedOperator;
                    EF.State.draggedOperator = null;
                } else if (EF.State.draggedValue) {
                    type = 'value';
                    value = EF.State.draggedValue;
                    EF.State.draggedValue = null;
                } else if (EF.State.draggedFunctionName) {
                    type = 'function';
                    value = EF.State.draggedFunctionName;
                    EF.State.draggedFunctionName = null;
                }
            }

            if (!type || !value) {
                console.warn('CalcularEdad: No se detecto tipo o valor en el drop');
                return;
            }

            // Crear bloque
            const block = {
                id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                type: type,
                value: value,
                order: EF.State.droppedBlocks.length
            };

            // Si es funcion, marcar como no configurada
            if (type === 'function') {
                block.configured = false;
                block.nestedBlocks = [];
            }

            EF.State.droppedBlocks.push(block);
            console.log('CalcularEdad: Bloque agregado', block);

            FunctionCalcularEdad.renderBlocks();
            FunctionCalcularEdad.updatePreview();
        }

        /**
         * Renderiza los bloques en la zona de drop
         */
        static renderBlocks() {
            const dropZone = document.getElementById('dropZone');
            if (!dropZone) return;

            const blocks = EF.State.droppedBlocks;

            if (blocks.length === 0) {
                dropZone.innerHTML = `
                    <div class="empty">
                        <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                        Arrastra bloques aqui para construir la funcion
                    </div>
                `;
                return;
            }

            const typeLabels = {
                field: 'Campo',
                operator: 'Operador',
                value: 'Valor',
                format: 'Formato',
                function: 'Funcion'
            };

            const typeIcons = {
                field: 'fa-database',
                operator: 'fa-calculator',
                value: 'fa-hashtag',
                format: 'fa-calendar',
                function: 'fa-magic'
            };

            const typeColors = {
                field: '#3b82f6',
                operator: '#8b5cf6',
                value: '#10b981',
                format: '#f59e0b',
                function: '#ec4899'
            };

            let html = '';
            blocks.sort((a, b) => a.order - b.order).forEach((block, index) => {
                html += `
                    <div class="param-block" data-block-id="${block.id}"
                         style="display: flex; align-items: center; gap: 10px; padding: 10px;
                                background: white; border-radius: 8px; margin-bottom: 8px;
                                border: 2px solid ${typeColors[block.type] || '#ccc'};">
                        <div class="param-block-number"
                             style="width: 24px; height: 24px; background: ${typeColors[block.type]};
                                    color: white; border-radius: 50%; display: flex;
                                    align-items: center; justify-content: center;
                                    font-size: 12px; font-weight: bold;">
                            ${index + 1}
                        </div>
                        <div class="param-block-content" style="flex: 1;">
                            <div class="param-block-label" style="font-size: 10px; color: var(--gray-500);">
                                <i class="fas ${typeIcons[block.type]}"></i> ${typeLabels[block.type]}
                            </div>
                            <div class="param-block-value" style="font-weight: 600; color: var(--gray-800);">
                                ${block.type === 'field' ? `[${block.value}]` : block.value}
                            </div>
                        </div>
                        <div class="param-block-actions">
                            <button type="button" onclick="FunctionCalcularEdad.deleteBlock('${block.id}')"
                                    style="background: #fee2e2; border: none; border-radius: 4px;
                                           padding: 6px 8px; cursor: pointer; color: #dc2626;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            dropZone.innerHTML = html;
        }

        /**
         * Elimina un bloque
         */
        static deleteBlock(blockId) {
            EF.State.droppedBlocks = EF.State.droppedBlocks.filter(b => b.id !== blockId);
            // Reordenar
            EF.State.droppedBlocks.forEach((b, i) => {
                b.order = i;
            });
            FunctionCalcularEdad.renderBlocks();
            FunctionCalcularEdad.updatePreview();
        }

        /**
         * Agrega un valor personalizado
         */
        static addCustomValue() {
            const value = prompt('Ingresa un valor numerico:');
            if (value && !isNaN(value)) {
                FunctionCalcularEdad.customValues.push(value);

                const palette = document.getElementById('valuesPalette');
                if (palette) {
                    const btn = palette.querySelector('button');
                    const newItem = document.createElement('div');
                    newItem.className = 'palette-item';
                    newItem.setAttribute('data-type', 'value');
                    newItem.setAttribute('data-value', value);
                    newItem.setAttribute('draggable', 'true');
                    newItem.setAttribute('ondragstart', 'dragStart(event)');
                    newItem.setAttribute('onclick', 'FunctionCalcularEdad.editPaletteValue(this)');
                    newItem.textContent = value;
                    palette.insertBefore(newItem, btn);
                }
            }
        }

        /**
         * Edita un valor de la paleta
         */
        static editPaletteValue(element) {
            const currentValue = element.getAttribute('data-value');
            const newValue = prompt('Editar valor:', currentValue);
            if (newValue && !isNaN(newValue)) {
                element.setAttribute('data-value', newValue);
                element.textContent = newValue;
            }
        }

        /**
         * Actualiza la vista previa
         */
        static updatePreview() {
            const previewEl = document.getElementById('blockPreview');
            if (previewEl) {
                previewEl.textContent = FunctionCalcularEdad.buildPreviewStatic();
            }
        }

        /**
         * Construye vista previa estatica
         */
        static buildPreviewStatic() {
            const blocks = EF.State.droppedBlocks;
            if (blocks.length === 0) return '#Calcular edad(...)#';

            let preview = '#Calcular edad(';
            blocks.forEach((block, i) => {
                if (i > 0) preview += ',';
                preview += block.type === 'field' ? `[${block.value}]` : block.value;
            });
            return preview + ')#';
        }

        // ==========================================
        // METODOS DE INSTANCIA
        // ==========================================

        /**
         * Construye la expresion final
         * Formato: #CalculaEdad([campo],operador,valor,formato)#
         */
        buildExpression(params) {
            const blocks = EF.State.droppedBlocks;

            const fieldBlock = blocks.find(b => b.type === 'field');
            const operatorBlock = blocks.find(b => b.type === 'operator');
            const valueBlock = blocks.find(b => b.type === 'value');
            const formatBlock = blocks.find(b => b.type === 'format');

            const field = fieldBlock ? fieldBlock.value : '';
            const operator = operatorBlock ? operatorBlock.value : '';
            const value = valueBlock ? valueBlock.value : '';
            const format = formatBlock ? formatBlock.value : 'YYYY';

            return `#CalculaEdad([${field}],${operator},${value},${format})#`;
        }

        /**
         * Vista previa
         */
        buildPreview(params) {
            return FunctionCalcularEdad.buildPreviewStatic();
        }

        /**
         * Valida los parametros
         */
        validate(params) {
            const blocks = EF.State.droppedBlocks;
            const errors = [];

            const hasField = blocks.some(b => b.type === 'field');
            if (!hasField) {
                errors.push('Debe especificar al menos un campo de fecha');
            }

            return {
                valid: errors.length === 0,
                errors: errors
            };
        }

        /**
         * Parsea una expresion guardada
         */
        parseExpression(expression) {
            // Formato: #CalculaEdad([campo],operador,valor,formato)#
            const match = expression.match(/#CalculaEdad\(\[([^\]]*)\],([^,]*),([^,]*),([^)]*)\)#/);
            if (!match) return null;

            return {
                fecha: match[1] || '',
                operador: match[2] || '',
                valor: match[3] || '',
                formato: match[4] || 'YYYY'
            };
        }

        /**
         * Hook al cerrar - limpia bloques
         */
        onClose() {
            EF.State.droppedBlocks = [];
        }
    }

    // Registrar en FunctionRegistry
    EF.Core.Registry.register(FunctionCalcularEdad);

    // Registrar en namespace
    EF.Functions.CalcularEdad = FunctionCalcularEdad;

    // Compatibilidad global
    window.FunctionCalcularEdad = FunctionCalcularEdad;

    console.log('[EF] FunctionCalcularEdad cargado');

    return FunctionCalcularEdad;
})();
