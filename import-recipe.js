// Import Recipe JavaScript

let extractedRecipeData = null;
let importedRecipeData = null;

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

        // Display extracted text
        document.getElementById('extractedText').value = text;
        progress.style.display = 'none';
        result.style.display = 'block';

        extractedRecipeData = {
            text: text,
            image: imageData
        };

    } catch (error) {
        console.error('OCR Error:', error);
        progress.style.display = 'none';
        alert('Sorry, we couldn\'t scan this image. Please try a clearer photo or enter the recipe manually.');
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
    window.location.href = 'add-recipe?mode=edit-scan';
}

// URL Import
function setupUrlImport() {
    const importBtn = document.getElementById('importUrl');
    const tryAnotherBtn = document.getElementById('tryAnotherUrl');
    const saveBtn = document.getElementById('saveUrlRecipe');

    importBtn.addEventListener('click', handleUrlImport);
    tryAnotherBtn.addEventListener('click', resetUrlImport);
    saveBtn.addEventListener('click', saveUrlRecipe);
}

async function handleUrlImport() {
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

    const progress = document.getElementById('urlProgress');
    const result = document.getElementById('urlResult');

    progress.style.display = 'block';
    result.style.display = 'none';

    try {
        // Try to use serverless function if available
        await fetchRecipeFromUrl(url);

    } catch (error) {
        console.error('URL Import Error:', error);
        progress.style.display = 'none';

        // Check if it's a network error (serverless function not available)
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            // Fallback to showing instructions
            await showUrlImportInstructions(url);
        } else {
            alert('Unable to import from this URL. This might be due to:\n\n' +
                  '1. The URL doesn\'t contain recipe data\n' +
                  '2. The website blocks automated access\n' +
                  '3. Network issues\n\n' +
                  'Try copying the recipe text and using "Scan Photo" or "Manual Entry" instead.');
        }
    }
}

// Fetch recipe from URL using serverless function
async function fetchRecipeFromUrl(url) {
    const progress = document.getElementById('urlProgress');
    const result = document.getElementById('urlResult');
    const urlTitle = document.getElementById('urlTitle');
    const urlContent = document.getElementById('urlContent');

    // Detect which platform we're on (Netlify or Cloudflare Pages)
    // Try Cloudflare Pages function first, fallback to Netlify
    let apiEndpoint = '/functions/fetch-recipe'; // Cloudflare Pages format

    // If on Netlify, use Netlify functions format
    if (window.location.hostname.includes('netlify')) {
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

    // Store the imported data
    importedRecipeData = data;

    // Display the imported recipe
    progress.style.display = 'none';
    result.style.display = 'block';

    urlTitle.textContent = data.title;

    let contentHTML = '<div class="recipe-preview">';

    if (data.note) {
        contentHTML += `<p class="info-message" style="background: #fff8dc; padding: 15px; border-radius: 5px; margin-bottom: 20px;"><strong>Note:</strong> ${data.note}</p>`;
    }

    if (data.image) {
        contentHTML += `<img src="${data.image}" alt="${data.title}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;">`;
    }

    if (data.servings) {
        contentHTML += `<p><strong>Servings:</strong> ${data.servings}</p>`;
    }

    if (data.prepTime) {
        contentHTML += `<p><strong>Prep Time:</strong> ${data.prepTime}</p>`;
    }

    if (data.cookTime) {
        contentHTML += `<p><strong>Cook Time:</strong> ${data.cookTime}</p>`;
    }

    if (data.totalTime) {
        contentHTML += `<p><strong>Total Time:</strong> ${data.totalTime}</p>`;
    }

    contentHTML += '<h4 style="margin-top: 20px;">Ingredients:</h4><ul style="list-style-position: inside;">';
    data.ingredients.forEach(ing => {
        contentHTML += `<li>${ing}</li>`;
    });
    contentHTML += '</ul>';

    contentHTML += '<h4 style="margin-top: 20px;">Instructions:</h4>';
    contentHTML += `<div style="white-space: pre-wrap; line-height: 1.6;">${data.instructions}</div>`;

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

            <p><strong>URL you tried:</strong> <a href="${url}" target="_blank" rel="noopener">${url}</a></p>
        </div>
    `;
}

function resetUrlImport() {
    document.getElementById('recipeUrl').value = '';
    document.getElementById('urlProgress').style.display = 'none';
    document.getElementById('urlResult').style.display = 'none';
}

function saveUrlRecipe() {
    if (!importedRecipeData) {
        alert('No recipe data to save. Please import a recipe first.');
        return;
    }

    // Get existing custom recipes
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');

    // Create new recipe object
    const newRecipe = {
        id: Date.now(),
        title: importedRecipeData.title,
        category: 'meats', // Default category, user can edit later
        ingredients: importedRecipeData.ingredients,
        instructions: importedRecipeData.instructions,
        servings: importedRecipeData.servings || '',
        source: importedRecipeData.source || '',
        image: importedRecipeData.image || null,
        isCustom: true,
        dateAdded: new Date().toISOString()
    };

    // Add to custom recipes
    customRecipes.push(newRecipe);

    // Save to localStorage
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));

    // Show success message
    alert('Recipe imported successfully! You can view it in "My Recipes" or edit it in "Add Recipe".');

    // Redirect to my recipes page
    window.location.href = 'my-recipes.html';
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
