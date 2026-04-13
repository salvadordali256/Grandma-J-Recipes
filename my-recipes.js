// My Recipes Page JavaScript

// Security: Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

let cachedRecipes = [];
let currentSearchTerm = '';
let userCollections = [];

document.addEventListener('DOMContentLoaded', async function() {
    await initializeMyRecipes();
});

async function initializeMyRecipes() {
    const container = document.getElementById('myRecipesContainer');
    if (window.API_CONFIG?.useBackend && typeof getAuthUser === 'function' && !getAuthUser()) {
        container.innerHTML = `
            <div class="info-message" style="max-width: 600px; margin: 0 auto; text-align: center;">
                <h2>Please sign in to view your private recipes</h2>
                <p>Your custom recipes are saved securely to your account. Sign in to sync them across devices.</p>
                <a href="login.html?redirect=my-recipes.html" class="btn-primary" style="text-decoration:none;">Go to Login</a>
            </div>
        `;
        return;
    }

    if (window.CustomRecipeService?.apiAvailable()) {
        await window.CustomRecipeService.syncFromBackend();
    }
    await initCollectionsPanel();
    setupSearchControls();
    loadCustomRecipes();
}

async function initCollectionsPanel() {
    const panel = document.getElementById('collectionsPanel');
    if (!panel) return;
    if (!window.CollectionsService?.apiAvailable()) {
        panel.style.display = 'none';
        return;
    }
    bindCollectionForm();
    await loadCollections();
}

function bindCollectionForm() {
    const toggleBtn = document.getElementById('toggleCollectionForm');
    const form = document.getElementById('collectionForm');
    const cancelBtn = document.getElementById('cancelCollectionForm');
    if (!toggleBtn || !form) return;

    const toggleForm = (visible) => {
        form.style.display = visible ? 'block' : 'none';
        if (!visible) form.reset();
    };

    toggleBtn.addEventListener('click', () => toggleForm(form.style.display === 'none'));
    cancelBtn.addEventListener('click', () => toggleForm(false));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('collectionName').value.trim();
        if (!name) return;
        const description = document.getElementById('collectionDescription').value.trim();
        const isPublic = document.getElementById('collectionIsPublic').checked;
        try {
            await window.CollectionsService.createCollection({ name, description, isPublic });
            await loadCollections(true);
            toggleForm(false);
        } catch (error) {
            console.error(error);
            alert('Unable to create collection right now.');
        }
    });
}

async function loadCollections(force = false) {
    try {
        userCollections = await window.CollectionsService.syncCollections(force);
        renderCollectionsList();
        renderRecipes(); // refresh selects
    } catch (error) {
        console.warn('Unable to load collections', error);
    }
}

function renderCollectionsList() {
    const listEl = document.getElementById('collectionsList');
    if (!listEl) return;
    if (!userCollections.length) {
        listEl.innerHTML = `<p class="muted">No collections yet. Create one to start sharing.</p>`;
        return;
    }
    listEl.innerHTML = '';
    userCollections.forEach(collection => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        const shareUrl = `${window.location.origin}/collection.html?slug=${collection.slug}`;
        card.innerHTML = `
            <div>
                <h4>${escapeHtml(collection.name)}</h4>
                <p>${escapeHtml(collection.description || '')}</p>
                <p class="collection-meta">${collection.recipeCount || 0} recipes · ${collection.isPublic ? 'Public' : 'Private'}</p>
            </div>
            <div class="collection-card-actions">
                ${collection.isPublic ? `<button class="btn-secondary small-btn" data-copy-link="${shareUrl}">Copy Share Link</button>` : '<span class="muted">Private</span>'}
            </div>
        `;
        const copyBtn = card.querySelector('[data-copy-link]');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(copyBtn.getAttribute('data-copy-link'));
                copyBtn.textContent = 'Link Copied!';
                setTimeout(() => (copyBtn.textContent = 'Copy Share Link'), 2000);
            });
        }
        listEl.appendChild(card);
    });
}

function setupSearchControls() {
    const input = document.getElementById('myRecipesSearch');
    const button = document.getElementById('myRecipesSearchBtn');
    if (!input || !button) return;

    const doSearch = () => {
        currentSearchTerm = input.value.trim().toLowerCase();
        renderRecipes();
    };

    button.addEventListener('click', doSearch);
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            doSearch();
        }
    });
    input.addEventListener('input', () => {
        if (input.value === '') {
            currentSearchTerm = '';
            renderRecipes();
        }
    });
}

function loadCustomRecipes() {
    cachedRecipes = (window.CustomRecipeService?.getLocalRecipes() || [])
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    renderRecipes();
}

function renderRecipes() {
    const recipeGrid = document.getElementById('myRecipeGrid');
    const noRecipes = document.getElementById('noRecipes');
    const recipeCount = document.getElementById('recipeCount');
    const filtered = cachedRecipes.filter(recipe => {
        if (!currentSearchTerm) return true;
        const haystack = [
            recipe.title,
            recipe.source,
            recipe.servings,
            ...(recipe.ingredients || []),
            recipe.instructions || ''
        ].join(' ').toLowerCase();
        return haystack.includes(currentSearchTerm);
    });

    recipeGrid.innerHTML = '';

    if (filtered.length === 0) {
        noRecipes.style.display = 'block';
        recipeCount.textContent = cachedRecipes.length
            ? 'No matches for your search.'
            : '';
        return;
    }

    noRecipes.style.display = 'none';
    recipeCount.textContent = `${filtered.length} recipe${filtered.length !== 1 ? 's' : ''} shown`;

    filtered.forEach(recipe => {
        const card = createCustomRecipeCard(recipe);
        recipeGrid.appendChild(card);
    });
}

function createCustomRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card custom-recipe-card';
    card.setAttribute('data-recipe-id', recipe.id);

    // Format date
    const dateAdded = new Date(recipe.dateAdded).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Get ingredient preview
    const ingredientPreview = recipe.ingredients && recipe.ingredients.length > 0
        ? recipe.ingredients.slice(0, 3).map(i => escapeHtml(i)).join(', ')
        : '';

    card.innerHTML = `
        ${recipe.image ? `
            <div class="recipe-card-image">
                <img src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.title)}">
            </div>
        ` : ''}
        <div class="recipe-card-header ${!recipe.image ? '' : 'with-image'}">
            <h3 class="recipe-card-title">${escapeHtml(recipe.title)}</h3>
        </div>
        <div class="recipe-card-body">
            <span class="recipe-card-category custom-badge">${escapeHtml(getCategoryName(recipe.category))}</span>
            ${recipe.source ? `<p class="recipe-card-source">Source: ${escapeHtml(recipe.source)}</p>` : ''}
            ${recipe.servings ? `<p class="recipe-card-source">Servings: ${escapeHtml(recipe.servings)}</p>` : ''}
            <p class="recipe-card-source date-added">Added: ${escapeHtml(dateAdded)}</p>
            ${ingredientPreview ? `<p class="recipe-card-preview"><strong>Ingredients:</strong> ${ingredientPreview}...</p>` : ''}
        </div>
        <div class="recipe-card-footer">
            <a href="recipe.html?id=${recipe.id}&custom=true" class="view-recipe-btn">View Recipe</a>
            <button class="delete-recipe-btn" data-delete-id="${recipe.id}">Delete</button>
            ${renderPublishButton(recipe)}
            ${renderCollectionControls(recipe)}
        </div>
    `;

    card.querySelector('[data-delete-id]').addEventListener('click', () => deleteRecipe(recipe.id));
    const publishBtn = card.querySelector('[data-publish-id]');
    if (publishBtn) {
        publishBtn.addEventListener('click', () => togglePublish(recipe));
    }

    const collectionSelect = card.querySelector('[data-collection-select]');
    if (collectionSelect) {
        collectionSelect.addEventListener('change', async (event) => {
            const targetCollection = event.target.value;
            if (!targetCollection) return;
            try {
                await window.CollectionsService.addRecipeToCollection(targetCollection, recipe.id);
                event.target.value = '';
                alert('Recipe added to collection!');
                await loadCollections(true);
            } catch (error) {
                console.error(error);
                alert('Unable to add recipe to collection.');
            }
        });
    }

    const createCta = card.querySelector('.create-collection-cta');
    if (createCta) {
        createCta.addEventListener('click', () => {
            document.getElementById('collectionForm').style.display = 'block';
            document.getElementById('collectionName').focus();
        });
    }

    return card;
}

function renderPublishButton(recipe) {
    if (!window.API_CONFIG?.useBackend || !window.CustomRecipeService?.apiAvailable()) {
        return '';
    }
    const label = recipe.isPublic ? 'Remove from Main Page' : 'Push to Main Page';
    const className = recipe.isPublic ? 'btn-secondary' : 'btn-primary';
    const status = recipe.isPublic ? '<span class="publish-status">Public</span>' : '<span class="publish-status draft">Private</span>';
    return `
        <button class="${className} publish-btn" data-publish-id="${recipe.id}">
            ${label}
        </button>
        ${status}
    `;
}

function renderCollectionControls(recipe) {
    if (!window.CollectionsService?.apiAvailable()) {
        return '';
    }
    if (!userCollections.length) {
        return `<button class="btn-text create-collection-cta">Create a collection</button>`;
    }
    const options = userCollections.map(col => `<option value="${col.id}">${escapeHtml(col.name)}</option>`).join('');
    return `
        <label class="collection-select-label">
            <span>Add to collection</span>
            <select data-collection-select>
                <option value="">Select...</option>
                ${options}
            </select>
        </label>
    `;
}

function getCategoryName(category) {
    const categoryNames = {
        'meats': 'Meats',
        'oriental': 'Oriental Cooking',
        'pasta': 'Pasta',
        'pastry': 'Pastry & Pies',
        'preserves': 'Preserves & Canning',
        'poultry': 'Poultry',
        'salads': 'Salads & Dressings',
        'sandwiches': 'Sandwiches',
        'sauces': 'Sauces & Gravies',
        'soups': 'Soups',
        'vegetables': 'Vegetables',
        'appetizers': 'Appetizers',
        'beverages': 'Beverages',
        'bread': 'Bread',
        'sweets': 'Sweets & Candy',
        'casseroles': 'Casseroles',
        'cake': 'Cakes',
        'cookies': 'Cookies',
        'desserts': 'Desserts',
        'frozen': 'Frozen Desserts',
        'diet': 'Diet Dishes',
        'eggs': 'Eggs & Cheese',
        'fish': 'Fish & Seafood',
        'frostings': 'Frostings',
        'fruits': 'Fruits'
    };
    return categoryNames[category] || category;
}

async function deleteRecipe(recipeId) {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
        return;
    }
    await window.CustomRecipeService?.deleteRecipe(recipeId);
    loadCustomRecipes();
}

async function togglePublish(recipe) {
    if (!(window.API_CONFIG?.useBackend && window.CustomRecipeService?.setPublicStatus)) {
        alert('Publishing requires the backend. Please deploy the API and enable it in config.js.');
        return;
    }
    const nextStatus = !recipe.isPublic;
    try {
        const updated = await window.CustomRecipeService.setPublicStatus(recipe.id, nextStatus);
        cachedRecipes = cachedRecipes.map(r => r.id === updated.id ? updated : r);
        renderRecipes();
        alert(nextStatus ? 'Recipe published to the main page!' : 'Recipe removed from the main page.');
    } catch (error) {
        console.error('Publish toggle failed', error);
        alert('Unable to update publish status right now.');
    }
}
