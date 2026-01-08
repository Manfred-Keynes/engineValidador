/**
 * FunctionRegistry.js - Registro central de funciones del Editor
 *
 * Arrow IIFE Pattern - Modulo encapsulado
 * Namespace: EF.Core.Registry
 */

const FunctionRegistryModule = (() => {
    'use strict';

    // Asegurar que EF existe
    window.EF = window.EF || { Core: {}, Functions: {}, State: {} };
    const EF = window.EF;

    // ===== ESTADO PRIVADO =====
    const functions = {};

    // ===== FUNCIONES PRIVADAS =====

    /**
     * Normaliza un nombre de funcion (quita tildes, espacios extra)
     */
    const normalizeName = (name) => {
        if (!name) return '';
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    };

    const generateFallbackForm = () => {
        const state = EF.State;
        const levelId = state.navigationStack.currentLevel >= 0 ? state.navigationStack.currentLevel : 0;
        const varId = state.currentConfigVarId || 'default';
        const builderId = `miniBuilder_var${varId}_level${levelId}_param1`;

        return `
            <div class="mini-builder-container" style="margin-bottom: 20px;">
                <label style="display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px;">
                    Campo o Expresion <span style="color: var(--danger);">*</span>
                </label>
                <div class="mini-expression-builder" id="${builderId}"
                     ondrop="dropIntoMiniBuilder(event, '${builderId}')"
                     ondragover="allowMiniBuilderDrop(event)"
                     ondragleave="dragMiniBuilderLeave(event)"
                     data-param-id="param1">
                    <div class="empty" style="font-size: 13px; color: var(--gray-500); display: flex; align-items: center; justify-content: center; min-height: 60px;">
                        <i class="fas fa-hand-pointer" style="margin-right: 6px;"></i>
                        Arrastra campos, operadores o funciones
                    </div>
                </div>
            </div>`;
    };

    // ===== FUNCIONES PUBLICAS =====

    /**
     * Registrar funcion
     */
    const register = (FunctionClass) => {
        if (!FunctionClass || !FunctionClass.functionName) {
            console.error('[EF.Registry] Clase invalida o sin functionName');
            return;
        }

        const name = FunctionClass.functionName;
        const id = FunctionClass.functionId || name;

        functions[name] = FunctionClass;
        if (id !== name) {
            functions[id] = FunctionClass;
        }

        // Registrar tambien en EF.Functions para acceso directo
        EF.Functions[name] = FunctionClass;
        if (id !== name) {
            EF.Functions[id] = FunctionClass;
        }

        console.log(`[EF.Registry] Registrada "${name}"`);
    };

    /**
     * Desregistrar funcion
     */
    const unregister = (functionName) => {
        const FunctionClass = functions[functionName];
        if (FunctionClass) {
            delete functions[functionName];
            delete EF.Functions[functionName];
            if (FunctionClass.functionId && FunctionClass.functionId !== functionName) {
                delete functions[FunctionClass.functionId];
                delete EF.Functions[FunctionClass.functionId];
            }
        }
    };

    /**
     * Obtener funcion por nombre (busca exacto primero, luego normalizado)
     */
    const get = (functionName) => {
        // Busqueda exacta
        if (functions[functionName]) {
            return functions[functionName];
        }

        // Busqueda normalizada (sin tildes)
        const normalized = normalizeName(functionName);
        if (functions[normalized]) {
            return functions[normalized];
        }

        // Buscar en todas las funciones por nombre normalizado
        for (const key of Object.keys(functions)) {
            if (normalizeName(key) === normalized) {
                return functions[key];
            }
        }

        return null;
    };

    /**
     * Verificar si existe
     */
    const has = (functionName) => !!get(functionName);

    /**
     * Crear instancia
     */
    const create = (functionName, varId, builderId) => {
        const FunctionClass = get(functionName);
        if (!FunctionClass) {
            console.warn(`[EF.Registry] Funcion "${functionName}" no encontrada`);
            return null;
        }
        return new FunctionClass(varId || null, builderId || null);
    };

    /**
     * Generar formulario
     */
    const generateForm = (functionName, varId) => {
        const FunctionClass = get(functionName);

        if (FunctionClass) {
            try {
                const instance = new FunctionClass(varId);
                const html = instance.generateForm();

                setTimeout(() => {
                    if (instance.onFormReady) {
                        instance.onFormReady();
                    }
                }, 50);

                return html;
            } catch (error) {
                console.error('[EF.Registry] Error generando formulario:', error);
            }
        }

        return generateFallbackForm();
    };

    /**
     * Construir expresion
     */
    const buildExpression = (functionName, params) => {
        const FunctionClass = get(functionName);
        if (!FunctionClass) {
            const cleanParams = (params || []).filter(p => p && p.trim() !== '');
            return `#${functionName}(${cleanParams.join(',')})#`;
        }

        try {
            const instance = new FunctionClass();
            return instance.buildExpression(params);
        } catch (error) {
            return `#${functionName}()#`;
        }
    };

    /**
     * Construir preview
     */
    const buildPreview = (functionName, params) => {
        const FunctionClass = get(functionName);
        if (!FunctionClass) {
            return buildExpression(functionName, params);
        }

        try {
            const instance = new FunctionClass();
            return instance.buildPreview(params);
        } catch (error) {
            return buildExpression(functionName, params);
        }
    };

    /**
     * Validar parametros
     */
    const validate = (functionName, params) => {
        const FunctionClass = get(functionName);
        if (!FunctionClass) {
            return { valid: true, errors: [] };
        }

        try {
            const instance = new FunctionClass();
            return instance.validate(params);
        } catch (error) {
            return { valid: false, errors: [`Error de validacion: ${error.message}`] };
        }
    };

    /**
     * Parsear expresion
     */
    const parseExpression = (functionName, expression) => {
        const FunctionClass = get(functionName);
        if (!FunctionClass) return null;

        try {
            const instance = new FunctionClass();
            return instance.parseExpression(expression);
        } catch (error) {
            return null;
        }
    };

    /**
     * Listar todas las funciones
     */
    const getAll = () => {
        const seen = {};
        const result = [];

        Object.keys(functions).forEach(key => {
            const FuncClass = functions[key];
            if (FuncClass.functionName && !seen[FuncClass.functionName]) {
                seen[FuncClass.functionName] = true;
                result.push(FuncClass);
            }
        });

        return result;
    };

    /**
     * Listar por categoria
     */
    const getByCategory = (category) => {
        return getAll().filter(FuncClass => FuncClass.category === category);
    };

    /**
     * Obtener categorias
     */
    const getCategories = () => {
        const categories = {};
        getAll().forEach(FuncClass => {
            if (FuncClass.category) {
                categories[FuncClass.category] = true;
            }
        });
        return Object.keys(categories);
    };

    /**
     * Listar nombres
     */
    const getNames = () => getAll().map(FuncClass => FuncClass.functionName);

    /**
     * Obtener metadata
     */
    const getAllMetadata = () => {
        return getAll().map(FuncClass => ({
            name: FuncClass.functionName,
            id: FuncClass.functionId,
            icon: FuncClass.icon,
            description: FuncClass.description,
            category: FuncClass.category
        }));
    };

    /**
     * Obtener icono
     */
    const getIcon = (functionName) => {
        const FunctionClass = get(functionName);
        return FunctionClass ? FunctionClass.icon : 'fa-cog';
    };

    /**
     * Debug
     */
    const debug = () => {
        console.group('[EF.Registry] Estado actual');
        console.log('Total funciones:', getAll().length);
        console.log('Categorias:', getCategories());
        console.table(getAllMetadata());
        console.groupEnd();
    };

    // ===== API PUBLICA =====
    const publicAPI = {
        functions,
        register,
        unregister,
        get,
        has,
        create,
        generateForm,
        buildExpression,
        buildPreview,
        validate,
        parseExpression,
        getAll,
        getByCategory,
        getCategories,
        getNames,
        getAllMetadata,
        getIcon,
        debug
    };

    // ===== REGISTRO DEL MODULO =====
    EF.Core.Registry = publicAPI;

    // Compatibilidad global
    window.FunctionRegistry = publicAPI;

    console.log('[EF] FunctionRegistry cargado');

    return publicAPI;
})();
