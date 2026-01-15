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

    // ===== DATOS DEMO PARA PROTOTIPO =====
    const datosDemo = {
        buros: [
            { valor: 'circulo', texto: 'Circulo de Credito' },
            { valor: 'buro', texto: 'Buro de Credito' },
            { valor: 'lexis', texto: 'LexisNexis' },
            { valor: 'transunion', texto: 'TransUnion' },
            { valor: 'equifax', texto: 'Equifax' },
            { valor: 'experian', texto: 'Experian' }
        ],
        segmentos: {
            'circulo': [
                { valor: 'PM', texto: 'Persona Moral' },
                { valor: 'PF', texto: 'Persona Fisica' },
                { valor: 'HW', texto: 'HawkScores' },
                { valor: 'MC', texto: 'Mejores Coincidencias' }
            ],
            'buro': [
                { valor: 'CR', texto: 'Creditos' },
                { valor: 'EM', texto: 'Empleos' },
                { valor: 'DC', texto: 'Domicilios' },
                { valor: 'SC', texto: 'Scores' }
            ],
            'lexis': [
                { valor: 'ID', texto: 'Identidad' },
                { valor: 'FR', texto: 'Fraude' },
                { valor: 'RP', texto: 'Riesgo Publico' }
            ],
            'transunion': [
                { valor: 'CL', texto: 'Cuentas Clausura' },
                { valor: 'HA', texto: 'Historial Activo' },
                { valor: 'AL', texto: 'Alertas' }
            ],
            'equifax': [
                { valor: 'GN', texto: 'General' },
                { valor: 'DT', texto: 'Detalle' },
                { valor: 'RS', texto: 'Resumen' }
            ],
            'experian': [
                { valor: 'PF', texto: 'Perfil' },
                { valor: 'SC', texto: 'Score' },
                { valor: 'HT', texto: 'Historial' }
            ]
        },
        campos: {
            'PM': [
                { campo: 'RFC', descripcion: 'Registro Federal de Contribuyentes' },
                { campo: 'RazonSocial', descripcion: 'Nombre de la empresa' },
                { campo: 'FechaConstitucion', descripcion: 'Fecha de constitucion legal' },
                { campo: 'Sector', descripcion: 'Sector economico' }
            ],
            'PF': [
                { campo: 'CURP', descripcion: 'Clave Unica de Registro' },
                { campo: 'Nombre', descripcion: 'Nombre completo' },
                { campo: 'FechaNacimiento', descripcion: 'Fecha de nacimiento' },
                { campo: 'RFC_PF', descripcion: 'RFC Persona Fisica' }
            ],
            'HW': [
                { campo: 'HawkScore', descripcion: 'Puntaje Hawk' },
                { campo: 'RiesgoFraude', descripcion: 'Nivel de riesgo de fraude' },
                { campo: 'AlertasActivas', descripcion: 'Numero de alertas' }
            ],
            'MC': [
                { campo: 'PorcentajeMatch', descripcion: 'Porcentaje de coincidencia' },
                { campo: 'NumRegistros', descripcion: 'Registros encontrados' },
                { campo: 'FuentePrincipal', descripcion: 'Fuente de datos principal' }
            ],
            'default': [
                { campo: 'CampoGeneral1', descripcion: 'Campo de ejemplo 1' },
                { campo: 'CampoGeneral2', descripcion: 'Campo de ejemplo 2' },
                { campo: 'CampoGeneral3', descripcion: 'Campo de ejemplo 3' }
            ]
        },
        camposProducto: [
            { campo: 'MontoSolicitado', descripcion: 'Monto del credito solicitado' },
            { campo: 'Plazo', descripcion: 'Plazo en meses' },
            { campo: 'TasaInteres', descripcion: 'Tasa de interes anual' },
            { campo: 'TipoProducto', descripcion: 'Tipo de producto financiero' },
            { campo: 'FechaSolicitud', descripcion: 'Fecha de la solicitud' },
            { campo: 'Sucursal', descripcion: 'Sucursal de origen' },
            { campo: 'Canal', descripcion: 'Canal de captacion' }
        ]
    };

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
                <!-- 1. Nombre de la Variable -->
                <div class="variable-field">
                    <div class="variable-field-label">NOMBRE DE LA VARIABLE</div>
                    <input type="text" class="variable-field-input" placeholder="Ej: EDAD"
                           onkeyup="updatePreview(${varId}, 'name', this.value)"
                           onfocus="EF.State.activeInput = this"
                           style="font-family: inherit;">
                </div>

                <!-- 2. Origen de Datos (Selector segmentado) -->
                <div class="variable-type-selector">
                    <div class="variable-field-label">
                        <i class="fas fa-database" style="margin-right: 6px; color: var(--primary);"></i>
                        ORIGEN DE DATOS
                    </div>
                    <div class="type-segmented-control" id="typeCards${varId}">
                        <input type="radio" name="varType${varId}" id="varType${varId}_producto" value="producto" checked>
                        <input type="radio" name="varType${varId}" id="varType${varId}_buros" value="buros">
                        <input type="radio" name="varType${varId}" id="varType${varId}_variables" value="variables">
                        <div class="type-segment-slider"></div>
                        <label for="varType${varId}_producto" class="type-segment" data-type="producto" onclick="cambiarOrigenDatos(${varId}, 'producto')">
                            Campos del producto
                        </label>
                        <label for="varType${varId}_buros" class="type-segment" data-type="buros" onclick="cambiarOrigenDatos(${varId}, 'buros')">
                            Campos de buros
                        </label>
                        <label for="varType${varId}_variables" class="type-segment" data-type="variables" onclick="cambiarOrigenDatos(${varId}, 'variables')">
                            Variables existentes
                        </label>
                    </div>

                    <!-- Timeline selector de Buro (separado, solo visible cuando buros esta activo) -->
                    <div class="buro-selector-wrapper" id="buroSelectorWrapper${varId}" style="display: none;">
                        <div class="buro-selector-container">
                            <!-- Timeline a la izquierda -->
                            <div class="buro-vertical-tabs">
                                <button type="button" class="buro-vtab active" data-tab="buros" onclick="cambiarTabBuro(${varId}, 'buros')">
                                    <div class="buro-vtab-icon">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="buro-vtab-card">
                                        <div class="buro-vtab-info">
                                            <div class="buro-vtab-label">Seleccionar Buro</div>
                                            <div class="buro-vtab-badge" id="buroBadge${varId}"></div>
                                            <div class="buro-vtab-status">Pendiente</div>
                                        </div>
                                    </div>
                                </button>
                                <button type="button" class="buro-vtab" data-tab="segmentos" onclick="cambiarTabBuro(${varId}, 'segmentos')">
                                    <div class="buro-vtab-icon">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="buro-vtab-card">
                                        <div class="buro-vtab-info">
                                            <div class="buro-vtab-label">Seleccionar Segmento</div>
                                            <div class="buro-vtab-badge" id="segmentoBadge${varId}"></div>
                                            <div class="buro-vtab-status">Pendiente</div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <!-- Area de contenido -->
                            <div class="buro-tabs-content">
                                <!-- Tab: Seleccion de Buros -->
                                <div class="buro-tab-panel active" data-tab="buros" id="tabBuros${varId}">
                                    <div class="buro-cards-carousel" id="burosCarousel${varId}">
                                        <div class="buro-cards-empty">
                                            <i class="fas fa-spinner fa-spin"></i> Cargando buros...
                                        </div>
                                    </div>
                                </div>
                                <!-- Tab: Seleccion de Segmentos -->
                                <div class="buro-tab-panel" data-tab="segmentos" id="tabSegmentos${varId}">
                                    <div class="buro-cards-carousel" id="segmentosCarousel${varId}">
                                        <div class="buro-cards-empty">
                                            <i class="fas fa-hand-pointer"></i> Selecciona un buro primero
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Inputs ocultos para mantener los valores seleccionados -->
                        <input type="hidden" id="selectBuro${varId}" value="">
                        <input type="hidden" id="selectSegmento${varId}" value="">
                    </div>

                    <!-- Contenedor de campos dinamico -->
                    <div class="origen-campos-container" id="origenCampos${varId}">
                        <!-- Panel: Campos del Producto (visible por defecto) -->
                        <div class="origen-panel active" id="panelProducto${varId}" data-panel="producto">
                            <div class="origen-campos-list" id="camposProducto${varId}">
                                <div class="origen-campos-loading">
                                    <i class="fas fa-spinner fa-spin"></i> Cargando campos...
                                </div>
                            </div>
                        </div>

                        <!-- Panel: Campos de Buros (solo la lista de campos) -->
                        <div class="origen-panel" id="panelBuros${varId}" data-panel="buros">
                            <div class="origen-campos-list" id="camposBuros${varId}">
                                <div class="origen-campos-empty">
                                    <i class="fas fa-hand-pointer"></i>
                                    Selecciona un buro y segmento para ver los campos disponibles
                                </div>
                            </div>
                        </div>

                        <!-- Panel: Variables Existentes -->
                        <div class="origen-panel" id="panelVariables${varId}" data-panel="variables">
                            <div class="origen-campos-list" id="camposVariables${varId}">
                                <div class="origen-campos-loading">
                                    <i class="fas fa-spinner fa-spin"></i> Cargando variables...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. Expresion -->
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

        // Cargar campos del producto por defecto al expandir
        setTimeout(() => {
            cargarCamposProductoVariable(id);
        }, 100);

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

    /**
     * Cambiar origen de datos (Producto, Buros, Variables)
     */
    const cambiarOrigenDatos = (varId, origen) => {
        // Marcar el radio button correspondiente
        const radioInput = document.getElementById(`varType${varId}_${origen}`);
        if (radioInput) {
            radioInput.checked = true;
        }

        // Guardar el origen seleccionado en la variable
        const varCard = document.getElementById(`varCard${varId}`);
        if (varCard) {
            varCard.dataset.origenDatos = origen;
        }

        // Mostrar/ocultar el timeline de buros
        const buroWrapper = document.getElementById(`buroSelectorWrapper${varId}`);
        if (buroWrapper) {
            buroWrapper.style.display = origen === 'buros' ? 'block' : 'none';
        }

        // Cambiar panel visible
        const container = document.getElementById(`origenCampos${varId}`);
        if (container) {
            container.querySelectorAll('.origen-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            const targetPanel = document.getElementById(`panel${origen.charAt(0).toUpperCase() + origen.slice(1)}${varId}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        }

        // Cargar datos segun el origen
        switch (origen) {
            case 'producto':
                cargarCamposProductoVariable(varId);
                break;
            case 'buros':
                cargarBurosDisponiblesVariable(varId);
                break;
            case 'variables':
                cargarVariablesExistentes(varId);
                break;
        }

        console.log(`[EF] Variable ${varId} - Origen de datos: ${origen}`);
    };

    /**
     * Cargar campos del producto (datos demo)
     */
    const cargarCamposProductoVariable = (varId) => {
        const container = document.getElementById(`camposProducto${varId}`);
        if (!container) return;

        // Simular delay de carga
        setTimeout(() => {
            renderizarCamposEnPanel(container, datosDemo.camposProducto, 'campo');
        }, 300);
    };

    /**
     * Cargar buros disponibles como cards (datos demo)
     */
    const cargarBurosDisponiblesVariable = (varId) => {
        const carousel = document.getElementById(`burosCarousel${varId}`);
        if (!carousel) return;

        const buros = datosDemo.buros;

        // Iconos para diferentes tipos de buro
        const iconosBuro = {
            'circulo': 'fa-circle',
            'buro': 'fa-building',
            'lexis': 'fa-search',
            'transunion': 'fa-university',
            'equifax': 'fa-chart-bar',
            'experian': 'fa-globe',
            'default': 'fa-database'
        };

        // Renderizar cards
        carousel.innerHTML = buros.map(buro => {
            const iconKey = Object.keys(iconosBuro).find(k => buro.valor.toLowerCase().includes(k)) || 'default';
            const icono = iconosBuro[iconKey];
            return `
                <div class="buro-card" data-valor="${buro.valor}" onclick="seleccionarBuroCard(${varId}, '${buro.valor}', '${buro.texto}')">
                    <div class="buro-card-icon">
                        <i class="fas ${icono}"></i>
                    </div>
                    <div class="buro-card-nombre">${buro.texto}</div>
                    <div class="buro-card-radio">
                        <span class="buro-radio-circle"></span>
                    </div>
                </div>
            `;
        }).join('');

        // Limpiar input hidden y resetear campos
        const selectBuro = document.getElementById(`selectBuro${varId}`);
        if (selectBuro) selectBuro.value = '';

        const camposBuros = document.getElementById(`camposBuros${varId}`);
        if (camposBuros) {
            camposBuros.innerHTML = '<div class="origen-campos-empty"><i class="fas fa-hand-pointer"></i>Selecciona un buro y segmento para ver los campos disponibles</div>';
        }
    };

    /**
     * Cambiar entre tabs de Buro y Segmento
     */
    const cambiarTabBuro = (varId, tab) => {
        const container = document.getElementById(`buroSelectorWrapper${varId}`);
        if (!container) return;

        // Actualizar tabs activos
        container.querySelectorAll('.buro-vtab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Mostrar panel correspondiente
        container.querySelectorAll('.buro-tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.dataset.tab === tab);
        });
    };

    /**
     * Seleccionar un buro card
     */
    const seleccionarBuroCard = (varId, valor, texto) => {
        const carousel = document.getElementById(`burosCarousel${varId}`);
        const selectBuro = document.getElementById(`selectBuro${varId}`);
        const buroBadge = document.getElementById(`buroBadge${varId}`);
        const segmentosCarousel = document.getElementById(`segmentosCarousel${varId}`);
        const camposBuros = document.getElementById(`camposBuros${varId}`);
        const container = document.getElementById(`buroSelectorWrapper${varId}`);

        // Marcar card como seleccionada
        carousel.querySelectorAll('.buro-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.valor === valor);
        });

        // Guardar valor en input hidden
        if (selectBuro) selectBuro.value = valor;

        // Actualizar badge del tab
        if (buroBadge) buroBadge.textContent = texto;

        // Actualizar estado del tab buro a completado
        if (container) {
            const buroTab = container.querySelector('.buro-vtab[data-tab="buros"]');
            const segmentoTab = container.querySelector('.buro-vtab[data-tab="segmentos"]');
            if (buroTab) {
                buroTab.classList.add('completed');
                const statusEl = buroTab.querySelector('.buro-vtab-status');
                if (statusEl) statusEl.textContent = 'Completado';
            }
            // Resetear estado del segmento
            if (segmentoTab) {
                segmentoTab.classList.remove('completed');
                const statusEl = segmentoTab.querySelector('.buro-vtab-status');
                if (statusEl) statusEl.textContent = 'Pendiente';
            }
        }

        // Mostrar loading en segmentos
        if (segmentosCarousel) {
            segmentosCarousel.innerHTML = '<div class="buro-cards-empty"><i class="fas fa-spinner fa-spin"></i> Cargando segmentos...</div>';
        }

        // Resetear campos
        if (camposBuros) {
            camposBuros.innerHTML = '<div class="origen-campos-empty"><i class="fas fa-hand-pointer"></i>Selecciona un segmento para ver los campos</div>';
        }

        // Limpiar segmento seleccionado
        const selectSegmento = document.getElementById(`selectSegmento${varId}`);
        if (selectSegmento) selectSegmento.value = '';

        const segmentoBadge = document.getElementById(`segmentoBadge${varId}`);
        if (segmentoBadge) segmentoBadge.textContent = '';

        // Cargar segmentos del buro (datos demo)
        setTimeout(() => {
            const bloques = datosDemo.segmentos[valor] || datosDemo.segmentos['circulo'];
            renderizarSegmentosCards(varId, bloques);

            // Cambiar automaticamente al tab de segmentos
            cambiarTabBuro(varId, 'segmentos');
        }, 500);
    };

    /**
     * Renderizar segmentos como cards
     */
    const renderizarSegmentosCards = (varId, bloques) => {
        const carousel = document.getElementById(`segmentosCarousel${varId}`);
        if (!carousel) return;

        if (!bloques || bloques.length === 0) {
            carousel.innerHTML = '<div class="buro-cards-empty"><i class="fas fa-inbox"></i> No hay segmentos disponibles</div>';
            return;
        }

        // Iconos para segmentos
        const iconosSegmento = ['fa-layer-group', 'fa-cube', 'fa-shapes', 'fa-puzzle-piece', 'fa-boxes'];

        carousel.innerHTML = bloques.map((bloque, index) => {
            const icono = iconosSegmento[index % iconosSegmento.length];
            return `
                <div class="buro-card" data-valor="${bloque.valor}" onclick="seleccionarSegmentoCard(${varId}, '${bloque.valor}', '${bloque.texto}')">
                    <div class="buro-card-icon">
                        <i class="fas ${icono}"></i>
                    </div>
                    <div class="buro-card-nombre">${bloque.texto}</div>
                    <div class="buro-card-radio">
                        <span class="buro-radio-circle"></span>
                    </div>
                </div>
            `;
        }).join('');
    };

    /**
     * Seleccionar un segmento card
     */
    const seleccionarSegmentoCard = (varId, valor, texto) => {
        const carousel = document.getElementById(`segmentosCarousel${varId}`);
        const selectSegmento = document.getElementById(`selectSegmento${varId}`);
        const segmentoBadge = document.getElementById(`segmentoBadge${varId}`);
        const container = document.getElementById(`buroSelectorWrapper${varId}`);
        const camposBuros = document.getElementById(`camposBuros${varId}`);

        // Marcar card como seleccionada
        carousel.querySelectorAll('.buro-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.valor === valor);
        });

        // Guardar valor en input hidden
        if (selectSegmento) selectSegmento.value = valor;

        // Actualizar badge del tab
        if (segmentoBadge) segmentoBadge.textContent = texto;

        // Actualizar estado del tab segmento a completado
        if (container) {
            const segmentoTab = container.querySelector('.buro-vtab[data-tab="segmentos"]');
            if (segmentoTab) {
                segmentoTab.classList.add('completed');
                const statusEl = segmentoTab.querySelector('.buro-vtab-status');
                if (statusEl) statusEl.textContent = 'Completado';
            }
        }

        // Cargar campos del segmento (datos demo)
        if (camposBuros) {
            camposBuros.innerHTML = '<div class="origen-campos-loading"><i class="fas fa-spinner fa-spin"></i> Cargando campos...</div>';
        }

        setTimeout(() => {
            const campos = datosDemo.campos[valor] || datosDemo.campos['default'];
            renderizarCamposEnPanel(camposBuros, campos, 'campo');
        }, 400);
    };

    /**
     * Cargar variables existentes (solo anteriores a la variable actual)
     */
    const cargarVariablesExistentes = (varId) => {
        const container = document.getElementById(`camposVariables${varId}`);
        if (!container) return;

        const currentVarId = parseInt(varId);

        // Obtener variables ya creadas en el editor
        const variablesCards = document.querySelectorAll('.variable-card');
        const variables = [];

        variablesCards.forEach(card => {
            const cardId = parseInt(card.id.replace('varCard', ''));

            // Solo incluir variables con ID menor (anteriores)
            // Excluir la variable actual y las posteriores
            if (cardId < currentVarId) {
                const namePreview = card.querySelector('.variable-name-preview');
                const nombre = namePreview ? namePreview.textContent : `Variable ${cardId}`;
                variables.push({
                    nombre: nombre,
                    id: cardId
                });
            }
        });

        // Ordenar por ID ascendente
        variables.sort((a, b) => a.id - b.id);

        if (variables.length === 0) {
            container.innerHTML = '<div class="origen-campos-empty"><i class="fas fa-inbox"></i>No hay variables anteriores para referenciar</div>';
            return;
        }

        renderizarVariablesEnPanel(container, variables);
    };

    /**
     * Renderizar campos en un panel - formato lista
     */
    const renderizarCamposEnPanel = (container, campos, tipo) => {
        if (!campos || campos.length === 0) {
            container.innerHTML = '<div class="origen-campos-empty"><i class="fas fa-inbox"></i>No hay campos disponibles</div>';
            return;
        }

        container.innerHTML = campos.map(campo => {
            // Soportar multiples formatos
            const nombre = campo.campo || campo.nombre || campo.Nombre || campo.NombreCampo || campo;
            const descripcion = campo.descripcion || campo.Descripcion || '';
            return `
                <div class="origen-campo-item"
                     draggable="true"
                     ondragstart="dragFieldFromOrigen(event, '${nombre}')"
                     title="${descripcion || nombre}">
                    <div class="campo-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="campo-info">
                        <div class="campo-nombre">${nombre}</div>
                        ${descripcion && descripcion !== nombre ? `<div class="campo-descripcion">${descripcion}</div>` : ''}
                    </div>
                    <div class="campo-drag-handle">
                        <i class="fas fa-grip-vertical"></i>
                    </div>
                </div>
            `;
        }).join('');
    };

    /**
     * Renderizar variables en un panel - formato lista
     */
    const renderizarVariablesEnPanel = (container, variables) => {
        if (!variables || variables.length === 0) {
            container.innerHTML = '<div class="origen-campos-empty"><i class="fas fa-inbox"></i>No hay variables existentes</div>';
            return;
        }

        container.innerHTML = variables.map(v => `
            <div class="origen-variable-item"
                 draggable="true"
                 ondragstart="dragVariableFromOrigen(event, '${v.nombre}')"
                 title="Variable: ${v.nombre}">
                <div class="campo-icon">
                    <i class="fas fa-cube"></i>
                </div>
                <div class="campo-info">
                    <div class="campo-nombre">${v.nombre}</div>
                    <div class="campo-descripcion">Variable #${v.id}</div>
                </div>
                <div class="campo-drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
            </div>
        `).join('');
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        agregarVariable,
        toggleCard,
        eliminarVariable,
        updatePreview,
        updateVariablesCount,
        insertarCampo,
        cambiarOrigenDatos,
        cambiarTabBuro,
        seleccionarBuroCard,
        seleccionarSegmentoCard,
        renderizarSegmentosCards,
        cargarCamposProductoVariable,
        cargarBurosDisponiblesVariable,
        cargarVariablesExistentes
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

// ===== FUNCIONES GLOBALES DE DRAG PARA ORIGEN DE DATOS =====

/**
 * Iniciar drag de un campo desde el panel de origen
 */
window.dragFieldFromOrigen = function(event, fieldName) {
    event.dataTransfer.setData('text/plain', `[${fieldName}]`);
    event.dataTransfer.setData('type', 'field');
    event.dataTransfer.setData('fieldName', fieldName);
    event.dataTransfer.effectAllowed = 'copy';

    // Usar estado global si existe
    if (window.EF && window.EF.State) {
        window.EF.State.draggedField = fieldName;
    }
    window.draggedField = fieldName;
};

/**
 * Iniciar drag de una variable desde el panel de origen
 */
window.dragVariableFromOrigen = function(event, variableName) {
    event.dataTransfer.setData('text/plain', `[${variableName}]`);
    event.dataTransfer.setData('type', 'variable');
    event.dataTransfer.setData('variableName', variableName);
    event.dataTransfer.effectAllowed = 'copy';

    // Usar estado global si existe
    if (window.EF && window.EF.State) {
        window.EF.State.draggedVariable = variableName;
    }
    window.draggedVariable = variableName;
};
