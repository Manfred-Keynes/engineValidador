# Motor de Validaciones para ASP.NET WebForms

## Estructura del Proyecto

```
MiProyecto/
│
├── Site.Master                              ← Master Page principal
├── Site.Master.cs                           ← Code-behind de Master Page
│
├── RegistroCliente.aspx                     ← Página de ejemplo
├── RegistroCliente.aspx.cs                  ← Code-behind de la página
│
├── Content/
│   └── estilos.css                          ← Estilos CSS para validaciones
│
├── Scripts/
│   └── Validaciones/
│       ├── reglas.js                        ← Funciones de validación reutilizables
│       ├── validaciones.js                  ← Configuración de reglas por página
│       └── ValidadorFrontendWebForms.js     ← Motor principal de validaciones
│
└── README.md                                ← Este archivo
```

## Cómo Funciona

### 1. Definir el Contexto de Página

En tu página ASPX, agrega un elemento con `data-page` que coincida con el nombre de la función en `validaciones.js`:

```html
<div data-page="registroCliente"></div>
```

### 2. Crear el Contenedor del Formulario

El contenedor debe tener `class="form"` y un ID único:

```html
<div class="form" id="formRegistroCliente">
    <!-- Campos aquí -->
</div>
```

### 3. Marcar Campos para Validación

Agrega `data-validacion="true"` a los campos que quieres validar:

```html
<asp:TextBox ID="txtNombre" runat="server" 
    CssClass="form-control" 
    data-validacion="true" />
```

### 4. Agregar Labels de Error

El ID del label de error debe ser: `{ID del campo}ErrorLabel`

```html
<span id="cphBody_txtNombreErrorLabel" class="error-label"></span>
```

**Nota:** El prefijo `cphBody_` viene del ContentPlaceHolder en la Master Page.

### 5. Configurar el Botón

Usa `OnClientClick` para validar antes del postback:

```html
<asp:Button ID="btnGuardar" runat="server" 
    Text="Guardar"
    OnClientClick="return triggerButtonClick('formRegistroCliente');"
    OnClick="btnGuardar_Click" />
```

## Agregar Nueva Página

### Paso 1: En `validaciones.js`, agregar una nueva función:

```javascript
const miNuevaPagina = () => {
    const reglasXCampo = {
        cphBody_txtCampo1: [reglas.validarNoNulo],
        cphBody_txtCampo2: [reglas.validarNoNulo, reglas.validarEmail],
        cphBody_ddlSelect: [reglas.validarSeleccion]
    };

    return {
        reglasXCampo: (campo) => reglasXCampo[campo] || []
    };
};

// Agregar al return del módulo
return {
    registroCliente,
    registroProducto,
    miNuevaPagina  // ← Agregar aquí
};
```

### Paso 2: En tu nueva página ASPX:

```html
<div data-page="miNuevaPagina"></div>

<div class="form" id="formMiNuevaPagina">
    <asp:TextBox ID="txtCampo1" runat="server" data-validacion="true" />
    <span id="cphBody_txtCampo1ErrorLabel" class="error-label"></span>
    
    <!-- Más campos... -->
    
    <asp:Button ID="btnGuardar" runat="server" 
        OnClientClick="return triggerButtonClick('formMiNuevaPagina');"
        OnClick="btnGuardar_Click" />
</div>
```

## Reglas Disponibles

| Regla | Descripción | Ejemplo |
|-------|-------------|---------|
| `validarNoNulo` | Campo requerido | `reglas.validarNoNulo` |
| `validarLongitudMaxima(n)` | Máximo n caracteres | `reglas.validarLongitudMaxima(50)` |
| `validarLongitudMinima(n)` | Mínimo n caracteres | `reglas.validarLongitudMinima(3)` |
| `validarSoloNumeros` | Solo dígitos | `reglas.validarSoloNumeros` |
| `validarSoloTexto` | Solo letras y espacios | `reglas.validarSoloTexto` |
| `validarAlfanumerico` | Letras, números y espacios | `reglas.validarAlfanumerico` |
| `validarEmail` | Formato de email | `reglas.validarEmail` |
| `validarDPI` | DPI guatemalteco (13 dígitos) | `reglas.validarDPI` |
| `validarNIT` | NIT guatemalteco | `reglas.validarNIT` |
| `validarSeleccion` | Select no vacío | `reglas.validarSeleccion` |
| `validarSoloDecimales` | Números decimales | `reglas.validarSoloDecimales` |
| `soloFechasFuturas` | Fechas futuras | `reglas.soloFechasFuturas` |
| `soloFechasPasadas` | Fechas pasadas | `reglas.soloFechasPasadas` |

## Crear Nueva Regla

En `reglas.js`, agrega tu función:

```javascript
const validarTelefonoGuatemala = (control) => {
    const valor = control.value.replace(/\s/g, '');
    const valido = /^[2-7]\d{7}$/.test(valor);
    
    return {
        valido,
        mensaje: valido ? "" : `${obtenerNombreCampo(control)} debe ser un teléfono válido de Guatemala`
    };
};

// Agregar al return
return {
    // ... otras reglas
    validarTelefonoGuatemala
};
```

## Flujo de Ejecución

```
Usuario hace clic en "Guardar"
        ↓
OnClientClick: return triggerButtonClick('formRegistroCliente')
        ↓
triggerButtonClick() llama a validateForm()
        ↓
¿Validación OK?
    │
    ├── NO → return false (Postback DETENIDO)
    │        Muestra errores en pantalla
    │
    └── SÍ → return true (Postback CONTINÚA)
             Se ejecuta btnGuardar_Click en el servidor
```

## Notas Importantes

1. **Orden de Scripts:** Siempre cargar en este orden:
   - reglas.js
   - validaciones.js
   - ValidadorFrontendWebForms.js

2. **Prefijo de IDs:** En ASP.NET WebForms, los controles dentro de un ContentPlaceHolder
   generan IDs con prefijo. Si tu ContentPlaceHolder es `cphBody`, el ID será `cphBody_txtNombre`.

3. **Validación del Servidor:** Siempre valida también en el servidor (code-behind)
   por seguridad.

4. **Campos Ocultos/Deshabilitados:** El motor ignora automáticamente campos
   que estén ocultos (`display:none`) o deshabilitados (`disabled`).

## Autor

Generado para ASP.NET WebForms
