const storageKeys = {
    users: 'gpAdminUsers',
    featured: 'gpFeaturedRecipes',
    log: 'gpAdminLog'
};

const FORM_LIMITS = {
    name: 80
};

const userStore = window.AdminUserStore || {
    load: () => JSON.parse(localStorage.getItem(storageKeys.users) || '[]'),
    save: (users) => localStorage.setItem(storageKeys.users, JSON.stringify(users)),
    hash: async (value) => value
};

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = requireAuth('admin.html');
    if (!currentUser) return;
    document.getElementById('adminWelcome').textContent = `Signed in as ${currentUser.name || currentUser.username}`;
    document.getElementById('btnLogout').addEventListener('click', () => {
        clearAuthUser();
        window.location.href = 'login.html';
    });

    initAdminState();
    bindEvents();
    renderAll();
});

function initAdminState() {
    if (!localStorage.getItem(storageKeys.featured)) {
        localStorage.setItem(storageKeys.featured, JSON.stringify([]));
    }
    if (!localStorage.getItem(storageKeys.log)) {
        localStorage.setItem(storageKeys.log, JSON.stringify([]));
    }
}

function bindEvents() {
    document.getElementById('userForm').addEventListener('submit', handleAddUser);
    document.getElementById('btnExportUsers').addEventListener('click', exportUsers);
    document.getElementById('btnClearLog').addEventListener('click', clearActivityLog);
    document.getElementById('btnSyncMock').addEventListener('click', simulateSync);
    document.getElementById('recipeSearch').addEventListener('input', debounce(renderRecipeTable, 200));
}

function renderAll() {
    updateStats();
    renderUserTable();
    renderRecipeTable();
    renderActivityLog();
}

function getUsers() {
    return userStore.load();
}

function saveUsers(users) {
    userStore.save(users);
}

function getFeaturedRecipeIds() {
    return JSON.parse(localStorage.getItem(storageKeys.featured) || '[]');
}

function saveFeaturedRecipeIds(ids) {
    localStorage.setItem(storageKeys.featured, JSON.stringify(ids));
}

function getActivityLog() {
    return JSON.parse(localStorage.getItem(storageKeys.log) || '[]');
}

function saveActivityLog(entries) {
    localStorage.setItem(storageKeys.log, JSON.stringify(entries.slice(-25)));
}

function addActivity(message) {
    const entries = getActivityLog();
    entries.push({ id: uid(), message, timestamp: new Date().toISOString() });
    saveActivityLog(entries);
    renderActivityLog();
}

function flattenRecipes() {
    const baseRecipes = Array.isArray(window.recipes) ? window.recipes : [];
    const blueRecipes = Array.isArray(window.blueRecipes) ? flattenBlue(window.blueRecipes) : [];
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]').map(r => ({ ...r, isCustom: true }));
    return [...customRecipes, ...blueRecipes, ...baseRecipes];
}

function flattenBlue(data) {
    const entries = [];
    data.forEach(section => {
        if (!Array.isArray(section.recipes)) return;
        section.recipes.forEach((recipe, idx) => {
            entries.push({
                id: `blue-${section.slug}-${idx}`,
                title: recipe.title || 'Untitled',
                category: section.slug,
                source: 'Blue Document',
                isBlue: true
            });
        });
    });
    return entries;
}

function updateStats() {
    const recipes = flattenRecipes();
    const customCount = recipes.filter(r => r.isCustom).length;
    const featured = getFeaturedRecipeIds();
    document.getElementById('adminStatRecipes').textContent = recipes.length;
    document.getElementById('adminStatCustom').textContent = customCount;
    document.getElementById('adminStatFeatured').textContent = featured.length;
    document.getElementById('adminStatUsers').textContent = getUsers().length;
}

function renderUserTable() {
    const tbody = document.querySelector('#userTable tbody');
    const fragment = document.createDocumentFragment();
    getUsers().forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.username || '—'}</td>
            <td>${user.email}</td>
            <td><span class="role-pill role-${user.role}">${user.role}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="table-actions">
                    <button class="text-btn" data-reset-id="${user.id}">Set Password</button>
                    <button class="text-btn danger" data-user-id="${user.id}">Remove</button>
                </div>
            </td>
        `;
        tr.querySelector('[data-reset-id]').addEventListener('click', () => promptPasswordReset(user.id));
        tr.querySelector('[data-user-id]').addEventListener('click', () => removeUser(user.id));
        fragment.appendChild(tr);
    });
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

async function handleAddUser(event) {
    event.preventDefault();
    const name = sanitize(document.getElementById('userName').value);
    const email = sanitize(document.getElementById('userEmail').value.toLowerCase());
    const username = sanitize(document.getElementById('userUsername').value).toLowerCase();
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;

    const errors = [];
    if (!name || name.length > FORM_LIMITS.name) errors.push('Name is required and must be under 80 characters.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');
    if (!username || username.length < 3 || username.length > 40 || !/^[a-z0-9._-]+$/.test(username)) {
        errors.push('Username must be 3-40 characters (letters, numbers, dot, underscore, dash).');
    }
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters.');
    }

    const users = getUsers();
    if (users.some(u => (u.email || '').toLowerCase() === email)) {
        errors.push('A user with that email already exists.');
    }
    if (users.some(u => (u.username || '').toLowerCase() === username)) {
        errors.push('A user with that username already exists.');
    }

    if (errors.length) {
        alert(errors.join('\n'));
        return;
    }

    const passwordHash = await userStore.hash(password);

    users.push({
        id: uid(),
        name,
        email,
        username,
        role,
        passwordHash,
        createdAt: new Date().toISOString()
    });
    saveUsers(users);
    renderUserTable();
    updateStats();
    addActivity(`Invited ${name} (${username}) as ${role}.`);
    event.target.reset();
}

function removeUser(id) {
    let users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return;
    if (!confirm(`Remove ${user.name || user.username}?`)) return;
    users = users.filter(u => u.id !== id);
    saveUsers(users);
    renderUserTable();
    updateStats();
    addActivity(`Removed user ${user.name || user.username}.`);
}

async function promptPasswordReset(id) {
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return;
    const nextPassword = prompt(`Enter a new password for ${user.name || user.username} (minimum 8 characters):`);
    if (nextPassword === null) return;
    if (nextPassword.length < 8) {
        alert('Password must be at least 8 characters.');
        return;
    }
    user.passwordHash = await userStore.hash(nextPassword);
    saveUsers(users);
    addActivity(`Updated password for ${user.name || user.username}.`);
    alert('Password updated. Share it securely with the user.');
}

function exportUsers() {
    const rows = getUsers().map(u => `${u.name},${u.username || ''},${u.email},${u.role},${u.createdAt}`);
    const csv = `Name,Username,Email,Role,Created\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-users.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function renderRecipeTable() {
    const tbody = document.querySelector('#recipeTable tbody');
    const searchValue = document.getElementById('recipeSearch').value.toLowerCase();
    const featuredIds = new Set(getFeaturedRecipeIds());
    const fragment = document.createDocumentFragment();
    flattenRecipes()
        .filter(recipe => recipe.title.toLowerCase().includes(searchValue))
        .slice(0, 150)
        .forEach(recipe => {
            const tr = document.createElement('tr');
            const isFeatured = featuredIds.has(String(recipe.id));
            tr.innerHTML = `
                <td>${recipe.title}${recipe.isBlue ? ' <span class="badge badge-blue">blue</span>' : ''}</td>
                <td>${getCategoryName(recipe.category)}</td>
                <td>${recipe.isCustom ? 'Custom' : (recipe.source || 'Original')}</td>
                <td>
                    <label class="switch">
                        <input type="checkbox" ${isFeatured ? 'checked' : ''} data-recipe-id="${recipe.id}">
                        <span class="slider"></span>
                    </label>
                </td>
            `;
            tr.querySelector('input').addEventListener('change', (e) => toggleFeatured(recipe, e.target.checked));
            fragment.appendChild(tr);
        });
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

function toggleFeatured(recipe, checked) {
    const ids = new Set(getFeaturedRecipeIds());
    if (checked) {
        ids.add(String(recipe.id));
        addActivity(`Featured "${recipe.title}".`);
    } else {
        ids.delete(String(recipe.id));
        addActivity(`Removed "${recipe.title}" from featured.`);
    }
    saveFeaturedRecipeIds(Array.from(ids));
    updateStats();
}

function renderActivityLog() {
    const container = document.getElementById('activityLog');
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    getActivityLog().slice().reverse().forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>${entry.message}</p>
            <span>${new Date(entry.timestamp).toLocaleString()}</span>
        `;
        fragment.appendChild(li);
    });
    container.appendChild(fragment);
}

function clearActivityLog() {
    if (!confirm('Clear the activity log?')) return;
    saveActivityLog([]);
    renderActivityLog();
}

function simulateSync() {
    const status = document.getElementById('syncStatus');
    status.textContent = 'Syncing…';
    setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString();
        status.textContent = `Last sync: ${timestamp}`;
        addActivity('Manual sync completed.');
    }, 800);
}

function sanitize(value) {
    const div = document.createElement('div');
    div.textContent = value || '';
    return div.innerHTML.trim();
}

function uid() {
    if (window.crypto?.randomUUID) {
        return crypto.randomUUID();
    }
    return 'id-' + Math.random().toString(36).slice(2, 10);
}

function getCategoryName(category) {
    const map = {
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
    return map[category] || category;
}

function debounce(fn, wait = 200) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), wait);
    };
}
