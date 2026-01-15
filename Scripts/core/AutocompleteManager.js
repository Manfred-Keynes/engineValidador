/**
 * AutocompleteManager.js - Sistema de autocompletado
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.Autocomplete
 */

const AutocompleteModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== INICIALIZAR ESTADO =====
    EF.State.autocompletePopup = null;
    EF.State.selectedAutocompleteIndex = -1;

    // ===== FUNCIONES PUBLICAS =====

    const createAutocompletePopup = () => {
        if (EF.State.autocompletePopup) return;

        EF.State.autocompletePopup = document.createElement('div');
        EF.State.autocompletePopup.className = 'autocomplete-popup';
        EF.State.autocompletePopup.id = 'autocompletePopup';
        document.body.appendChild(EF.State.autocompletePopup);

        document.addEventListener('click', e => {
            if (EF.State.autocompletePopup && !EF.State.autocompletePopup.contains(e.target) && e.target !== EF.State.activeInput) {
                hideAutocomplete();
            }
        });
    };

    const showAutocomplete = (input, query) => {
        if (!EF.State.autocompletePopup) return;

        const catalog = window.functionCatalog || window.FunctionCatalog || {};

        const filtered = Object.keys(catalog).filter(key => {
            const func = catalog[key];
            return key.toLowerCase().includes(query.toLowerCase()) ||
                   func.name.toLowerCase().includes(query.toLowerCase());
        });

        if (filtered.length === 0) {
            hideAutocomplete();
            return;
        }

        let html = '<div class="autocomplete-header">Funciones disponibles</div>';

        filtered.forEach((key, index) => {
            const func = catalog[key];
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

        EF.State.autocompletePopup.innerHTML = html;

        const rect = input.getBoundingClientRect();
        const caretPos = getCaretCoordinates(input);

        EF.State.autocompletePopup.style.position = 'fixed';
        EF.State.autocompletePopup.style.left = `${rect.left + caretPos.left}px`;
        EF.State.autocompletePopup.style.top = `${rect.top + caretPos.top + 20}px`;

        const popupRect = EF.State.autocompletePopup.getBoundingClientRect();
        if (popupRect.right > window.innerWidth) {
            EF.State.autocompletePopup.style.left = `${window.innerWidth - popupRect.width - 20}px`;
        }
        if (popupRect.bottom > window.innerHeight) {
            EF.State.autocompletePopup.style.top = `${rect.top + caretPos.top - popupRect.height - 10}px`;
        }

        EF.State.autocompletePopup.classList.add('active');
        EF.State.selectedAutocompleteIndex = 0;

        EF.State.autocompletePopup.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', function() {
                const funcKey = this.getAttribute('data-function');
                insertFunctionTemplate(funcKey, input);
            });
        });
    };

    const hideAutocomplete = () => {
        if (EF.State.autocompletePopup) {
            EF.State.autocompletePopup.classList.remove('active');
            EF.State.selectedAutocompleteIndex = -1;
        }
    };

    const getCaretCoordinates = (element) => {
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
    };

    const navigateAutocomplete = (direction) => {
        if (!EF.State.autocompletePopup || !EF.State.autocompletePopup.classList.contains('active')) return;

        const items = EF.State.autocompletePopup.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;

        if (items[EF.State.selectedAutocompleteIndex]) {
            items[EF.State.selectedAutocompleteIndex].classList.remove('selected');
        }

        if (direction === 'down') {
            EF.State.selectedAutocompleteIndex = (EF.State.selectedAutocompleteIndex + 1) % items.length;
        } else if (direction === 'up') {
            EF.State.selectedAutocompleteIndex = EF.State.selectedAutocompleteIndex <= 0 ? items.length - 1 : EF.State.selectedAutocompleteIndex - 1;
        }

        items[EF.State.selectedAutocompleteIndex].classList.add('selected');
        items[EF.State.selectedAutocompleteIndex].scrollIntoView({ block: 'nearest' });
    };

    const selectAutocompleteItem = () => {
        if (!EF.State.autocompletePopup || !EF.State.autocompletePopup.classList.contains('active')) return false;

        const selectedItem = EF.State.autocompletePopup.querySelector('.autocomplete-item.selected');
        if (selectedItem) {
            const funcKey = selectedItem.getAttribute('data-function');
            insertFunctionTemplate(funcKey, EF.State.activeInput);
            return true;
        }
        return false;
    };

    const insertFunctionTemplate = (funcKey, input) => {
        const catalog = window.functionCatalog || window.FunctionCatalog || {};
        const func = catalog[funcKey];
        if (!func) return;

        const text = input.value;
        const cursorPos = input.selectionStart;

        let hashPos = cursorPos - 1;
        while (hashPos >= 0 && text[hashPos] !== '#') {
            hashPos--;
        }

        if (hashPos >= 0) {
            input.value = text.substring(0, hashPos) + text.substring(cursorPos);
            input.selectionStart = input.selectionEnd = hashPos;
        }

        hideAutocomplete();

        const mappings = window.FunctionNameMappings || {
            'CalculaEdad': 'Calcular edad',
            'SiEntonces': 'Si entonces',
            'Conteo': 'Conteo',
            'Maximo': 'Maximo',
            'Minimo': 'Minimo',
            'Promedio': 'Promedio',
            'Suma': 'Suma',
            'ConteoCaracteres': 'Conteo caracteres',
            'ExpresionRegular': 'Expresion regular',
            'CualquierFecha': 'Cualquier fecha'
        };

        const modalFunctionName = mappings[funcKey] || func.name;

        if (typeof openFunctionModal === 'function') {
            openFunctionModal(modalFunctionName, input);
        }
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        createAutocompletePopup,
        showAutocomplete,
        hideAutocomplete,
        getCaretCoordinates,
        navigateAutocomplete,
        selectAutocompleteItem,
        insertFunctionTemplate
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.Autocomplete = publicAPI;

    // Legacy compatibility
    window.autocompletePopup = EF.State.autocompletePopup;
    window.selectedAutocompleteIndex = EF.State.selectedAutocompleteIndex;

    console.log('[EF] Autocomplete cargado');

    return publicAPI;
})();
