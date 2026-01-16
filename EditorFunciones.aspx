<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EditorFunciones.aspx.cs" Inherits="enginevalidator.EditorFunciones" MasterPageFile="~/Site.Master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="Content/EditorReglas.css" rel="stylesheet" type="text/css" />
    <style>
        * {
            box-sizing: border-box;
        }

        :root {
            --primary: #2563eb;
            --primary-dark: #1e40af;
            --primary-light: #dbeafe;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --gray-50: #f9fafb;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-400: #9ca3af;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
            --gray-900: #111827;
            --border-radius: 8px;
            --border-radius-sm: 6px;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        .editor-funciones-container {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--gray-50);
            color: var(--gray-900);
            line-height: 1.6;
            padding: 24px;
            padding-right: 450px; /* Espacio para ambas paletas */
        }

        .header {
            background: white;
            border-radius: var(--border-radius);
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: var(--shadow-sm);
            border-left: 4px solid var(--primary);
        }

        .header h1 {
            font-size: 24px;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 4px;
        }

        .header p {
            color: var(--gray-600);
            font-size: 14px;
            margin: 0;
        }

        .main-grid {
            display: block;
            margin-bottom: 24px;
        }

        .card {
            background: white;
            border-radius: var(--border-radius);
            padding: 24px;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--gray-200);
        }

        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--gray-100);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group:last-child {
            margin-bottom: 0;
        }

        .form-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-700);
            margin-bottom: 8px;
            letter-spacing: 0.01em;
        }

        .form-label .required {
            color: var(--danger);
            margin-left: 2px;
        }

        .form-input,
        .form-select,
        .form-textarea {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s;
            background: white;
            color: var(--gray-900);
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-light);
        }

        .form-select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
            background-position: right 10px center;
            background-repeat: no-repeat;
            background-size: 20px;
            padding-right: 40px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .form-row.acciones-row {
            grid-template-columns: 1fr 1fr 1fr;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 16px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            margin-top: 8px;
        }

        .action-select {
            background-color: white;
            border: 2px solid #e2e8f0;
            transition: all 0.2s ease;
        }

        .action-select:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .action-select option[value="verde"] {
            color: #10b981;
        }

        .action-select option[value="rojo"] {
            color: #ef4444;
        }

        .action-select option[value="amarillo"] {
            color: #f59e0b;
        }

        .form-textarea {
            min-height: 80px;
            resize: vertical;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }

        /* Variables Section - Accordion Style */
        .variables-section {
            margin-top: 32px;
        }

        .variables-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .btn-function-menu {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: white;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-700);
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }

        .btn-function-menu:hover {
            background: var(--gray-50);
            border-color: var(--primary);
            color: var(--primary);
        }

        .variables-count {
            background: var(--primary-light);
            color: var(--primary-dark);
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        /* Accordion Variable Cards */
        .variable-card {
            background: white;
            border: 2px solid #bfdbfe;
            border-radius: var(--border-radius);
            margin-bottom: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .variable-card.expanded {
            border-color: var(--primary);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .variable-card-header {
            padding: 16px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s;
        }

        .variable-card.expanded .variable-card-header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
        }

        .variable-card-header:hover {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }

        .variable-card.expanded .variable-card-header:hover {
            background: linear-gradient(135deg, var(--primary-dark) 0%, #1e3a8a 100%);
        }

        .variable-card-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }

        .variable-number {
            width: 36px;
            height: 36px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            flex-shrink: 0;
            transition: all 0.2s;
        }

        .variable-card.expanded .variable-number {
            background: white;
            color: var(--primary);
        }

        .variable-info {
            flex: 1;
            min-width: 0;
        }

        .variable-name-preview {
            font-weight: 600;
            color: var(--gray-900);
            font-size: 14px;
            margin-bottom: 4px;
        }

        .variable-card.expanded .variable-name-preview {
            color: white;
        }

        .variable-expression-preview {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: var(--gray-600);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .variable-card.expanded .variable-expression-preview {
            color: rgba(255, 255, 255, 0.9);
        }

        .variable-card-actions {
            display: flex;
            gap: 8px;
        }

        .variable-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: #dbeafe;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            color: var(--primary);
        }

        .variable-btn:hover {
            transform: scale(1.1);
            background: #bfdbfe;
        }

        .variable-card.expanded .variable-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }

        .variable-card.expanded .variable-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .variable-btn.delete:hover {
            background: var(--danger) !important;
            color: white !important;
        }

        .variable-btn.expand i {
            transition: transform 0.3s ease;
        }

        .variable-card.expanded .variable-btn.expand i {
            transform: rotate(180deg);
        }

        .variable-card-body {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
            background: white;
            position: relative;
        }

        .variable-card.expanded .variable-card-body {
            max-height: 2000px;
            padding: 20px;
            border-top: 1px solid var(--primary-light);
            overflow: visible;
        }

        /* Function menu dentro de cada variable */
        .function-menu-container {
            position: relative;
            margin-bottom: 16px;
        }

        .btn-function-menu {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: white;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-700);
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }

        .btn-function-menu:hover {
            background: var(--gray-50);
            border-color: var(--primary);
            color: var(--primary);
        }

        /* Estilo del botón de funciones dentro de la paleta de componentes */
        .component-palette-items .btn-function-menu {
            padding: 6px 10px;
            font-size: 12px;
            background: #eff6ff;
            border-color: #3b82f6;
            color: #1e40af;
        }

        .component-palette-items .btn-function-menu:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Function menu dropdown dentro de card */
        .function-menu {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            width: 360px;
            max-height: 500px;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            display: none;
            overflow: hidden;
        }

        .function-menu.active {
            display: block;
            animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .function-menu-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 14px 16px;
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            font-weight: 600;
            font-size: 14px;
            color: var(--gray-900);
        }

        .function-menu-header i {
            color: var(--primary);
        }

        .function-menu-search {
            position: relative;
            padding: 12px 16px;
            border-bottom: 1px solid var(--gray-200);
        }

        .function-menu-search i {
            position: absolute;
            left: 28px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-400);
            font-size: 13px;
        }

        .function-menu-search input {
            width: 100%;
            padding: 8px 12px 8px 32px;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 13px;
            font-family: inherit;
        }

        .function-menu-search input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-light);
        }

        .function-menu-items {
            max-height: 380px;
            overflow-y: auto;
        }

        .function-category {
            border-bottom: 1px solid var(--gray-100);
        }

        .function-category:last-child {
            border-bottom: none;
        }

        .function-category-title {
            padding: 10px 16px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gray-500);
            background: var(--gray-50);
        }

        .function-item {
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.15s;
            border-left: 3px solid transparent;
        }

        .function-item:hover {
            background: var(--primary-light);
            border-left-color: var(--primary);
        }

        .function-item.hidden {
            display: none;
        }

        .function-item-name {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            color: var(--gray-900);
            margin-bottom: 4px;
        }

        .function-item-name i {
            color: var(--primary);
            width: 16px;
        }

        .function-item-desc {
            font-size: 12px;
            color: var(--gray-600);
            margin-left: 24px;
        }

        .function-menu-items::-webkit-scrollbar {
            width: 6px;
        }

        .function-menu-items::-webkit-scrollbar-track {
            background: var(--gray-50);
        }

        .function-menu-items::-webkit-scrollbar-thumb {
            background: var(--gray-300);
            border-radius: 3px;
        }

        /* Autocompletado Inline */
        .autocomplete-popup {
            position: absolute;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            min-width: 280px;
            max-width: 400px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 10000;
            display: none;
        }

        .autocomplete-popup.active {
            display: block;
            animation: fadeInUp 0.15s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
            }
            50% {
                box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
            }
        }

        .autocomplete-header {
            padding: 8px 12px;
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            font-size: 11px;
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .autocomplete-item {
            padding: 10px 12px;
            cursor: pointer;
            transition: background 0.1s;
            border-left: 3px solid transparent;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .autocomplete-item:hover,
        .autocomplete-item.selected {
            background: var(--primary-light);
            border-left-color: var(--primary);
        }

        .autocomplete-item-icon {
            color: var(--primary);
            font-size: 16px;
            width: 20px;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .autocomplete-item-content {
            flex: 1;
            min-width: 0;
        }

        .autocomplete-item-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--gray-900);
            margin-bottom: 2px;
        }

        .autocomplete-item-desc {
            font-size: 12px;
            color: var(--gray-600);
            line-height: 1.4;
        }

        .autocomplete-item-params {
            font-size: 11px;
            color: var(--gray-500);
            font-family: 'Courier New', monospace;
            margin-top: 4px;
            background: var(--gray-50);
            padding: 4px 6px;
            border-radius: 4px;
        }

        .autocomplete-hint {
            padding: 8px 12px;
            font-size: 11px;
            color: var(--gray-500);
            background: var(--gray-50);
            border-top: 1px solid var(--gray-200);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .autocomplete-popup::-webkit-scrollbar {
            width: 6px;
        }

        .autocomplete-popup::-webkit-scrollbar-track {
            background: var(--gray-50);
        }

        .autocomplete-popup::-webkit-scrollbar-thumb {
            background: var(--gray-300);
            border-radius: 3px;
        }

        /* Constructor de Bloques Drag & Drop */
        .block-builder-container {
            margin-bottom: 0;
        }

        /* Layout de 2 columnas */
        .two-column-layout {
            display: block;
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .palette-column {
            display: none; /* Ocultar la columna de paleta ya que ahora está en sidebar */
        }

        .drop-column {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .block-builder-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--gray-700);
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .drop-zone {
            flex: 1;
            min-height: 300px;
            background: white;
            border: 2px dashed var(--gray-300);
            border-radius: var(--border-radius);
            padding: 16px;
            transition: all 0.2s;
            overflow-y: auto;
        }

        .drop-zone.drag-over {
            background: var(--primary-light);
            border-color: var(--primary);
            border-style: solid;
        }

        .drop-zone.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-500);
            font-size: 14px;
        }

        .param-block {
            background: white;
            border: 2px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            padding: 12px 16px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: move;
            transition: all 0.2s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .param-block:hover {
            border-color: var(--primary);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }

        .param-block.dragging {
            opacity: 0.5;
            cursor: grabbing;
        }

        .param-block-number {
            width: 28px;
            height: 28px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 12px;
            flex-shrink: 0;
        }

        .param-block-content {
            flex: 1;
            min-width: 0;
        }

        .param-block-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }

        .param-block-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--gray-900);
            font-family: 'Courier New', monospace;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .param-block-actions {
            display: flex;
            gap: 4px;
            flex-shrink: 0;
        }

        .param-block-btn {
            width: 28px;
            height: 28px;
            border: none;
            background: var(--gray-100);
            color: var(--gray-600);
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-size: 12px;
        }

        .param-block-btn:hover {
            background: var(--gray-200);
        }

        .param-block-btn.delete:hover {
            background: var(--danger);
            color: white;
        }

        .param-block-btn.edit:hover {
            background: var(--primary);
            color: white;
        }

        /* Colores por tipo de parámetro */
        .param-block[data-type="field"] {
            border-color: #3b82f6;
            background: linear-gradient(135deg, #eff6ff 0%, white 100%);
        }

        .param-block[data-type="field"] .param-block-number {
            background: #3b82f6;
        }

        .param-block[data-type="operator"] {
            border-color: #8b5cf6;
            background: linear-gradient(135deg, #f5f3ff 0%, white 100%);
        }

        .param-block[data-type="operator"] .param-block-number {
            background: #8b5cf6;
        }

        .param-block[data-type="value"] {
            border-color: #10b981;
            background: linear-gradient(135deg, #f0fdf4 0%, white 100%);
        }

        .param-block[data-type="value"] .param-block-number {
            background: #10b981;
        }

        .param-block[data-type="format"] {
            border-color: #f59e0b;
            background: linear-gradient(135deg, #fffbeb 0%, white 100%);
        }

        .param-block[data-type="format"] .param-block-number {
            background: #f59e0b;
        }

        /* Funciones anidadas */
        .param-block[data-type="function"],
        .param-block-function {
            border-color: #ec4899;
            background: linear-gradient(135deg, #fce7f3 0%, white 100%);
            cursor: default; /* No arrastrable hasta configurar */
        }

        .param-block-function .param-block-number {
            background: #ec4899;
        }

        .param-block-function.nested-function-configured {
            border-color: #10b981;
            background: linear-gradient(135deg, #d1fae5 0%, white 100%);
        }

        .param-block-function.nested-function-configured .param-block-number {
            background: #10b981;
        }

        .nested-function-info {
            font-size: 11px;
            color: var(--gray-600);
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .nested-function-pending .nested-function-info {
            color: #f59e0b;
        }

        .nested-function-configured .nested-function-info {
            color: #10b981;
        }

        .param-block-btn.config {
            background: #ec4899;
            color: white;
        }

        .param-block-btn.config:hover {
            background: #db2777;
            transform: scale(1.1);
        }

        /* Paleta de elementos disponibles */
        .elements-palette {
            background: transparent;
            border: none;
            padding: 0;
            margin-top: 0;
        }

        .palette-section {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--gray-200);
        }

        .palette-section:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        .palette-title {
            font-size: 11px;
            font-weight: 700;
            color: var(--gray-700);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .palette-items {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .palette-item {
            padding: 6px 10px;
            background: white;
            border: 2px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 12px;
            font-weight: 600;
            color: var(--gray-900);
            cursor: grab;
            transition: all 0.2s;
            font-family: 'Courier New', monospace;
            white-space: nowrap;
        }

        .palette-item:hover {
            background: var(--primary-light);
            border-color: var(--primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .palette-item:active {
            cursor: grabbing;
        }

        .palette-item[data-type="field"] {
            background: #eff6ff;
            border-color: #3b82f6;
            color: #1e40af;
        }

        .palette-item[data-type="operator"] {
            background: #f5f3ff;
            border-color: #8b5cf6;
            color: #6d28d9;
        }

        .palette-item[data-type="format"] {
            background: #fffbeb;
            border-color: #f59e0b;
            color: #d97706;
        }

        .palette-item[data-type="function"],
        .palette-item-function {
            background: #fce7f3;
            border-color: #ec4899;
            color: #be185d;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .palette-item-function i {
            font-size: 10px;
        }

        /* Scrollbars para las columnas */
        .palette-column::-webkit-scrollbar {
            width: 6px;
        }

        .palette-column::-webkit-scrollbar-track {
            background: var(--gray-100);
        }

        .palette-column::-webkit-scrollbar-thumb {
            background: var(--gray-300);
            border-radius: 3px;
        }

        .drop-zone::-webkit-scrollbar {
            width: 6px;
        }

        .drop-zone::-webkit-scrollbar-track {
            background: var(--gray-50);
        }

        .drop-zone::-webkit-scrollbar-thumb {
            background: var(--gray-300);
            border-radius: 3px;
        }

        /* Preview section in drop column */
        .preview-section {
            background: var(--gray-900);
            border-radius: var(--border-radius);
            padding: 12px 16px;
            flex-shrink: 0;
        }

        .preview-label {
            font-size: 10px;
            font-weight: 600;
            color: var(--gray-400);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .preview-code {
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #a6e22e;
            word-break: break-all;
            line-height: 1.6;
        }

        /* Indicador de arrastre */
        .drag-ghost {
            opacity: 0.8;
            transform: rotate(5deg);
        }

        /* Constructor Visual de Expresiones */
        .expression-builder {
            background: white;
            border: 2px solid var(--gray-300);
            border-radius: var(--border-radius);
            padding: 16px;
            min-height: 120px;
            transition: all 0.2s;
        }

        .expression-builder.drag-over {
            background: var(--primary-light);
            border-color: var(--primary);
            border-style: solid;
        }

        .expression-builder.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-500);
            font-size: 14px;
            min-height: 120px;
        }

        .expression-components {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }

        /* Input inline para captura de valores */
        .inline-value-input {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 4px;
            background: #fffbeb;
            border: 2px solid #fbbf24;
            border-radius: var(--border-radius-sm);
            box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
            animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .inline-value-input input {
            border: 1px solid #fbbf24;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 13px;
            font-weight: 600;
            font-family: 'Courier New', monospace;
            width: 120px;
            outline: none;
            transition: all 0.2s;
        }

        .inline-value-input input:focus {
            border-color: #f59e0b;
            box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
        }

        .inline-value-input button {
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .inline-value-input .btn-accept {
            background: #10b981;
            color: white;
        }

        .inline-value-input .btn-accept:hover {
            background: #059669;
            transform: translateY(-1px);
        }

        .inline-value-input .btn-cancel {
            background: #ef4444;
            color: white;
        }

        .inline-value-input .btn-cancel:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }

        .expr-component {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: white;
            border: 2px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 13px;
            font-weight: 600;
            cursor: move;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            font-family: 'Courier New', monospace;
        }

        .expr-component:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .expr-component.dragging {
            opacity: 0.5;
        }

        /* Tipos de componentes */
        .expr-component[data-type="function"] {
            background: linear-gradient(135deg, #eff6ff 0%, white 100%);
            border-color: #3b82f6;
            color: #1e40af;
        }

        .expr-component[data-type="function"] .expr-icon {
            color: #3b82f6;
        }

        .expr-component[data-type="field"] {
            background: linear-gradient(135deg, #f0fdf4 0%, white 100%);
            border-color: #10b981;
            color: #065f46;
        }

        .expr-component[data-type="field"] .expr-icon {
            color: #10b981;
        }

        .expr-component[data-type="operator"] {
            background: linear-gradient(135deg, #fef3c7 0%, white 100%);
            border-color: #f59e0b;
            color: #92400e;
            min-width: 40px;
            justify-content: center;
        }

        .expr-component[data-type="value"] {
            background: linear-gradient(135deg, #fae8ff 0%, white 100%);
            border-color: #a855f7;
            color: #6b21a8;
        }

        .expr-component[data-type="parenthesis"] {
            background: var(--gray-100);
            border-color: var(--gray-400);
            color: var(--gray-700);
            min-width: 36px;
            justify-content: center;
            padding: 8px;
        }

        .expr-icon {
            font-size: 14px;
        }

        .expr-content {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .expr-label {
            font-size: 9px;
            text-transform: uppercase;
            opacity: 0.7;
            font-weight: 700;
            letter-spacing: 0.05em;
        }

        .expr-value {
            font-size: 13px;
        }

        .expr-actions {
            display: flex;
            gap: 4px;
            margin-left: 4px;
        }

        .expr-btn {
            width: 20px;
            height: 20px;
            border: none;
            background: rgba(0, 0, 0, 0.05);
            color: var(--gray-600);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-size: 10px;
        }

        .expr-btn:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        .expr-btn.edit:hover {
            background: var(--primary);
            color: white;
        }

        .expr-btn.delete:hover {
            background: var(--danger);
            color: white;
        }

        /* Paleta de componentes para expresiones */
        .component-palette {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
            padding: 12px;
            margin-top: 12px;
        }

        .component-palette-title {
            font-size: 11px;
            font-weight: 700;
            color: var(--gray-700);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .component-palette-items {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .component-palette-item {
            padding: 6px 10px;
            background: white;
            border: 2px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .component-palette-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .component-palette-item[data-type="function"] {
            background: #eff6ff;
            border-color: #3b82f6;
            color: #1e40af;
        }

        .component-palette-item[data-type="field"] {
            background: #f0fdf4;
            border-color: #10b981;
            color: #065f46;
        }

        .component-palette-item[data-type="operator"] {
            background: #fef3c7;
            border-color: #f59e0b;
            color: #92400e;
        }

        .component-palette-item[data-type="value"] {
            background: #fae8ff;
            border-color: #a855f7;
            color: #6b21a8;
        }

        .component-palette-item[data-type="parenthesis"] {
            background: var(--gray-100);
            border-color: var(--gray-400);
            color: var(--gray-700);
        }

        /* Parámetro placeholder interactivo */
        .param-placeholder {
            display: inline-block;
            background: var(--primary-light);
            color: var(--primary-dark);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            border: 2px solid var(--primary);
            transition: all 0.2s;
        }

        .param-placeholder:hover {
            background: var(--primary);
            color: white;
            transform: scale(1.05);
        }

        .param-dropdown {
            position: absolute;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-sm);
            box-shadow: var(--shadow-md);
            min-width: 200px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 10001;
            display: none;
        }

        .param-dropdown.active {
            display: block;
        }

        .param-dropdown-item {
            padding: 8px 12px;
            cursor: pointer;
            transition: background 0.1s;
            font-size: 13px;
        }

        .param-dropdown-item:hover {
            background: var(--primary-light);
        }

        .param-dropdown-item strong {
            color: var(--gray-900);
        }

        .param-dropdown-item span {
            color: var(--gray-600);
            font-size: 12px;
            display: block;
        }

        .variable-field {
            margin-bottom: 16px;
        }

        .variable-field:last-child {
            margin-bottom: 0;
        }

        .variable-field-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--gray-700);
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .variable-field-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 13px;
            font-family: 'Courier New', monospace;
            transition: all 0.2s;
        }

        .variable-field-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-light);
        }

        .variable-fields-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }

        .btn-add-variable {
            width: 100%;
            padding: 12px;
            background: white;
            border: 2px dashed var(--gray-300);
            border-radius: var(--border-radius);
            color: var(--gray-600);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
        }

        .btn-add-variable:hover {
            background: var(--primary-light);
            border-color: var(--primary);
            color: var(--primary);
        }

        .field-list {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-sm);
            max-height: 400px;
            overflow-y: auto;
            padding: 12px;
        }

        /* Grid de campos como pills */
        .fields-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        /* Campo Pill - Estilo similar a operadores pero azul */
        .field-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 600;
            line-height: 1;
            color: #1e40af;
            background-color: #dbeafe;
            border: none;
            border-radius: 50rem;
            cursor: grab;
            transition: all 0.15s ease-in-out;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
        }

        .field-pill:active {
            cursor: grabbing;
        }

        .field-pill:hover {
            background-color: #bfdbfe;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .field-pill.dragging {
            opacity: 0.5;
        }

        /* Icono del campo */
        .field-pill-icon {
            font-size: 11px;
            line-height: 1;
        }

        /* Nombre del campo */
        .field-pill-name {
            font-size: 11px;
            font-weight: 600;
            line-height: 1;
        }

        /* Mantener estilos antiguos por si se necesitan en otra parte */
        .field-list-header {
            display: none; /* Ocultar header de tabla */
        }

        .field-item {
            display: none; /* Ocultar items de tabla */
        }

        .field-name {
            font-weight: 500;
            color: var(--gray-900);
        }

        .field-description {
            color: var(--gray-600);
        }

        .logic-expression {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-sm);
            padding: 16px;
            margin-top: 24px;
        }

        .logic-expression-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
        }

        .logic-expression-header i {
            color: var(--primary);
        }

        .logic-expression-header span {
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-700);
        }

        .logic-expression-content {
            background: white;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            padding: 12px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: var(--gray-900);
            min-height: 60px;
        }

        .action-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 20px 24px;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--gray-200);
        }

        .action-bar-left {
            display: flex;
            gap: 12px;
        }

        /* Contenedor de Factores de Riesgo */
        .factores-container {
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--gray-200);
            margin-top: 20px;
            overflow: hidden;
        }

        .factores-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-bottom: 1px solid #bfdbfe;
        }

        .factores-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .factores-header i {
            color: var(--primary);
            font-size: 18px;
        }

        .factores-title {
            font-weight: 600;
            color: var(--gray-800);
            font-size: 15px;
        }

        .factores-count {
            background: var(--primary);
            color: white;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .factores-list {
            max-height: 300px;
            overflow-y: auto;
            padding: 12px;
        }

        .factores-list::-webkit-scrollbar {
            width: 6px;
        }

        .factores-list::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
        }

        .factores-list::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }

        .factores-list::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        .factor-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 8px;
            transition: all 0.2s ease;
        }

        .factor-item:last-child {
            margin-bottom: 0;
        }

        .factor-item:hover {
            background: #eff6ff;
            border-color: #bfdbfe;
            transform: translateX(4px);
        }

        .factor-item-left {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }

        .factor-item-icon {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 14px;
        }

        .factor-item-info {
            flex: 1;
        }

        .factor-item-name {
            font-weight: 600;
            color: var(--gray-800);
            font-size: 14px;
            margin-bottom: 2px;
        }

        .factor-item-description {
            font-size: 12px;
            color: var(--gray-500);
        }

        .factor-item-actions {
            display: flex;
            gap: 6px;
        }

        .factor-item-btn {
            width: 30px;
            height: 30px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .factor-item-btn.edit {
            background: #dbeafe;
            color: var(--primary);
        }

        .factor-item-btn.edit:hover {
            background: var(--primary);
            color: white;
        }

        .factor-item-btn.delete {
            background: #fee2e2;
            color: #dc2626;
        }

        .factor-item-btn.delete:hover {
            background: #dc2626;
            color: white;
        }

        .factores-empty {
            text-align: center;
            padding: 40px 20px;
            color: var(--gray-400);
        }

        .factores-empty i {
            font-size: 40px;
            margin-bottom: 12px;
            display: block;
        }

        .factores-empty span {
            font-size: 14px;
        }

        .helper-text {
            font-size: 12px;
            color: var(--gray-500);
            margin-top: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .badge-primary {
            background: var(--primary-light);
            color: var(--primary-dark);
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: var(--border-radius-sm);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
            box-shadow: var(--shadow-sm);
        }

        .btn-primary:hover {
            background: var(--primary-dark);
        }

        .btn-secondary {
            background: white;
            color: var(--gray-700);
            border: 1px solid var(--gray-300);
        }

        .btn-secondary:hover {
            background: var(--gray-50);
        }

        .btn-success {
            background: var(--success);
            color: white;
        }

        .btn-success:hover {
            background: #059669;
        }

        @media (max-width: 1400px) {
            .editor-funciones-container {
                padding-right: 230px; /* Solo espacio para una paleta */
            }
        }

        @media (max-width: 1024px) {
            .variable-fields-grid {
                grid-template-columns: 1fr;
            }

            .editor-funciones-container {
                padding-right: 24px;
            }

            .resources-sidebar,
            .functions-sidebar {
                position: relative;
                right: auto;
                top: auto;
                width: 100%;
                max-height: none;
                margin-bottom: 20px;
                border-radius: var(--border-radius);
            }

            .resources-sidebar.shift-left {
                right: auto;
            }
        }

        .field-list::-webkit-scrollbar {
            width: 8px;
        }

        .field-list::-webkit-scrollbar-track {
            background: var(--gray-100);
            border-radius: 4px;
        }

        .field-list::-webkit-scrollbar-thumb {
            background: var(--gray-300);
            border-radius: 4px;
        }

        /* ===== PANEL LATERAL DE CONFIGURACIÓN ===== */
        /* Panel de configuración inline (debajo del expression-builder) */
        .config-panel {
            display: none;
            margin-top: 16px;
            background: white;
            border: 2px solid #667eea;
            border-radius: var(--border-radius);
            overflow: hidden;
            animation: expandPanel 0.3s ease-out;
        }

        @keyframes expandPanel {
            from {
                opacity: 0;
                max-height: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                max-height: 800px;
                transform: translateY(0);
            }
        }

        .config-panel.active {
            display: block;
        }

        .config-panel-overlay {
            display: none; /* No necesitamos overlay en versión inline */
        }

        .config-panel-content {
            display: flex;
            flex-direction: column;
            /* Altura automática según contenido */
        }

        .config-panel-header {
            padding: 16px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .config-panel-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .config-panel-header i {
            font-size: 18px;
        }

        .config-panel-title {
            font-size: 16px;
            font-weight: 700;
        }

        .config-panel-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }

        .config-panel-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }

        .config-panel-body {
            flex: 1;
            padding: 20px;
            position: relative;
            z-index: 1;
        }

        /* ===== MINI-BUILDERS COLAPSABLES ===== */
        .collapsible-mini-builder {
            border: 2px solid var(--gray-200);
            border-radius: 8px;
            margin-bottom: 16px;
            background: white;
            transition: all 0.3s ease;
            position: relative;
            z-index: 0;
        }

        .collapsible-mini-builder.collapsed {
            border-color: var(--gray-300);
            background: var(--gray-50);
        }

        .mini-builder-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-bottom: 2px solid var(--gray-200);
            cursor: pointer;
            user-select: none;
            border-radius: 6px 6px 0 0;
            transition: all 0.2s;
        }

        .mini-builder-header:hover {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }

        .collapsible-mini-builder.collapsed .mini-builder-header {
            border-radius: 6px;
            border-bottom: none;
        }

        .mini-builder-header-left {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .mini-builder-header-title {
            font-weight: 600;
            font-size: 13px;
            color: var(--gray-800);
        }

        .mini-builder-toggle {
            background: none;
            border: none;
            color: var(--primary);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }

        .mini-builder-toggle i {
            font-size: 14px;
        }

        .collapsible-mini-builder.collapsed .mini-builder-toggle {
            transform: rotate(-90deg);
        }

        .mini-builder-content {
            padding: 16px;
            transition: all 0.3s ease;
            max-height: 2000px;
            overflow: visible;
        }

        .collapsible-mini-builder.collapsed .mini-builder-content {
            max-height: 0;
            padding: 0 16px;
            overflow: hidden;
        }

        /* Breadcrumb individual para cada mini-builder */
        .mini-builder-breadcrumb {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-wrap: wrap;
            margin-bottom: 12px;
            padding: 8px 12px;
            background: var(--gray-50);
            border-radius: 6px;
            border: 1px solid var(--gray-200);
            font-size: 11px;
            overflow-x: auto;
            max-width: 100%;
        }

        /* ===== TABS PARA "SI ENTONCES" ===== */
        .si-entonces-tabs-container {
            background: white;
            border: 2px solid var(--gray-200);
            border-radius: 8px;
            overflow: hidden;
        }

        .si-entonces-tabs-header {
            display: flex;
            background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
            border-bottom: 2px solid var(--gray-300);
            gap: 0;
        }

        .si-entonces-tab-button {
            flex: 1;
            padding: 14px 20px;
            background: transparent;
            border: none;
            border-right: 1px solid var(--gray-300);
            color: var(--gray-600);
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .si-entonces-tab-button:last-child {
            border-right: none;
        }

        .si-entonces-tab-button:hover {
            background: rgba(102, 126, 234, 0.1);
            color: var(--primary);
        }

        .si-entonces-tab-button.active {
            background: white;
            color: var(--primary);
            border-bottom: 3px solid var(--primary);
            font-weight: 700;
        }

        .si-entonces-tab-button.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--primary);
        }

        .si-entonces-tabs-content {
            padding: 20px;
            background: white;
            min-height: 100px;
        }

        .si-entonces-tab-panel {
            display: none;
            animation: fadeIn 0.3s ease;
        }

        .si-entonces-tab-panel.active {
            display: block;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .config-panel-footer {
            padding: 16px 24px;
            background: #f8f9fa;
            border-top: 1px solid var(--gray-200);
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .config-panel-footer .btn {
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .config-panel-footer .btn-secondary {
            background: white;
            color: var(--gray-700);
            border: 2px solid var(--gray-300);
        }

        .config-panel-footer .btn-secondary:hover {
            background: var(--gray-50);
            border-color: var(--gray-400);
        }

        .config-panel-footer .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .config-panel-footer .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        /* Mini Expression Builder dentro del config panel */
        .mini-builder-container {
            margin-bottom: 20px;
        }

        .mini-expression-builder {
            background: white;
            border: 2px dashed var(--gray-300);
            border-radius: 8px;
            padding: 12px;
            min-height: 80px;
            transition: all 0.2s;
        }

        .mini-expression-builder.drag-over {
            background: var(--primary-light);
            border-color: var(--primary);
            border-style: solid;
        }

        .mini-expression-builder .empty {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-500);
            font-size: 13px;
            min-height: 56px;
        }

        .mini-expression-builder .expression-components {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: center;
        }

        /* Badges más pequeños para mini-builder */
        .mini-expression-builder .expr-component {
            padding: 6px 10px;
            font-size: 12px;
        }

        .mini-preview {
            display: none;
            margin-top: 8px;
            padding: 8px 12px;
            background: #1e293b;
            color: #10b981;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            border-radius: 6px;
        }

        .mini-preview.active {
            display: block;
        }

        /* ===== PANEL LATERAL DE OPERADORES - DISEÑO MODERNO ===== */
        .resources-sidebar {
            position: fixed;
            right: 12px;
            top: 120px;
            width: 200px;
            background: #ffffff;
            border: none;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
            z-index: 99;
            max-height: calc(100vh - 140px);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Cuando hay una variable expandida, correrse a la izquierda */
        .resources-sidebar.shift-left {
            right: 230px; /* 210px (ancho funciones) + 8px gap + 12px posicion */
        }

        .resources-sidebar-header {
            padding: 12px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 16px 16px 0 0;
        }

        .resources-sidebar-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .resources-sidebar-header i {
            color: #ffffff;
            font-size: 18px;
        }

        .resources-sidebar-title {
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
        }

        .resources-sidebar-info {
            width: 28px;
            height: 28px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .resources-sidebar-info:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        /* Sección dentro del panel de recursos */
        .resources-section {
            border-bottom: 1px solid var(--gray-200);
        }

        .resources-section:last-child {
            border-bottom: none;
        }

        .resources-section-header {
            padding: 12px 16px;
            background: var(--gray-50);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 600;
            color: var(--gray-700);
            border-bottom: 1px solid var(--gray-200);
        }

        .resources-section-header i {
            color: var(--primary);
            font-size: 14px;
        }

        .resources-badge {
            margin-left: auto;
            background: #dbeafe;
            color: #1e40af;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }

        .resources-section-content {
            padding: 10px;
            max-height: 400px;
            overflow-y: auto;
            background: #ffffff;
        }

        /* Selector de segmento compacto */
        .resources-segment-selector {
            margin-bottom: 12px;
        }

        .resources-segment-selector .form-select-sm {
            font-size: 12px;
            padding: 4px 8px;
        }

        /* Panel lateral de funciones - SE MUESTRA/OCULTA A LA DERECHA */
        .functions-sidebar {
            position: fixed;
            right: 12px;             /* Siempre en el extremo derecho */
            top: 120px;              /* Misma altura que operadores */
            width: 210px;            /* Ancho compacto */
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: 16px;
            box-shadow: var(--shadow-lg);
            z-index: 100;
            max-height: calc(100vh - 140px);  /* Altura completa disponible */
            display: none;           /* Oculto por defecto */
            flex-direction: column;
            overflow: hidden;        /* Importante para que el contenido tenga altura */
        }

        .functions-sidebar-header {
            padding: 12px 14px;
            border-bottom: 2px solid var(--gray-100);
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 16px 16px 0 0;
        }

        .functions-sidebar-header i {
            color: #ffffff;
            font-size: 16px;
        }

        .functions-sidebar-title {
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
        }

        .functions-sidebar-search {
            padding: 8px 10px;
            border-bottom: 1px solid var(--gray-200);
        }

        .functions-sidebar-search input {
            width: 100%;
            padding: 8px 12px 8px 36px;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-sm);
            font-size: 13px;
            background: white url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>') no-repeat 10px center;
        }

        .functions-sidebar-search input:focus {
            outline: none;
            border-color: var(--primary);
        }

        .functions-sidebar-content {
            overflow-y: auto;
            flex: 1;
        }

        /* Secciones dentro del sidebar derecho */
        .sidebar-section {
            border-bottom: 1px solid var(--gray-200);
        }

        .sidebar-section:last-child {
            border-bottom: none;
        }

        .sidebar-section-header {
            padding: 12px 16px;
            background: var(--gray-50);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 600;
            color: var(--gray-700);
            border-bottom: 1px solid var(--gray-200);
        }

        .sidebar-section-header i {
            color: var(--primary);
            font-size: 14px;
        }

        .sidebar-badge {
            margin-left: auto;
            background: #dbeafe;
            color: #1e40af;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }

        .sidebar-section-content {
            padding: 12px;
            max-height: 250px;
            overflow-y: auto;
        }

        /* Selector de segmento en sidebar */
        .sidebar-segment-selector {
            margin-bottom: 12px;
        }

        .sidebar-segment-selector .form-select-sm {
            font-size: 12px;
            padding: 4px 8px;
        }

        /* Separador visual */
        .sidebar-separator {
            height: 8px;
            background: var(--gray-100);
            border-top: 1px solid var(--gray-200);
            border-bottom: 1px solid var(--gray-200);
        }

        .function-category-sidebar {
            padding: 12px 16px 8px 16px;
        }

        .function-category-sidebar-title {
            font-size: 11px;
            font-weight: 700;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .draggable-function-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            margin-bottom: 4px;
            background: white;
            border: 1px solid #dbeafe;
            border-radius: var(--border-radius-sm);
            cursor: grab;
            transition: all 0.2s;
        }

        .draggable-function-item:active {
            cursor: grabbing;
        }

        .draggable-function-item:hover {
            border-color: var(--primary);
            background: #eff6ff;
            transform: translateX(4px);
        }

        .draggable-function-item.dragging {
            opacity: 0.5;
            transform: scale(0.95);
        }

        .draggable-function-icon {
            width: 26px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-light);
            border-radius: 6px;
            color: var(--primary);
            font-size: 12px;
            flex-shrink: 0;
        }

        .draggable-function-content {
            flex: 1;
        }

        .draggable-function-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 0;
        }

        .draggable-function-desc {
            display: none; /* Ocultar descripcion en paleta compacta */
        }

        .drag-handle {
            color: #93c5fd;
            font-size: 12px;
        }

        /* Hint de arrastre */
        .functions-sidebar-hint {
            padding: 10px 12px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-top: 1px solid #bfdbfe;
            font-size: 11px;
            color: #1e40af;
            display: flex;
            align-items: center;
            gap: 8px;
            border-radius: 0 0 16px 16px;
        }

        .functions-sidebar-hint i {
            color: var(--primary);
        }

        /* Panel estático de operadores */
        .operators-static-panel {
            margin-top: 16px;
            padding: 12px;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
        }

        /* ===== DISEÑO MINIMALISTA DE OPERADORES ===== */

        /* Categorías de operadores */
        .op-category {
            margin-bottom: 12px;
        }

        .op-category:last-child {
            margin-bottom: 0;
        }

        .op-category-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
        }

        .op-category-header i {
            font-size: 12px;
        }

        .op-category-header.arithmetic i { color: var(--primary); }
        .op-category-header.comparison i { color: #3b82f6; }
        .op-category-header.logic i { color: #1d4ed8; }
        .op-category-header.special i { color: #6366f1; }

        /* Grid de operadores */
        .operators-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        /* Operador Pill - Diseño Cuadrado Minimalista */
        .op-pill {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'SF Mono', 'Consolas', monospace;
            color: #ffffff;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            border: none;
            border-radius: 8px;
            cursor: grab;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
        }

        .op-pill:active {
            cursor: grabbing;
            transform: scale(0.95);
        }

        .op-pill:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }

        .op-pill.dragging {
            opacity: 0.7;
            transform: scale(1.05);
        }

        /* Operadores Aritméticos - Azul primario */
        .op-pill.arithmetic {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .op-pill.arithmetic:hover {
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }

        /* Operadores de Comparación - Azul medio */
        .op-pill.comparison {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .op-pill.comparison:hover {
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        /* Operadores de Comparación con borde (>=, <=, !=) */
        .op-pill.comparison-outline {
            background: transparent;
            color: #3b82f6;
            border: 2px solid #3b82f6;
            box-shadow: none;
        }

        .op-pill.comparison-outline:hover {
            background: rgba(59, 130, 246, 0.1);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        /* Operadores Lógicos - Azul oscuro */
        .op-pill.logic {
            width: auto;
            padding: 0 10px;
            font-size: 11px;
            font-weight: 700;
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            box-shadow: 0 2px 8px rgba(29, 78, 216, 0.3);
        }

        .op-pill.logic:hover {
            box-shadow: 0 6px 16px rgba(29, 78, 216, 0.4);
        }

        /* Especiales - Valor */
        .op-pill.special-value {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .op-pill.special-value:hover {
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }

        /* Especiales - Paréntesis */
        .op-pill.special-parenthesis {
            background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
            box-shadow: 0 2px 8px rgba(129, 140, 248, 0.3);
        }

        .op-pill.special-parenthesis:hover {
            box-shadow: 0 6px 16px rgba(129, 140, 248, 0.4);
        }

        /* Especiales - Where */
        .op-pill.special-where {
            width: auto;
            padding: 0 10px;
            font-size: 11px;
            font-weight: 700;
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }

        .op-pill.special-where:hover {
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }

        /* Hint del sidebar */
        .operators-sidebar-hint {
            padding: 10px 12px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-top: 1px solid #bfdbfe;
            font-size: 11px;
            color: #1e40af;
            display: flex;
            align-items: center;
            gap: 8px;
            border-radius: 0 0 16px 16px;
        }

        .operators-sidebar-hint i {
            color: var(--primary);
            font-size: 12px;
        }

        /* ===== MODAL ANIDADO PARA CONFIGURAR FUNCIONES ===== */
        .nested-function-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10000; /* Encima del modal principal */
            align-items: center;
            justify-content: center;
        }

        .nested-function-modal {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 900px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .nested-function-modal-header {
            padding: 20px 24px;
            border-bottom: 2px solid var(--gray-200);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
            border-radius: 12px 12px 0 0;
        }

        .nested-function-modal-header div {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .nested-function-modal-header i {
            font-size: 20px;
            color: #ec4899;
        }

        .nested-function-modal-header span {
            font-size: 18px;
            font-weight: 700;
            color: var(--gray-900);
        }

        .nested-function-modal-body {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
        }

        .nested-function-modal-footer {
            padding: 16px 24px;
            border-top: 2px solid var(--gray-200);
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            background: var(--gray-50);
            border-radius: 0 0 12px 12px;
        }

        .nested-function-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .nested-function-info-banner {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 13px;
            color: #1e40af;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nested-two-column {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 20px;
        }

        .nested-palette {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 8px;
            padding: 12px;
            max-height: 400px;
            overflow-y: auto;
        }

        .nested-palette-section {
            margin-bottom: 16px;
        }

        .nested-palette-section:last-child {
            margin-bottom: 0;
        }

        .nested-palette-title {
            font-size: 11px;
            font-weight: 700;
            color: var(--gray-700);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .nested-palette-items {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .nested-drop-area {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .nested-drop-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-700);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nested-drop-zone {
            background: white;
            border: 2px dashed var(--gray-300);
            border-radius: 8px;
            padding: 16px;
            min-height: 200px;
            transition: all 0.2s;
        }

        .nested-drop-zone.drag-over {
            background: var(--primary-light);
            border-color: var(--primary);
            border-style: solid;
        }

        .nested-param-block {
            background: white;
            border: 2px solid var(--gray-300);
            border-radius: 6px;
            padding: 10px 12px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.2s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .nested-param-block:hover {
            border-color: var(--primary);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        /* Estilos para funciones anidadas profundamente */
        .nested-param-block-function {
            background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
            border: 2px solid #f59e0b;
        }

        .nested-param-block-function:hover {
            border-color: #d97706;
            box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
        }

        .nested-function-pending {
            border-style: dashed;
            opacity: 0.8;
        }

        .nested-function-configured {
            border-style: solid;
        }

        .nested-function-info-small {
            font-size: 10px;
            color: var(--gray-600);
            margin-top: 2px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .nested-function-info-small i {
            font-size: 10px;
        }

        .nested-param-block-number {
            width: 24px;
            height: 24px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 11px;
            flex-shrink: 0;
        }

        .nested-param-block-content {
            flex: 1;
            min-width: 0;
        }

        .nested-param-block-label {
            font-size: 10px;
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
        }

        .nested-param-block-value {
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-900);
            font-family: 'Courier New', monospace;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .nested-param-block-actions {
            display: flex;
            gap: 4px;
            flex-shrink: 0;
        }

        .nested-param-block-btn {
            width: 24px;
            height: 24px;
            border: none;
            background: var(--gray-100);
            color: var(--gray-600);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-size: 11px;
        }

        .nested-param-block-btn.delete:hover {
            background: var(--danger);
            color: white;
        }

        .nested-param-block[data-type="field"] {
            border-color: #3b82f6;
            background: linear-gradient(135deg, #eff6ff 0%, white 100%);
        }

        .nested-param-block[data-type="field"] .nested-param-block-number {
            background: #3b82f6;
        }

        .nested-param-block[data-type="operator"] {
            border-color: #8b5cf6;
            background: linear-gradient(135deg, #f5f3ff 0%, white 100%);
        }

        .nested-param-block[data-type="operator"] .nested-param-block-number {
            background: #8b5cf6;
        }

        .nested-param-block[data-type="value"] {
            border-color: #10b981;
            background: linear-gradient(135deg, #f0fdf4 0%, white 100%);
        }

        .nested-param-block[data-type="value"] .nested-param-block-number {
            background: #10b981;
        }

        .nested-preview {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 6px;
            padding: 12px;
        }

        .nested-preview-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .nested-preview-code {
            background: #1e293b;
            color: #10b981;
            padding: 12px 16px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            font-weight: 600;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .btn-add-value {
            padding: 6px 10px;
            background: var(--primary-light);
            border: 2px solid var(--primary);
            border-radius: 6px;
            color: var(--primary-dark);
            font-weight: 600;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s;
        }

        .btn-add-value:hover {
            background: var(--primary);
            color: white;
        }

        /* Toolbar para expresión lógica */
        .logic-expression-toolbar {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-bottom: none;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
            margin-top: 12px;
        }

        .btn-insert-value {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: #fffbeb;
            border: 2px solid #fbbf24;
            border-radius: 6px;
            color: #92400e;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-insert-value:hover {
            background: #fbbf24;
            color: white;
            transform: translateY(-1px);
        }

        .btn-insert-value i {
            font-size: 11px;
        }

        /* Input inline para valores en expresión lógica */
        .inline-value-input-logic {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 4px 8px;
            background: #fffbeb;
            border: 2px solid #fbbf24;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
            animation: slideIn 0.2s ease-out;
        }

        .inline-value-input-logic .inline-value-label {
            color: #d97706;
            font-size: 14px;
        }

        .inline-value-input-logic input {
            border: 1px solid #fbbf24;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 13px;
            font-weight: 600;
            font-family: 'Courier New', monospace;
            width: 150px;
            outline: none;
            transition: all 0.2s;
        }

        .inline-value-input-logic input:focus {
            border-color: #f59e0b;
            box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
        }

        .inline-value-input-logic button {
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .inline-value-input-logic .btn-accept {
            background: #10b981;
            color: white;
        }

        .inline-value-input-logic .btn-accept:hover {
            background: #059669;
        }

        .inline-value-input-logic .btn-cancel {
            background: #ef4444;
            color: white;
        }

        .inline-value-input-logic .btn-cancel:hover {
            background: #dc2626;
        }

        /* Estilos para el constructor de expresión lógica */
        .logic-expression-builder {
            background: white;
            border: 2px solid var(--gray-300);
            border-radius: 0 0 var(--border-radius) var(--border-radius);
            padding: 16px;
            min-height: 80px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            transition: all 0.2s;
        }

        .logic-expression-builder.drag-over {
            background: var(--primary-light);
            border-color: var(--primary);
        }

        .logic-expression-builder .empty {
            width: 100%;
            text-align: center;
            color: var(--gray-500);
            font-size: 13px;
            padding: 20px;
        }

        /* Pills de componentes en la expresión lógica */
        .logic-component {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            font-family: 'Courier New', monospace;
            cursor: default;
            transition: all 0.2s;
        }

        .logic-component .remove-btn {
            background: transparent;
            border: none;
            color: inherit;
            opacity: 0.6;
            cursor: pointer;
            padding: 2px 4px;
            font-size: 10px;
            transition: all 0.2s;
        }

        .logic-component .remove-btn:hover {
            opacity: 1;
            transform: scale(1.2);
        }

        /* Tipo: Variable */
        .logic-component.variable {
            background: linear-gradient(135deg, #eff6ff 0%, white 100%);
            border: 2px solid #3b82f6;
            color: #1e40af;
        }

        /* Tipo: Operador */
        .logic-component.operator {
            background: linear-gradient(135deg, #f0fdf4 0%, white 100%);
            border: 2px solid #10b981;
            color: #065f46;
        }

        /* Tipo: Paréntesis */
        .logic-component.parenthesis {
            background: linear-gradient(135deg, #f5f3ff 0%, white 100%);
            border: 2px solid #8b5cf6;
            color: #5b21b6;
        }

        /* Tipo: Valor (número o texto) */
        .logic-component.value {
            background: linear-gradient(135deg, #fffbeb 0%, white 100%);
            border: 2px solid #fbbf24;
            color: #92400e;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" runat="server">
    <div class="editor-funciones-container">
        <!-- Header -->
        <div class="header">
            <h1><i class="fas fa-calculator" style="color: var(--primary); margin-right: 12px;"></i>Editor de Funciones</h1>
            <p>Configure factores de riesgo con expresiones y condiciones personalizadas</p>
        </div>

        <!-- Main Grid -->
        <div class="main-grid">
            <!-- Panel Izquierdo: Configuración Principal -->
            <div class="card">
                <div class="card-title">Configuración del Factor</div>

                <!-- Nombre y Descripción -->
                <div class="form-group">
                    <label class="form-label">
                        Nombre del Factor de Riesgo <span class="required">*</span>
                    </label>
                    <asp:TextBox 
                        ID="txtNombre" 
                        runat="server" 
                        CssClass="form-input" 
                        placeholder="Ej: KO-EDAD-CALCULADA"
                        MaxLength="100" />
                    <div class="helper-text">
                        <i class="fas fa-info-circle"></i>
                        Identificador único para el factor
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <asp:TextBox
                        ID="txtDescripcion"
                        runat="server"
                        CssClass="form-input"
                        placeholder="Breve descripción del propósito del factor"
                        MaxLength="200" />
                </div>

                <!-- Acciones -->
                <div class="form-row acciones-row">
                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-check-circle" style="color: #10b981; margin-right: 6px;"></i>
                            Acción Aprobado
                        </label>
                        <asp:DropDownList ID="ddlAccionAprobado" runat="server" CssClass="form-select action-select">
                            <asp:ListItem Value="">Seleccione...</asp:ListItem>
                            <asp:ListItem Value="verde">Verde</asp:ListItem>
                            <asp:ListItem Value="rojo">Rojo</asp:ListItem>
                            <asp:ListItem Value="amarillo">Amarillo</asp:ListItem>
                        </asp:DropDownList>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-times-circle" style="color: #ef4444; margin-right: 6px;"></i>
                            Acción Denegado
                        </label>
                        <asp:DropDownList ID="ddlAccionDenegado" runat="server" CssClass="form-select action-select">
                            <asp:ListItem Value="">Seleccione...</asp:ListItem>
                            <asp:ListItem Value="verde">Verde</asp:ListItem>
                            <asp:ListItem Value="rojo">Rojo</asp:ListItem>
                            <asp:ListItem Value="amarillo">Amarillo</asp:ListItem>
                        </asp:DropDownList>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-arrow-right" style="color: var(--primary); margin-right: 6px;"></i>
                            Acción Next
                        </label>
                        <asp:DropDownList ID="ddlAccionNext" runat="server" CssClass="form-select action-select">
                            <asp:ListItem Value="">Seleccione...</asp:ListItem>
                            <asp:ListItem Value="ir_a">Ir a</asp:ListItem>
                        </asp:DropDownList>
                    </div>
                </div>

                <!-- Variables Section con Accordion -->
                <div class="variables-section">
                    <div class="variables-header">
                        <label class="form-label" style="margin: 0;">Variables y Expresiones</label>
                        <span class="variables-count" id="variablesCount">0 variables</span>
                    </div>

                    <div id="variablesContainer">
                        <!-- Las variables se agregan dinámicamente aquí -->
                    </div>

                    <button type="button" class="btn-add-variable" onclick="agregarVariable()">
                        <i class="fas fa-plus"></i>
                        Agregar Variable
                    </button>
                </div>

                <!-- Expresión Lógica Final -->
                <div class="logic-expression">
                    <div class="logic-expression-header">
                        <i class="fas fa-code"></i>
                        <span>Expresión Lógica</span>
                        <span class="badge badge-primary">Resultado final</span>
                    </div>

                    <!-- Input inline para capturar valor (se muestra al arrastrar #valor desde paleta) -->
                    <div class="inline-value-input-logic" id="inlineValueInputLogico" style="display: none;">
                        <span class="inline-value-label"><i class="fas fa-hashtag"></i></span>
                        <input type="text" id="inputValorLogicoExpr" placeholder="Numero o texto..."
                               onkeypress="if(event.key==='Enter') aceptarValorLogicoExpr()">
                        <button type="button" class="btn-accept" onclick="aceptarValorLogicoExpr()" title="Aceptar">
                            <i class="fas fa-check"></i>
                        </button>
                        <button type="button" class="btn-cancel" onclick="cancelarValorLogicoExpr()" title="Cancelar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="logic-expression-builder" id="logicExprBuilder"
                         ondrop="dropIntoLogicExpression(event)"
                         ondragover="allowLogicDrop(event)"
                         ondragleave="dragLogicLeave(event)">
                        <div class="empty">
                            <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                            Arrastra variables y operadores para construir la expresión lógica
                        </div>
                    </div>

                    <!-- Vista previa de la expresión lógica -->
                    <div class="logic-expression-preview">
                        <div class="logic-expression-preview-header">
                            <i class="fas fa-eye"></i>
                            <span>Vista Previa</span>
                        </div>
                        <div class="logic-expression-preview-content" id="logicExpressionPreview">
                            <span class="preview-empty">Sin expresión configurada</span>
                        </div>
                    </div>

                    <div class="helper-text" style="margin-top: 12px;">
                        <i class="fas fa-lightbulb"></i>
                        Esta es la expresión resultante que se evaluará
                    </div>

                    <asp:HiddenField ID="hdnExpresionLogica" runat="server" />
                </div>
            </div>

        </div>

        <!-- Action Bar -->
        <div class="action-bar">
            <div class="action-bar-left">
                <asp:Button 
                    ID="btnGuardar" 
                    runat="server" 
                    Text="Guardar Factor" 
                    CssClass="btn btn-success"
                    OnClick="btnGuardar_Click" />
                <asp:Button 
                    ID="btnCancelar" 
                    runat="server" 
                    Text="Cancelar" 
                    CssClass="btn btn-secondary"
                    OnClick="btnCancelar_Click" />
            </div>
            <div>
                <asp:Button 
                    ID="btnValidar" 
                    runat="server" 
                    Text="Validar Expresión" 
                    CssClass="btn btn-primary"
                    OnClick="btnValidar_Click" />
            </div>
        </div>

        <!-- Contenedor de Factores de Riesgo -->
        <div class="factores-container">
            <div class="factores-header">
                <div class="factores-header-left">
                    <i class="fas fa-project-diagram"></i>
                    <span class="factores-title">Flujo de la Evaluación</span>
                </div>
                <span class="factores-count" id="factoresCount">0</span>
            </div>
            <div class="factores-list" id="factoresList">
                <div class="factores-empty">
                    <i class="fas fa-inbox"></i>
                    <span>No hay factores en el flujo</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Panel lateral de Operadores (siempre visible) -->
    <div class="resources-sidebar">
        <!-- Header del panel -->
        <div class="resources-sidebar-header">
            <div class="resources-sidebar-header-left">
                <i class="fas fa-calculator"></i>
                <span class="resources-sidebar-title">Operadores</span>
            </div>
        </div>

        <!-- Contenido de Operadores -->
        <div class="resources-section-content">
            <!-- Categoría: Aritméticos -->
            <div class="op-category">
                <div class="op-category-header arithmetic">
                    <i class="fas fa-calculator"></i>
                    <span>Aritméticos</span>
                </div>
                <div class="operators-grid">
                    <div class="op-pill arithmetic draggable-operator-item" draggable="true" data-operator="+" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Suma">+</div>
                    <div class="op-pill arithmetic draggable-operator-item" draggable="true" data-operator="-" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Resta">−</div>
                    <div class="op-pill arithmetic draggable-operator-item" draggable="true" data-operator="*" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Multiplicación">×</div>
                    <div class="op-pill arithmetic draggable-operator-item" draggable="true" data-operator="/" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="División">÷</div>
                </div>
            </div>

            <!-- Categoría: Comparación -->
            <div class="op-category">
                <div class="op-category-header comparison">
                    <i class="fas fa-not-equal"></i>
                    <span>Comparación</span>
                </div>
                <div class="operators-grid">
                    <div class="op-pill comparison draggable-operator-item" draggable="true" data-operator=">" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Mayor que">&gt;</div>
                    <div class="op-pill comparison draggable-operator-item" draggable="true" data-operator="<" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Menor que">&lt;</div>
                    <div class="op-pill comparison draggable-operator-item" draggable="true" data-operator="=" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Igual">=</div>
                    <div class="op-pill comparison-outline draggable-operator-item" draggable="true" data-operator=">=" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Mayor o igual">≥</div>
                    <div class="op-pill comparison-outline draggable-operator-item" draggable="true" data-operator="<=" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Menor o igual">≤</div>
                    <div class="op-pill comparison-outline draggable-operator-item" draggable="true" data-operator="!=" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Diferente">≠</div>
                </div>
            </div>

            <!-- Categoría: Lógicos -->
            <div class="op-category">
                <div class="op-category-header logic">
                    <i class="fas fa-code-branch"></i>
                    <span>Lógicos</span>
                </div>
                <div class="operators-grid">
                    <div class="op-pill logic draggable-logic-item" draggable="true" data-operator="AND" data-type="logic" ondragstart="dragLogicOperatorStart(event)" ondragend="dragLogicOperatorEnd(event)" title="Y lógico">AND</div>
                    <div class="op-pill logic draggable-logic-item" draggable="true" data-operator="OR" data-type="logic" ondragstart="dragLogicOperatorStart(event)" ondragend="dragLogicOperatorEnd(event)" title="O lógico">OR</div>
                </div>
            </div>

            <!-- Categoría: Especiales -->
            <div class="op-category">
                <div class="op-category-header special">
                    <i class="fas fa-asterisk"></i>
                    <span>Especiales</span>
                </div>
                <div class="operators-grid">
                    <div class="op-pill special-value draggable-value-item" draggable="true" data-type="value" ondragstart="dragValueStart(event)" ondragend="dragValueEnd(event)" title="Insertar valor">#</div>
                    <div class="op-pill special-parenthesis draggable-parenthesis-item" draggable="true" data-type="parenthesis" data-value="(" ondragstart="dragParenthesisStart(event)" ondragend="dragParenthesisEnd(event)" title="Abrir paréntesis">(</div>
                    <div class="op-pill special-parenthesis draggable-parenthesis-item" draggable="true" data-type="parenthesis" data-value=")" ondragstart="dragParenthesisStart(event)" ondragend="dragParenthesisEnd(event)" title="Cerrar paréntesis">)</div>
                    <div class="op-pill special-where draggable-operator-item" draggable="true" data-operator="where" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)" title="Cláusula where">where</div>
                </div>
            </div>
        </div>

        <!-- Hint -->
        <div class="operators-sidebar-hint">
            <i class="fas fa-lightbulb"></i>
            <span>Arrastra los operadores a las expresiones</span>
        </div>
    </div>

    <!-- Panel lateral de funciones y campos arrastrables -->
    <div class="functions-sidebar">
        <div class="functions-sidebar-header">
            <i class="fas fa-magic"></i>
            <span class="functions-sidebar-title">Funciones</span>
        </div>

        <!-- Búsqueda de funciones -->
        <div class="functions-sidebar-search">
            <input type="text" placeholder="Buscar función..." onkeyup="filterSidebarFunctions(event)">
        </div>
        
        <div class="functions-sidebar-content">
            <div class="function-category-sidebar">
                <div class="function-category-sidebar-title">Agregación</div>
                <div class="draggable-function-item" draggable="true" data-function="Conteo" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-hashtag"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Conteo</div>
                        <div class="draggable-function-desc">Cuenta elementos en una colección</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
                <div class="draggable-function-item" draggable="true" data-function="Máximo" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-arrow-up"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Máximo</div>
                        <div class="draggable-function-desc">Retorna el valor máximo</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
                <div class="draggable-function-item" draggable="true" data-function="Mínimo" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-arrow-down"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Mínimo</div>
                        <div class="draggable-function-desc">Retorna el valor mínimo</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
                <div class="draggable-function-item" draggable="true" data-function="Promedio" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Promedio</div>
                        <div class="draggable-function-desc">Calcula el promedio aritmético</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
                <div class="draggable-function-item" draggable="true" data-function="Suma" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-plus"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Suma</div>
                        <div class="draggable-function-desc">Suma todos los valores</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
            </div>

            <div class="function-category-sidebar">
                <div class="function-category-sidebar-title">Lógica</div>
                <div class="draggable-function-item" draggable="true" data-function="Si entonces" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-code-branch"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Si entonces</div>
                        <div class="draggable-function-desc">Evaluación condicional</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
            </div>

            <div class="function-category-sidebar">
                <div class="function-category-sidebar-title">Texto</div>
                <div class="draggable-function-item" draggable="true" data-function="Conteo caracteres" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-text-width"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Conteo caracteres</div>
                        <div class="draggable-function-desc">Cuenta caracteres en texto</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
                <div class="draggable-function-item" draggable="true" data-function="Expresión regular" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-code"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Expresión regular</div>
                        <div class="draggable-function-desc">Validación con regex</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
            </div>

            <div class="function-category-sidebar">
                <div class="function-category-sidebar-title">Fechas</div>
                <div class="draggable-function-item" draggable="true" data-function="Calcular edad" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-birthday-cake"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Calcular edad</div>
                        <div class="draggable-function-desc">Calcula edad o evalúa condición</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
                <div class="draggable-function-item" draggable="true" data-function="Cualquier fecha" ondragstart="dragFunctionStart(event)" ondragend="dragFunctionEnd(event)">
                    <div class="draggable-function-icon"><i class="fas fa-calendar-alt"></i></div>
                    <div class="draggable-function-content">
                        <div class="draggable-function-name">Cualquier fecha</div>
                        <div class="draggable-function-desc">Operaciones con fechas</div>
                    </div>
                    <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                </div>
            </div>
        </div>

        <div class="functions-sidebar-hint">
            <i class="fas fa-hand-pointer"></i>
            <span>Arrastra una función hacia la zona de expresión</span>
        </div>
    </div>

    <!-- Hidden field para almacenar datos de variables -->
    <asp:HiddenField ID="hfVariablesData" runat="server" />
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="scripts" runat="server">
<!-- ==========================================
     SISTEMA MODULAR DE FUNCIONES (IIFE Pattern)
     Orden: Namespace -> Base -> Registry -> Core -> Funciones -> Editor
     Namespace: EF (Editor Funciones)
     ========================================== -->

<!-- Namespace principal - DEBE SER PRIMERO -->
<script src="Scripts/core/Namespace.js"></script>

<!-- Infraestructura base -->
<script src="Scripts/FunctionBase.js"></script>
<script src="Scripts/FunctionRegistry.js"></script>

<!-- Core modular (drag & drop, navegacion, mini-builders, expresiones, panel config) -->
<script src="Scripts/core/DragDropManager.js"></script>
<script src="Scripts/core/NavigationStack.js"></script>
<script src="Scripts/core/MiniBuilderManager.js"></script>
<script src="Scripts/core/ExpressionBuilder.js"></script>
<script src="Scripts/core/ConfigPanel.js"></script>
<script src="Scripts/core/FunctionCatalog.js"></script>
<script src="Scripts/core/AutocompleteManager.js"></script>
<script src="Scripts/core/LogicExpressionBuilder.js"></script>
<script src="Scripts/core/InputHandlers.js"></script>
<script src="Scripts/core/VariableCardManager.js"></script>

<!-- Funciones modulares (se auto-registran) -->
<script src="Scripts/functions/Minimo.js"></script>
<script src="Scripts/functions/Maximo.js"></script>
<script src="Scripts/functions/Suma.js"></script>
<script src="Scripts/functions/Promedio.js"></script>
<script src="Scripts/functions/Conteo.js"></script>
<script src="Scripts/functions/ConteoCaracteres.js"></script>
<script src="Scripts/functions/DifFechaHoy.js"></script>
<script src="Scripts/functions/ExpresionRegular.js"></script>
<script src="Scripts/functions/SiEntonces.js"></script>
<script src="Scripts/functions/CalcularEdad.js"></script>

<!-- Core del editor (debe ir al final) -->
<script src="Scripts/EditorFunciones.js"></script>

<script>
// ==========================================
// GESTOR DE FACTORES DE RIESGO
// ==========================================
const FactoresManager = (() => {
    'use strict';

    let factoresGuardados = [];
    let factorIdCounter = 1;

    // Serializar variables antes de enviar el formulario
    const serializarVariables = () => {
        const variablesCards = document.querySelectorAll('.variable-card');
        const variables = [];

        variablesCards.forEach((card, index) => {
            const varId = card.id.replace('varCard', '');
            const nameEl = document.getElementById('varName' + varId);
            const exprBuilder = document.getElementById('exprBuilder' + varId);

            // Obtener la expresión del builder
            let expresion = '';
            if (exprBuilder) {
                const components = exprBuilder.querySelectorAll('.expr-component');
                components.forEach(comp => {
                    expresion += comp.getAttribute('data-value') || '';
                });
            }

            // Obtener origen de datos seleccionado
            const origenSelector = card.querySelector('.origen-selector-btn.active');
            let origen = origenSelector ? origenSelector.getAttribute('data-origen') : '';

            // Obtener buró y segmento seleccionados
            const buroCard = card.querySelector('.buro-card.selected');
            const segmentoCard = card.querySelector('.segmento-card.selected');

            variables.push({
                Orden: index + 1,
                Variable: nameEl ? nameEl.textContent : 'Variable ' + varId,
                Funcion: '',
                Origen: origen,
                Expresion: expresion,
                ExpresionCondicional: '',
                ExpresionWhere: '',
                MensajeWhere: '',
                TipoRespuesta: '',
                Buro: buroCard ? buroCard.getAttribute('data-buro') : '',
                Bloque: segmentoCard ? segmentoCard.getAttribute('data-segmento') : '',
                Accion: ''
            });
        });

        // Guardar en el hidden field
        const hfVariablesData = document.getElementById('<%= hfVariablesData.ClientID %>');
        if (hfVariablesData) {
            hfVariablesData.value = JSON.stringify(variables);
        }

        return variables;
    };

    // Agregar factor a la lista visual
    const agregarFactorALista = (factor) => {
        const factoresList = document.getElementById('factoresList');
        const factoresCount = document.getElementById('factoresCount');

        if (!factoresList) return;

        // Remover mensaje de vacío si existe
        const emptyMsg = factoresList.querySelector('.factores-empty');
        if (emptyMsg) emptyMsg.remove();

        const factorHtml = `
            <div class="factor-item" data-factor-id="${factor.id}">
                <div class="factor-item-left">
                    <div class="factor-item-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="factor-item-info">
                        <div class="factor-item-name">${factor.nombre}</div>
                        <div class="factor-item-description">${factor.descripcion || 'Sin descripción'} - ${factor.variablesCount} variable(s)</div>
                    </div>
                </div>
                <div class="factor-item-actions">
                    <button type="button" class="factor-item-btn edit" onclick="FactoresManager.editarFactor(${factor.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="factor-item-btn delete" onclick="FactoresManager.eliminarFactor(${factor.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        factoresList.insertAdjacentHTML('beforeend', factorHtml);

        // Actualizar contador
        if (factoresCount) {
            factoresCount.textContent = factoresGuardados.length;
        }
    };

    // Guardar factor (llamado antes del submit)
    const guardarFactor = () => {
        const txtNombre = document.getElementById('<%= txtNombre.ClientID %>');
        const txtDescripcion = document.getElementById('<%= txtDescripcion.ClientID %>');
        const ddlAccionAprobado = document.getElementById('<%= ddlAccionAprobado.ClientID %>');
        const ddlAccionDenegado = document.getElementById('<%= ddlAccionDenegado.ClientID %>');
        const ddlAccionNext = document.getElementById('<%= ddlAccionNext.ClientID %>');

        if (!txtNombre || !txtNombre.value.trim()) {
            return false;
        }

        const variables = serializarVariables();

        const factor = {
            id: factorIdCounter++,
            nombre: txtNombre.value.trim(),
            descripcion: txtDescripcion ? txtDescripcion.value.trim() : '',
            accionAprobado: ddlAccionAprobado ? ddlAccionAprobado.value : '',
            accionDenegado: ddlAccionDenegado ? ddlAccionDenegado.value : '',
            accionNext: ddlAccionNext ? ddlAccionNext.value : '',
            variables: variables,
            variablesCount: variables.length,
            expresionLogica: document.getElementById('logicExpressionPreview')?.textContent || '',
            fechaCreacion: new Date().toISOString()
        };

        factoresGuardados.push(factor);
        agregarFactorALista(factor);

        // Limpiar formulario después de guardar
        limpiarFormulario();

        return true;
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        const txtNombre = document.getElementById('<%= txtNombre.ClientID %>');
        const txtDescripcion = document.getElementById('<%= txtDescripcion.ClientID %>');
        const ddlAccionAprobado = document.getElementById('<%= ddlAccionAprobado.ClientID %>');
        const ddlAccionDenegado = document.getElementById('<%= ddlAccionDenegado.ClientID %>');
        const ddlAccionNext = document.getElementById('<%= ddlAccionNext.ClientID %>');

        if (txtNombre) txtNombre.value = '';
        if (txtDescripcion) txtDescripcion.value = '';
        if (ddlAccionAprobado) ddlAccionAprobado.selectedIndex = 0;
        if (ddlAccionDenegado) ddlAccionDenegado.selectedIndex = 0;
        if (ddlAccionNext) ddlAccionNext.selectedIndex = 0;

        // Limpiar variables
        const variablesContainer = document.getElementById('variablesContainer');
        if (variablesContainer) variablesContainer.innerHTML = '';

        // Limpiar expresión lógica
        const logicBuilder = document.getElementById('logicExprBuilder');
        if (logicBuilder) {
            logicBuilder.innerHTML = `
                <div class="empty">
                    <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                    Arrastra variables y operadores para construir la expresión lógica
                </div>
            `;
        }

        const logicPreview = document.getElementById('logicExpressionPreview');
        if (logicPreview) {
            logicPreview.innerHTML = '<span class="preview-empty">Sin expresión configurada</span>';
        }

        // Resetear contador de variables
        if (typeof resetVariableCounter === 'function') {
            resetVariableCounter();
        }

        // Actualizar contador visual
        const variablesCount = document.getElementById('variablesCount');
        if (variablesCount) variablesCount.textContent = '0 variables';
    };

    // Editar factor
    const editarFactor = (factorId) => {
        const factor = factoresGuardados.find(f => f.id === factorId);
        if (!factor) return;

        // Cargar datos del factor en el formulario
        const txtNombre = document.getElementById('<%= txtNombre.ClientID %>');
        const txtDescripcion = document.getElementById('<%= txtDescripcion.ClientID %>');
        const ddlAccionAprobado = document.getElementById('<%= ddlAccionAprobado.ClientID %>');
        const ddlAccionDenegado = document.getElementById('<%= ddlAccionDenegado.ClientID %>');
        const ddlAccionNext = document.getElementById('<%= ddlAccionNext.ClientID %>');

        if (txtNombre) txtNombre.value = factor.nombre;
        if (txtDescripcion) txtDescripcion.value = factor.descripcion;
        if (ddlAccionAprobado) ddlAccionAprobado.value = factor.accionAprobado || '';
        if (ddlAccionDenegado) ddlAccionDenegado.value = factor.accionDenegado || '';
        if (ddlAccionNext) ddlAccionNext.value = factor.accionNext || '';

        // Eliminar el factor de la lista (se volverá a agregar al guardar)
        eliminarFactor(factorId, false);

        // Scroll al formulario
        document.querySelector('.card')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Eliminar factor
    const eliminarFactor = (factorId, confirmar = true) => {
        if (confirmar && !confirm('¿Está seguro de eliminar este factor?')) {
            return;
        }

        factoresGuardados = factoresGuardados.filter(f => f.id !== factorId);

        // Remover de la UI
        const factorItem = document.querySelector(`.factor-item[data-factor-id="${factorId}"]`);
        if (factorItem) factorItem.remove();

        // Actualizar contador
        const factoresCount = document.getElementById('factoresCount');
        if (factoresCount) {
            factoresCount.textContent = factoresGuardados.length;
        }

        // Mostrar mensaje vacío si no hay factores
        if (factoresGuardados.length === 0) {
            const factoresList = document.getElementById('factoresList');
            if (factoresList) {
                factoresList.innerHTML = `
                    <div class="factores-empty">
                        <i class="fas fa-inbox"></i>
                        <span>No hay factores en el flujo</span>
                    </div>
                `;
            }
        }
    };

    // Obtener todos los factores
    const obtenerFactores = () => factoresGuardados;

    // API pública
    return {
        serializarVariables,
        guardarFactor,
        editarFactor,
        eliminarFactor,
        obtenerFactores,
        limpiarFormulario
    };
})();

// Interceptar el submit del formulario para serializar variables
document.addEventListener('DOMContentLoaded', function() {
    const btnGuardar = document.getElementById('<%= btnGuardar.ClientID %>');

    if (btnGuardar) {
        btnGuardar.addEventListener('click', function(e) {
            // Serializar variables antes de enviar
            FactoresManager.serializarVariables();

            // Guardar factor en la lista visual (solo si hay nombre)
            const txtNombre = document.getElementById('<%= txtNombre.ClientID %>');
            if (txtNombre && txtNombre.value.trim()) {
                e.preventDefault(); // Prevenir el postback

                if (FactoresManager.guardarFactor()) {
                    // Mostrar mensaje de éxito
                    alert('Factor guardado exitosamente');
                }
            }
        });
    }
});
</script>

</asp:Content>
