/**
 * Custom recipe synchronization helper
 * Keeps localStorage in sync with the backend API when available.
 */
(function() {
    const STORAGE_KEY = 'customRecipes';
    const TOKEN_KEY = 'gpAuthToken';
    let syncPromise = null;

    const apiAvailable = () => Boolean(window.API_CONFIG?.useBackend && window.apiRequest);
    const getToken = () =>
        sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;

    const normalizeRecipe = (recipe = {}) => ({
        id: recipe.id,
        title: recipe.title || 'Untitled Recipe',
        category: recipe.category || 'meats',
        source: recipe.source || 'My Recipe',
        servings: recipe.servings || '',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: recipe.instructions || '',
        image: recipe.image || null,
        isCustom: true,
        isPublic: !!recipe.isPublic,
        publishedAt: recipe.publishedAt || recipe.published_at || null,
        dateAdded: recipe.dateAdded || recipe.created_at || new Date().toISOString()
    });

    const getLocalRecipes = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (_) {
            return [];
        }
    };

    const saveLocalRecipes = (recipes) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    };

    const upsertLocalRecipe = (recipe, replaceId) => {
        const current = getLocalRecipes().filter(r => r.id !== recipe.id && (!replaceId || r.id !== replaceId));
        current.push(recipe);
        saveLocalRecipes(current);
        return recipe;
    };

    const removeLocalRecipe = (id) => {
        const next = getLocalRecipes().filter(r => String(r.id) !== String(id));
        saveLocalRecipes(next);
    };

    async function syncFromBackend(force = false) {
        if (!apiAvailable() || !getToken()) return null;
        if (syncPromise && !force) return syncPromise;

        syncPromise = window.apiRequest(window.API_CONFIG.endpoints.recipes.mine.list, {
            method: 'GET'
        }).then((data) => {
            if (Array.isArray(data)) {
                const normalized = data.map(normalizeRecipe);
                saveLocalRecipes(normalized);
                return normalized;
            }
            return [];
        }).catch((error) => {
            console.warn('Custom recipe sync failed', error);
            return null;
        }).finally(() => {
            syncPromise = null;
        });

        return syncPromise;
    }

    async function saveRecipe(recipe) {
        const draft = {
            ...recipe,
            id: recipe.id || Date.now(),
            dateAdded: recipe.dateAdded || new Date().toISOString(),
            isCustom: true,
            isPublic: !!recipe.isPublic
        };

        if (apiAvailable() && getToken()) {
            try {
                const response = await window.apiRequest(window.API_CONFIG.endpoints.recipes.mine.create, {
                    method: 'POST',
                    body: JSON.stringify({
                        title: draft.title,
                        category: draft.category,
                        instructions: draft.instructions,
                        ingredients: draft.ingredients,
                        source: draft.source,
                        servings: draft.servings,
                        image: draft.image
                    })
                });
                const normalized = normalizeRecipe(response);
                return upsertLocalRecipe(normalized, draft.id);
            } catch (error) {
                console.error('Failed to save recipe to backend', error);
                throw error;
            }
        }

        return upsertLocalRecipe(draft);
    }

    async function deleteRecipe(id) {
        removeLocalRecipe(id);
        if (apiAvailable() && getToken()) {
            try {
                await window.apiRequest(window.API_CONFIG.endpoints.recipes.mine.delete(id), { method: 'DELETE' });
                await syncFromBackend(true);
                return true;
            } catch (error) {
                console.error('Failed to delete recipe from backend', error);
                await syncFromBackend(true);
                return false;
            }
        }
        return true;
    }

    async function setPublicStatus(id, isPublic) {
        if (!(apiAvailable() && getToken())) {
            const local = getLocalRecipes();
            const next = local.map(recipe =>
                String(recipe.id) === String(id) ? { ...recipe, isPublic } : recipe
            );
            saveLocalRecipes(next);
            return next.find(r => String(r.id) === String(id));
        }
        const response = await window.apiRequest(window.API_CONFIG.endpoints.recipes.mine.publish(id), {
            method: 'PATCH',
            body: JSON.stringify({ isPublic })
        });
        const normalized = normalizeRecipe(response);
        upsertLocalRecipe(normalized);
        return normalized;
    }

    window.CustomRecipeService = {
        syncFromBackend,
        saveRecipe,
        deleteRecipe,
        setPublicStatus,
        getLocalRecipes,
        apiAvailable
    };
})();
