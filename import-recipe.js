// Import Recipe JavaScript

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isSafeImageUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

let extractedRecipeData = null;
let importedRecipeData = null;
const importQueue = [];
let queueProcessing = false;
let queueElements = {};

document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    setupScanUpload();
    setupUrlImport();
});

// Tab Navigation
function setupTabs() {
    const tabs = document.querySelectorAll('.import-tab');
    const tabContents = document.querySelectorAll('.import-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Scan Recipe from Photo (OCR)
function setupScanUpload() {
    const scanInput = document.getElementById('scanImage');
    const removeScan = document.getElementById('removeScan');
    const rescanBtn = document.getElementById('rescanImage');
    const editBtn = document.getElementById('editExtracted');

    scanInput.addEventListener('change', handleScanUpload);
    removeScan.addEventListener('click', resetScan);
    rescanBtn.addEventListener('click', resetScan);
    editBtn.addEventListener('click', editExtractedRecipe);
}

function handleScanUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG)');
        return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('Image file is too large. Please choose an image smaller than 10MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const scanPreview = document.getElementById('scanPreview');
        const scanPreviewImg = document.getElementById('scanPreviewImg');

        scanPreviewImg.src = e.target.result;
        scanPreview.style.display = 'block';

        // Start OCR processing
        performOCR(e.target.result);
    };
    reader.readAsDataURL(file);
}

async function performOCR(imageData) {
    const progress = document.getElementById('scanProgress');
    const result = document.getElementById('scanResult');
    const progressBar = document.getElementById('progressBarFill');

    progress.style.display = 'block';
    result.style.display = 'none';

    try {
        const worker = await Tesseract.createWorker({
            logger: m => {
                if (m.status === 'recognizing text') {
                    const percent = Math.round(m.progress * 100);
                    progressBar.style.width = percent + '%';
                }
            }
        });

        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        const { data: { text } } = await worker.recognize(imageData);
        await worker.terminate();

        document.getElementById('extractedText').value = text;
        result.style.display = 'block';

        extractedRecipeData = {
            text: text,
            image: imageData
        };

    } catch (error) {
        console.error('OCR Error:', error);
        alert('Sorry, we couldn\'t scan this image. Please try a clearer photo or enter the recipe manually.');
    } finally {
        progress.style.display = 'none';
        progressBar.style.width = '0%';
    }
}

function resetScan() {
    document.getElementById('scanImage').value = '';
    document.getElementById('scanPreview').style.display = 'none';
    document.getElementById('scanProgress').style.display = 'none';
    document.getElementById('scanResult').style.display = 'none';
    extractedRecipeData = null;
}

function editExtractedRecipe() {
    if (!extractedRecipeData) return;

    // Store extracted data in localStorage for the add-recipe page
    localStorage.setItem('extractedRecipeText', extractedRecipeData.text);
    if (extractedRecipeData.image) {
        localStorage.setItem('extractedRecipeImage', extractedRecipeData.image);
    }

    // Redirect to add recipe page
    window.location.href = 'add-recipe.html?mode=edit-scan';
}

// URL Import
function setupUrlImport() {
    const importBtn = document.getElementById('importUrl');
    const tryAnotherBtn = document.getElementById('tryAnotherUrl');
    const saveBtn = document.getElementById('saveUrlRecipe');
    queueElements = {
        container: document.getElementById('urlQueue'),
        list: document.getElementById('urlQueueList'),
        progress: document.getElementById('urlProgress'),
        result: document.getElementById('urlResult'),
        suggestion: document.getElementById('categorySuggestion')
    };

    importBtn.addEventListener('click', handleUrlImport);
    tryAnotherBtn.addEventListener('click', resetUrlImport);
    saveBtn.addEventListener('click', saveUrlRecipe);
}

function handleUrlImport() {
    const urlInput = document.getElementById('recipeUrl');
    const url = urlInput.value.trim();

    if (!url) {
        alert('Please enter a recipe URL');
        return;
    }

    // Validate URL
    try {
        new URL(url);
    } catch (e) {
        alert('Please enter a valid URL');
        return;
    }

    if (importQueue.some(item => item.url === url)) {
        alert('This URL is already in the queue.');
        return;
    }

    importQueue.push({ url, status: 'pending' });
    renderQueue();
    processQueue();
}

function renderQueue() {
    if (!queueElements.container || !queueElements.list) return;
    if (!importQueue.length) {
        queueElements.container.style.display = 'none';
        return;
    }
    queueElements.container.style.display = 'block';
    queueElements.list.innerHTML = importQueue.map(item => {
        const status = item.status;
        const duplicate = item.duplicate ? '<span class="muted">Possible duplicate</span>' : '';
        const statusLabel = status === 'pending' ? 'Queued'
            : status === 'processing' ? 'Importing…'
            : status === 'done' ? 'Ready'
            : 'Failed';
        return `<li>
            <span>${escapeHtml(item.url)}</span>
            <span>${escapeHtml(statusLabel)} ${duplicate}</span>
        </li>`;
    }).join('');
}

async function processQueue() {
    if (queueProcessing) return;
    const nextItem = importQueue.find(item => item.status === 'pending');
    if (!nextItem) {
        queueProcessing = false;
        if (queueElements.progress) queueElements.progress.style.display = 'none';
        return;
    }
    queueProcessing = true;
    nextItem.status = 'processing';
    renderQueue();
    if (queueElements.progress) queueElements.progress.style.display = 'block';
    if (queueElements.result) queueElements.result.style.display = 'none';

    try {
        const data = await fetchRecipeFromUrl(nextItem.url);
        nextItem.status = 'done';
        nextItem.title = data.title;
        nextItem.duplicate = checkDuplicateTitle(data.title);
        renderQueue();
        displayImportedRecipe(data, nextItem);
    } catch (error) {
        console.error('URL Import Error:', error);
        nextItem.status = 'error';
        nextItem.error = error.message;
        renderQueue();
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            await showUrlImportInstructions(nextItem.url);
        } else {
            alert('Unable to import from this URL. Please try another or use manual entry.');
        }
    } finally {
        queueProcessing = false;
        processQueue();
    }
}

// Fetch recipe from URL using serverless function
async function fetchRecipeFromUrl(url) {
    // Detect which platform we're on (Netlify or Cloudflare Pages)
    // Cloudflare Pages uses the route name directly (no /functions prefix)
    let apiEndpoint = '/fetch-recipe';

    const host = window.location.hostname;
    const isNetlify = host.includes('netlify') || host.includes('127.0.0.1') || host.includes('localhost');

    if (isNetlify) {
        apiEndpoint = '/.netlify/functions/fetch-recipe';
    }

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Failed to parse recipe');
    }

    return data;
}

function displayImportedRecipe(data, queueItem) {
    const result = document.getElementById('urlResult');
    const urlTitle = document.getElementById('urlTitle');
    const urlContent = document.getElementById('urlContent');
    const suggestion = document.getElementById('categorySuggestion');

    importedRecipeData = data;

    if (queueElements.progress) queueElements.progress.style.display = 'none';
    result.style.display = 'block';

    urlTitle.textContent = data.title;

    const recommendedCategory = suggestCategory(data);
    const recommendedKey = Object.keys({
        meats: 'Meats', oriental: 'Oriental Cooking', pasta: 'Pasta', pastry: 'Pastry & Pies',
        preserves: 'Preserves & Canning', poultry: 'Poultry', salads: 'Salads & Dressings',
        sandwiches: 'Sandwiches', sauces: 'Sauces & Gravies', soups: 'Soups',
        vegetables: 'Vegetables', appetizers: 'Appetizers', beverages: 'Beverages',
        bread: 'Bread', sweets: 'Sweets & Candy', casseroles: 'Casseroles', cake: 'Cakes',
        cookies: 'Cookies', desserts: 'Desserts', frozen: 'Frozen Desserts', diet: 'Diet Dishes',
        eggs: 'Eggs & Cheese', fish: 'Fish & Seafood', frostings: 'Frostings', fruits: 'Fruits'
    }).find(k => getCategoryName(k) === recommendedCategory) || 'meats';

    const categorySelect = document.getElementById('importCategorySelect');
    if (categorySelect) {
        categorySelect.innerHTML = Object.entries({
            meats: 'Meats', oriental: 'Oriental Cooking', pasta: 'Pasta', pastry: 'Pastry & Pies',
            preserves: 'Preserves & Canning', poultry: 'Poultry', salads: 'Salads & Dressings',
            sandwiches: 'Sandwiches', sauces: 'Sauces & Gravies', soups: 'Soups',
            vegetables: 'Vegetables', appetizers: 'Appetizers', beverages: 'Beverages',
            bread: 'Bread', sweets: 'Sweets & Candy', casseroles: 'Casseroles', cake: 'Cakes',
            cookies: 'Cookies', desserts: 'Desserts', frozen: 'Frozen Desserts', diet: 'Diet Dishes',
            eggs: 'Eggs & Cheese', fish: 'Fish & Seafood', frostings: 'Frostings', fruits: 'Fruits'
        }).map(([k, v]) => `<option value="${k}"${k === recommendedKey ? ' selected' : ''}>${v}</option>`).join('');
    }

    if (suggestion) {
        const duplicateNote = queueItem?.duplicate ? 'Looks similar to a recipe you already saved. ' : '';
        suggestion.textContent = duplicateNote ? duplicateNote.trim() : '';
    }

    let contentHTML = '<div class="recipe-preview">';

    if (data.note) {
        contentHTML += `<p class="info-message" style="background: #fff8dc; padding: 15px; border-radius: 5px; margin-bottom: 20px;"><strong>Note:</strong> ${escapeHtml(data.note)}</p>`;
    }

    if (data.image && isSafeImageUrl(data.image)) {
        contentHTML += `<img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;">`;
    }

    if (data.servings) {
        contentHTML += `<p><strong>Servings:</strong> ${escapeHtml(data.servings)}</p>`;
    }

    if (data.prepTime) {
        contentHTML += `<p><strong>Prep Time:</strong> ${escapeHtml(data.prepTime)}</p>`;
    }

    if (data.cookTime) {
        contentHTML += `<p><strong>Cook Time:</strong> ${escapeHtml(data.cookTime)}</p>`;
    }

    if (data.totalTime) {
        contentHTML += `<p><strong>Total Time:</strong> ${escapeHtml(data.totalTime)}</p>`;
    }

    contentHTML += '<h4 style="margin-top: 20px;">Ingredients:</h4><ul style="list-style-position: inside;">';
    data.ingredients.forEach(ing => {
        contentHTML += `<li>${escapeHtml(ing)}</li>`;
    });
    contentHTML += '</ul>';

    contentHTML += '<h4 style="margin-top: 20px;">Instructions:</h4>';
    contentHTML += `<div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(data.instructions)}</div>`;

    contentHTML += '</div>';

    urlContent.innerHTML = contentHTML;
}

// Fallback: Show instructions when serverless function is not available
async function showUrlImportInstructions(url) {
    const progress = document.getElementById('urlProgress');
    const result = document.getElementById('urlResult');
    const urlTitle = document.getElementById('urlTitle');
    const urlContent = document.getElementById('urlContent');

    progress.style.display = 'none';
    result.style.display = 'block';

    urlTitle.textContent = 'Import Not Available (Backend Required)';
    urlContent.innerHTML = `
        <div class="info-box">
            <p><strong>The recipe import feature requires the site to be deployed with serverless functions enabled.</strong></p>

            <h4>Alternative Solutions:</h4>
            <ol>
                <li><strong>Copy & Paste:</strong> Copy the recipe text from the website and use the "Manual Entry" tab</li>
                <li><strong>Screenshot:</strong> Take a screenshot of the recipe and use "Scan Photo"</li>
                <li><strong>Browser Extension:</strong> Use a recipe clipper browser extension to save recipes</li>
            </ol>

            <h4>For Deployment:</h4>
            <p>This feature works automatically when deployed to:</p>
            <ul>
                <li><strong>Netlify</strong> - Serverless functions enabled by default</li>
                <li><strong>Vercel</strong> - API routes enabled by default</li>
            </ul>
            <p>The backend function is already included in your project files.</p>

            <p><strong>URL you tried:</strong> <a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(url)}</a></p>
        </div>
    `;
}

function resetUrlImport() {
    document.getElementById('recipeUrl').value = '';
    document.getElementById('urlProgress').style.display = 'none';
    document.getElementById('urlResult').style.display = 'none';
    if (queueElements?.suggestion) {
        queueElements.suggestion.textContent = '';
    }
}

async function saveUrlRecipe() {
    if (!importedRecipeData) {
        alert('No recipe data to save. Please import a recipe first.');
        return;
    }

    // Get existing custom recipes
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');

    const selectedCategory = document.getElementById('importCategorySelect')?.value || 'meats';

    // Create new recipe object
    const newRecipe = {
        id: Date.now(),
        title: importedRecipeData.title,
        category: selectedCategory,
        ingredients: importedRecipeData.ingredients,
        instructions: importedRecipeData.instructions,
        servings: importedRecipeData.servings || '',
        source: importedRecipeData.source || '',
        image: importedRecipeData.image || null,
        isCustom: true,
        isPublic: false,
        dateAdded: new Date().toISOString()
    };

    try {
        if (window.CustomRecipeService?.saveRecipe) {
            await window.CustomRecipeService.saveRecipe(newRecipe);
        } else {
            customRecipes.push(newRecipe);
            localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
        }
    } catch (error) {
        console.error('Failed to save imported recipe', error);
        alert('Unable to save this recipe right now. Please try again in a moment.');
        return;
    }

    window.location.href = 'my-recipes.html';
}

function checkDuplicateTitle(title = '') {
    const normalized = title.trim().toLowerCase();
    if (!normalized) return false;
    const local = window.CustomRecipeService?.getLocalRecipes?.() || [];
    return local.some(recipe => (recipe.title || '').trim().toLowerCase() === normalized);
}

function suggestCategory(data) {
    const mapping = [
        { category: 'desserts', keywords: ['cake', 'cookie', 'pie', 'sweet', 'frosting'] },
        { category: 'meats', keywords: ['beef', 'pork', 'steak', 'bacon'] },
        { category: 'poultry', keywords: ['chicken', 'turkey'] },
        { category: 'fish', keywords: ['salmon', 'shrimp', 'cod'] },
        { category: 'soups', keywords: ['soup', 'stew', 'broth', 'chili'] },
        { category: 'salads', keywords: ['salad', 'greens', 'vinaigrette'] },
        { category: 'appetizers', keywords: ['dip', 'appetizer', 'starter'] },
        { category: 'vegetables', keywords: ['kale', 'carrot', 'spinach'] },
        { category: 'pasta', keywords: ['pasta', 'noodle', 'lasagna'] }
    ];
    const haystack = `${(data.ingredients || []).join(' ')} ${(data.instructions || '')}`.toLowerCase();
    for (const map of mapping) {
        if (map.keywords.some(keyword => haystack.includes(keyword))) {
            return getCategoryName(map.category);
        }
    }
    return 'Meats';
}

// Helper function to parse recipe text intelligently
function parseRecipeText(text) {
    // Basic recipe parsing logic
    const lines = text.split('\n').filter(line => line.trim());

    let title = lines[0] || 'Scanned Recipe';
    let ingredients = [];
    let instructions = '';

    let inIngredients = false;
    let inInstructions = false;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        const lowerLine = line.toLowerCase();

        // Detect ingredients section
        if (lowerLine.includes('ingredient') || lowerLine.match(/^\d+\s*(cup|tbsp|tsp|lb|oz)/)) {
            inIngredients = true;
            inInstructions = false;
            if (lowerLine.includes('ingredient')) continue;
        }

        // Detect instructions section
        if (lowerLine.includes('instruction') || lowerLine.includes('direction') ||
            lowerLine.match(/^step\s*\d+/i)) {
            inInstructions = true;
            inIngredients = false;
            if (lowerLine.includes('instruction') || lowerLine.includes('direction')) continue;
        }

        // Collect ingredients
        if (inIngredients && !inInstructions) {
            if (line.match(/^[\d\/\s]*(cup|tbsp|tsp|tablespoon|teaspoon|lb|oz|pound|ounce)/i) ||
                line.match(/^\d/) || line.includes('•') || line.includes('-')) {
                ingredients.push(line.replace(/^[•\-\*]\s*/, ''));
            }
        }

        // Collect instructions
        if (inInstructions) {
            instructions += line + '\n';
        }
    }

    return {
        title,
        ingredients: ingredients.length > 0 ? ingredients : ['Please add ingredients'],
        instructions: instructions || 'Please add instructions'
    };
}

function getCategoryName(category) {
    const categoryNames = {
        meats: 'Meats',
        oriental: 'Oriental Cooking',
        pasta: 'Pasta',
        pastry: 'Pastry & Pies',
        preserves: 'Preserves & Canning',
        poultry: 'Poultry',
        salads: 'Salads & Dressings',
        sandwiches: 'Sandwiches',
        sauces: 'Sauces & Gravies',
        soups: 'Soups',
        vegetables: 'Vegetables',
        appetizers: 'Appetizers',
        beverages: 'Beverages',
        bread: 'Bread',
        sweets: 'Sweets & Candy',
        casseroles: 'Casseroles',
        cake: 'Cakes',
        cookies: 'Cookies',
        desserts: 'Desserts',
        frozen: 'Frozen Desserts',
        diet: 'Diet Dishes',
        eggs: 'Eggs & Cheese',
        fish: 'Fish & Seafood',
        frostings: 'Frostings',
        fruits: 'Fruits'
    };
    return categoryNames[category] || 'Family Favorite';
}
