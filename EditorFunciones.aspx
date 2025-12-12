<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EditorFunciones.aspx.cs" Inherits="enginevalidator.EditorFunciones" MasterPageFile="~/Site.Master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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
            padding: 24px 0;
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
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 24px;
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
            border: 2px solid var(--gray-200);
            border-radius: var(--border-radius);
            margin-bottom: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .variable-card.expanded {
            border-color: var(--primary);
            box-shadow: var(--shadow-md);
        }

        .variable-card-header {
            padding: 16px;
            background: var(--gray-50);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s;
        }

        .variable-card.expanded .variable-card-header {
            background: var(--primary);
            color: white;
        }

        .variable-card-header:hover {
            background: var(--primary-light);
        }

        .variable-card.expanded .variable-card-header:hover {
            background: var(--primary-dark);
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
            background: white;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            color: var(--gray-600);
        }

        .variable-btn:hover {
            transform: scale(1.1);
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
            display: grid;
            grid-template-columns: 360px 1fr;
            gap: 20px;
            height: 500px;
        }

        .palette-column {
            background: var(--gray-50);
            border-radius: var(--border-radius);
            padding: 16px;
            overflow-y: auto;
            border: 1px solid var(--gray-200);
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
        }

        .field-list-header {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 12px;
            padding: 12px;
            background: white;
            border-bottom: 1px solid var(--gray-200);
            font-size: 12px;
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .field-item {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 12px;
            padding: 10px 12px;
            border-bottom: 1px solid var(--gray-200);
            font-size: 13px;
            transition: background 0.15s;
            cursor: pointer;
        }

        .field-item:hover {
            background: white;
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

        @media (max-width: 1024px) {
            .main-grid {
                grid-template-columns: 1fr;
            }
            
            .variable-fields-grid {
                grid-template-columns: 1fr;
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

        /* Panel lateral fijo de funciones */
        .functions-sidebar {
            position: fixed;
            right: 20px;
            top: 120px;
            width: 320px;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 100;
            max-height: calc(100vh - 140px);
            display: none; /* Oculto por defecto */
            flex-direction: column;
            transition: opacity 0.3s ease-in-out;
        }

        .functions-sidebar-header {
            padding: 16px;
            border-bottom: 2px solid var(--gray-100);
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--gray-50);
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }

        .functions-sidebar-header i {
            color: var(--primary);
            font-size: 18px;
        }

        .functions-sidebar-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--gray-900);
        }

        .functions-sidebar-search {
            padding: 12px 16px;
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

        .function-category-sidebar {
            padding: 12px 16px 8px 16px;
        }

        .function-category-sidebar-title {
            font-size: 11px;
            font-weight: 700;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .draggable-function-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            margin-bottom: 6px;
            background: white;
            border: 2px solid var(--gray-200);
            border-radius: var(--border-radius-sm);
            cursor: grab;
            transition: all 0.2s;
        }

        .draggable-function-item:active {
            cursor: grabbing;
        }

        .draggable-function-item:hover {
            border-color: var(--primary);
            background: var(--primary-light);
            transform: translateX(4px);
        }

        .draggable-function-item.dragging {
            opacity: 0.5;
            transform: scale(0.95);
        }

        .draggable-function-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-light);
            border-radius: 6px;
            color: var(--primary);
            font-size: 14px;
            flex-shrink: 0;
        }

        .draggable-function-content {
            flex: 1;
        }

        .draggable-function-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 2px;
        }

        .draggable-function-desc {
            font-size: 11px;
            color: var(--gray-600);
            line-height: 1.3;
        }

        .drag-handle {
            color: var(--gray-400);
            font-size: 16px;
        }

        /* Hint de arrastre */
        .functions-sidebar-hint {
            padding: 12px 16px;
            background: #eff6ff;
            border-top: 1px solid #dbeafe;
            font-size: 11px;
            color: #1e40af;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .functions-sidebar-hint i {
            color: #3b82f6;
        }

        /* Panel lateral de operadores */
        .operators-sidebar {
            position: fixed;
            right: 360px; /* A la izquierda del panel de funciones */
            top: 120px;
            width: 280px;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 100;
            max-height: calc(100vh - 140px);
            display: none;
            flex-direction: column;
            transition: opacity 0.3s ease-in-out;
        }

        .operators-sidebar-header {
            padding: 16px;
            border-bottom: 2px solid var(--gray-100);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fef3c7;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }

        .operators-sidebar-header-left {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .operators-sidebar-header i {
            color: #f59e0b;
            font-size: 18px;
        }

        .operators-sidebar-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--gray-900);
        }

        .operators-sidebar-close {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid var(--gray-300);
            border-radius: 4px;
            cursor: pointer;
            color: var(--gray-600);
            transition: all 0.2s;
        }

        .operators-sidebar-close:hover {
            background: var(--gray-100);
            color: var(--gray-900);
        }

        .operators-sidebar-content {
            padding: 16px;
            overflow-y: auto;
            flex: 1;
        }

        .operators-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .draggable-operator-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 16px 12px;
            background: white;
            border: 2px solid #fbbf24;
            border-radius: var(--border-radius-sm);
            cursor: grab;
            transition: all 0.2s;
            min-height: 80px;
        }

        .draggable-operator-item:active {
            cursor: grabbing;
        }

        .draggable-operator-item:hover {
            border-color: #f59e0b;
            background: #fef3c7;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(245, 158, 11, 0.2);
        }

        .draggable-operator-item.dragging {
            opacity: 0.5;
            transform: scale(0.95);
        }

        .draggable-operator-symbol {
            font-size: 24px;
            font-weight: 700;
            color: #92400e;
            font-family: 'Courier New', monospace;
        }

        .draggable-operator-name {
            font-size: 11px;
            font-weight: 600;
            color: #92400e;
            text-align: center;
        }

        .operators-sidebar-hint {
            padding: 12px 16px;
            background: #fef3c7;
            border-top: 1px solid #fde68a;
            font-size: 11px;
            color: #92400e;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .operators-sidebar-hint i {
            color: #f59e0b;
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

                <!-- Función y Origen -->
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Función <span class="required">*</span></label>
                        <asp:DropDownList ID="ddlFuncion" runat="server" CssClass="form-select">
                            <asp:ListItem Value="">Seleccione...</asp:ListItem>
                            <asp:ListItem Value="expresion">Expresión Avanzada Recurrente</asp:ListItem>
                            <asp:ListItem Value="simple">Expresión Simple</asp:ListItem>
                            <asp:ListItem Value="lookup">Búsqueda en Tabla</asp:ListItem>
                        </asp:DropDownList>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Origen de Datos</label>
                        <asp:DropDownList ID="ddlOrigen" runat="server" CssClass="form-select">
                            <asp:ListItem Value="">Seleccione...</asp:ListItem>
                            <asp:ListItem Value="producto">Campos del Producto</asp:ListItem>
                            <asp:ListItem Value="cliente">Campos del Cliente</asp:ListItem>
                            <asp:ListItem Value="bureau">Datos de Buró</asp:ListItem>
                        </asp:DropDownList>
                    </div>
                </div>

                <!-- Operador Comparativo -->
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Operador Comparativo</label>
                        <asp:DropDownList ID="ddlOperador" runat="server" CssClass="form-select">
                            <asp:ListItem Value="">Ninguno</asp:ListItem>
                            <asp:ListItem Value=">">&gt; Mayor que</asp:ListItem>
                            <asp:ListItem Value=">=">&gt;= Mayor o igual</asp:ListItem>
                            <asp:ListItem Value="<">&lt; Menor que</asp:ListItem>
                            <asp:ListItem Value="<=">&lt;= Menor o igual</asp:ListItem>
                            <asp:ListItem Value="=">=  Igual</asp:ListItem>
                            <asp:ListItem Value="!=">!= Diferente</asp:ListItem>
                        </asp:DropDownList>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Valor Comparativo</label>
                        <asp:TextBox 
                            ID="txtValorComparativo" 
                            runat="server" 
                            CssClass="form-input" 
                            placeholder="Ingrese valor a comparar" />
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
                    <div class="logic-expression-content">
                        <asp:Label ID="lblExpresionLogica" runat="server" Text="[EDAD] > 21" />
                    </div>
                    <div class="helper-text" style="margin-top: 8px;">
                        <i class="fas fa-lightbulb"></i>
                        Esta es la expresión resultante que se evaluará
                    </div>
                </div>
            </div>

            <!-- Panel Derecho: Campos Disponibles -->
            <div class="card">
                <div class="card-title">
                    Campos Disponibles
                    <span class="badge badge-primary" style="float: right;">
                        <asp:Label ID="lblCantidadCampos" runat="server" Text="0" /> campos
                    </span>
                </div>

                <div class="form-group">
                    <label class="form-label">Segmento</label>
                    <asp:DropDownList 
                        ID="ddlSegmentos" 
                        runat="server" 
                        CssClass="form-select"
                        AutoPostBack="True"
                        OnSelectedIndexChanged="ddlSegmentos_SelectedIndexChanged">
                    </asp:DropDownList>
                </div>

                <div class="field-list">
                    <div class="field-list-header">
                        <div>Campo</div>
                        <div>Descripción</div>
                    </div>
                    <asp:Repeater ID="rptCampos" runat="server">
                        <ItemTemplate>
                            <div class="field-item" onclick="insertarCampo('<%# Eval("Campo") %>')">
                                <div class="field-name"><%# Eval("Campo") %></div>
                                <div class="field-description"><%# Eval("Descripcion") %></div>
                            </div>
                        </ItemTemplate>
                    </asp:Repeater>
                </div>

                <div class="helper-text" style="margin-top: 12px;">
                    <i class="fas fa-mouse-pointer"></i>
                    Haga clic en un campo para insertarlo en la expresión
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
    </div>

    <!-- Panel lateral de funciones arrastrables -->
    <div class="functions-sidebar">
        <div class="functions-sidebar-header">
            <i class="fas fa-function"></i>
            <span class="functions-sidebar-title">Funciones Disponibles</span>
        </div>
        
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

    <!-- Panel lateral de operadores arrastrables -->
    <div class="operators-sidebar">
        <div class="operators-sidebar-header">
            <div class="operators-sidebar-header-left">
                <i class="fas fa-calculator"></i>
                <span class="operators-sidebar-title">Operadores</span>
            </div>
            <div class="operators-sidebar-close" onclick="closeOperatorsSidebar()">
                <i class="fas fa-times"></i>
            </div>
        </div>
        
        <div class="operators-sidebar-content">
            <div class="operators-grid">
                <!-- Operadores Aritméticos -->
                <div class="draggable-operator-item" draggable="true" data-operator="+" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">+</div>
                    <div class="draggable-operator-name">Suma</div>
                </div>
                <div class="draggable-operator-item" draggable="true" data-operator="-" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">−</div>
                    <div class="draggable-operator-name">Resta</div>
                </div>
                <div class="draggable-operator-item" draggable="true" data-operator="*" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">×</div>
                    <div class="draggable-operator-name">Multiplicación</div>
                </div>
                <div class="draggable-operator-item" draggable="true" data-operator="/" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">÷</div>
                    <div class="draggable-operator-name">División</div>
                </div>
                
                <!-- Operadores de Comparación -->
                <div class="draggable-operator-item" draggable="true" data-operator=">" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">&gt;</div>
                    <div class="draggable-operator-name">Mayor que</div>
                </div>
                <div class="draggable-operator-item" draggable="true" data-operator="<" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">&lt;</div>
                    <div class="draggable-operator-name">Menor que</div>
                </div>
                <div class="draggable-operator-item" draggable="true" data-operator=">=" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">≥</div>
                    <div class="draggable-operator-name">Mayor o igual</div>
                </div>
                <div class="draggable-operator-item" draggable="true" data-operator="<=" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">≤</div>
                    <div class="draggable-operator-name">Menor o igual</div>
                </div>
                <div class="draggable-operator-item" draggable="true" data-operator="=" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">=</div>
                    <div class="draggable-operator-name">Igual</div>
                </div>
                <div class="draggable-operator-item" draggable="true" data-operator="!=" ondragstart="dragOperatorStart(event)" ondragend="dragOperatorEnd(event)">
                    <div class="draggable-operator-symbol">≠</div>
                    <div class="draggable-operator-name">Diferente</div>
                </div>
            </div>
        </div>

        <div class="operators-sidebar-hint">
            <i class="fas fa-hand-pointer"></i>
            <span>Arrastra un operador hacia la zona de expresión</span>
        </div>
    </div>

    <!-- Hidden field para almacenar datos de variables -->
    <asp:HiddenField ID="hfVariablesData" runat="server" />
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="scripts" runat="server">
    <script>
        let variablesCounter = 0;
        let activeInput = null;
        let currentExpandedCard = null;
        let autocompletePopup = null;
        let selectedAutocompleteIndex = -1;
        let expressionComponents = {}; // Almacena componentes por variable: {varId: [components]}
        let componentCounter = 0;
        let draggedFunctionName = null; // Para almacenar qué función se está arrastrando
        let draggedOperator = null; // Para almacenar qué operador se está arrastrando
        let targetVarId = null; // Para almacenar a qué variable se soltó

        // ===== DRAG & DROP DE OPERADORES DESDE SIDEBAR =====

        function dragOperatorStart(event) {
            const operatorSymbol = event.target.closest('.draggable-operator-item').getAttribute('data-operator');
            draggedOperator = operatorSymbol;
            event.dataTransfer.effectAllowed = 'copy';
            event.dataTransfer.setData('text/plain', operatorSymbol);
            event.target.closest('.draggable-operator-item').classList.add('dragging');
        }

        function dragOperatorEnd(event) {
            // Limpiar estado visual cuando termina el drag (soltado en cualquier lugar)
            event.target.closest('.draggable-operator-item').classList.remove('dragging');
            draggedOperator = null;
        }

        function allowOperatorDrop(event, varId) {
            event.preventDefault();
            event.currentTarget.classList.add('drag-over');
            targetVarId = varId;
        }

        function dragOperatorLeave(event) {
            event.currentTarget.classList.remove('drag-over');
        }

        function dropOperator(event, varId) {
            event.preventDefault();
            event.currentTarget.classList.remove('drag-over');

            // Remover clase dragging
            document.querySelectorAll('.draggable-operator-item.dragging').forEach(item => {
                item.classList.remove('dragging');
            });

            if (!draggedOperator) return;

            // Agregar operador directamente al constructor visual
            addExprComponent(varId, 'operator', draggedOperator, `<span class="expr-value">${draggedOperator}</span>`);

            // Limpiar
            draggedOperator = null;
            targetVarId = null;
        }

        // ===== FUNCIONES UNIFICADAS PARA MANEJAR TODOS LOS DROPS =====

        function allowItemDrop(event, varId) {
            event.preventDefault();
            event.currentTarget.classList.add('drag-over');
            targetVarId = varId;
        }

        function dragItemLeave(event) {
            event.currentTarget.classList.remove('drag-over');
        }

        function dropItem(event, varId) {
            event.preventDefault();
            event.currentTarget.classList.remove('drag-over');

            // Remover clase dragging de todos los items
            document.querySelectorAll('.draggable-function-item.dragging, .draggable-operator-item.dragging').forEach(item => {
                item.classList.remove('dragging');
            });

            // Manejar drop de función
            if (draggedFunctionName) {
                const builder = document.getElementById('exprBuilder' + varId);
                if (builder) {
                    const tempInput = document.createElement('textarea');
                    tempInput.style.display = 'none';
                    builder.appendChild(tempInput);

                    activeInput = tempInput;
                    activeInput.varId = varId;
                }

                openFunctionModal(draggedFunctionName, activeInput);
                draggedFunctionName = null;
                targetVarId = null;
                return;
            }

            // Manejar drop de operador
            if (draggedOperator) {
                addExprComponent(varId, 'operator', draggedOperator, `<span class="expr-value">${draggedOperator}</span>`);
                draggedOperator = null;
                targetVarId = null;
                return;
            }
        }

        function closeOperatorsSidebar() {
            const sidebar = document.querySelector('.operators-sidebar');
            if (sidebar) {
                sidebar.style.display = 'none';
            }
        }

        // ===== DRAG & DROP DE FUNCIONES DESDE SIDEBAR =====

        function dragFunctionStart(event) {
            const functionName = event.target.closest('.draggable-function-item').getAttribute('data-function');
            draggedFunctionName = functionName;
            event.dataTransfer.effectAllowed = 'copy';
            event.dataTransfer.setData('text/plain', functionName);
            event.target.closest('.draggable-function-item').classList.add('dragging');
        }

        function dragFunctionEnd(event) {
            // Limpiar estado visual cuando termina el drag (soltado en cualquier lugar)
            event.target.closest('.draggable-function-item').classList.remove('dragging');
            draggedFunctionName = null;
        }

        function allowFunctionDrop(event, varId) {
            event.preventDefault();
            event.currentTarget.classList.add('drag-over');
            targetVarId = varId;
        }

        function dragFunctionLeave(event) {
            event.currentTarget.classList.remove('drag-over');
        }

        function dropFunction(event, varId) {
            event.preventDefault();
            event.currentTarget.classList.remove('drag-over');

            // Remover clase dragging de todos los items
            document.querySelectorAll('.draggable-function-item.dragging').forEach(item => {
                item.classList.remove('dragging');
            });

            if (!draggedFunctionName) return;

            // Establecer contexto para el constructor visual
            const builder = document.getElementById('exprBuilder' + varId);
            if (builder) {
                const tempInput = document.createElement('textarea');
                tempInput.style.display = 'none';
                builder.appendChild(tempInput);

                activeInput = tempInput;
                activeInput.varId = varId;
            }

            // Abrir modal inmediatamente con la función
            openFunctionModal(draggedFunctionName, activeInput);

            // Limpiar
            draggedFunctionName = null;
            targetVarId = null;
        }

        // Filtrar funciones en sidebar
        function filterSidebarFunctions(event) {
            const query = event.target.value.toLowerCase();
            const items = document.querySelectorAll('.draggable-function-item');

            items.forEach(item => {
                const name = item.querySelector('.draggable-function-name').textContent.toLowerCase();
                const desc = item.querySelector('.draggable-function-desc').textContent.toLowerCase();

                if (name.includes(query) || desc.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Inicializar componentes de expresión para una variable
        function initExpressionComponents(varId) {
            if (!expressionComponents[varId]) {
                expressionComponents[varId] = [];
            }
        }

        // ===== CONSTRUCTOR VISUAL DE EXPRESIONES =====

        // Abrir selector de funciones
        function openFunctionSelector(varId) {
            const builder = document.getElementById('exprBuilder' + varId);
            const tempInput = document.createElement('textarea');
            tempInput.style.display = 'none';
            builder.appendChild(tempInput);

            activeInput = tempInput;
            activeInput.varId = varId;

            const card = builder.closest('.variable-card');
            const functionMenu = card.querySelector('.function-menu');
            if (functionMenu) {
                // Cerrar todos los otros menús
                document.querySelectorAll('.function-menu.active').forEach(m => m.classList.remove('active'));

                // Abrir este menú
                functionMenu.classList.add('active');

                // Hacer scroll hasta el menú de funciones con animación suave
                setTimeout(() => {
                    const functionMenuContainer = card.querySelector('.function-menu-container');
                    if (functionMenuContainer) {
                        functionMenuContainer.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });

                        // Efecto visual de destacar el menú
                        functionMenu.style.animation = 'pulse 0.5s ease-in-out';
                        setTimeout(() => {
                            functionMenu.style.animation = '';
                        }, 500);
                    }
                }, 100);
            }
        }

        // Abrir selector de campos
        function openFieldSelector(varId) {
            const fields = getAvailableFields();
            if (fields.length === 0) {
                alert('⚠️ No hay campos disponibles\n\nAsegúrese de que existen campos configurados en el sistema.');
                return;
            }

            let fieldOptions = '📊 SELECCIONAR CAMPO\n\n';
            fieldOptions += 'Campos disponibles:\n\n';
            fields.forEach((f, i) => {
                fieldOptions += `  ${i + 1}. ${f.name}${f.description ? ' - ' + f.description : ''}\n`;
            });
            fieldOptions += '\n💡 Ingrese el número del campo:';

            const fieldName = prompt(fieldOptions);
            if (fieldName) {
                const fieldIndex = parseInt(fieldName) - 1;
                if (fieldIndex >= 0 && fieldIndex < fields.length) {
                    addExprComponent(varId, 'field', `[${fields[fieldIndex].name}]`, `<i class="fas fa-database expr-icon"></i><span class="expr-value">[${fields[fieldIndex].name}]</span>`);
                } else {
                    alert('❌ Número inválido\n\nPor favor ingrese un número entre 1 y ' + fields.length);
                }
            }
        }

        // Abrir selector de operadores
        // Abrir panel lateral de operadores
        function openOperatorSelector(varId) {
            const sidebar = document.querySelector('.operators-sidebar');
            if (sidebar) {
                sidebar.style.display = 'flex';
            }

            // Ocultar panel de funciones si está abierto
            const functionsSidebar = document.querySelector('.functions-sidebar');
            if (functionsSidebar) {
                functionsSidebar.style.display = 'none';
            }
        }

        // Agregar componente de valor
        function addValueComponent(varId) {
            const value = prompt('🔢 INGRESAR VALOR\n\nIngrese el valor:\n\nEjemplos:\n  • Número: 18, 25, 100\n  • Texto: "APROBADO", "RECHAZADO"\n  • Decimal: 3.14, 0.5\n\n💡 Ingrese el valor:');
            if (value !== null && value.trim() !== '') {
                const displayValue = value.trim();
                addExprComponent(varId, 'value', displayValue, `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${displayValue}</span>`);
            }
        }

        // Agregar paréntesis
        function addParenthesis(varId, type) {
            const choice = prompt('() SELECCIONAR PARÉNTESIS\n\nOpciones:\n\n  1. ( Abrir paréntesis\n  2. ) Cerrar paréntesis\n\n💡 Ingrese el número:');
            if (choice === '1') {
                addExprComponent(varId, 'parenthesis', '(', '<span class="expr-value">(</span>');
            } else if (choice === '2') {
                addExprComponent(varId, 'parenthesis', ')', '<span class="expr-value">)</span>');
            } else if (choice !== null && choice.trim() !== '') {
                alert('❌ Opción inválida\n\nPor favor ingrese 1 o 2');
            }
        }

        // Agregar componente a la expresión
        function addExprComponent(varId, type, value, html, metadata = null) {
            initExpressionComponents(varId);
            const componentId = 'comp_' + (++componentCounter);
            const component = {
                id: componentId,
                type: type,
                value: value,
                html: html,
                order: expressionComponents[varId].length,
                metadata: metadata // Guardar metadata para funciones (nombre, bloques, etc)
            };
            expressionComponents[varId].push(component);
            renderExpression(varId);
            updateExpressionPreview(varId);
        }

        // Renderizar expresión visual
        function renderExpression(varId) {
            const builder = document.getElementById('exprBuilder' + varId);
            if (!builder) return;

            initExpressionComponents(varId);
            const components = expressionComponents[varId];

            if (components.length === 0) {
                builder.classList.add('empty');
                builder.innerHTML = '<div class="empty"><i class="fas fa-puzzle-piece" style="margin-right: 8px;"></i>Arrastra componentes aquí para construir la expresión</div>';
                return;
            }

            builder.classList.remove('empty');
            let html = '<div class="expression-components">';
            components.forEach((comp, index) => {
                html += `<div class="expr-component" data-type="${comp.type}" data-comp-id="${comp.id}"><div class="expr-content">${comp.html}</div><div class="expr-actions">`;
                if (comp.type === 'function') html += `<button type="button" class="expr-btn edit" onclick="editExprComponent('${comp.id}', ${varId})" title="Editar"><i class="fas fa-edit"></i></button>`;
                if (comp.type === 'value') html += `<button type="button" class="expr-btn edit" onclick="editExprValue('${comp.id}', ${varId})" title="Editar"><i class="fas fa-edit"></i></button>`;
                html += `<button type="button" class="expr-btn delete" onclick="deleteExprComponent('${comp.id}', ${varId})" title="Eliminar"><i class="fas fa-trash"></i></button></div></div>`;
            });
            html += '</div>';
            builder.innerHTML = html;
        }

        // Eliminar componente
        // Eliminar componente con confirmación
        function deleteExprComponent(compId, varId) {
            initExpressionComponents(varId);
            const comp = expressionComponents[varId].find(c => c.id === compId);
            if (!comp) return;

            // Tipos simples que NO requieren confirmación
            const simpleTypes = ['operator', 'value', 'parenthesis'];

            if (simpleTypes.includes(comp.type)) {
                // Eliminar directamente sin confirmación
                expressionComponents[varId] = expressionComponents[varId].filter(c => c.id !== compId);
                renderExpression(varId);
                updateExpressionPreview(varId);
                return;
            }

            // Para funciones y campos, pedir confirmación
            const componentTypes = {
                'function': '📅 Función',
                'field': '📊 Campo'
            };

            const typeLabel = componentTypes[comp.type] || comp.type;
            const shortValue = comp.value.length > 30 ? comp.value.substring(0, 27) + '...' : comp.value;

            let mensaje = `¿Eliminar este componente?\n\n`;
            mensaje += `Tipo: ${typeLabel}\n`;
            mensaje += `Valor: ${shortValue}`;

            if (comp.type === 'function' && comp.metadata) {
                mensaje += `\n\n⚠️ Esta función tiene ${comp.metadata.blocks ? comp.metadata.blocks.length : 0} bloque(s) configurado(s)`;
            }

            if (confirm(mensaje)) {
                expressionComponents[varId] = expressionComponents[varId].filter(c => c.id !== compId);
                renderExpression(varId);
                updateExpressionPreview(varId);
            }
        }

        // Editar valor de componente
        function editExprValue(compId, varId) {
            initExpressionComponents(varId);
            const comp = expressionComponents[varId].find(c => c.id === compId);
            if (!comp) return;
            const newValue = prompt('Editar valor:', comp.value);
            if (newValue !== null && newValue.trim() !== '') {
                comp.value = newValue.trim();
                comp.html = `<i class="fas fa-hashtag expr-icon"></i><span class="expr-value">${newValue.trim()}</span>`;
                renderExpression(varId);
                updateExpressionPreview(varId);
            }
        }

        // Editar componente de función
        // Editar componente de función (reabre el modal con los bloques cargados)
        function editExprComponent(compId, varId) {
            initExpressionComponents(varId);
            const comp = expressionComponents[varId].find(c => c.id === compId);
            if (!comp || comp.type !== 'function') return;

            // Guardar referencia para actualizar después
            window.editingComponent = { compId, varId };

            // Si tiene metadata (bloques guardados), recargarlos
            if (comp.metadata && comp.metadata.functionName && comp.metadata.blocks) {
                const builder = document.getElementById('exprBuilder' + varId);
                const tempInput = document.createElement('textarea');
                tempInput.style.display = 'none';
                builder.appendChild(tempInput);

                activeInput = tempInput;
                activeInput.varId = varId;
                activeInput.editMode = true; // Marcar que estamos en modo edición

                // Abrir modal con la función
                openFunctionModal(comp.metadata.functionName, tempInput);

                // Esperar a que el modal se renderice y luego cargar los bloques
                setTimeout(() => {
                    loadBlocksIntoModal(comp.metadata.blocks);
                }, 300);
            } else {
                // Fallback: intentar parsear la función del texto
                alert('No se puede editar esta función. Por favor elimínela y créela de nuevo.');
            }
        }

        // Cargar bloques guardados en el modal para edición
        function loadBlocksIntoModal(blocks) {
            if (!blocks || blocks.length === 0) return;

            // Limpiar bloques actuales
            droppedBlocks = [];

            // Recargar cada bloque
            blocks.forEach(block => {
                droppedBlocks.push({
                    id: 'block_' + Date.now() + '_' + Math.random(),
                    type: block.type,
                    value: block.value,
                    order: block.order
                });
            });

            // Renderizar bloques en el modal
            renderBlocks();
            updateBlockPreview();
        }


        // Actualizar preview de la expresión
        function updateExpressionPreview(varId) {
            initExpressionComponents(varId);
            const components = expressionComponents[varId];
            let exprText = '';
            components.forEach(comp => {
                if (comp.type === 'field' || comp.type === 'value' || comp.type === 'function' || comp.type === 'parenthesis') {
                    exprText += comp.value;
                } else if (comp.type === 'operator') {
                    exprText += ' ' + comp.value + ' ';
                }
            });
            updatePreview(varId, 'expr', exprText);
        }

        // Drag & drop para expresiones
        function allowExprDrop(event) {
            event.preventDefault();
            event.currentTarget.classList.add('drag-over');
        }

        function dragExprLeave(event) {
            event.currentTarget.classList.remove('drag-over');
        }

        function dropExprComponent(event, varId) {
            event.preventDefault();
            event.currentTarget.classList.remove('drag-over');
        }

        // ===== FIN CONSTRUCTOR VISUAL =====

        // Catálogo de funciones con sus parámetros
        const functionCatalog = {
            'CalculaEdad': {
                icon: 'fa-birthday-cake',
                name: 'Calcular Edad',
                desc: 'Calcula la edad en años desde una fecha de nacimiento. Si especificas operador y valor, retorna true/false.',
                params: [
                    { name: 'campo_fecha', type: 'field', required: true, hint: 'Campo con fecha de nacimiento' },
                    { name: 'operador', type: 'select', required: false, hint: 'Operador de comparación (vacío para solo calcular)', options: ['', '>', '<', '>=', '<=', '=', '!='] },
                    { name: 'valor', type: 'text', required: false, hint: 'Valor a comparar (ej: 18). Dejar vacío si no usas operador' },
                    { name: 'formato', type: 'select', required: true, hint: 'Formato de año', options: ['YYYY', 'YY'] }
                ],
                template: '#CalculaEdad([?campo_fecha],[?operador],[?valor],[?formato])#'
            },
            'SiEntonces': {
                icon: 'fa-code-branch',
                name: 'Si Entonces',
                desc: 'Evaluación condicional - retorna un valor si la condición es verdadera, otro si es falsa',
                params: [
                    { name: 'condicion', type: 'text', required: true, hint: 'Expresión lógica a evaluar' },
                    { name: 'valor_verdadero', type: 'text', required: true, hint: 'Valor si es verdadero' },
                    { name: 'valor_falso', type: 'text', required: true, hint: 'Valor si es falso' }
                ],
                template: '#SiEntonces([?condicion], [?valor_verdadero], [?valor_falso])#'
            },
            'Conteo': {
                icon: 'fa-hashtag',
                name: 'Conteo',
                desc: 'Cuenta elementos en una colección',
                params: [
                    { name: 'campo', type: 'field', required: true, hint: 'Campo a contar' }
                ],
                template: '#Conteo([?campo])#'
            },
            'Maximo': {
                icon: 'fa-arrow-up',
                name: 'Máximo',
                desc: 'Retorna el valor máximo de una colección',
                params: [
                    { name: 'campo', type: 'field', required: true, hint: 'Campo a evaluar' }
                ],
                template: '#Maximo([?campo])#'
            },
            'Minimo': {
                icon: 'fa-arrow-down',
                name: 'Mínimo',
                desc: 'Retorna el valor mínimo de una colección',
                params: [
                    { name: 'campo', type: 'field', required: true, hint: 'Campo a evaluar' }
                ],
                template: '#Minimo([?campo])#'
            },
            'Promedio': {
                icon: 'fa-chart-line',
                name: 'Promedio',
                desc: 'Calcula el promedio aritmético',
                params: [
                    { name: 'campo', type: 'field', required: true, hint: 'Campo a promediar' }
                ],
                template: '#Promedio([?campo])#'
            },
            'Suma': {
                icon: 'fa-plus',
                name: 'Suma',
                desc: 'Suma todos los valores',
                params: [
                    { name: 'campo', type: 'field', required: true, hint: 'Campo a sumar' }
                ],
                template: '#Suma([?campo])#'
            },
            'ConteoCaracteres': {
                icon: 'fa-text-width',
                name: 'Conteo Caracteres',
                desc: 'Cuenta la cantidad de caracteres en un texto',
                params: [
                    { name: 'campo', type: 'field', required: true, hint: 'Campo de texto' }
                ],
                template: '#ConteoCaracteres([?campo])#'
            },
            'ExpresionRegular': {
                icon: 'fa-code',
                name: 'Expresión Regular',
                desc: 'Validación de texto con expresión regular',
                params: [
                    { name: 'campo', type: 'field', required: true, hint: 'Campo a validar' },
                    { name: 'patron', type: 'text', required: true, hint: 'Patrón regex' }
                ],
                template: '#ExpresionRegular([?campo], [?patron])#'
            },
            'CualquierFecha': {
                icon: 'fa-calendar-alt',
                name: 'Cualquier Fecha',
                desc: 'Operaciones con fechas',
                params: [
                    { name: 'campo', type: 'field', required: true, hint: 'Campo de fecha' },
                    { name: 'operacion', type: 'text', required: false, hint: 'Operación (ej: +30 días)' }
                ],
                template: '#CualquierFecha([?campo], [?operacion])#'
            }
        };

        // Crear popup de autocompletado
        function createAutocompletePopup() {
            if (autocompletePopup) return;

            autocompletePopup = document.createElement('div');
            autocompletePopup.className = 'autocomplete-popup';
            autocompletePopup.id = 'autocompletePopup';
            document.body.appendChild(autocompletePopup);

            // Click fuera cierra el popup
            document.addEventListener('click', function (e) {
                if (autocompletePopup && !autocompletePopup.contains(e.target) && e.target !== activeInput) {
                    hideAutocomplete();
                }
            });
        }

        function agregarVariable() {
            variablesCounter++;
            const container = document.getElementById('variablesContainer');

            const card = document.createElement('div');
            card.className = 'variable-card';
            card.id = 'varCard' + variablesCounter;
            card.innerHTML = `
                <div class="variable-card-header" onclick="toggleCard(${variablesCounter})">
                    <div class="variable-card-content">
                        <div class="variable-number">${variablesCounter}</div>
                        <div class="variable-info">
                            <div class="variable-name-preview" id="varName${variablesCounter}">Variable ${variablesCounter}</div>
                            <div class="variable-expression-preview" id="varExpr${variablesCounter}">Sin expresión configurada</div>
                        </div>
                    </div>
                    <div class="variable-card-actions" onclick="event.stopPropagation();">
                        <button type="button" class="variable-btn expand" onclick="toggleCard(${variablesCounter})">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <button type="button" class="variable-btn delete" onclick="eliminarVariable(${variablesCounter})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="variable-card-body">
                    <div class="variable-field">
                        <div class="variable-field-label">Nombre de la Variable</div>
                        <input type="text" class="variable-field-input" placeholder="Ej: EDAD" 
                               onkeyup="updatePreview(${variablesCounter}, 'name', this.value)"
                               onfocus="activeInput = this"
                               style="font-family: inherit;">
                    </div>
                    
                    <div class="variable-fields-grid">
                        <div class="variable-field">
                            <div class="variable-field-label">Función</div>
                            <select class="variable-field-input" style="font-family: inherit;">
                                <option value="expresion">Expresión</option>
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
                        <div class="variable-field-label">Expresión</div>
                        <div class="expression-builder" id="exprBuilder${variablesCounter}" 
                             ondrop="dropItem(event, ${variablesCounter})" 
                             ondragover="allowItemDrop(event, ${variablesCounter})" 
                             ondragleave="dragItemLeave(event)">
                            <div class="empty">
                                <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                                Arrastra funciones u operadores o usa los componentes
                            </div>
                        </div>
                        
                        <div class="component-palette">
                            <div class="component-palette-title">
                                <i class="fas fa-cubes"></i>
                                Componentes Disponibles
                            </div>
                            <div class="component-palette-items">
                                <div class="component-palette-item" data-type="field" onclick="openFieldSelector(${variablesCounter})">
                                    <i class="fas fa-database"></i>
                                    Campo
                                </div>
                                <div class="component-palette-item" data-type="value" onclick="addValueComponent(${variablesCounter})">
                                    <i class="fas fa-hashtag"></i>
                                    Valor
                                </div>
                                <div class="component-palette-item" data-type="parenthesis" onclick="addParenthesis(${variablesCounter}, '(')">
                                    <i class="fas fa-bracket-curly"></i>
                                    ( )
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="variable-field">
                        <div class="variable-field-label">Expresión Condicional</div>
                        <textarea class="variable-field-input" rows="2" placeholder="Condición opcional"
                                  onfocus="activeInput = this"></textarea>
                    </div>

                    <div class="variable-fields-grid">
                        <div class="variable-field">
                            <div class="variable-field-label">Expresión WHERE</div>
                            <input type="text" class="variable-field-input" placeholder="Opcional"
                                   onfocus="activeInput = this">
                        </div>
                        <div class="variable-field">
                            <div class="variable-field-label">Mensaje WHERE</div>
                            <input type="text" class="variable-field-input" placeholder="Opcional"
                                   onfocus="activeInput = this">
                        </div>
                    </div>

                    <div class="variable-fields-grid">
                        <div class="variable-field">
                            <div class="variable-field-label">Tipo Respuesta</div>
                            <select class="variable-field-input" style="font-family: inherit;">
                                <option value="numerico">Numérico</option>
                                <option value="texto">Texto</option>
                                <option value="booleano">Booleano</option>
                            </select>
                        </div>
                        <div class="variable-field">
                            <div class="variable-field-label">Buró</div>
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
                            <div class="variable-field-label">Acción</div>
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

            // Inicializar constructor visual para esta variable
            initExpressionComponents(variablesCounter);

            // Auto-expandir la nueva variable (y cerrar otras)
            setTimeout(() => {
                toggleCard(variablesCounter);
            }, 100);
        }

        // ACCORDION: Solo una variable abierta a la vez
        function toggleCard(id) {
            const card = document.getElementById('varCard' + id);
            const functionsSidebar = document.querySelector('.functions-sidebar');
            const operatorsSidebar = document.querySelector('.operators-sidebar');

            // Si esta card ya está expandida, cerrarla
            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                currentExpandedCard = null;

                // Ocultar ambos paneles laterales
                if (functionsSidebar) {
                    functionsSidebar.style.display = 'none';
                }
                if (operatorsSidebar) {
                    operatorsSidebar.style.display = 'none';
                }
                return;
            }

            // Cerrar la card actualmente expandida
            if (currentExpandedCard) {
                const prevCard = document.getElementById('varCard' + currentExpandedCard);
                if (prevCard) {
                    prevCard.classList.remove('expanded');
                }
            }

            // Expandir la nueva card
            card.classList.add('expanded');
            currentExpandedCard = id;

            // Mostrar ambos paneles laterales
            if (functionsSidebar) {
                functionsSidebar.style.display = 'flex';
            }
            if (operatorsSidebar) {
                operatorsSidebar.style.display = 'flex';
            }

            // Scroll suave a la card expandida
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }

        function eliminarVariable(id) {
            // Obtener información de la variable antes de eliminar
            const card = document.getElementById('varCard' + id);
            if (!card) return;

            const nameInput = card.querySelector('input[placeholder="Nombre de la variable"]');
            const varName = nameInput ? nameInput.value.trim() : '';
            const displayName = varName || 'Variable ' + id;

            // Contar componentes de expresión
            initExpressionComponents(id);
            const components = expressionComponents[id] || [];
            const componentCount = components.length;

            // Construir mensaje de confirmación detallado
            let mensaje = `⚠️ ¿Está seguro de eliminar esta variable?\n\n`;
            mensaje += `📝 Variable: ${displayName}\n`;

            if (componentCount > 0) {
                mensaje += `🧩 Componentes: ${componentCount} elemento(s) configurado(s)\n`;

                // Mostrar preview de componentes
                const componentTypes = {
                    'function': '📅 Función',
                    'field': '📊 Campo',
                    'operator': '➕ Operador',
                    'value': '🔢 Valor',
                    'parenthesis': '() Paréntesis'
                };

                const summary = components.slice(0, 3).map(c => {
                    const typeLabel = componentTypes[c.type] || c.type;
                    const shortValue = c.value.length > 20 ? c.value.substring(0, 17) + '...' : c.value;
                    return `   • ${typeLabel}: ${shortValue}`;
                }).join('\n');

                mensaje += '\nContenido:\n' + summary;
                if (componentCount > 3) {
                    mensaje += `\n   ... y ${componentCount - 3} más`;
                }
            } else {
                mensaje += `📭 Sin componentes configurados\n`;
            }

            mensaje += `\n\n⚠️ Esta acción no se puede deshacer.`;

            if (confirm(mensaje)) {
                card.remove();

                if (currentExpandedCard === id) {
                    currentExpandedCard = null;

                    // Ocultar ambos paneles laterales si se elimina la variable expandida
                    const functionsSidebar = document.querySelector('.functions-sidebar');
                    const operatorsSidebar = document.querySelector('.operators-sidebar');
                    if (functionsSidebar) {
                        functionsSidebar.style.display = 'none';
                    }
                    if (operatorsSidebar) {
                        operatorsSidebar.style.display = 'none';
                    }
                }

                // Limpiar componentes de expresión
                delete expressionComponents[id];

                updateVariablesCount();
            }
        }

        function updatePreview(id, type, value) {
            if (type === 'name') {
                const nameEl = document.getElementById('varName' + id);
                nameEl.textContent = value || 'Variable ' + id;
            } else if (type === 'expr') {
                const exprEl = document.getElementById('varExpr' + id);
                exprEl.textContent = value || 'Sin expresión configurada';
            }
        }

        function updateVariablesCount() {
            const count = document.querySelectorAll('.variable-card').length;
            document.getElementById('variablesCount').textContent = count + ' variable' + (count !== 1 ? 's' : '');
        }

        function insertarCampo(campo) {
            if (activeInput) {
                const start = activeInput.selectionStart;
                const end = activeInput.selectionEnd;
                const text = activeInput.value;

                activeInput.value = text.substring(0, start) + '[' + campo + ']' + text.substring(end);
                activeInput.focus();
                activeInput.selectionStart = activeInput.selectionEnd = start + campo.length + 2;

                // Actualizar preview si es el campo de expresión
                const card = activeInput.closest('.variable-card');
                if (card) {
                    const cardId = card.id.replace('varCard', '');
                    updatePreview(cardId, 'expr', activeInput.value);
                }
            } else {
                alert('Por favor, haga clic en un campo de texto antes de insertar un campo.');
            }
        }

        // Track del input activo
        document.addEventListener('DOMContentLoaded', function () {
            // Crear modal dinámicamente
            createModalInBody();

            // Crear popup de autocompletado
            createAutocompletePopup();

            document.addEventListener('focus', function (e) {
                if (e.target.classList.contains('variable-field-input') ||
                    e.target.tagName === 'TEXTAREA' && e.target.classList.contains('variable-field-input')) {
                    activeInput = e.target;
                }
            }, true);
        });

        // Mostrar autocompletado
        function showAutocomplete(input, query) {
            if (!autocompletePopup) return;

            // Filtrar funciones según el query
            const filtered = Object.keys(functionCatalog).filter(key => {
                const func = functionCatalog[key];
                return key.toLowerCase().includes(query.toLowerCase()) ||
                    func.name.toLowerCase().includes(query.toLowerCase());
            });

            if (filtered.length === 0) {
                hideAutocomplete();
                return;
            }

            // Generar HTML del popup
            let html = '<div class="autocomplete-header">Funciones disponibles</div>';

            filtered.forEach((key, index) => {
                const func = functionCatalog[key];
                const paramList = func.params.map(p => p.name).join(', ');

                html += `
                    <div class="autocomplete-item ${index === 0 ? 'selected' : ''}" data-function="${key}" data-index="${index}">
                        <i class="fas ${func.icon} autocomplete-item-icon"></i>
                        <div class="autocomplete-item-content">
                            <div class="autocomplete-item-name">${func.name}</div>
                            <div class="autocomplete-item-desc">${func.desc}</div>
                            <div class="autocomplete-item-params">${paramList}</div>
                        </div>
                    </div>
                `;
            });

            html += '<div class="autocomplete-hint"><i class="fas fa-lightbulb"></i>Presiona Enter para insertar o Esc para cerrar</div>';

            autocompletePopup.innerHTML = html;

            // Posicionar el popup
            const rect = input.getBoundingClientRect();
            const caretPos = getCaretCoordinates(input);

            autocompletePopup.style.position = 'fixed';
            autocompletePopup.style.left = (rect.left + caretPos.left) + 'px';
            autocompletePopup.style.top = (rect.top + caretPos.top + 20) + 'px';

            // Ajustar si se sale de la pantalla
            const popupRect = autocompletePopup.getBoundingClientRect();
            if (popupRect.right > window.innerWidth) {
                autocompletePopup.style.left = (window.innerWidth - popupRect.width - 20) + 'px';
            }
            if (popupRect.bottom > window.innerHeight) {
                autocompletePopup.style.top = (rect.top + caretPos.top - popupRect.height - 10) + 'px';
            }

            autocompletePopup.classList.add('active');
            selectedAutocompleteIndex = 0;

            // Event listeners para los items
            autocompletePopup.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', function () {
                    const funcKey = this.getAttribute('data-function');
                    insertFunctionTemplate(funcKey, input);
                });
            });
        }

        // Ocultar autocompletado
        function hideAutocomplete() {
            if (autocompletePopup) {
                autocompletePopup.classList.remove('active');
                selectedAutocompleteIndex = -1;
            }
        }

        // Obtener coordenadas del cursor en un textarea
        function getCaretCoordinates(element) {
            const position = element.selectionStart;
            const div = document.createElement('div');
            const style = getComputedStyle(element);

            div.style.position = 'absolute';
            div.style.visibility = 'hidden';
            div.style.whiteSpace = 'pre-wrap';
            div.style.font = style.font;
            div.style.padding = style.padding;
            div.style.width = style.width;

            const text = element.value.substring(0, position);
            div.textContent = text;

            const span = document.createElement('span');
            span.textContent = element.value.substring(position) || '.';
            div.appendChild(span);

            document.body.appendChild(div);
            const coordinates = {
                left: span.offsetLeft,
                top: span.offsetTop
            };
            document.body.removeChild(div);

            return coordinates;
        }

        // Navegar con teclado en el autocompletado
        function navigateAutocomplete(direction) {
            if (!autocompletePopup || !autocompletePopup.classList.contains('active')) return;

            const items = autocompletePopup.querySelectorAll('.autocomplete-item');
            if (items.length === 0) return;

            // Remover selección actual
            items[selectedAutocompleteIndex]?.classList.remove('selected');

            // Calcular nuevo índice
            if (direction === 'down') {
                selectedAutocompleteIndex = (selectedAutocompleteIndex + 1) % items.length;
            } else if (direction === 'up') {
                selectedAutocompleteIndex = selectedAutocompleteIndex <= 0 ? items.length - 1 : selectedAutocompleteIndex - 1;
            }

            // Agregar selección nueva
            items[selectedAutocompleteIndex].classList.add('selected');
            items[selectedAutocompleteIndex].scrollIntoView({ block: 'nearest' });
        }

        // Seleccionar función del autocompletado
        function selectAutocompleteItem() {
            if (!autocompletePopup || !autocompletePopup.classList.contains('active')) return false;

            const selectedItem = autocompletePopup.querySelector('.autocomplete-item.selected');
            if (selectedItem) {
                const funcKey = selectedItem.getAttribute('data-function');
                insertFunctionTemplate(funcKey, activeInput);
                return true;
            }
            return false;
        }

        // Insertar plantilla de función - ABRE EL MODAL CON BLOQUES
        function insertFunctionTemplate(funcKey, input) {
            const func = functionCatalog[funcKey];
            if (!func) return;

            // Guardar la posición donde se debe insertar
            const text = input.value;
            const cursorPos = input.selectionStart;

            // Buscar hacia atrás desde el cursor para encontrar el #
            let hashPos = cursorPos - 1;
            while (hashPos >= 0 && text[hashPos] !== '#') {
                hashPos--;
            }

            if (hashPos >= 0) {
                // Eliminar el # y texto parcial que escribió el usuario
                input.value = text.substring(0, hashPos) + text.substring(cursorPos);
                input.selectionStart = input.selectionEnd = hashPos;
            }

            hideAutocomplete();

            // Mapear nombres del catálogo a nombres del modal
            const modalFunctionNames = {
                'CalculaEdad': 'Calcular edad',
                'SiEntonces': 'Si entonces',
                'Conteo': 'Conteo',
                'Maximo': 'Máximo',
                'Minimo': 'Mínimo',
                'Promedio': 'Promedio',
                'Suma': 'Suma',
                'ConteoCaracteres': 'Conteo caracteres',
                'ExpresionRegular': 'Expresión regular',
                'CualquierFecha': 'Cualquier fecha'
            };

            const modalFunctionName = modalFunctionNames[funcKey] || func.name;

            // Abrir el modal configurador (ahora con bloques para CalculaEdad)
            openFunctionModal(modalFunctionName, input);
        }

        // Función legacy para compatibilidad con menú de funciones
        function insertFunction(functionName, varId) {
            // Si se proporciona varId, establecer el contexto del constructor visual
            if (varId) {
                const builder = document.getElementById('exprBuilder' + varId);
                if (builder) {
                    // Crear input temporal para establecer contexto
                    const tempInput = document.createElement('textarea');
                    tempInput.style.display = 'none';
                    builder.appendChild(tempInput);

                    activeInput = tempInput;
                    activeInput.varId = varId;
                }
            }

            if (!activeInput) {
                alert('Por favor, haga clic en un campo de expresión antes de seleccionar una función.');
                return;
            }

            // Cerrar todos los menús de funciones
            document.querySelectorAll('.function-menu.active').forEach(menu => {
                menu.classList.remove('active');
            });

            // Abrir modal con configuración de la función
            openFunctionModal(functionName, activeInput);
        }

        // Manejar el input en tiempo real para detectar #
        function handleInputChange(e) {
            const input = e.target;
            const text = input.value;
            const cursorPos = input.selectionStart;

            // Detectar si el usuario está escribiendo después de #
            if (cursorPos > 0) {
                let hashPos = cursorPos - 1;

                // Buscar hacia atrás hasta encontrar # o espacio/salto de línea
                while (hashPos >= 0 && text[hashPos] !== '#' && text[hashPos] !== ' ' && text[hashPos] !== '\n') {
                    hashPos--;
                }

                if (hashPos >= 0 && text[hashPos] === '#') {
                    // Extraer el query después de #
                    const query = text.substring(hashPos + 1, cursorPos);

                    // Solo mostrar autocompletado si hay al menos 1 caracter o es solo #
                    if (query.length >= 0) {
                        showAutocomplete(input, query);
                    }
                } else {
                    hideAutocomplete();
                }
            } else {
                hideAutocomplete();
            }
        }

        // Manejar teclas especiales
        function handleKeyDown(e) {
            const input = e.target;

            // Si el autocompletado está activo
            if (autocompletePopup && autocompletePopup.classList.contains('active')) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    navigateAutocomplete('down');
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    navigateAutocomplete('up');
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectAutocompleteItem()) {
                        return;
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    hideAutocomplete();
                }
            }
        }

        // Agregar event listeners a los textareas de expresión
        function attachAutocompleteListeners(textarea) {
            textarea.addEventListener('input', handleInputChange);
            textarea.addEventListener('keydown', handleKeyDown);
        }
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.function-menu-container')) {
                document.querySelectorAll('.function-menu.active').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });

        // Toggle del menú de funciones (específico por tarjeta)
        function toggleFunctionMenu(event, cardId) {
            event.preventDefault();
            event.stopPropagation();

            const menu = document.getElementById('functionMenu' + cardId);
            const wasActive = menu.classList.contains('active');

            // Cerrar todos los otros menús
            document.querySelectorAll('.function-menu.active').forEach(m => {
                m.classList.remove('active');
            });

            // Toggle el menú actual
            if (!wasActive) {
                menu.classList.add('active');
            }
        }

        // Filtrar funciones en el menú (específico por tarjeta)
        function filterFunctions(cardId) {
            const menu = document.getElementById('functionMenu' + cardId);
            const searchInput = menu.querySelector('.function-menu-search input');
            const filter = searchInput.value.toLowerCase();
            const items = menu.querySelectorAll('.function-item');

            items.forEach(item => {
                const keywords = item.getAttribute('data-keywords') || '';
                const name = item.querySelector('.function-item-name').textContent.toLowerCase();
                const desc = item.querySelector('.function-item-desc').textContent.toLowerCase();

                if (keywords.includes(filter) || name.includes(filter) || desc.includes(filter)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Ocultar categorías vacías
            const categories = menu.querySelectorAll('.function-category');
            categories.forEach(category => {
                const visibleItems = category.querySelectorAll('.function-item:not(.hidden)');
                category.style.display = visibleItems.length > 0 ? 'block' : 'none';
            });
        }

        // Variables para el modal
        let currentFunction = null;
        let availableFields = [];
        let droppedBlocks = [];
        let draggedElement = null;

        // Generar items de campos para la paleta
        function generateFieldPaletteItems() {
            let html = '';
            availableFields.forEach(field => {
                html += `<div class="palette-item" data-type="field" data-value="${field.name}" draggable="true" ondragstart="dragStart(event)">${field.name}</div>`;
            });
            if (availableFields.length === 0) {
                html = '<div style="color: var(--gray-500); font-size: 13px;">No hay campos disponibles</div>';
            }
            return html;
        }

        // Iniciar arrastre
        function dragStart(event) {
            draggedElement = event.target;
            event.dataTransfer.effectAllowed = 'copy';
            event.dataTransfer.setData('text/html', event.target.innerHTML);
            event.dataTransfer.setData('type', event.target.getAttribute('data-type'));
            event.dataTransfer.setData('value', event.target.getAttribute('data-value'));

            setTimeout(() => {
                event.target.classList.add('dragging');
            }, 0);
        }

        // Permitir drop
        function allowDrop(event) {
            event.preventDefault();
            const dropZone = document.getElementById('dropZone');
            dropZone.classList.add('drag-over');
        }

        // Salir de zona de drop
        function dragLeave(event) {
            const dropZone = document.getElementById('dropZone');
            if (event.target === dropZone) {
                dropZone.classList.remove('drag-over');
            }
        }

        // Soltar bloque
        function dropBlock(event) {
            event.preventDefault();
            const dropZone = document.getElementById('dropZone');
            dropZone.classList.remove('drag-over');

            const type = event.dataTransfer.getData('type');
            const value = event.dataTransfer.getData('value');

            if (!type || !value) return;

            // Remover el placeholder "empty" si existe
            const emptyDiv = dropZone.querySelector('.empty');
            if (emptyDiv) {
                emptyDiv.remove();
            }

            // Crear bloque
            const blockId = 'block_' + Date.now();
            const block = {
                id: blockId,
                type: type,
                value: value,
                order: droppedBlocks.length
            };

            droppedBlocks.push(block);

            // Renderizar bloques
            renderBlocks();
            updateBlockPreview();

            // Limpiar clase dragging
            if (draggedElement) {
                draggedElement.classList.remove('dragging');
                draggedElement = null;
            }
        }

        // Renderizar bloques en la zona de drop
        function renderBlocks() {
            const dropZone = document.getElementById('dropZone');

            if (droppedBlocks.length === 0) {
                dropZone.innerHTML = `
                    <div class="empty">
                        <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                        Arrastra los bloques aquí para construir la función
                    </div>
                `;
                return;
            }

            // Ordenar bloques
            droppedBlocks.sort((a, b) => a.order - b.order);

            let html = '';
            droppedBlocks.forEach((block, index) => {
                const labels = {
                    'field': 'Campo',
                    'operator': 'Operador',
                    'value': 'Valor',
                    'format': 'Formato'
                };

                html += `
                    <div class="param-block" data-type="${block.type}" data-block-id="${block.id}" draggable="true" ondragstart="dragBlockStart(event, '${block.id}')">
                        <div class="param-block-number">${index + 1}</div>
                        <div class="param-block-content">
                            <div class="param-block-label">${labels[block.type]}</div>
                            <div class="param-block-value">${block.value}</div>
                        </div>
                        <div class="param-block-actions">
                            ${block.type === 'value' ? `<button type="button" class="param-block-btn edit" onclick="editBlockValue('${block.id}')" title="Editar"><i class="fas fa-edit"></i></button>` : ''}
                            <button type="button" class="param-block-btn delete" onclick="deleteBlock('${block.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });

            dropZone.innerHTML = html;
        }

        // Eliminar bloque
        function deleteBlock(blockId) {
            droppedBlocks = droppedBlocks.filter(b => b.id !== blockId);
            renderBlocks();
            updateBlockPreview();
        }

        // Editar valor de bloque
        function editBlockValue(blockId) {
            const block = droppedBlocks.find(b => b.id === blockId);
            if (!block) return;

            const newValue = prompt('Ingrese el nuevo valor:', block.value);
            if (newValue !== null && newValue.trim() !== '') {
                block.value = newValue.trim();
                renderBlocks();
                updateBlockPreview();
            }
        }

        // Editar valor en paleta
        function editPaletteValue(element) {
            const currentValue = element.getAttribute('data-value');
            const newValue = prompt('Ingrese el valor personalizado:', currentValue);
            if (newValue !== null && newValue.trim() !== '') {
                element.setAttribute('data-value', newValue.trim());
                element.textContent = newValue.trim();
            }
        }

        // Agregar valor personalizado
        function addCustomValue() {
            const value = prompt('Ingrese el valor numérico:');
            if (value !== null && value.trim() !== '') {
                const paletteItems = document.querySelector('.palette-section:nth-child(3) .palette-items');
                const newItem = document.createElement('div');
                newItem.className = 'palette-item';
                newItem.setAttribute('data-type', 'value');
                newItem.setAttribute('data-value', value.trim());
                newItem.setAttribute('draggable', 'true');
                newItem.ondragstart = dragStart;
                newItem.onclick = function () { editPaletteValue(this); };
                newItem.textContent = value.trim();
                paletteItems.insertBefore(newItem, paletteItems.lastElementChild);
            }
        }

        // Arrastrar bloque existente para reordenar
        let draggedBlockId = null;

        function dragBlockStart(event, blockId) {
            draggedBlockId = blockId;
            event.dataTransfer.effectAllowed = 'move';
            event.target.classList.add('dragging');
        }

        // Actualizar preview de bloques
        function updateBlockPreview() {
            const previewEl = document.getElementById('modalPreviewCode');
            if (!previewEl) return;

            // Extraer parámetros de los bloques
            const campo = droppedBlocks.find(b => b.type === 'field')?.value || '';
            const operador = droppedBlocks.find(b => b.type === 'operator')?.value || '';
            const valor = droppedBlocks.find(b => b.type === 'value')?.value || '';
            const formato = droppedBlocks.find(b => b.type === 'format')?.value || 'YYYY';

            const campoStr = campo ? '[' + campo + ']' : '[]';
            const operadorStr = operador ? '[' + operador + ']' : '[]';
            const valorStr = valor ? '[' + valor + ']' : '[]';
            const formatoStr = '[' + formato + ']';

            const preview = `#CalculaEdad(${campoStr},${operadorStr},${valorStr},${formatoStr})#`;
            previewEl.textContent = preview;
        }

        // Crear modal y agregarlo directamente al body
        function createModalInBody() {
            if (document.getElementById('functionModalOverlay')) {
                return;
            }

            const overlay = document.createElement('div');
            overlay.id = 'functionModalOverlay';
            overlay.className = 'function-modal-overlay';

            overlay.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.5) !important;
                display: none !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 2147483647 !important;
                backdrop-filter: blur(4px) !important;
            `;

            overlay.innerHTML = `
                <div class="function-modal" onclick="event.stopPropagation()" style="background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 90%; max-width: 900px; max-height: 90vh; overflow: hidden; position: relative; z-index: 2147483647;">
                    <div style="padding: 24px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700;">
                            <i class="fas fa-magic" id="modalIcon"></i>
                            <span id="modalTitle">Configurar Función</span>
                        </div>
                        <button type="button" onclick="closeFunctionModal()" style="width: 36px; height: 36px; border: none; background: rgba(255, 255, 255, 0.2); color: white; border-radius: 8px; cursor: pointer;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="modalBody" style="padding: 24px; max-height: calc(90vh - 180px); overflow-y: auto;">
                        <!-- Los parámetros se cargan dinámicamente aquí -->
                    </div>
                    <div style="padding: 20px 24px; background: var(--gray-50); border-top: 1px solid var(--gray-200); display: flex; justify-content: flex-end; gap: 12px;">
                        <button type="button" onclick="closeFunctionModal()" style="padding: 10px 24px; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; background: white; color: var(--gray-700);">
                            Cancelar
                        </button>
                        <button type="button" onclick="insertFunctionFromModal()" style="padding: 10px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <i class="fas fa-check"></i> Insertar Función
                        </button>
                    </div>
                </div>
            `;

            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) {
                    closeFunctionModal();
                }
            });

            document.body.appendChild(overlay);
        }

        // Abrir modal de configuración
        function openFunctionModal(functionName, input) {
            // Si se pasa un input, establecerlo como activo
            if (input) {
                activeInput = input;
            }

            currentFunction = functionName;
            const modal = document.getElementById('functionModalOverlay');

            if (!modal) {
                createModalInBody();
                setTimeout(() => openFunctionModal(functionName), 100);
                return;
            }

            const modalBody = document.getElementById('modalBody');
            const modalTitle = document.getElementById('modalTitle');
            const modalIcon = document.getElementById('modalIcon');

            const icons = {
                'Conteo': 'fa-hashtag',
                'Máximo': 'fa-arrow-up',
                'Mínimo': 'fa-arrow-down',
                'Promedio': 'fa-chart-line',
                'Suma': 'fa-plus',
                'Si entonces': 'fa-code-branch',
                'Conteo caracteres': 'fa-text-width',
                'Expresión regular': 'fa-code',
                'Calcular edad': 'fa-birthday-cake',
                'Cualquier fecha': 'fa-calendar-alt'
            };

            modalTitle.textContent = functionName;
            modalIcon.className = 'fas ' + (icons[functionName] || 'fa-magic');

            availableFields = getAvailableFields();
            modalBody.innerHTML = generateFunctionForm(functionName);

            // Si es Calcular edad, inicializar el sistema de bloques
            if (functionName === 'Calcular edad') {
                droppedBlocks = [];
                updateBlockPreview();
            } else {
                // Para otras funciones, agregar event listeners normales
                setTimeout(() => {
                    const inputs = modalBody.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => {
                        input.addEventListener('input', updateModalPreview);
                        input.addEventListener('change', updateModalPreview);
                    });
                    updateModalPreview();
                }, 100);
            }

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // Cerrar modal
        function closeFunctionModal() {
            const modal = document.getElementById('functionModalOverlay');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }

        // Obtener campos disponibles
        function getAvailableFields() {
            const fields = [];
            document.querySelectorAll('.field-item').forEach(item => {
                const name = item.querySelector('.field-name')?.textContent;
                const desc = item.querySelector('.field-description')?.textContent;
                if (name) fields.push({ name, desc });
            });
            return fields;
        }

        // Generar opciones de campos
        function generateFieldOptions() {
            let options = '<option value="">-- Seleccione un campo --</option>';
            availableFields.forEach(field => {
                options += `<option value="${field.name}">${field.name} - ${field.desc}</option>`;
            });
            return options;
        }

        // Generar formulario según la función (código extenso - lo resumo)
        function generateFunctionForm(functionName) {
            let html = '';
            const modalParamStyle = 'margin-bottom: 20px;';
            const labelStyle = 'display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;';
            const inputStyle = 'width: 100%; padding: 10px 14px; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 14px; font-family: "Courier New", monospace;';
            const selectStyle = 'width: 100%; padding: 10px 14px; border: 2px solid var(--gray-300); border-radius: 8px; font-size: 14px;';

            switch (functionName) {
                case 'Calcular edad':
                    html = `
                        <div class="two-column-layout">
                            <!-- COLUMNA IZQUIERDA: Paleta -->
                            <div class="palette-column">
                                <div class="elements-palette">
                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-database" style="color: #3b82f6;"></i>
                                            Campos
                                        </div>
                                        <div class="palette-items" id="fieldsContainer">
                                            ${generateFieldPaletteItems()}
                                        </div>
                                    </div>

                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-calculator" style="color: #8b5cf6;"></i>
                                            Operadores
                                        </div>
                                        <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">Opcional - para retornar true/false</div>
                                        <div class="palette-items">
                                            <div class="palette-item" data-type="operator" data-value=">" draggable="true" ondragstart="dragStart(event)">&gt;</div>
                                            <div class="palette-item" data-type="operator" data-value="<" draggable="true" ondragstart="dragStart(event)">&lt;</div>
                                            <div class="palette-item" data-type="operator" data-value=">=" draggable="true" ondragstart="dragStart(event)">&gt;=</div>
                                            <div class="palette-item" data-type="operator" data-value="<=" draggable="true" ondragstart="dragStart(event)">&lt;=</div>
                                            <div class="palette-item" data-type="operator" data-value="=" draggable="true" ondragstart="dragStart(event)">=</div>
                                            <div class="palette-item" data-type="operator" data-value="!=" draggable="true" ondragstart="dragStart(event)">!=</div>
                                        </div>
                                    </div>

                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-sort-numeric-up" style="color: #10b981;"></i>
                                            Valores
                                        </div>
                                        <div style="font-size: 10px; color: var(--gray-500); margin-bottom: 8px;">Click para editar</div>
                                        <div class="palette-items">
                                            <div class="palette-item" data-type="value" data-value="18" draggable="true" ondragstart="dragStart(event)" onclick="editPaletteValue(this)">18</div>
                                            <div class="palette-item" data-type="value" data-value="21" draggable="true" ondragstart="dragStart(event)" onclick="editPaletteValue(this)">21</div>
                                            <div class="palette-item" data-type="value" data-value="65" draggable="true" ondragstart="dragStart(event)" onclick="editPaletteValue(this)">65</div>
                                            <button type="button" onclick="addCustomValue()" style="padding: 6px 10px; background: var(--primary-light); border: 2px solid var(--primary); border-radius: 6px; color: var(--primary-dark); font-weight: 600; cursor: pointer; font-size: 11px;">
                                                <i class="fas fa-plus"></i> +
                                            </button>
                                        </div>
                                    </div>

                                    <div class="palette-section">
                                        <div class="palette-title">
                                            <i class="fas fa-calendar" style="color: #f59e0b;"></i>
                                            Formato
                                        </div>
                                        <div class="palette-items">
                                            <div class="palette-item" data-type="format" data-value="YYYY" draggable="true" ondragstart="dragStart(event)">YYYY</div>
                                            <div class="palette-item" data-type="format" data-value="YY" draggable="true" ondragstart="dragStart(event)">YY</div>
                                        </div>
                                    </div>
                                </div>

                                <div style="background: var(--primary-light); border-left: 3px solid var(--primary); padding: 10px; border-radius: 6px; margin-top: 16px; font-size: 11px; color: var(--gray-700); line-height: 1.5;">
                                    <strong style="color: var(--primary-dark);">💡 CÓMO USAR</strong><br>
                                    <strong>1️⃣</strong> Arrastra campo → Calcula edad<br>
                                    <strong>2️⃣</strong> + Operador + Valor → true/false<br>
                                    <strong>3️⃣</strong> Agrega formato (YYYY/YY)
                                </div>
                            </div>

                            <!-- COLUMNA DERECHA: Zona de Drop + Preview -->
                            <div class="drop-column">
                                <div>
                                    <div class="block-builder-label">
                                        <i class="fas fa-cubes"></i> Zona de Construcción
                                    </div>
                                    <div class="drop-zone" id="dropZone" ondrop="dropBlock(event)" ondragover="allowDrop(event)" ondragleave="dragLeave(event)">
                                        <div class="empty">
                                            <i class="fas fa-hand-pointer" style="margin-right: 8px;"></i>
                                            Arrastra bloques aquí para construir la función
                                        </div>
                                    </div>
                                </div>

                                <div class="preview-section">
                                    <div class="preview-label">Vista Previa</div>
                                    <div class="preview-code" id="modalPreviewCode">#CalculaEdad([],[],[],[YYYY])#</div>
                                </div>
                            </div>
                        </div>
                    `;
                    break;
                case 'Si entonces':
                    html = `
                        <div style="${modalParamStyle}">
                            <label style="${labelStyle}">Condición <span style="color: var(--danger);">*</span></label>
                            <textarea style="${inputStyle}" id="param1" rows="2" placeholder="Ej: [EDAD] > 18"></textarea>
                        </div>
                        <div style="${modalParamStyle}">
                            <label style="${labelStyle}">Valor si es Verdadero <span style="color: var(--danger);">*</span></label>
                            <input type="text" style="${inputStyle}" id="param2" placeholder='Ej: "APROBADO"'>
                        </div>
                        <div style="${modalParamStyle}">
                            <label style="${labelStyle}">Valor si es Falso <span style="color: var(--danger);">*</span></label>
                            <input type="text" style="${inputStyle}" id="param3" placeholder='Ej: "RECHAZADO"'>
                        </div>
                    `;
                    break;
                default:
                    html = `
                        <div style="${modalParamStyle}">
                            <label style="${labelStyle}">Campo o Expresión <span style="color: var(--danger);">*</span></label>
                            <select style="${selectStyle}" id="param1">${generateFieldOptions()}</select>
                        </div>
                    `;
            }

            html += `
                <div style="background: var(--gray-900); border-radius: 8px; padding: 16px; margin-top: 24px;">
                    <div style="font-size: 11px; font-weight: 600; color: var(--gray-400); margin-bottom: 8px;">VISTA PREVIA</div>
                    <div id="modalPreviewCode" style="font-family: 'Courier New', monospace; font-size: 13px; color: #a6e22e;">#${functionName}()#</div>
                </div>
            `;

            return html;
        }

        // Actualizar preview del modal
        function updateModalPreview() {
            const previewEl = document.getElementById('modalPreviewCode');
            if (!previewEl || !currentFunction) return;

            const params = [];
            let i = 1;
            let param;

            while (param = document.getElementById('param' + i)) {
                let value = param.value.trim();
                if (param.tagName === 'SELECT' && value) {
                    value = '[' + value + ']';
                }
                params.push(value || '');
                i++;
            }

            let preview = '';
            switch (currentFunction) {
                case 'Calcular edad':
                    // param1 = campo (field)
                    // param2 = operador (select)
                    // param3 = valor (text)
                    // param4 = formato (select)
                    const campo = params[0] || '[]';
                    const operador = params[1] ? '[' + params[1] + ']' : '[]';
                    const valor = params[2] ? '[' + params[2] + ']' : '[]';
                    const formato = params[3] || '[YYYY]';
                    preview = `#CalculaEdad(${campo},${operador},${valor},${formato})#`;
                    break;
                case 'Si entonces':
                    preview = `#SiEntonces(${params[0] || 'condicion'}, ${params[1] || 'valorVerdadero'}, ${params[2] || 'valorFalso'})#`;
                    break;
                default:
                    preview = `#${currentFunction}(${params[0] || '[]'})#`;
            }

            previewEl.textContent = preview;
        }

        // Insertar función desde el modal
        function insertFunctionFromModal() {
            const preview = document.getElementById('modalPreviewCode').textContent;

            if (activeInput && activeInput.varId) {
                const varId = activeInput.varId;
                const icon = '<i class="fas fa-function expr-icon"></i>';
                const shortPreview = preview.length > 40 ? preview.substring(0, 37) + '...' : preview;

                // Preparar metadata con los bloques y nombre de función
                const metadata = {
                    functionName: currentFunction,
                    blocks: droppedBlocks.map(b => ({ type: b.type, value: b.value, order: b.order }))
                };

                // Verificar si estamos editando un componente existente
                if (activeInput.editMode && window.editingComponent) {
                    // Modo edición: actualizar el componente existente
                    initExpressionComponents(varId);
                    const comp = expressionComponents[varId].find(c => c.id === window.editingComponent.compId);
                    if (comp) {
                        comp.value = preview;
                        comp.html = `${icon}<span class="expr-value">${shortPreview}</span>`;
                        comp.metadata = metadata;
                        renderExpression(varId);
                        updateExpressionPreview(varId);
                    }
                    window.editingComponent = null;
                } else {
                    // Modo inserción: crear nuevo componente
                    addExprComponent(varId, 'function', preview, `${icon}<span class="expr-value">${shortPreview}</span>`, metadata);
                }

                // Remover el input temporal
                activeInput.remove();
                activeInput = null;
            } else if (activeInput) {
                // Fallback al comportamiento anterior
                insertAtCursor(activeInput, preview);

                const card = activeInput.closest('.variable-card');
                if (card) {
                    const cardId = card.id.replace('varCard', '');
                    updatePreview(cardId, 'expr', activeInput.value);
                }
            }

            closeFunctionModal();
        }

        // Insertar texto en la posición del cursor
        function insertAtCursor(input, text) {
            const startPos = input.selectionStart;
            const endPos = input.selectionEnd;
            const scrollTop = input.scrollTop;

            const currentValue = input.value;
            input.value = currentValue.substring(0, startPos) + text + currentValue.substring(endPos);

            input.selectionStart = input.selectionEnd = startPos + text.length;
            input.scrollTop = scrollTop;

            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
        }
    </script>
</asp:Content>
