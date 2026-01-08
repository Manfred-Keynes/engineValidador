/**
 * VariableCardManager.js - Gestion de tarjetas de variables
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.VariableCard
 */

const VariableCardModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== INICIALIZAR ESTADO =====
    EF.State.variablesCounter = 0;
    EF.State.currentExpandedCard = null;

    // ===== FUNCIONES PUBLICAS =====

    const agregarVariable = () => {
        EF.State.variablesCounter++;

        const container = document.getElementById('variablesContainer');
        const varId = EF.State.variablesCounter;

        const card = document.createElement('div');
        card.className = 'variable-card';
        card.id = `varCard${varId}`;
        card.innerHTML = `
            <div class="variable-card-header" onclick="toggleCard(${varId})"
                 draggable="true"
                 ondragstart="dragVariable(event, ${varId})"
                 ondragend="dragEnd(event)">
                <div class="variable-card-content">
                    <div class="variable-number">${varId}</div>
                    <div class="variable-info">
                        <div class="variable-name-preview" id="varName${varId}">Variable ${varId}</div>
                        <div class="variable-expression-preview" id="varExpr${varId}">Sin expresion configurada</div>
                    </div>
                </div>
                <div class="variable-card-actions" onclick="event.stopPropagation();">
                    <button type="button" class="variable-btn expand" onclick="toggleCard(${varId})">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button type="button" class="variable-btn delete" onclick="eliminarVariable(${varId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="variable-card-body">
                <div class="variable-field">
                    <div class="variable-field-label">Nombre de la Variable</div>
                    <input type="text" class="variable-field-input" placeholder="Ej: EDAD"
                           onkeyup="updatePreview(${varId}, 'name', this.value)"
                           onfocus="EF.State.activeInput = this"
                           style="font-family: inherit;">
                </div>

                <div class="variable-fields-grid">
                    <div class="variable-field">
                        <div class="variable-field-label">Funcion</div>
                        <select class="variable-field-input" style="font-family: inherit;">
                            <option value="expresion">Expresion</option>
                            <option value="valor">Valor Fijo</option>
                        </select>
                    </div>
                    <div class="variable-field">
                        <div class="variable-field-label">Origen</div>
                        <select class="variable-field-input" style="font-family: inherit;">
                            <option value="producto">Campos del Producto</option>
                            <option value="cliente">Campos del Cliente</option>
                        </select>
                    </div>
                </div>

                <div class="variable-field">
                    <div class="variable-field-label">Expresion</div>
                    <div class="expression-builder" id="exprBuilder${varId}"
                         ondrop="dropItem(event, ${varId})"
                         ondragover="allowItemDrop(event, ${varId})"
                         ondragleave="dragItemLeave(event)">
                        <div class="empty">
                            <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                            Arrastra funciones u operadores o usa los componentes
                        </div>
                    </div>

                    <div class="config-panel" id="configPanel${varId}">
                        <div class="config-panel-content">
                            <div class="config-panel-header">
                                <div class="config-panel-header-left">
                                    <i class="fas fa-cog"></i>
                                    <span class="config-panel-title" id="configPanelTitle${varId}">Configurar Funcion</span>
                                </div>
                                <button class="config-panel-close" onclick="closeConfigPanel(${varId})" title="Cerrar" type="button">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>

                            <div class="config-panel-breadcrumb" id="configBreadcrumb${varId}" style="display: none;"></div>

                            <div class="config-panel-body" id="configPanelBody${varId}"></div>

                            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; padding: 20px; margin: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid #334155;" id="globalPreview${varId}Container">
                                <div style="font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 1px;">
                                    <i class="fas fa-eye" style="color: #10b981; font-size: 16px;"></i>
                                    VISTA PREVIA COMPLETA
                                </div>
                                <div id="globalPreview${varId}" style="font-family: 'Courier New', Consolas, Monaco, monospace; font-size: 14px; color: #10b981; word-break: break-all; line-height: 1.8; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; border-left: 4px solid #10b981; min-height: 40px;">
                                    <span style="color: #64748b; font-style: italic;">Esperando parametros...</span>
                                </div>
                            </div>

                            <div class="config-panel-footer">
                                <button class="btn btn-secondary" onclick="closeConfigPanel(${varId})" type="button">
                                    <i class="fas fa-times"></i>
                                    Cancelar
                                </button>
                                <button class="btn btn-primary" onclick="acceptFunctionConfig(${varId})" type="button">
                                    <i class="fas fa-check"></i>
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="variable-field">
                    <div class="variable-field-label">Expresion Condicional</div>
                    <textarea class="variable-field-input" rows="2" placeholder="Condicion opcional"
                              onfocus="EF.State.activeInput = this"></textarea>
                </div>

                <div class="variable-fields-grid">
                    <div class="variable-field">
                        <div class="variable-field-label">Expresion WHERE</div>
                        <input type="text" class="variable-field-input" placeholder="Opcional"
                               onfocus="EF.State.activeInput = this">
                    </div>
                    <div class="variable-field">
                        <div class="variable-field-label">Mensaje WHERE</div>
                        <input type="text" class="variable-field-input" placeholder="Opcional"
                               onfocus="EF.State.activeInput = this">
                    </div>
                </div>

                <div class="variable-fields-grid">
                    <div class="variable-field">
                        <div class="variable-field-label">Tipo Respuesta</div>
                        <select class="variable-field-input" style="font-family: inherit;">
                            <option value="numerico">Numerico</option>
                            <option value="texto">Texto</option>
                            <option value="booleano">Booleano</option>
                        </select>
                    </div>
                    <div class="variable-field">
                        <div class="variable-field-label">Buro</div>
                        <select class="variable-field-input" style="font-family: inherit;">
                            <option value="">Ninguno</option>
                            <option value="producto">Campos del producto</option>
                        </select>
                    </div>
                </div>

                <div class="variable-fields-grid">
                    <div class="variable-field">
                        <div class="variable-field-label">Bloque</div>
                        <select class="variable-field-input" style="font-family: inherit;">
                            <option value="">Seleccione...</option>
                            <option value="bloque1">Bloque 1</option>
                        </select>
                    </div>
                    <div class="variable-field">
                        <div class="variable-field-label">Accion</div>
                        <select class="variable-field-input" style="font-family: inherit;">
                            <option value="END">END</option>
                            <option value="STOP">STOP</option>
                        </select>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
        updateVariablesCount();

        if (typeof initExpressionComponents === 'function') {
            initExpressionComponents(varId);
        }

        setTimeout(() => {
            toggleCard(varId);
        }, 100);
    };

    const toggleCard = (id) => {
        const card = document.getElementById(`varCard${id}`);
        const functionsSidebar = document.querySelector('.functions-sidebar');
        const operatorsSidebar = document.querySelector('.resources-sidebar');

        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
            EF.State.currentExpandedCard = null;

            if (functionsSidebar) {
                functionsSidebar.style.display = 'none';
            }

            if (operatorsSidebar) {
                operatorsSidebar.classList.remove('shift-left');
            }
            return;
        }

        if (EF.State.currentExpandedCard) {
            const prevCard = document.getElementById(`varCard${EF.State.currentExpandedCard}`);
            if (prevCard) {
                prevCard.classList.remove('expanded');
            }
        }

        card.classList.add('expanded');
        EF.State.currentExpandedCard = id;

        if (operatorsSidebar) {
            operatorsSidebar.classList.add('shift-left');
        }

        if (functionsSidebar) {
            functionsSidebar.style.display = 'flex';
        }

        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    };

    const eliminarVariable = (id) => {
        const card = document.getElementById(`varCard${id}`);
        if (!card) return;

        const nameInput = card.querySelector('input[placeholder="Nombre de la variable"]');
        const varName = nameInput ? nameInput.value.trim() : '';
        const displayName = varName || `Variable ${id}`;

        if (typeof initExpressionComponents === 'function') {
            initExpressionComponents(id);
        }
        const components = EF.State.expressionComponents[id] || [];
        const componentCount = components.length;

        let mensaje = 'Estas seguro de eliminar esta variable?\n\n';
        mensaje += `Variable: ${displayName}\n`;

        if (componentCount > 0) {
            mensaje += `Componentes: ${componentCount} elemento(s) configurado(s)\n`;

            const componentTypes = {
                'function': 'Funcion',
                'field': 'Campo',
                'operator': 'Operador',
                'value': 'Valor',
                'parenthesis': 'Parentesis'
            };

            const summary = components.slice(0, 3).map(c => {
                const typeLabel = componentTypes[c.type] || c.type;
                const shortValue = c.value.length > 20 ? `${c.value.substring(0, 17)}...` : c.value;
                return `   - ${typeLabel}: ${shortValue}`;
            }).join('\n');

            mensaje += `\nContenido:\n${summary}`;
            if (componentCount > 3) {
                mensaje += `\n   ... y ${componentCount - 3} mas`;
            }
        } else {
            mensaje += 'Sin componentes configurados\n';
        }

        mensaje += '\n\nEsta accion no se puede deshacer.';

        if (confirm(mensaje)) {
            card.remove();

            if (EF.State.currentExpandedCard === id) {
                EF.State.currentExpandedCard = null;

                const functionsSidebar = document.querySelector('.functions-sidebar');
                if (functionsSidebar) {
                    functionsSidebar.style.display = 'none';
                }

                const operatorsSidebar = document.querySelector('.resources-sidebar');
                if (operatorsSidebar) {
                    operatorsSidebar.classList.remove('shift-left');
                }
            }

            delete EF.State.expressionComponents[id];

            updateVariablesCount();
        }
    };

    const updatePreview = (id, type, value) => {
        if (type === 'name') {
            const nameEl = document.getElementById(`varName${id}`);
            nameEl.textContent = value || `Variable ${id}`;
        } else if (type === 'expr') {
            const exprEl = document.getElementById(`varExpr${id}`);
            exprEl.textContent = value || 'Sin expresion configurada';
        }
    };

    const updateVariablesCount = () => {
        const count = document.querySelectorAll('.variable-card').length;
        const countEl = document.getElementById('variablesCount');
        if (countEl) {
            countEl.textContent = `${count} variable${count !== 1 ? 's' : ''}`;
        }
    };

    const insertarCampo = (campo) => {
        if (EF.State.activeInput) {
            const start = EF.State.activeInput.selectionStart;
            const end = EF.State.activeInput.selectionEnd;
            const text = EF.State.activeInput.value;

            EF.State.activeInput.value = `${text.substring(0, start)}[${campo}]${text.substring(end)}`;
            EF.State.activeInput.focus();
            EF.State.activeInput.selectionStart = EF.State.activeInput.selectionEnd = start + campo.length + 2;

            const card = EF.State.activeInput.closest('.variable-card');
            if (card) {
                const cardId = card.id.replace('varCard', '');
                updatePreview(cardId, 'expr', EF.State.activeInput.value);
            }
        } else {
            alert('Por favor, haga clic en un campo de texto antes de insertar un campo.');
        }
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        agregarVariable,
        toggleCard,
        eliminarVariable,
        updatePreview,
        updateVariablesCount,
        insertarCampo
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.VariableCard = publicAPI;

    // Legacy compatibility
    window.variablesCounter = EF.State.variablesCounter;
    window.currentExpandedCard = EF.State.currentExpandedCard;

    console.log('[EF] VariableCard cargado');

    return publicAPI;
})();
