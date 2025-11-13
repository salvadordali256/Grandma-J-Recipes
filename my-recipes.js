// My Recipes Page JavaScript

// Security: Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    loadCustomRecipes();
});

function loadCustomRecipes() {
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
    const recipeGrid = document.getElementById('myRecipeGrid');
    const noRecipes = document.getElementById('noRecipes');
    const recipeCount = document.getElementById('recipeCount');

    if (customRecipes.length === 0) {
        noRecipes.style.display = 'block';
        recipeCount.textContent = '';
    } else {
        noRecipes.style.display = 'none';
        recipeCount.textContent = `${customRecipes.length} recipe${customRecipes.length !== 1 ? 's' : ''} in your collection`;

        // Sort by date added (newest first)
        customRecipes.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

        customRecipes.forEach(recipe => {
            const card = createCustomRecipeCard(recipe);
            recipeGrid.appendChild(card);
        });
    }
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
            <button onclick="deleteRecipe(${recipe.id})" class="delete-recipe-btn">Delete</button>
        </div>
    `;

    return card;
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

function deleteRecipe(recipeId) {
    if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
        let customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
        customRecipes = customRecipes.filter(recipe => recipe.id !== recipeId);
        localStorage.setItem('customRecipes', JSON.stringify(customRecipes));

        // Reload the page
        location.reload();
    }
}
