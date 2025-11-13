// Add Recipe Form JavaScript

const FORM_LIMITS = {
    titleMin: 3,
    titleMax: 120,
    ingredientMax: 160,
    instructionsMin: 20,
    sourceMax: 80,
    servingsMax: 60
};

document.addEventListener('DOMContentLoaded', function() {
    setupFormHandlers();
});

function sanitizeInput(value = '') {
    const temp = document.createElement('textarea');
    temp.innerHTML = value;
    return temp.value.trim();
}

function sanitizeMultiline(value = '') {
    const temp = document.createElement('textarea');
    temp.innerHTML = value;
    return temp.value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function showFormErrors(messages = []) {
    const container = document.getElementById('formErrors');
    if (!container) return;

    if (!messages.length) {
        container.classList.remove('active');
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <p>Please fix the following:</p>
        <ul>${messages.map(msg => `<li>${msg}</li>`).join('')}</ul>
    `;
    container.style.display = 'block';
    container.classList.add('active');
    container.focus();
}

function setupFormHandlers() {
    const form = document.getElementById('addRecipeForm');
    const addIngredientBtn = document.getElementById('addIngredient');
    const imageInput = document.getElementById('recipeImage');
    const removeImageBtn = document.getElementById('removeImage');

    // Add ingredient functionality
    addIngredientBtn.addEventListener('click', addIngredientField);

    // Image upload preview
    imageInput.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeImage);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Form reset
    form.addEventListener('reset', function() {
        removeImage();
        // Reset to one ingredient field
        const ingredientsList = document.getElementById('ingredientsList');
        ingredientsList.innerHTML = `
            <div class="ingredient-item">
                <input type="text" class="form-input ingredient-input" placeholder="e.g., 2 cups flour" required>
                <button type="button" class="remove-ingredient-btn" style="display: none;">✕</button>
            </div>
        `;
    });
}

// Add ingredient field
function addIngredientField() {
    const ingredientsList = document.getElementById('ingredientsList');
    const newItem = document.createElement('div');
    newItem.className = 'ingredient-item';
    newItem.innerHTML = `
        <input type="text" class="form-input ingredient-input" placeholder="e.g., 1 cup sugar" required>
        <button type="button" class="remove-ingredient-btn">✕</button>
    `;

    ingredientsList.appendChild(newItem);

    // Add remove functionality
    const removeBtn = newItem.querySelector('.remove-ingredient-btn');
    removeBtn.addEventListener('click', function() {
        newItem.remove();
        updateRemoveButtons();
    });

    updateRemoveButtons();
}

// Update remove button visibility
function updateRemoveButtons() {
    const items = document.querySelectorAll('.ingredient-item');
    items.forEach((item, index) => {
        const removeBtn = item.querySelector('.remove-ingredient-btn');
        if (items.length === 1) {
            removeBtn.style.display = 'none';
        } else {
            removeBtn.style.display = 'block';
        }
    });
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file is too large. Please choose an image smaller than 5MB.');
            event.target.value = '';
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');

            previewImg.src = e.target.result;
            preview.style.display = 'block';
            document.querySelector('.file-upload-label').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Remove image
function removeImage() {
    const imageInput = document.getElementById('recipeImage');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    imageInput.value = '';
    previewImg.src = '';
    preview.style.display = 'none';
    document.querySelector('.file-upload-label').style.display = 'flex';
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const validationErrors = [];

    // Get ingredients
    const ingredientInputs = document.querySelectorAll('.ingredient-input');
    const ingredients = Array.from(ingredientInputs)
        .map(input => sanitizeInput(input.value))
        .filter(value => value !== '');

    // Get image if uploaded
    const previewImg = document.getElementById('previewImg');
    const imageData = previewImg.src || null;

    const title = sanitizeInput(formData.get('title') || '');
    const category = formData.get('category');
    const source = sanitizeInput(formData.get('source') || '');
    const servings = sanitizeInput(formData.get('servings') || '');
    const instructions = sanitizeMultiline(formData.get('instructions') || '');

    if (!title || title.length < FORM_LIMITS.titleMin || title.length > FORM_LIMITS.titleMax) {
        validationErrors.push(`Title must be between ${FORM_LIMITS.titleMin} and ${FORM_LIMITS.titleMax} characters.`);
    }

    if (!category) {
        validationErrors.push('Please select a category.');
    }

    if (!ingredients.length) {
        validationErrors.push('Please add at least one ingredient.');
    }

    if (ingredients.some(ing => ing.length > FORM_LIMITS.ingredientMax)) {
        validationErrors.push(`Each ingredient must be fewer than ${FORM_LIMITS.ingredientMax} characters.`);
    }

    if (!instructions || instructions.length < FORM_LIMITS.instructionsMin) {
        validationErrors.push(`Instructions must be at least ${FORM_LIMITS.instructionsMin} characters long.`);
    }

    if (source && source.length > FORM_LIMITS.sourceMax) {
        validationErrors.push(`Source should be fewer than ${FORM_LIMITS.sourceMax} characters.`);
    }

    if (servings && servings.length > FORM_LIMITS.servingsMax) {
        validationErrors.push(`Servings should be fewer than ${FORM_LIMITS.servingsMax} characters.`);
    }

    if (validationErrors.length) {
        showFormErrors(validationErrors);
        document.getElementById('formErrors').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    } else {
        showFormErrors([]);
    }

    // Create recipe object
    const recipe = {
        id: Date.now(), // Use timestamp as unique ID
        title,
        category,
        source: source || 'My Recipe',
        servings,
        ingredients: ingredients,
        instructions,
        image: imageData,
        isCustom: true,
        dateAdded: new Date().toISOString()
    };

    // Save to localStorage
    saveRecipe(recipe);

    // Show success message
    showSuccessMessage();
}

// Save recipe to localStorage
function saveRecipe(recipe) {
    let customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
    customRecipes.push(recipe);
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('addRecipeForm');
    const successMessage = document.getElementById('successMessage');
    showFormErrors([]);

    form.style.display = 'none';
    successMessage.style.display = 'block';

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize remove buttons
document.addEventListener('DOMContentLoaded', function() {
    updateRemoveButtons();
});
