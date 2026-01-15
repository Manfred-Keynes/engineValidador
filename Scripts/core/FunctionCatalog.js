/**
 * FunctionCatalog.js - Catalogo de funciones disponibles
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.Catalog
 */

const FunctionCatalogModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== DATOS DEL CATALOGO =====
    const functionCatalogData = {
        'CalculaEdad': {
            icon: 'fa-birthday-cake',
            name: 'Calcular Edad',
            desc: 'Calcula la edad en anos desde una fecha de nacimiento. Si especificas operador y valor, retorna true/false.',
            params: [
                { name: 'campo_fecha', type: 'field', required: true, hint: 'Campo con fecha de nacimiento' },
                { name: 'operador', type: 'select', required: false, hint: 'Operador de comparacion (vacio para solo calcular)', options: ['', '>', '<', '>=', '<=', '=', '!='] },
                { name: 'valor', type: 'text', required: false, hint: 'Valor a comparar (ej: 18). Dejar vacio si no usas operador' },
                { name: 'formato', type: 'select', required: true, hint: 'Formato de ano', options: ['YYYY', 'YY'] }
            ],
            template: '#CalculaEdad([?campo_fecha],[?operador],[?valor],[?formato])#'
        },
        'SiEntonces': {
            icon: 'fa-code-branch',
            name: 'Si Entonces',
            desc: 'Evaluacion condicional - retorna un valor si la condicion es verdadera, otro si es falsa',
            params: [
                { name: 'condicion', type: 'text', required: true, hint: 'Expresion logica a evaluar' },
                { name: 'valor_verdadero', type: 'text', required: true, hint: 'Valor si es verdadero' },
                { name: 'valor_falso', type: 'text', required: true, hint: 'Valor si es falso' }
            ],
            template: '#SiEntonces([?condicion], [?valor_verdadero], [?valor_falso])#'
        },
        'Conteo': {
            icon: 'fa-hashtag',
            name: 'Conteo',
            desc: 'Cuenta elementos en una coleccion',
            params: [{ name: 'campo', type: 'field', required: true, hint: 'Campo a contar' }],
            template: '#Conteo([?campo])#'
        },
        'Maximo': {
            icon: 'fa-arrow-up',
            name: 'Maximo',
            desc: 'Retorna el valor maximo de una coleccion',
            params: [{ name: 'campo', type: 'field', required: true, hint: 'Campo a evaluar' }],
            template: '#Maximo([?campo])#'
        },
        'Minimo': {
            icon: 'fa-arrow-down',
            name: 'Minimo',
            desc: 'Retorna el valor minimo de una coleccion',
            params: [{ name: 'campo', type: 'field', required: true, hint: 'Campo a evaluar' }],
            template: '#Minimo([?campo])#'
        },
        'Promedio': {
            icon: 'fa-chart-line',
            name: 'Promedio',
            desc: 'Calcula el promedio aritmetico',
            params: [{ name: 'campo', type: 'field', required: true, hint: 'Campo a promediar' }],
            template: '#Promedio([?campo])#'
        },
        'Suma': {
            icon: 'fa-plus',
            name: 'Suma',
            desc: 'Suma todos los valores',
            params: [{ name: 'campo', type: 'field', required: true, hint: 'Campo a sumar' }],
            template: '#Suma([?campo])#'
        },
        'ConteoCaracteres': {
            icon: 'fa-text-width',
            name: 'Conteo Caracteres',
            desc: 'Cuenta la cantidad de caracteres en un texto',
            params: [{ name: 'campo', type: 'field', required: true, hint: 'Campo de texto' }],
            template: '#ConteoCaracteres([?campo])#'
        },
        'ExpresionRegular': {
            icon: 'fa-code',
            name: 'Expresion Regular',
            desc: 'Validacion de texto con expresion regular',
            params: [
                { name: 'campo', type: 'field', required: true, hint: 'Campo a validar' },
                { name: 'patron', type: 'text', required: true, hint: 'Patron regex' }
            ],
            template: '#ExpresionRegular([?campo], [?patron])#'
        },
        'CualquierFecha': {
            icon: 'fa-calendar-alt',
            name: 'Cualquier Fecha',
            desc: 'Operaciones con fechas',
            params: [
                { name: 'campo', type: 'field', required: true, hint: 'Campo de fecha' },
                { name: 'operacion', type: 'text', required: false, hint: 'Operacion (ej: +30 dias)' }
            ],
            template: '#CualquierFecha([?campo], [?operacion])#'
        }
    };

    // Mapeo de nombres
    const nameMappings = {
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

    // ===== FUNCIONES PUBLICAS =====

    const get = (key) => functionCatalogData[key] || null;

    const getModalName = (key) => {
        const func = functionCatalogData[key];
        return nameMappings[key] || (func ? func.name : null) || key;
    };

    const search = (query) => {
        const lowerQuery = query.toLowerCase();
        return Object.keys(functionCatalogData).filter(key => {
            const func = functionCatalogData[key];
            return key.toLowerCase().includes(lowerQuery) ||
                   func.name.toLowerCase().includes(lowerQuery) ||
                   func.desc.toLowerCase().includes(lowerQuery);
        });
    };

    const getAllKeys = () => Object.keys(functionCatalogData);

    const getParamList = (key) => {
        const func = functionCatalogData[key];
        return func ? func.params.map(p => p.name).join(', ') : '';
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        data: functionCatalogData,
        nameMappings,
        get,
        getModalName,
        search,
        getAllKeys,
        getParamList
    };

    // Exponer cada funcion al scope global
    window.functionCatalog = functionCatalogData;
    window.FunctionCatalog = functionCatalogData;
    window.FunctionNameMappings = nameMappings;
    window.FunctionCatalogUtils = {
        get,
        getModalName,
        search,
        getAllKeys,
        getParamList
    };

    // Registrar en namespace
    EF.Core.Catalog = publicAPI;

    console.log('[EF] Catalog cargado');

    return publicAPI;
})();
