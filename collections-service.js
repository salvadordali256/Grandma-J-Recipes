(function() {
    const STORAGE_KEY = 'gpCollectionsCache';

    const apiAvailable = () =>
        Boolean(window.API_CONFIG?.useBackend && window.apiRequest && typeof getAuthUser === 'function' && getAuthUser());

    const getCachedCollections = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    };

    const saveCache = (collections) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    };

    async function syncCollections(force = false) {
        if (!apiAvailable()) return getCachedCollections();
        if (!force && getCachedCollections().length) {
            return getCachedCollections();
        }
        const data = await window.apiRequest(window.API_CONFIG.endpoints.collections.mine, { method: 'GET' });
        saveCache(Array.isArray(data) ? data : []);
        return getCachedCollections();
    }

    async function createCollection(payload) {
        if (!apiAvailable()) throw new Error('Backend required to create collections.');
        const result = await window.apiRequest(window.API_CONFIG.endpoints.collections.create, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const cache = getCachedCollections();
        cache.unshift(result);
        saveCache(cache);
        return result;
    }

    async function updateCollection(id, payload) {
        if (!apiAvailable()) return null;
        const result = await window.apiRequest(window.API_CONFIG.endpoints.collections.update(id), {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });
        const cache = getCachedCollections().map(col => col.id === result.id ? result : col);
        saveCache(cache);
        return result;
    }

    async function deleteCollection(id) {
        if (!apiAvailable()) return;
        await window.apiRequest(window.API_CONFIG.endpoints.collections.remove(id), { method: 'DELETE' });
        const cache = getCachedCollections().filter(col => col.id !== id);
        saveCache(cache);
    }

    async function addRecipeToCollection(collectionId, recipeId) {
        if (!apiAvailable()) throw new Error('Backend required to manage collections.');
        await window.apiRequest(window.API_CONFIG.endpoints.collections.addRecipe(collectionId), {
            method: 'POST',
            body: JSON.stringify({ recipeId })
        });
    }

    async function removeRecipeFromCollection(collectionId, recipeId) {
        if (!apiAvailable()) throw new Error('Backend required to manage collections.');
        await window.apiRequest(window.API_CONFIG.endpoints.collections.removeRecipe(collectionId, recipeId), {
            method: 'DELETE'
        });
    }

    async function fetchPublicCollection(slug) {
        const response = await fetch(window.API_CONFIG.baseURL + window.API_CONFIG.endpoints.collections.public(slug));
        if (!response.ok) {
            throw new Error('Collection not found');
        }
        return response.json();
    }

    window.CollectionsService = {
        apiAvailable,
        syncCollections,
        getCachedCollections,
        createCollection,
        updateCollection,
        deleteCollection,
        addRecipeToCollection,
        removeRecipeFromCollection,
        fetchPublicCollection
    };
})();
