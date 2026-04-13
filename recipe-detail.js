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

async function loadRecipeDetail() {
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
                <a href="index.html" class="btn-primary">Return to All Recipes</a>
            </div>
        `;
        return;
    }

    let recipe;
    if (isCustom) {
        if (window.CustomRecipeService?.apiAvailable()) {
            await window.CustomRecipeService.syncFromBackend();
        }
        const customRecipes = window.CustomRecipeService?.getLocalRecipes?.() ||
            JSON.parse(localStorage.getItem('customRecipes') || '[]');
        recipe = customRecipes.find(r => String(r.id) === recipeIdParam);
    } else {
        recipe = allRecipes.find(r => String(r.id) === recipeIdParam);
    }

    if (!recipe) {
        recipeDetail.innerHTML = `
            <div class="error-message">
                <h2>Recipe Not Found</h2>
                <p>Sorry, we couldn't find the recipe you're looking for.</p>
                <a href="index.html" class="btn-primary">Return to All Recipes</a>
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

    const backLink = isCustom ? 'my-recipes.html' : 'index.html';
    const backText = isCustom ? '← Back to My Recipes' : '← Back to All Recipes';
    const sectionLabel = recipe.sectionLabel || getCategoryName(recipe.category);
    const neighbors = getNeighborRecipes(recipe.id);
    const navHtml = `
        <div class="recipe-detail-nav">
            ${neighbors.prev ? `<a class="detail-nav-link" href="recipe.html?id=${encodeURIComponent(neighbors.prev.id)}">← ${escapeHtml(neighbors.prev.title)}</a>` : '<span class="detail-nav-limit">← First recipe</span>'}
            ${neighbors.next ? `<a class="detail-nav-link" href="recipe.html?id=${encodeURIComponent(neighbors.next.id)}">${escapeHtml(neighbors.next.title)} →</a>` : '<span class="detail-nav-limit">Last recipe →</span>'}
        </div>
    `;

    // Build the complete recipe HTML
    const cookingSteps = deriveCookingSteps(recipe);

    const spiceAlert = isRecipeSpicy(recipe) ? '<span class="spice-alert">🌶️ Spice Alert</span>' : '';

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
                    ${spiceAlert}
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
            ${cookingSteps.length > 0 ? '<button class="btn-outline" id="cookingModeBtn">🍳 Cooking Mode</button>' : ''}
            <button onclick="window.print()" class="btn-primary">🖨️ Print Recipe</button>
        </div>
    `;

    // Scroll to top
    window.scrollTo(0, 0);

    if (cookingSteps.length > 0) {
        initCookingMode(recipe, cookingSteps);
    }
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

function deriveCookingSteps(recipe) {
    const steps = [];
    if (recipe.instructions) {
        recipe.instructions
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean)
            .forEach(line => {
                const cleaned = line.replace(/^\d+\.\s*/, '');
                if (cleaned) {
                    steps.push(cleaned);
                }
            });
    } else if (Array.isArray(recipe.contentLines)) {
        recipe.contentLines.filter(Boolean).forEach(line => steps.push(line));
    }
    return steps;
}

function initCookingMode(recipe, steps) {
    let overlay = document.getElementById('cookingModeOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'cookingModeOverlay';
        overlay.innerHTML = `
            <div class="cooking-mode-dialog" role="dialog" aria-modal="true">
                <header class="cooking-mode-header">
                    <div>
                        <h2 id="cookingModeTitle"></h2>
                        <p id="cookingModeMeta"></p>
                    </div>
                    <button id="closeCookingMode" class="btn-text">Close ✕</button>
                </header>
                <div class="cooking-mode-body">
                    <div class="step-counter">
                        Step <span id="cookingModeStepIndex">1</span> / <span id="cookingModeStepTotal">1</span>
                    </div>
                    <p id="cookingModeStepText" class="step-text"></p>
                    <div class="cooking-mode-controls">
                        <button id="prevCookingStep" class="btn-secondary">← Previous</button>
                        <button id="nextCookingStep" class="btn-primary">Next →</button>
                    </div>
                </div>
                <div class="cooking-mode-timer">
                    <label>
                        Set timer (minutes)
                        <input type="number" id="cookingModeTimerInput" min="0" max="180" step="1" value="1">
                    </label>
                    <div class="timer-display" id="cookingModeTimerDisplay" aria-live="polite" aria-atomic="true">00:00</div>
                    <p id="cookingModeTimerDone" class="timer-done-msg" aria-live="assertive" style="display:none;">⏰ Timer finished!</p>
                    <div class="timer-buttons">
                        <button id="startCookingTimer" class="btn-primary">Start Timer</button>
                        <button id="pauseCookingTimer" class="btn-secondary">Pause</button>
                        <button id="resetCookingTimer" class="btn-text">Reset</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const state = {
        steps,
        current: 0,
        timer: null,
        remainingSeconds: 0
    };

    const titleEl = document.getElementById('cookingModeTitle');
    const metaEl = document.getElementById('cookingModeMeta');
    const stepIndexEl = document.getElementById('cookingModeStepIndex');
    const stepTotalEl = document.getElementById('cookingModeStepTotal');
    const stepTextEl = document.getElementById('cookingModeStepText');
    const prevBtn = document.getElementById('prevCookingStep');
    const nextBtn = document.getElementById('nextCookingStep');
    const timerInput = document.getElementById('cookingModeTimerInput');
    const timerDisplay = document.getElementById('cookingModeTimerDisplay');
    const timerDoneMsg = document.getElementById('cookingModeTimerDone');
    const startBtn = document.getElementById('startCookingTimer');
    const pauseBtn = document.getElementById('pauseCookingTimer');
    const resetBtn = document.getElementById('resetCookingTimer');
    const closeBtn = document.getElementById('closeCookingMode');

    function updateStep() {
        stepIndexEl.textContent = state.current + 1;
        stepTotalEl.textContent = state.steps.length;
        stepTextEl.textContent = state.steps[state.current];
        prevBtn.disabled = state.current === 0;
        nextBtn.disabled = state.current === state.steps.length - 1;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function clearTimer() {
        if (state.timer) {
            clearInterval(state.timer);
            state.timer = null;
        }
    }

    function startTimer() {
        const minutes = parseInt(timerInput.value, 10) || 0;
        state.remainingSeconds = Math.max(minutes * 60, 0);
        timerDisplay.textContent = formatTime(state.remainingSeconds);
        clearTimer();
        timerDoneMsg.style.display = 'none';
        state.timer = setInterval(() => {
            state.remainingSeconds -= 1;
            if (state.remainingSeconds <= 0) {
                clearTimer();
                state.remainingSeconds = 0;
                timerDisplay.textContent = '00:00';
                timerDoneMsg.style.display = 'block';
            } else {
                timerDisplay.textContent = formatTime(state.remainingSeconds);
            }
        }, 1000);
    }

    function pauseTimer() {
        clearTimer();
    }

    function resetTimer() {
        clearTimer();
        timerDisplay.textContent = '00:00';
        timerDoneMsg.style.display = 'none';
        timerInput.value = '1';
    }

    document.getElementById('cookingModeBtn').onclick = () => {
        overlay.classList.add('visible');
        titleEl.textContent = recipe.title;
        metaEl.textContent = recipe.servings ? `Serves ${recipe.servings}` : 'Cooking together';
        state.current = 0;
        updateStep();
        resetTimer();
    };

    closeBtn.onclick = () => {
        overlay.classList.remove('visible');
        clearTimer();
    };

    prevBtn.onclick = () => {
        if (state.current > 0) {
            state.current -= 1;
            updateStep();
        }
    };
    nextBtn.onclick = () => {
        if (state.current < state.steps.length - 1) {
            state.current += 1;
            updateStep();
        }
    };

    startBtn.onclick = startTimer;
    pauseBtn.onclick = pauseTimer;
    resetBtn.onclick = resetTimer;
}

function isRecipeSpicy(recipe) {
    const keywords = ['chipotle', 'jalapeno', 'jalapeño', 'spicy', 'cayenne', 'chili', 'chile', 'sriracha', 'pepper flakes', 'habanero'];
    const haystack = `${(recipe.ingredients || []).join(' ')} ${(recipe.instructions || '')}`.toLowerCase();
    return keywords.some(keyword => haystack.includes(keyword));
}
function printRecipe() {
    window.print();
}
