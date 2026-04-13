document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('collectionView');
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Missing Link</h2>
                <p>This collection link is missing a slug.</p>
            </div>
        `;
        return;
    }

    try {
        const collection = await window.CollectionsService.fetchPublicCollection(slug);
        renderCollection(container, collection);
    } catch (error) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Collection Not Found</h2>
                <p>The shared link may be private or no longer available.</p>
            </div>
        `;
    }
});

function renderCollection(container, collection) {
    const recipes = Array.isArray(collection.recipes) ? collection.recipes : [];
    container.innerHTML = `
        <div class="collection-hero">
            <h2>${sanitize(collection.name)}</h2>
            <p>${sanitize(collection.description || 'Special recipes curated with love.')}</p>
            <p class="collection-meta">${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}</p>
        </div>
        <div class="recipe-grid">
            ${recipes.map(recipeCard).join('')}
        </div>
    `;
}

function recipeCard(recipe) {
    const ingredientPreview = Array.isArray(recipe.ingredients) && recipe.ingredients.length
        ? sanitize(recipe.ingredients.slice(0, 3).join(', '))
        : '';
    const imageBlock = recipe.image
        ? `<div class="recipe-card-image"><img src="${sanitize(recipe.image)}" alt="${sanitize(recipe.title)}"></div>`
        : '';
    return `
        <article class="recipe-card">
            ${imageBlock}
            <div class="recipe-card-header">
                <h3 class="recipe-card-title">${sanitize(recipe.title)}</h3>
            </div>
            <div class="recipe-card-body">
                <span class="recipe-card-category">${sanitize(recipe.category || 'Family Favorite')}</span>
                ${ingredientPreview ? `<p class="recipe-card-preview"><strong>Ingredients:</strong> ${ingredientPreview}...</p>` : ''}
            </div>
        </article>
    `;
}

function sanitize(value = '') {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}
