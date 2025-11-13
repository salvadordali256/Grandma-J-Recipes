// Recipe Detail Page JavaScript

// Security: Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

const baseRecipes = Array.isArray(window.recipes) ? window.recipes : [];
const blueRecipeEntries = Array.isArray(window.blueRecipes) ? flattenBlueRecipes(window.blueRecipes) : [];
const enhancedBaseRecipes = baseRecipes.map(recipe => ({ ...recipe, hasDetailPage: true }));
const allRecipes = [...blueRecipeEntries, ...enhancedBaseRecipes];

function flattenBlueRecipes(data) {
    if (!Array.isArray(data)) return [];
    const entries = [];
    data.forEach(section => {
        const category = section.slug || 'meats';
        const sectionLabel = section.section || getCategoryName(category);
        if (!Array.isArray(section.recipes)) return;
        section.recipes.forEach((recipe, idx) => {
            const contentLines = Array.isArray(recipe.content) ? recipe.content.filter(Boolean) : [];
            entries.push({
                id: `blue-${category}-${idx}`,
                title: recipe.title || 'Untitled Recipe',
                category,
                sectionLabel,
                source: 'Grandma Pauline (Word Doc)',
                servings: '',
                contentLines,
                instructions: contentLines.join('\n'),
                hasDetailPage: true
            });
        });
    });
    return entries;
}

document.addEventListener('DOMContentLoaded', function() {
    loadRecipeDetail();
});

function loadRecipeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeIdParamRaw = urlParams.get('id');
    const recipeIdParam = recipeIdParamRaw ? decodeURIComponent(recipeIdParamRaw) : '';
    const isCustom = urlParams.get('custom') === 'true';

    const recipeDetail = document.getElementById('recipeDetail');

    if (!recipeIdParam) {
        recipeDetail.innerHTML = `
            <div class="error-message">
                <h2>Recipe Not Found</h2>
                <p>No recipe ID provided.</p>
                <a href="/" class="btn-primary">Return to All Recipes</a>
            </div>
        `;
        return;
    }

    let recipe;
    if (isCustom) {
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
        recipe = customRecipes.find(r => String(r.id) === recipeIdParam);
    } else {
        recipe = allRecipes.find(r => String(r.id) === recipeIdParam);
    }

    if (!recipe) {
        recipeDetail.innerHTML = `
            <div class="error-message">
                <h2>Recipe Not Found</h2>
                <p>Sorry, we couldn't find the recipe you're looking for.</p>
                <a href="/" class="btn-primary">Return to All Recipes</a>
            </div>
        `;
        return;
    }

    // Update page title
    document.title = `${escapeHtml(recipe.title)} - Grandma Pauline's Recipes`;

    let ingredientsHTML = '';
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        ingredientsHTML = `
            <div class="recipe-section">
                <h2>Ingredients</h2>
                <ul class="ingredients-list">
                    ${recipe.ingredients.map(ingredient => `<li>${escapeHtml(ingredient)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    let instructionsHTML = '';
    const shouldShowInstructions = recipe.instructions && (!recipe.contentLines || recipe.contentLines.length === 0);
    if (shouldShowInstructions) {
        const instructions = escapeHtml(recipe.instructions).replace(/•/g, '<br>•').replace(/\n/g, '<br>');
        instructionsHTML = `
            <div class="recipe-section">
                <h2>Instructions</h2>
                <div class="instructions-text">${instructions}</div>
            </div>
        `;
    }

    let documentLinesHTML = '';
    if (recipe.contentLines && recipe.contentLines.length > 0) {
        documentLinesHTML = `
            <div class="recipe-section">
                <h2>Recipe Text</h2>
                <div class="instructions-text stacked">
                    ${recipe.contentLines.map(line => `<p>${escapeHtml(line)}</p>`).join('')}
                </div>
            </div>
        `;
    }

    let imageHTML = '';
    if (recipe.image) {
        imageHTML = `
            <div class="recipe-image-detail">
                <img src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.title)}">
            </div>
        `;
    }

    const backLink = isCustom ? 'my-recipes' : '/';
    const backText = isCustom ? '← Back to My Recipes' : '← Back to All Recipes';
    const sectionLabel = recipe.sectionLabel || getCategoryName(recipe.category);
    const neighbors = getNeighborRecipes(recipe.id);
    const navHtml = `
        <div class="recipe-detail-nav">
            ${neighbors.prev ? `<a class="detail-nav-link" href="recipe?id=${encodeURIComponent(neighbors.prev.id)}">← ${escapeHtml(neighbors.prev.title)}</a>` : '<span></span>'}
            ${neighbors.next ? `<a class="detail-nav-link" href="recipe?id=${encodeURIComponent(neighbors.next.id)}">${escapeHtml(neighbors.next.title)} →</a>` : '<span></span>'}
        </div>
    `;

    // Build the complete recipe HTML
    recipeDetail.innerHTML = `
        <div class="recipe-header-detail">
            <div class="recipe-title-section">
                <h1 class="recipe-title-detail">${escapeHtml(recipe.title)}</h1>
                <div class="recipe-meta-detail">
                    <span class="recipe-category-badge ${isCustom ? 'custom-badge' : ''}">${escapeHtml(getCategoryName(recipe.category))}</span>
                    ${sectionLabel ? `<span class="recipe-source-detail">Section: ${escapeHtml(sectionLabel)}</span>` : ''}
                    ${recipe.source ? `<span class="recipe-source-detail">Source: ${escapeHtml(recipe.source)}</span>` : ''}
                    ${recipe.servings ? `<span class="recipe-servings-detail">Servings: ${escapeHtml(recipe.servings)}</span>` : ''}
                    ${isCustom ? '<span class="recipe-source-detail custom-indicator">✨ My Recipe</span>' : ''}
                </div>
            </div>
        </div>

        ${imageHTML}

        <div class="recipe-content-detail">
            ${ingredientsHTML}
            ${instructionsHTML}
            ${documentLinesHTML}
        </div>
        ${navHtml}

        <div class="recipe-footer-detail">
            <a href="${backLink}" class="btn-secondary">${backText}</a>
            <button onclick="window.print()" class="btn-primary">🖨️ Print Recipe</button>
        </div>
    `;

    // Scroll to top
    window.scrollTo(0, 0);
}

// Get category display name
function getCategoryName(category) {
    const categoryNames = {
        'all': 'All Recipes',
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

function getNeighborRecipes(currentId) {
    const index = allRecipes.findIndex(r => String(r.id) === String(currentId));
    if (index === -1) {
        return { prev: null, next: null };
    }
    return {
        prev: index > 0 ? allRecipes[index - 1] : null,
        next: index < allRecipes.length - 1 ? allRecipes[index + 1] : null
    };
}

// Print functionality
function printRecipe() {
    window.print();
}
