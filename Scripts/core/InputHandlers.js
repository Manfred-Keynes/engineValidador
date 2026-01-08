/**
 * InputHandlers.js - Manejo de eventos de input
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.InputHandlers
 */

const InputHandlersModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== FUNCIONES PUBLICAS =====

    const handleInputChange = (e) => {
        const input = e.target;
        const text = input.value;
        const cursorPos = input.selectionStart;

        if (cursorPos > 0) {
            let hashPos = cursorPos - 1;

            while (hashPos >= 0 && text[hashPos] !== '#' && text[hashPos] !== ' ' && text[hashPos] !== '\n') {
                hashPos--;
            }

            if (hashPos >= 0 && text[hashPos] === '#') {
                const query = text.substring(hashPos + 1, cursorPos);

                if (query.length >= 0) {
                    if (typeof showAutocomplete === 'function') {
                        showAutocomplete(input, query);
                    }
                }
            } else {
                if (typeof hideAutocomplete === 'function') {
                    hideAutocomplete();
                }
            }
        } else {
            if (typeof hideAutocomplete === 'function') {
                hideAutocomplete();
            }
        }
    };

    const handleKeyDown = (e) => {
        const autocompletePopup = EF.State.autocompletePopup || window.autocompletePopup;

        if (autocompletePopup && autocompletePopup.classList.contains('active')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (typeof navigateAutocomplete === 'function') {
                    navigateAutocomplete('down');
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (typeof navigateAutocomplete === 'function') {
                    navigateAutocomplete('up');
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (typeof selectAutocompleteItem === 'function') {
                    if (selectAutocompleteItem()) {
                        return;
                    }
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                if (typeof hideAutocomplete === 'function') {
                    hideAutocomplete();
                }
            }
        }
    };

    const attachAutocompleteListeners = (textarea) => {
        textarea.addEventListener('input', handleInputChange);
        textarea.addEventListener('keydown', handleKeyDown);
    };

    const insertFunction = (functionName, varId) => {
        if (varId) {
            const builder = document.getElementById(`exprBuilder${varId}`);
            if (builder) {
                const tempInput = document.createElement('textarea');
                tempInput.style.display = 'none';
                builder.appendChild(tempInput);

                EF.State.activeInput = tempInput;
                EF.State.activeInput.varId = varId;
            }
        }

        if (!EF.State.activeInput) {
            alert('Por favor, haga clic en un campo de expresion antes de seleccionar una funcion.');
            return;
        }

        document.querySelectorAll('.function-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });

        if (typeof openFunctionModal === 'function') {
            openFunctionModal(functionName, EF.State.activeInput);
        }
    };

    const toggleFunctionMenu = (event, cardId) => {
        event.preventDefault();
        event.stopPropagation();

        const menu = document.getElementById(`functionMenu${cardId}`);
        const wasActive = menu.classList.contains('active');

        document.querySelectorAll('.function-menu.active').forEach(m => {
            m.classList.remove('active');
        });

        if (!wasActive) {
            menu.classList.add('active');
        }
    };

    const filterFunctions = (cardId) => {
        const menu = document.getElementById(`functionMenu${cardId}`);
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

        const categories = menu.querySelectorAll('.function-category');
        categories.forEach(category => {
            const visibleItems = category.querySelectorAll('.function-item:not(.hidden)');
            category.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    };

    const insertAtCursor = (input, text) => {
        const startPos = input.selectionStart;
        const endPos = input.selectionEnd;
        const scrollTop = input.scrollTop;

        const currentValue = input.value;
        input.value = currentValue.substring(0, startPos) + text + currentValue.substring(endPos);

        input.selectionStart = input.selectionEnd = startPos + text.length;
        input.scrollTop = scrollTop;

        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    };

    const init = () => {
        document.addEventListener('click', e => {
            if (!e.target.closest('.function-menu-container')) {
                document.querySelectorAll('.function-menu.active').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });
    };

    // Inicializar listeners globales
    init();

    // ===== API PUBLICA =====
    const publicAPI = {
        handleInputChange,
        handleKeyDown,
        attachAutocompleteListeners,
        insertFunction,
        toggleFunctionMenu,
        filterFunctions,
        insertAtCursor,
        init
    };

    // Exponer cada funcion al scope global
    Object.keys(publicAPI).forEach(key => {
        window[key] = publicAPI[key];
    });

    // Registrar en namespace
    EF.Core.InputHandlers = publicAPI;

    console.log('[EF] InputHandlers cargado');

    return publicAPI;
})();
