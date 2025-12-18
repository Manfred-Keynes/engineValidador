<%@ Page Title="Editor de Reglas" Language="C#" MasterPageFile="~/Site.Master"
    AutoEventWireup="true" CodeBehind="EditorReglasSelector.aspx.cs" Inherits="enginevalidator.EditorReglasSelector" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="<%= ResolveClientUrl("~/Content/EditorReglasSelector.css") %>" rel="stylesheet" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" runat="server">

    <!-- ScriptManager para PageMethods -->
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"></asp:ScriptManager>

    <div class="editor-container">

        <!-- ============================================= -->
        <!-- HEADER DEL EDITOR                             -->
        <!-- ============================================= -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">
                <i class="fas fa-cogs text-primary"></i> Editor de Reglas
            </h4>
            <div class="editor-toolbar">
                <button type="button" class="btn btn-success" onclick="guardarRegla()">
                    <i class="fas fa-save"></i> Guardar
                </button>
                <button type="button" class="btn btn-info" onclick="mostrarModalCargar()">
                    <i class="fas fa-folder-open"></i> Cargar
                </button>
                <button type="button" class="btn btn-secondary" onclick="limpiarEditor()">
                    <i class="fas fa-eraser"></i> Limpiar
                </button>
            </div>
        </div>

        <!-- ============================================= -->
        <!-- SECCION: VARIABLES                            -->
        <!-- ============================================= -->
        <div class="editor-section">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="editor-section-title mb-0">
                    <i class="fas fa-cube"></i> Variables
                    <span class="badge bg-primary ms-2" id="variablesCount">0</span>
                </div>
                <button type="button" class="btn btn-primary btn-sm" onclick="agregarVariable()">
                    <i class="fas fa-plus"></i> Nueva Variable
                </button>
            </div>

            <!-- Contenedor de Variables -->
            <div id="variablesContainer">
                <div class="text-center text-muted py-4" id="noVariablesMessage">
                    <i class="fas fa-info-circle fa-2x mb-2 d-block"></i>
                    No hay variables. Haga clic en "Nueva Variable" para comenzar.
                </div>
            </div>
        </div>

        <!-- ============================================= -->
        <!-- SECCION: EXPRESION LOGICA                     -->
        <!-- ============================================= -->
        <div class="editor-section">
            <div class="editor-section-title">
                <i class="fas fa-project-diagram"></i> Expresion Logica
            </div>

            <p class="text-muted small mb-2">
                Combine las variables usando operadores logicos, de comparacion y parentesis para crear expresiones complejas.
            </p>

            <!-- Controles para agregar a la expresion logica -->
            <div class="logic-controls mb-3">
                <div class="row g-2 align-items-end">
                    <!-- Selector de Variables -->
                    <div class="col-auto">
                        <label class="form-label small text-muted mb-1">Variable:</label>
                        <div class="input-group input-group-sm">
                            <select class="form-select form-select-sm" id="selectVariableLogica" style="min-width: 180px;">
                                <option value="">-- Sin variables --</option>
                            </select>
                            <button type="button" class="btn btn-primary btn-sm" onclick="agregarVariableSeleccionada()" title="Agregar variable">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Operadores Logicos -->
                    <div class="col-auto">
                        <label class="form-label small text-muted mb-1">Logicos:</label>
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-success" onclick="agregarOperadorLogico('AND')">AND</button>
                            <button type="button" class="btn btn-outline-success" onclick="agregarOperadorLogico('OR')">OR</button>
                            <button type="button" class="btn btn-outline-warning" onclick="agregarOperadorLogico('NOT')">NOT</button>
                        </div>
                    </div>

                    <!-- Operadores de Comparacion -->
                    <div class="col-auto">
                        <label class="form-label small text-muted mb-1">Comparacion:</label>
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-info" onclick="agregarOperadorLogico('==')" title="Igual a">=</button>
                            <button type="button" class="btn btn-outline-info" onclick="agregarOperadorLogico('!=')" title="Diferente de">!=</button>
                            <button type="button" class="btn btn-outline-info" onclick="agregarOperadorLogico('>')" title="Mayor que">&gt;</button>
                            <button type="button" class="btn btn-outline-info" onclick="agregarOperadorLogico('<')" title="Menor que">&lt;</button>
                            <button type="button" class="btn btn-outline-info" onclick="agregarOperadorLogico('>=')" title="Mayor o igual">>=</button>
                            <button type="button" class="btn btn-outline-info" onclick="agregarOperadorLogico('<=')" title="Menor o igual"><=</button>
                        </div>
                    </div>

                    <!-- Parentesis -->
                    <div class="col-auto">
                        <label class="form-label small text-muted mb-1">Agrupar:</label>
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-dark" onclick="agregarOperadorLogico('(')">(</button>
                            <button type="button" class="btn btn-outline-dark" onclick="agregarOperadorLogico(')')">)</button>
                        </div>
                    </div>

                    <!-- Insertar Valor -->
                    <div class="col-auto">
                        <label class="form-label small text-muted mb-1">Valor:</label>
                        <button type="button" class="btn btn-outline-warning btn-sm" onclick="mostrarInputValor()" id="btnInsertarValor">
                            <i class="fas fa-hashtag"></i> Insertar Valor
                        </button>
                    </div>
                </div>

                <!-- Input inline para capturar valor -->
                <div class="inline-value-input" id="inlineValueInput" style="display: none;">
                    <span class="inline-value-label"><i class="fas fa-hashtag"></i></span>
                    <input type="text" id="inputValorLogico" placeholder="Numero o texto..."
                           onkeypress="if(event.key==='Enter') aceptarValorLogico()">
                    <button type="button" class="btn-accept" onclick="aceptarValorLogico()" title="Aceptar">
                        <i class="fas fa-check"></i>
                    </button>
                    <button type="button" class="btn-cancel" onclick="cancelarValorLogico()" title="Cancelar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Zona de construccion de expresion logica -->
            <div class="build-zone" id="logicBuildZone">
                <div class="build-zone-placeholder">
                    <i class="fas fa-arrow-up"></i>
                    Agregue variables y operadores para crear la expresion logica
                </div>
            </div>

            <div class="expression-preview" id="logicExpressionPreview"></div>
        </div>

    </div>

    <!-- ============================================= -->
    <!-- MODAL: CARGAR REGLA                           -->
    <!-- ============================================= -->
    <div class="modal fade" id="modalCargar" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-folder-open"></i> Cargar Regla
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Seleccione una regla guardada:</label>
                        <select class="form-select" id="selectReglaCargar">
                            <option value="">-- Seleccione --</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="cargarReglaSeleccionada()">Cargar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================= -->
    <!-- MODAL: GUARDAR REGLA                          -->
    <!-- ============================================= -->
    <div class="modal fade" id="modalGuardar" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-save"></i> Guardar Regla
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="form-group mb-3">
                        <label>Nombre de la regla:</label>
                        <input type="text" class="form-control" id="inputNombreRegla" placeholder="Ej: Validacion de edad">
                    </div>
                    <div class="form-group">
                        <label>Descripcion (opcional):</label>
                        <textarea class="form-control" id="inputDescripcionRegla" rows="2" placeholder="Descripcion de la regla..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" onclick="confirmarGuardar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="scripts" runat="server">
    <script src="<%= ResolveClientUrl("~/Scripts/EditorReglasSelector.js") %>"></script>
    <script>
        // Inicializar el editor cuando la pagina cargue
        document.addEventListener('DOMContentLoaded', function() {
            initEditor();
        });
    </script>
</asp:Content>
