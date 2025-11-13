# Backend API Documentation

## 🚀 Deployment Status

**Status:** ✅ Live and Running

**API URL:** https://grandma-recipes-api.onrender.com

**Database:** PostgreSQL (Render.com) - Initialized ✅

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns API status and timestamp

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `GET /api/auth/me` - Get current user info (requires auth)
- `POST /api/auth/logout` - Logout user

### Recipes (`/api/recipes`)
- `GET /api/recipes` - List all recipes
- `POST /api/recipes` - Create new recipe (requires auth)
- `GET /api/recipes/:id` - Get specific recipe
- `PUT /api/recipes/:id` - Update recipe (requires auth)
- `DELETE /api/recipes/:id` - Delete recipe (requires auth)
- `GET /api/recipes/featured` - Get featured recipes

### Users (`/api/users`) - Admin only
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### How to authenticate:
1. Login via `POST /api/auth/login` with username/password
2. Receive JWT token in response
3. Include token in subsequent requests:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

### Token Storage:
- Frontend stores token in `localStorage` under key `authToken`
- Token expires after 2 hours (configurable)

---

## 🗄️ Database Schema

### Users Table
```sql
- id (UUID, primary key)
- name (TEXT)
- email (TEXT, unique)
- username (TEXT, unique)
- password_hash (TEXT)
- role (admin|editor|viewer)
- created_at (TIMESTAMP)
```

### Recipes Table
```sql
- id (UUID, primary key)
- title (TEXT)
- category (TEXT)
- instructions (TEXT)
- ingredients (TEXT[])
- source (TEXT)
- servings (TEXT)
- featured (BOOLEAN)
- author_id (UUID, foreign key to users)
- created_at (TIMESTAMP)
```

### Activity Log Table
```sql
- id (UUID, primary key)
- actor_id (UUID, foreign key to users)
- action (TEXT)
- created_at (TIMESTAMP)
```

---

## 🛠️ Configuration

### Environment Variables (Render.com)
- `NODE_ENV=production`
- `PORT=8787`
- `DATABASE_URL=postgresql://...` (auto-configured by Render)
- `JWT_SECRET=...` (auto-generated)
- `JWT_EXPIRES_IN=2h`
- `ALLOW_ORIGIN=https://grandmas-recipes.salvadordali256.net,https://grandma-j-recipes.pages.dev`

### Frontend Configuration (`config.js`)
```javascript
API_CONFIG.baseURL = 'https://grandma-recipes-api.onrender.com/api'
API_CONFIG.useBackend = true
```

---

## 🔄 Switching Between Backend and localStorage

The frontend can operate in two modes:

### Backend Mode (Current - Recommended)
Set in `config.js`:
```javascript
useBackend: true
```
- User data stored in PostgreSQL
- Recipes synced across devices
- Real authentication
- Activity logging

### localStorage Mode (Fallback)
Set in `config.js`:
```javascript
useBackend: false
```
- User data stored locally in browser
- No sync across devices
- Demo authentication
- No activity logging

---

## 🧪 Testing the API

### Test Health Endpoint:
```bash
curl https://grandma-recipes-api.onrender.com/api/health
```

### Test Registration:
```bash
curl -X POST https://grandma-recipes-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpassword123",
    "role": "editor"
  }'
```

### Test Login:
```bash
curl -X POST https://grandma-recipes-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpassword123"
  }'
```

---

## 📊 Monitoring

**Render Dashboard:** https://dashboard.render.com/

- View deployment logs
- Monitor API performance
- Check database metrics
- Manage environment variables

---

## 🔧 Local Development

To run the backend locally:

```bash
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your local database credentials

# Run database migrations
psql $DATABASE_URL -f db/schema.sql

# Start development server
npm run dev
```

API will be available at: `http://localhost:8787`

---

## 🚨 Troubleshooting

### API not responding
- Check Render dashboard for deployment status
- Verify environment variables are set
- Check API logs in Render dashboard

### Database connection errors
- Verify DATABASE_URL is correct in Render
- Check database is running in Render dashboard
- Ensure schema has been initialized

### CORS errors
- Verify ALLOW_ORIGIN includes your frontend URL
- Check that frontend is using HTTPS (not HTTP)

---

## 📈 Next Steps

- [ ] Create first admin user via registration
- [ ] Test authentication flow
- [ ] Migrate existing localStorage recipes to backend (optional)
- [ ] Set up monitoring/alerts (optional)
- [ ] Configure custom domain for API (optional)

---

**Last Updated:** 2025-01-13
**API Version:** 0.1.0
