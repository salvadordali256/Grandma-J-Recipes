# Grandma Pauline's Recipe Collection

A beautiful, production-ready website showcasing Grandma Pauline's cherished family recipes.

## Features

- **Searchable**: Instantly search through all recipes by name, ingredients, or instructions
- **Categorized**: Browse recipes by category (Meats, Desserts, Salads, etc.)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dedicated Recipe Pages**: Each recipe opens on its own full page with all details
- **Add Your Own Recipes**: Complete form to submit your own recipes with photos
- **Photo Upload**: Add pictures to your recipes (max 5MB)
- **My Recipes Collection**: View and manage all your custom recipes
- **Delete Recipes**: Remove recipes from your personal collection
- **OCR Recipe Scanning**: Scan photos of recipe cards or cookbook pages to extract text automatically
- **URL Recipe Import**: Import recipes from websites automatically (works when deployed to Netlify/Vercel)
- **Print Friendly**: Print individual recipes with optimized formatting
- **LocalStorage**: Your custom recipes are saved in your browser
- **Blue Recipe Index**: Dedicated `blue-recipes.html` page lists every blue heading from the source Word doc (with the captured ingredient/direction text), searchable and grouped by category
- **Admin Dashboard**: `admin.html` prototype lets you manage users, featured recipes, and view activity logs (local-only for now)
- **Mock Login**: `login.html` adds a username/password demo that gates the admin dashboard (client-side only)
- **Production Ready**: Optimized for performance and user experience

## Getting Started

### Option 1: Open Directly in Browser
Simply double-click `index.html` to open the website in your default browser.

### Option 2: Use a Local Server (Recommended)
For the best experience, serve the files using a local web server:

**Using Python:**
```bash
python3 -m http.server 8000
```
Then visit: http://localhost:8000

**Using Node.js (if you have it installed):**
```bash
npx http-server -p 8000
```
Then visit: http://localhost:8000

## File Structure

```
Grandma J Recipies/
├── index.html                      # Main homepage with recipe grid
├── recipe.html                     # Individual recipe detail page
├── blue-recipes.html               # Blue heading index page
├── admin.html                      # Admin dashboard prototype
├── add-recipe.html                 # Form to add new recipes
├── my-recipes.html                 # View your custom recipes
├── import-recipe.html              # Import recipes via photo scan or URL
├── styles.css                      # All styling (responsive & print-friendly)
├── recipes.js                      # Recipe data (100+ recipes from Grandma)
├── blue-recipes-data.js            # Generated list of blue headings per category
├── script.js                       # Homepage interactive functionality
├── auth.js                         # Shared helpers for demo authentication
├── admin.js                        # Logic for admin dashboard
├── blue-recipes-page.js            # Logic for the blue heading index experience
├── login.html / login.js           # Demo username/password flow
├── server/                         # Express API + Postgres integration
│   ├── package.json                # Backend dependencies
│   ├── .env.example                # Sample environment variables
│   ├── db/schema.sql               # Database schema
│   └── src/                        # Express routes, middleware, server
├── recipe-detail.js                # Recipe detail page functionality
├── add-recipe.js                   # Add recipe form functionality
├── my-recipes.js                   # My recipes page functionality
├── import-recipe.js                # Import recipe functionality (OCR & URL)
├── netlify/
│   └── functions/
│       └── fetch-recipe.js         # Serverless function for URL import
├── tools/
│   └── generate_blue_data.py       # Script to regenerate blue-recipes-data.js from the Word doc
├── netlify.toml                    # Netlify deployment configuration
├── package.json                    # Project metadata
├── Grandma Pauline.docx            # Original Word document
├── README.md                       # This file
├── DEPLOYMENT.md                   # Deployment guide
└── SECURITY.md                     # Security information
```

## How to Use

### Browsing Recipes
1. **Browse All Recipes**: The homepage displays all Grandma Pauline's recipes
2. **Filter by Category**: Click any category in the sidebar to filter recipes
3. **Search**: Use the search bar to find recipes by name, ingredient, or keyword
4. **View Recipe**: Click "View Recipe" on any card to open the full recipe page
5. **Print Recipe**: On the recipe page, click the print button for a printer-friendly version

### Blue Recipe Index
1. **Open “Blue Index”**: Use the navigation link (or visit `blue-recipes.html`) to view every blue heading from the scanned document
2. **Search & Filter**: Type any word (recipe name, category, cook) to filter the list instantly
3. **Jump Links**: Use the pill-style category index at the top to jump directly to a section
4. **Cross-Reference**: Match spellings or confirm whether a recipe has already been digitized before adding full details

### Logging In & Admin Use
1. Open `login.html` (or use the “Login” link in the nav).
2. Use the default accounts (`pauline / grandma-love`, `kyle / family-first`) or invite new users via Admin → Team Directory (set username, role, and password). When the backend is running, these users are stored in Postgres.
3. After signing in you’ll be redirected to `admin.html`; use the Logout button there (or the nav link) to end the session.
4. By default, the login flow works entirely on the client. Once you run the backend API, you can switch the front end to call it for real credential checks.

### Backend API (Node + Postgres)
The `/server` folder contains an Express API meant to run on Cloudflare (Pages Functions/Workers) or any Node host.

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```
2. **Configure environment** – copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` – e.g. `postgres://user:pass@localhost:5432/grandma`
   - `JWT_SECRET` – random string
   - `ALLOW_ORIGIN` – comma-separated list of allowed front-end origins (e.g. `http://localhost:5173`)
3. **Provision database**
   ```bash
   psql $DATABASE_URL -f db/schema.sql
   ```
4. **Run locally**
   ```bash
   npm run dev
   ```
   This starts the API at `http://localhost:8787`. Use `/api/auth/login`, `/api/auth/register`, `/api/recipes`, `/api/users`, etc.
5. **Deploying** – on Cloudflare, create a Pages/Workers project pointing to `/server` (set `npm install && npm run build` if needed, start command `npm run start`). Add the same env vars in the Cloudflare dashboard. Point your front-end to the hosted API URL.

#### Running the API in Docker
1. Build the image (from repo root):
   ```bash
   cd server
   docker build -t grandma-recipes-api .
   ```
2. Run it (remember to pass env vars / secrets). Example using `.env`:
   ```bash
   docker run --env-file .env -p 8787:8787 grandma-recipes-api
   ```
3. The API is now available at `http://localhost:8787`.

### Adding Your Own Recipes
1. **Click "+ Add Recipe"**: In the navigation bar on any page
2. **Fill Out the Form**:
   - Recipe title (required)
   - Category (required)
   - Source (optional - e.g., "Mom", "Family tradition")
   - Servings (optional)
   - Upload a photo (optional - JPG/PNG, max 5MB)
   - Add ingredients (required - click "+ Add Another Ingredient" for more)
   - Instructions (required)
3. **Save**: Click "Save Recipe" to add it to your collection
4. **Success**: View your new recipe or add another one

### Importing Recipes
1. **Click "📸 Import"**: In the navigation bar on any page
2. **Choose Import Method**:
   - **Scan Photo**: Upload a photo of a recipe card or cookbook page
     - Select an image file (JPG or PNG)
     - Wait for OCR processing (powered by Tesseract.js)
     - View extracted text in editable textarea
     - Click "Edit & Save Recipe" to refine and save
   - **Import from URL**: Paste a recipe website URL
     - Note: This requires a backend server due to browser security (CORS)
     - See instructions in the import page for setup details
   - **Manual Entry**: Redirects to the standard recipe form

### Managing Your Recipes
1. **View "My Recipes"**: Click "My Recipes" in the navigation
2. **See Your Collection**: All your custom recipes with photos
3. **Delete**: Click "Delete" button to remove a recipe (can't be undone)
4. **View Details**: Click "View Recipe" to see full recipe page

## Recipe Categories

- Meats
- Oriental Cooking
- Pasta
- Pastry & Pies
- Preserves & Canning
- Poultry
- Salads & Dressings
- Sandwiches
- Sauces & Gravies
- Soups
- Vegetables
- Appetizers
- Beverages
- Bread
- Sweets & Candy
- Casseroles
- Cakes
- Cookies
- Desserts
- Frozen Desserts
- Eggs & Cheese
- Fish & Seafood
- Frostings
- Fruits

## Important Notes from Grandma Pauline

- **"inch thread"**: For frosting or candy, heating and mixing until the mixture forms a "thread", approximately 235°F
- **10X sugar**: Confectioners' sugar (the amount of times it's processed). 4X = 4 times, not as fine
- **Note**: Some recipes were cut off at the end or included typos. They were left as written - original is always better!
- **Watch the salt amounts**: Some recipes have high salt content

## Important Notes

### Data Storage
- **Custom recipes are stored in your browser's localStorage**
- Recipes persist across sessions in the same browser
- **Clearing browser data will delete your custom recipes**
- Custom recipes are NOT synced across devices or browsers
- Consider backing up by:
  - Taking screenshots
  - Copying text to a document
  - Using browser export/import features

### Image Storage
- Photos are converted to Base64 and stored in localStorage
- Max file size: 5MB per image
- Supported formats: JPG, PNG
- Large images may slow down the page slightly

## Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript - no frameworks required
- **Modern Browser Support**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- **LocalStorage API**: Custom recipes saved locally in browser
- **Base64 Image Encoding**: Photos stored as data URLs
- **Tesseract.js OCR**: Client-side optical character recognition for recipe scanning
- **SEO Optimized**: Includes proper meta tags and semantic HTML
- **Print Friendly**: Recipe pages are optimized for printing
- **Fast Loading**: Optimized CSS and JavaScript for quick page loads
- **Form Validation**: Built-in validation for required fields

### OCR Recipe Scanning
- **Technology**: Tesseract.js (v4) loaded from CDN
- **Supported Formats**: JPG, PNG (max 10MB)
- **Processing**: Client-side text extraction from recipe images
- **Best Results**: Use clear, well-lit photos with readable text
- **Progress Tracking**: Real-time progress bar during OCR processing
- **Editable Output**: Extracted text can be edited before saving

### URL Import Limitations
- **Browser Security**: Direct URL import blocked by CORS (Cross-Origin Resource Sharing)
- **Current Implementation**: Shows informative message with alternatives
- **Workarounds Available**:
  - Copy/paste recipe text manually
  - Screenshot and use OCR scanning
  - Browser extension recipe clippers
- **Backend Solution**: Requires Node.js/Python server with recipe parser library

## Hosting Options

### ⭐ Recommended: Netlify (Enables URL Import!)

**Why Netlify?**
- ✅ URL Import feature works automatically (serverless functions)
- ✅ Free SSL/HTTPS
- ✅ Instant deploys from GitHub
- ✅ Custom domains
- ✅ 100GB bandwidth/month (free tier)

**Deploy to Netlify:**
1. Push your code to GitHub
2. Connect to Netlify at https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Click "Deploy"

**That's it!** The URL import feature will work automatically. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Other Free Hosting Options:
1. **GitHub Pages**: Upload to a GitHub repository and enable Pages (URL import won't work)
2. **Vercel**: Deploy with one click (requires minor configuration for URL import)
3. **Cloudflare Pages**: Fast and free hosting (URL import won't work)

### Steps to Deploy on GitHub Pages:
```bash
# Create a new repository on GitHub
# Then run these commands:
git init
git add .
git commit -m "Initial commit - Grandma Pauline's Recipes"
git branch -M main
git remote add origin [your-repo-url]
git push -u origin main

# Enable GitHub Pages in repository settings
```

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features to add:
- Recipe ratings and reviews
- Share recipes via social media
- Create a shopping list from ingredients
- Favorite recipes system
- Recipe difficulty indicators
- Cooking time estimates
- Recipe comments/notes
- Metric/Imperial unit conversion
- Backend server for URL recipe import
- Improved OCR parsing with recipe structure detection
- Recipe export to PDF or print format
- Tags and advanced filtering
- Meal planning calendar

## Credits

Original recipes from **Grandma Pauline's** personal collection.

Website created with ❤️ to preserve and share these treasured family recipes.

---

**Enjoy!**
# Grandma-J-Recipes
