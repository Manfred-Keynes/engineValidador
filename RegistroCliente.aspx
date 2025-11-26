<%@ Page Title="Registro de Cliente" Language="C#" MasterPageFile="~/Site.Master" 
    AutoEventWireup="true" CodeBehind="RegistroCliente.aspx.cs" Inherits="enginevalidator.RegistroCliente" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" runat="server">
    
    <%-- ============================================= --%>
    <%-- IMPORTANTE: data-page conecta con validaciones.js --%>
    <%-- El valor debe coincidir con el nombre de la funcion --%>
    <%-- en validaciones.js --%>
    <%-- ============================================= --%>
    <div data-page="registroCliente"></div>
    
    <div class="row">
        <div class="col-lg-8 mx-auto">
            
            <div class="card shadow">
                <div class="card-header card-header-custom">
                    <h5 class="mb-0">
                        <i class="fas fa-user-plus"></i> Registro de Cliente
                    </h5>
                </div>
                <div class="card-body">
                    
                    <%-- ============================================= --%>
                    <%-- CONTENEDOR DEL FORMULARIO                     --%>
                    <%-- Debe tener class="form" y un ID unico         --%>
                    <%-- ============================================= --%>
                    <div class="form" id="formRegistroCliente">
                        
                        <div class="row">
                            <%-- CAMPO: Nombre --%>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="cphBody_txtNombre" class="form-label">
                                        Nombre <span class="text-danger">*</span>
                                    </label>
                                    <asp:TextBox ID="txtNombre" runat="server" 
                                        CssClass="form-control" 
                                        data-validacion="true"
                                        placeholder="Ingrese su nombre"
                                        MaxLength="50">
                                    </asp:TextBox>
                                    <span id="cphBody_txtNombreErrorLabel" class="error-label"></span>
                                </div>
                            </div>
                            
                            <%-- CAMPO: Apellido --%>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="cphBody_txtApellido" class="form-label">
                                        Apellido <span class="text-danger">*</span>
                                    </label>
                                    <asp:TextBox ID="txtApellido" runat="server" 
                                        CssClass="form-control" 
                                        data-validacion="true"
                                        placeholder="Ingrese su apellido"
                                        MaxLength="50">
                                    </asp:TextBox>
                                    <span id="cphBody_txtApellidoErrorLabel" class="error-label"></span>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <%-- CAMPO: DPI --%>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="cphBody_txtDPI" class="form-label">
                                        No. DPI <span class="text-danger">*</span>
                                    </label>
                                    <asp:TextBox ID="txtDPI" runat="server" 
                                        CssClass="form-control" 
                                        data-validacion="true"
                                        placeholder="Ej: 1234567890101"
                                        MaxLength="13">
                                    </asp:TextBox>
                                    <span id="cphBody_txtDPIErrorLabel" class="error-label"></span>
                                    <small class="text-muted">13 digitos sin espacios ni guiones</small>
                                </div>
                            </div>
                            
                            <%-- CAMPO: Email --%>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="cphBody_txtEmail" class="form-label">
                                        Correo Electronico <span class="text-danger">*</span>
                                    </label>
                                    <asp:TextBox ID="txtEmail" runat="server" 
                                        CssClass="form-control" 
                                        data-validacion="true"
                                        placeholder="ejemplo@correo.com">
                                    </asp:TextBox>
                                    <span id="cphBody_txtEmailErrorLabel" class="error-label"></span>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <%-- CAMPO: Telefono --%>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="cphBody_txtTelefono" class="form-label">
                                        Telefono <span class="text-danger">*</span>
                                    </label>
                                    <asp:TextBox ID="txtTelefono" runat="server" 
                                        CssClass="form-control" 
                                        data-validacion="true"
                                        placeholder="Ej: 55551234"
                                        MaxLength="8">
                                    </asp:TextBox>
                                    <span id="cphBody_txtTelefonoErrorLabel" class="error-label"></span>
                                    <small class="text-muted">8 digitos, solo numeros</small>
                                </div>
                            </div>
                            
                            <%-- CAMPO: Departamento (DropDownList) --%>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="cphBody_ddlDepartamento" class="form-label">
                                        Departamento <span class="text-danger">*</span>
                                    </label>
                                    <asp:DropDownList ID="ddlDepartamento" runat="server" 
                                        CssClass="form-select" 
                                        data-validacion="true">
                                        <asp:ListItem Value="" Text="-- Seleccione --" />
                                        <asp:ListItem Value="1" Text="Guatemala" />
                                        <asp:ListItem Value="2" Text="El Progreso" />
                                        <asp:ListItem Value="3" Text="Sacatepequez" />
                                        <asp:ListItem Value="4" Text="Chimaltenango" />
                                        <asp:ListItem Value="5" Text="Escuintla" />
                                        <asp:ListItem Value="6" Text="Santa Rosa" />
                                        <asp:ListItem Value="7" Text="Solola" />
                                        <asp:ListItem Value="8" Text="Totonicapan" />
                                        <asp:ListItem Value="9" Text="Quetzaltenango" />
                                        <asp:ListItem Value="10" Text="Suchitepequez" />
                                    </asp:DropDownList>
                                    <span id="cphBody_ddlDepartamentoErrorLabel" class="error-label"></span>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <%-- CAMPO: Direccion (TextArea) --%>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="cphBody_txtDireccion" class="form-label">
                                        Direccion <span class="text-danger">*</span>
                                    </label>
                                    <asp:TextBox ID="txtDireccion" runat="server" 
                                        CssClass="form-control" 
                                        data-validacion="true"
                                        TextMode="MultiLine" 
                                        Rows="2"
                                        placeholder="Ingrese su direccion completa">
                                    </asp:TextBox>
                                    <span id="cphBody_txtDireccionErrorLabel" class="error-label"></span>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <%-- ============================================= --%>
                        <%-- BOTONES DE ACCION                             --%>
                        <%-- ============================================= --%>
                        <div class="d-flex justify-content-end gap-2">
                            
                            <%-- Boton Limpiar (sin validacion) --%>
                            <asp:Button ID="btnLimpiar" runat="server" 
                                Text="Limpiar" 
                                CssClass="btn btn-secondary"
                                OnClick="btnLimpiar_Click"
                                CausesValidation="false" />
                            
                            <%-- ============================================= --%>
                            <%-- BOTON CON VALIDACION JAVASCRIPT               --%>
                            <%-- OnClientClick="return triggerButtonClick(...)" --%>
                            <%-- Si retorna false, detiene el postback         --%>
                            <%-- Si retorna true, continua a btnGuardar_Click  --%>
                            <%-- ============================================= --%>
                            <asp:Button ID="btnGuardar" runat="server" 
                                Text="Guardar" 
                                CssClass="btn btn-primary"
                                OnClientClick="return triggerButtonClick('formRegistroCliente');"
                                OnClick="btnGuardar_Click" />
                            
                        </div>
                        
                    </div>
                    
                </div>
            </div>
            
            <%-- ============================================= --%>
            <%-- PANEL DE RESULTADO                            --%>
            <%-- Se muestra despues de guardar exitosamente    --%>
            <%-- ============================================= --%>
            <asp:Panel ID="pnlResultado" runat="server" Visible="false" CssClass="mt-3">
                <div class="alert alert-success">
                    <h5><i class="fas fa-check-circle"></i> Cliente Guardado Exitosamente</h5>
                    <asp:Literal ID="litResultado" runat="server"></asp:Literal>
                </div>
            </asp:Panel>
            
        </div>
    </div>
    
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="scripts" runat="server">
    <script>
        // Scripts especificos de esta pagina (opcionales)
        console.log('Pagina RegistroCliente cargada');
    </script>
</asp:Content>