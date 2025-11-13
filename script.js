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

const STORAGE_KEYS = {
    category: 'gpFilters:category',
    search: 'gpFilters:search'
};

const categoryIcons = {
    meats: '🥩',
    poultry: '🍗',
    fish: '🐟',
    oriental: '🥢',
    pasta: '🍝',
    pastry: '🥧',
    desserts: '🍰',
    cookies: '🍪',
    cake: '🎂',
    casseroles: '🥘',
    vegetables: '🥦',
    salads: '🥗',
    sandwiches: '🥪',
    sauces: '🥫',
    soups: '🍲',
    bread: '🍞',
    eggs: '🥚',
    preserves: '🍓',
    sweets: '🍬',
    frozen: '🍧',
    beverages: '🍹',
    frostings: '🧁',
    fruits: '🍎',
    diet: '⚖️',
    appetizers: '🧀'
};

function getCategoryIcon(category) {
    return categoryIcons[category] || '🍽️';
}

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

// Global variables
let currentCategory = 'all';
let currentSearchTerm = '';
let filteredRecipes = [...allRecipes];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryButtons = document.querySelectorAll('.category-btn');
const recipeGrid = document.getElementById('recipeGrid');
const recipeCount = document.getElementById('recipeCount');
const noResults = document.getElementById('noResults');
const modal = document.getElementById('recipeModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const loginNavLink = document.getElementById('loginNavLink');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    restoreFilters();
    filterAndDisplayRecipes();
    updateHeroStats();
    setupEventListeners();
    updateAuthNavLink();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Real-time search
    searchInput.addEventListener('input', debounce(performSearch, 300));

    // Category filtering
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            currentCategory = this.getAttribute('data-category');
            sessionStorage.setItem(STORAGE_KEYS.category, currentCategory);
            filterAndDisplayRecipes();
        });
    });

    // Modal close functionality
    modalClose.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Perform search
function performSearch() {
    currentSearchTerm = searchInput.value.trim().toLowerCase();
    sessionStorage.setItem(STORAGE_KEYS.search, currentSearchTerm);
    filterAndDisplayRecipes();
}

// Filter and display recipes
function filterAndDisplayRecipes() {
    filteredRecipes = allRecipes.filter(recipe => {
        // Filter by category
        const categoryMatch = currentCategory === 'all' || recipe.category === currentCategory;

        // Filter by search term
        const searchMatch = currentSearchTerm === '' ||
            recipe.title.toLowerCase().includes(currentSearchTerm) ||
            (recipe.source && recipe.source.toLowerCase().includes(currentSearchTerm)) ||
            (recipe.ingredients && recipe.ingredients.some(ing => ing.toLowerCase().includes(currentSearchTerm))) ||
            (recipe.instructions && recipe.instructions.toLowerCase().includes(currentSearchTerm)) ||
            (recipe.contentLines && recipe.contentLines.some(line => line.toLowerCase().includes(currentSearchTerm)));

        return categoryMatch && searchMatch;
    });

    displayRecipes(filteredRecipes);
}

// Display recipes
function displayRecipes(recipesToDisplay) {
    recipeGrid.innerHTML = '';

    if (recipesToDisplay.length === 0) {
        noResults.style.display = 'block';
        recipeCount.textContent = '';
    } else {
        noResults.style.display = 'none';
        recipeCount.textContent = `Showing ${recipesToDisplay.length} recipe${recipesToDisplay.length !== 1 ? 's' : ''}`;

        const chunkSize = 24;
        let renderIndex = 0;

        const schedule = window.requestIdleCallback || window.requestAnimationFrame || function(cb) {
            return setTimeout(cb, 16);
        };

        const renderChunk = () => {
            const fragment = document.createDocumentFragment();
            const limit = Math.min(renderIndex + chunkSize, recipesToDisplay.length);
            for (; renderIndex < limit; renderIndex++) {
                fragment.appendChild(createRecipeCard(recipesToDisplay[renderIndex]));
            }
            recipeGrid.appendChild(fragment);
            if (renderIndex < recipesToDisplay.length) {
                schedule(renderChunk);
            }
        };

        schedule(renderChunk);
    }
}

function updateHeroStats() {
    const totalEl = document.getElementById('statTotalRecipes');
    const categoriesEl = document.getElementById('statTotalCategories');
    const blueEl = document.getElementById('statBlueRecipes');
    if (!totalEl || !categoriesEl || !blueEl) return;

    const totalRecipes = allRecipes.length;
    const categoryCount = new Set(allRecipes.map(r => r.category)).size;
    const blueCount = blueRecipeEntries.length;

    totalEl.textContent = totalRecipes;
    categoriesEl.textContent = categoryCount;
    blueEl.textContent = blueCount;
}

function restoreFilters() {
    const savedCategory = sessionStorage.getItem(STORAGE_KEYS.category);
    const savedSearch = sessionStorage.getItem(STORAGE_KEYS.search);

    if (savedCategory) {
        currentCategory = savedCategory;
    }

    if (savedSearch && searchInput) {
        currentSearchTerm = savedSearch;
        searchInput.value = savedSearch;
    }

    if (categoryButtons && categoryButtons.length) {
        categoryButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === currentCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

function updateAuthNavLink() {
    if (!loginNavLink || typeof getAuthUser !== 'function') return;
    const user = getAuthUser();
    const link = document.getElementById('loginNavLink');
    if (!link) return;

    link.onclick = null;
    if (user) {
        link.textContent = 'Log out';
        link.href = '#';
        link.addEventListener('click', (event) => {
            event.preventDefault();
            clearAuthUser();
            updateAuthNavLink();
        });
    } else {
        link.textContent = 'Login';
        link.href = 'login.html';
    }
}

// Create recipe card
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.setAttribute('data-recipe-id', recipe.id);
    if (recipe.contentLines && recipe.contentLines.length) {
        card.classList.add('rich-card');
    }
    const hasDetailLink = recipe.hasDetailPage !== false;
    if (!hasDetailLink) {
        card.classList.add('static-card');
    }

    // Get first 2-3 ingredients for preview
    const ingredientPreview = recipe.ingredients && recipe.ingredients.length > 0
        ? recipe.ingredients.slice(0, 3).map(i => escapeHtml(i)).join(', ')
        : '';
    const ingredientHasMore = recipe.ingredients && recipe.ingredients.length > 3;

    // Get first 100 characters of instructions for preview
    const instructionPreview = recipe.instructions
        ? escapeHtml(recipe.instructions.substring(0, 100)) + '...'
        : '';

    const shouldClamp = recipe.contentLines && recipe.contentLines.length > 3;
    const icon = getCategoryIcon(recipe.category);
    const clampHintId = shouldClamp ? `hint-${encodeURIComponent(recipe.id)}` : '';
    const contentLinesHtml = recipe.contentLines && recipe.contentLines.length
        ? `<div class="recipe-card-lines${shouldClamp ? ' clamped' : ''}">${recipe.contentLines.map(line => `<p class="recipe-card-line">${escapeHtml(line)}</p>`).join('')}</div>`
        : '';

    const previewHtml = (!recipe.contentLines || recipe.contentLines.length === 0) ? `
        ${ingredientPreview ? `<p class="recipe-card-preview"><strong>Ingredients:</strong> ${ingredientPreview}${ingredientHasMore ? '...' : ''}</p>` : ''}
        ${instructionPreview ? `<p class="recipe-card-preview"><strong>Instructions:</strong> ${instructionPreview}</p>` : ''}
    ` : '';

    card.innerHTML = `
        <div class="recipe-card-header">
            <h3 class="recipe-card-title">
                <span class="recipe-card-icon" aria-hidden="true">${icon}</span>
                ${escapeHtml(recipe.title)}
            </h3>
        </div>
        <div class="recipe-card-body">
            <span class="recipe-card-category">${escapeHtml(getCategoryName(recipe.category))}</span>
            ${recipe.source ? `<p class="recipe-card-source">Source: ${escapeHtml(recipe.source)}</p>` : ''}
            ${recipe.servings ? `<p class="recipe-card-source">Servings: ${escapeHtml(recipe.servings)}</p>` : ''}
            ${(contentLinesHtml || previewHtml)}
            ${clampHintId ? `<span class="sr-only" id="${clampHintId}">Additional directions truncated. Activate card to view the full recipe.</span>` : ''}
        </div>
        <div class="recipe-card-footer">
            <a href="recipe.html?id=${encodeURIComponent(recipe.id)}" class="view-recipe-btn">View Recipe</a>
        </div>
    `;

    if (hasDetailLink) {
        const goToDetail = () => {
            window.location.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;
        };

        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${recipe.title} recipe card. Activate to open full recipe.`);
        if (clampHintId) {
            card.setAttribute('aria-describedby', clampHintId);
        }
        card.tabIndex = 0;
        card.classList.add('is-clickable');
        card.addEventListener('click', (event) => {
            if (event.target.closest('.view-recipe-btn')) {
                return;
            }
            goToDetail();
        });
        card.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToDetail();
            }
        });
    } else {
        card.setAttribute('role', 'article');
    }

    return card;
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

// Show recipe modal
function showRecipeModal(recipeId) {
    const recipe = allRecipes.find(r => String(r.id) === String(recipeId));
    if (!recipe) return;

    let ingredientsList = '';
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        ingredientsList = '<h3>Ingredients</h3><ul>';
        recipe.ingredients.forEach(ingredient => {
            ingredientsList += `<li>${ingredient}</li>`;
        });
        ingredientsList += '</ul>';
    }

    let instructionsText = '';
    if (recipe.instructions) {
        instructionsText = `<h3>Instructions</h3><p>${recipe.instructions}</p>`;
    }

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${recipe.title}</h2>
            <div class="modal-meta">
                <span>${getCategoryName(recipe.category)}</span>
                ${recipe.source ? ` • Source: ${recipe.source}` : ''}
                ${recipe.servings ? ` • Servings: ${recipe.servings}` : ''}
            </div>
        </div>
        <div class="modal-recipe-content">
            ${ingredientsList}
            ${instructionsText}
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top on category change
categoryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        setTimeout(scrollToTop, 100);
    });
});

// Print recipe functionality
function printRecipe() {
    window.print();
}

// Export functionality (future enhancement)
function exportRecipes() {
    console.log('Export functionality coming soon!');
}

// Performance optimization: Lazy loading for images (if we add them later)
function lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img.lazy');
    images.forEach(img => imageObserver.observe(img));
}

// Service Worker registration for PWA (optional future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.warn('Service worker registration failed:', err);
        });
    });
}

// Analytics (placeholder for future implementation)
function trackRecipeView(recipeId) {
    // Add analytics tracking here
    console.log(`Recipe ${recipeId} viewed`);
}

// Share functionality (if browser supports it)
async function shareRecipe(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    if (navigator.share) {
        try {
            await navigator.share({
                title: recipe.title,
                text: `Check out this recipe: ${recipe.title}`,
                url: window.location.href
            });
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        // Fallback: Copy to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
}

// Favorite recipes (localStorage)
function toggleFavorite(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const index = favorites.indexOf(recipeId);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(recipeId);
    }

    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    updateFavoriteUI(recipeId);
}

function updateFavoriteUI(recipeId) {
    // Update UI to show favorite status
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    // Implementation depends on UI design
}

// Random recipe
function showRandomRecipe() {
    const detailedRecipes = allRecipes.filter(r => r.hasDetailPage);
    if (detailedRecipes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * detailedRecipes.length);
    const randomRecipe = detailedRecipes[randomIndex];
    showRecipeModal(randomRecipe.id);
}

// Initialize favorites on load
document.addEventListener('DOMContentLoaded', function() {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    favorites.forEach(id => updateFavoriteUI(id));
});

// Console welcome message
console.log('%cGrandma Pauline\'s Recipes', 'font-size: 24px; color: #8b4513; font-weight: bold;');
console.log('%cEnjoy browsing through these cherished family recipes!', 'font-size: 14px; color: #666;');
console.log(`Total recipes: ${allRecipes.length}`);
