# Deployment Guide

Your recipe website now includes **URL Import** functionality using serverless functions! Follow this guide to deploy your site.

## 🚀 Quick Deploy (Recommended)

### Option 1: Deploy to Netlify (Easiest!)

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Grandma Pauline's Recipe Site"
   ```

2. **Push to GitHub**:
   - Create a new repository at https://github.com/new
   - Follow GitHub's instructions to push your code

3. **Deploy to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and select your repository
   - Click "Deploy" (no configuration needed!)

**That's it!** Netlify will automatically:
- ✅ Deploy your static files
- ✅ Enable the serverless function for URL import
- ✅ Provide HTTPS
- ✅ Give you a free subdomain (you can add a custom domain later)

### Option 2: Deploy to Vercel

Vercel also works great! You'll need to adapt the serverless function:

1. Create a `vercel.json` file:
```json
{
  "functions": {
    "api/fetch-recipe.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

2. Move the function:
```bash
mkdir -p api
cp netlify/functions/fetch-recipe.js api/
```

3. Deploy via Vercel CLI or GitHub integration

## 📁 What's Included

Your project now has these deployment files:

- **`netlify.toml`** - Netlify configuration
  - Defines the serverless functions directory
  - Sets up security headers
  - Configures redirects

- **`netlify/functions/fetch-recipe.js`** - Serverless function
  - Fetches recipes from URLs
  - Parses recipe data using JSON-LD structured data
  - Bypasses CORS restrictions

- **`package.json`** - Project metadata
  - Helps with dependency management
  - Provides npm scripts for local development

## 🧪 Testing Locally

The URL import feature **won't work locally** without additional setup because it requires the Netlify serverless function environment.

### To test locally with Netlify Dev:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Run local dev server**:
   ```bash
   netlify dev
   ```

3. **Open** http://localhost:8888

This simulates the production environment and enables the serverless function!

## 🎯 How URL Import Works

1. User enters a recipe URL (e.g., from Allrecipes, Food Network, etc.)
2. Frontend calls `/.netlify/functions/fetch-recipe`
3. Serverless function:
   - Fetches the recipe page (bypassing CORS)
   - Looks for JSON-LD structured data (Recipe schema)
   - Extracts title, ingredients, instructions, image, etc.
   - Returns parsed data to frontend
4. User can preview and save the recipe

## 🌐 Supported Recipe Websites

The serverless function works best with sites that use **Recipe Schema** (JSON-LD):

✅ **Works Great:**
- AllRecipes.com
- Food Network
- Bon Appétit
- Serious Eats
- NYT Cooking
- Tasty
- Epicurious
- Most major recipe sites

⚠️ **May Have Issues:**
- Sites that block automated access
- Sites without structured data
- Paywalled content
- Sites with heavy JavaScript rendering

## 🔧 Troubleshooting

### URL import shows "Backend Required" message
- The site is running locally without Netlify Dev
- Solution: Deploy to Netlify or use `netlify dev` for local testing

### Recipe import fails for a specific URL
- The website may not have structured recipe data
- The website may block automated access
- Solution: Use "Copy & Paste" or "Scan Photo" methods

### Function times out
- Some websites are slow to respond
- Solution: The function has a 10-second timeout - try again

## 🔒 Security Notes

The serverless function:
- ✅ Only accepts POST requests
- ✅ Validates URLs before fetching
- ✅ Has CORS protection
- ✅ Sanitizes output
- ✅ Has timeout limits
- ❌ Does not store or log recipe URLs

## 💰 Cost

**Netlify Free Tier includes:**
- 100GB bandwidth/month
- 125,000 serverless function requests/month
- Unlimited sites

This is **more than enough** for a personal recipe site!

## 📊 After Deployment

### Check that everything works:
1. ✅ Homepage loads with all recipes
2. ✅ Search and filters work
3. ✅ Recipe detail pages display correctly
4. ✅ Add recipe form works
5. ✅ **OCR scanning works** (Tesseract.js from CDN)
6. ✅ **URL import works** (requires deployment)
7. ✅ My Recipes saves to localStorage
8. ✅ HTTPS is enabled

### Optional Enhancements:

**Custom Domain:**
- Netlify: Site settings → Domain management → Add custom domain
- Follow DNS configuration instructions

**Analytics (Privacy-Friendly):**
- Consider Plausible Analytics or Fathom
- Avoid Google Analytics (privacy concerns)

## 🎉 You're Done!

Once deployed, your URL import feature will work automatically. Users can:
1. Paste any recipe URL
2. Get instant parsed recipe data
3. Save it to their collection

No backend maintenance required - it's all serverless!

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://answers.netlify.com
