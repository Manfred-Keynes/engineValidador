/**
 * Namespace.js - Namespace principal del Editor de Funciones
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF (Editor Funciones)
 *
 * ESTRUCTURA:
 * - EF.Core      -> Modulos core (DragDrop, Navigation, etc.)
 * - EF.Functions -> Funciones individuales (Suma, Minimo, etc.)
 * - EF.Utils     -> Utilidades compartidas
 * - EF.State     -> Estado global de la aplicacion
 */

const EFNamespace = (() => {
    'use strict';

    // ===== CREAR NAMESPACE PRINCIPAL =====
    window.EF = window.EF || {};
    const EF = window.EF;

    // Sub-namespaces
    EF.Core = EF.Core || {};
    EF.Functions = EF.Functions || {};
    EF.Utils = EF.Utils || {};
    EF.State = EF.State || {};

    // ===== ESTADO GLOBAL DE LA APLICACION =====
    EF.State = {
        expressionComponents: {},
        componentCounter: 0,
        miniBuilderComponents: {},
        navigationStack: {
            levels: [],
            currentLevel: -1
        },
        logicComponents: [],
        variablesCounter: 0,
        currentExpandedCard: null,
        activeInput: null,
        currentConfigVarId: null,
        currentFunction: null,
        draggedFunctionName: null,
        draggedOperator: null,
        draggedField: null,
        draggedValue: null,
        draggedParenthesis: null,
        draggedVariableId: null,
        draggedVariableName: null,
        draggedLogicOperator: null,
        targetVarId: null,
        availableFields: null,
        autocompletePopup: null,
        selectedAutocompleteIndex: -1
    };

    // ===== FUNCIONES DEL NAMESPACE =====

    /**
     * Obtener estado
     */
    const getState = (key) => EF.State[key];

    /**
     * Establecer estado
     */
    const setState = (key, value) => {
        EF.State[key] = value;
        // Mantener compatibilidad con window.*
        if (window[key] !== undefined || key.startsWith('dragged') || key === 'activeInput') {
            window[key] = value;
        }
    };

    /**
     * Registrar un modulo
     */
    const registerModule = (namespace, name, module) => {
        if (!EF[namespace]) {
            EF[namespace] = {};
        }
        EF[namespace][name] = module;
        console.log(`EF.${namespace}.${name} registrado`);
    };

    /**
     * Exponer funcion al scope global para compatibilidad con HTML
     */
    const expose = (funcName, func) => {
        window[funcName] = func;
    };

    /**
     * Exponer multiples funciones
     */
    const exposeAll = (funcs) => {
        Object.keys(funcs).forEach(name => {
            window[name] = funcs[name];
        });
    };

    /**
     * Inicializar compatibilidad con variables globales legacy
     */
    const initLegacyCompat = () => {
        Object.keys(EF.State).forEach(key => {
            if (window[key] !== undefined) {
                EF.State[key] = window[key];
            } else {
                window[key] = EF.State[key];
            }
        });
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        getState,
        setState,
        registerModule,
        expose,
        exposeAll,
        initLegacyCompat
    };

    // Asignar metodos al namespace EF
    EF.getState = getState;
    EF.setState = setState;
    EF.registerModule = registerModule;
    EF.expose = expose;
    EF.exposeAll = exposeAll;
    EF.initLegacyCompat = initLegacyCompat;

    console.log('[EF] Namespace inicializado');

    return publicAPI;
})();
