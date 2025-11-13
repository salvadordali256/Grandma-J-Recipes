// Netlify serverless function to fetch recipes from URLs
// This bypasses CORS restrictions by fetching on the server side

const https = require('https');
const http = require('http');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { url } = JSON.parse(event.body);

        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'URL is required' })
            };
        }

        // Validate URL
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid URL' })
            };
        }

        // Fetch the recipe page
        const html = await fetchURL(url);

        // Parse recipe data using common recipe markup patterns
        const recipeData = parseRecipe(html, url);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(recipeData)
        };

    } catch (error) {
        console.error('Error fetching recipe:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to fetch recipe',
                message: error.message
            })
        };
    }
};

// Fetch URL content
function fetchURL(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; RecipeBot/1.0)'
            }
        };

        protocol.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Parse recipe from HTML
function parseRecipe(html, url) {
    // Try to extract JSON-LD recipe data first (most reliable)
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);

    if (jsonLdMatch) {
        for (const match of jsonLdMatch) {
            try {
                const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
                const data = JSON.parse(jsonContent);

                // Handle @graph array
                const recipes = Array.isArray(data) ? data : (data['@graph'] || [data]);

                for (const item of recipes) {
                    if (item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))) {
                        return formatRecipeFromJsonLd(item, url);
                    }
                }
            } catch (e) {
                // Continue to next JSON-LD block
                continue;
            }
        }
    }

    // Fallback: Try to extract from HTML using common patterns
    return parseRecipeFromHTML(html, url);
}

// Format recipe from JSON-LD structured data
function formatRecipeFromJsonLd(recipe, url) {
    const ingredients = [];

    if (recipe.recipeIngredient) {
        const rawIngredients = Array.isArray(recipe.recipeIngredient)
            ? recipe.recipeIngredient
            : [recipe.recipeIngredient];

        ingredients.push(...rawIngredients.map(i => String(i).trim()));
    }

    let instructions = '';
    if (recipe.recipeInstructions) {
        if (Array.isArray(recipe.recipeInstructions)) {
            instructions = recipe.recipeInstructions.map((step, index) => {
                if (typeof step === 'string') {
                    return `${index + 1}. ${step}`;
                } else if (step.text) {
                    return `${index + 1}. ${step.text}`;
                }
                return '';
            }).join('\n\n');
        } else if (typeof recipe.recipeInstructions === 'string') {
            instructions = recipe.recipeInstructions;
        }
    }

    return {
        success: true,
        title: recipe.name || 'Imported Recipe',
        ingredients: ingredients.length > 0 ? ingredients : ['No ingredients found'],
        instructions: instructions || 'No instructions found',
        servings: recipe.recipeYield ? String(recipe.recipeYield) : '',
        source: url,
        image: recipe.image ? (Array.isArray(recipe.image) ? recipe.image[0] : recipe.image.url || recipe.image) : null,
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        totalTime: recipe.totalTime || ''
    };
}

// Fallback HTML parsing
function parseRecipeFromHTML(html, url) {
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
                      html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Imported Recipe';

    // Try to find ingredients section
    const ingredients = [];
    const ingredientMatches = html.match(/<li[^>]*class="[^"]*ingredient[^"]*"[^>]*>([^<]+)<\/li>/gi) ||
                             html.match(/<div[^>]*class="[^"]*ingredient[^"]*"[^>]*>([^<]+)<\/div>/gi);

    if (ingredientMatches) {
        ingredientMatches.forEach(match => {
            const text = match.replace(/<[^>]+>/g, '').trim();
            if (text) ingredients.push(text);
        });
    }

    // Try to find instructions
    let instructions = '';
    const instructionMatch = html.match(/<div[^>]*class="[^"]*instructions?[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                           html.match(/<ol[^>]*class="[^"]*instructions?[^"]*"[^>]*>([\s\S]*?)<\/ol>/i);

    if (instructionMatch) {
        instructions = instructionMatch[1]
            .replace(/<li[^>]*>/gi, '\n• ')
            .replace(/<[^>]+>/g, '')
            .trim();
    }

    return {
        success: true,
        title: cleanText(title),
        ingredients: ingredients.length > 0 ? ingredients : ['Could not extract ingredients - please add manually'],
        instructions: instructions || 'Could not extract instructions - please add manually',
        servings: '',
        source: url,
        note: 'Recipe data was partially extracted. Please review and edit as needed.'
    };
}

// Clean text from HTML entities
function cleanText(text) {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}
