// API Configuration
const API_CONFIG = {
    // Backend API URL (deployed on Render.com)
    baseURL: 'https://grandma-recipes-api.onrender.com/api',

    // Enable backend API (set to false to use localStorage only)
    useBackend: true,

    // Timeout for API requests (ms)
    timeout: 10000,

    // API endpoints
    endpoints: {
        health: '/health',
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout',
            me: '/auth/me'
        },
        recipes: {
            list: '/recipes',
            create: '/recipes',
            get: (id) => `/recipes/${id}`,
            update: (id) => `/recipes/${id}`,
            delete: (id) => `/recipes/${id}`,
            featured: '/recipes/featured'
        },
        users: {
            list: '/users',
            get: (id) => `/users/${id}`,
            update: (id) => `/users/${id}`,
            delete: (id) => `/users/${id}`
        }
    }
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    const url = API_CONFIG.baseURL + endpoint;
    const token = localStorage.getItem('authToken');

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
    window.apiRequest = apiRequest;
}
