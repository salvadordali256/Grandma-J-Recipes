const AUTH_KEYS = {
    session: 'gpAuthUser',
    remember: 'gpRememberedUser'
};

const ADMIN_USER_KEY = 'gpAdminUsers';
const DEFAULT_ADMIN_USERS = [
    {
        id: 'u-1',
        username: 'pauline',
        name: 'Pauline J.',
        email: 'pauline@example.com',
        role: 'admin',
        passwordHash: '8304dceac42c9f465b70f0f946217171400f01938af92536fc1403f3ea5ef261',
        createdAt: '2024-01-01T12:00:00Z'
    },
    {
        id: 'u-2',
        username: 'kyle',
        name: 'Kyle J.',
        email: 'kyle@example.com',
        role: 'editor',
        passwordHash: 'cb098c7c6fb60ea4e46d6c68c6e3a27f56e2eb79aafc2cf759537402285b4d9b',
        createdAt: '2024-02-14T08:30:00Z'
    }
];

ensureDefaultAdminUsers();

function getAuthUser() {
    const raw = sessionStorage.getItem(AUTH_KEYS.session) || localStorage.getItem(AUTH_KEYS.remember);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function saveAuthUser(user, persist = false) {
    if (!user) {
        clearAuthUser();
        return;
    }
    const payload = JSON.stringify(user);
    sessionStorage.setItem(AUTH_KEYS.session, payload);
    if (persist) {
        localStorage.setItem(AUTH_KEYS.remember, payload);
    } else {
        localStorage.removeItem(AUTH_KEYS.remember);
    }
}

function clearAuthUser() {
    sessionStorage.removeItem(AUTH_KEYS.session);
    localStorage.removeItem(AUTH_KEYS.remember);
}

function requireAuth(redirectTarget = 'admin.html') {
    const user = getAuthUser();
    if (!user) {
        const params = new URLSearchParams({ redirect: redirectTarget });
        window.location.href = `login.html?${params.toString()}`;
        return null;
    }
    return user;
}

function loadAdminUsers() {
    try {
        return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveAdminUsers(users) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(users));
}

function ensureDefaultAdminUsers() {
    const existing = loadAdminUsers();
    if (!existing.length) {
        saveAdminUsers(DEFAULT_ADMIN_USERS);
        return;
    }
    let changed = false;
    const patched = existing.map(user => {
        if (!user.username && user.email) {
            user.username = user.email.split('@')[0];
            changed = true;
        }
        if (!user.passwordHash) {
            user.passwordHash = '';
            changed = true;
        }
        return user;
    });
    if (changed) {
        saveAdminUsers(patched);
    }
}

async function hashPassword(plain) {
    if (!plain) return '';
    if (window.crypto?.subtle && window.TextEncoder) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback (demo only)
    return plain;
}

function getAdminUserStore() {
    const hashFn = hashPassword;
    return {
        load: loadAdminUsers,
        save: saveAdminUsers,
        hash: hashFn
    };
}

window.AdminUserStore = getAdminUserStore();

async function verifyUserPassword(user, plain) {
    if (!user?.passwordHash) return false;
    const hashed = await hashPassword(plain);
    return hashed === user.passwordHash;
}

async function updateUserPassword(userId, plain) {
    const users = loadAdminUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    users[idx].passwordHash = await hashPassword(plain);
    saveAdminUsers(users);
    return true;
}

window.verifyAdminPassword = verifyUserPassword;
window.updateAdminPassword = updateUserPassword;
