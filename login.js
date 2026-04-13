function escHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getSafeRedirect(defaultPath = 'admin.html') {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || defaultPath;
    try {
        const url = new URL(redirect, window.location.origin);
        if (url.origin !== window.location.origin) {
            return defaultPath;
        }
        return url.pathname + url.search + url.hash;
    } catch {
        return defaultPath;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const notice = document.getElementById('loginNotice');
    const store = window.AdminUserStore || {
        load: () => [],
        hash: async () => { throw new Error('Auth module not loaded.'); }
    };
    const useBackend = Boolean(window.API_CONFIG?.useBackend && window.apiRequest);

    const existingUser = getAuthUser();
    if (existingUser) {
        showInfo(`
            You are already signed in as <strong>${escHtml(existingUser.name || existingUser.username)}</strong>.
            <div class="auth-actions">
                <button id="logoutBtn" class="outline-btn">Log out</button>
                <a href="admin.html" class="nav-btn accent">Go to Admin</a>
            </div>
        `);
        document.getElementById('logoutBtn').addEventListener('click', () => {
            clearAuthUser();
            window.location.reload();
        });
        form.style.display = 'none';
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = event.target.username.value.trim().toLowerCase();
        const password = event.target.password.value;
        const remember = event.target.rememberMe.checked;

        if (!username || !password) {
            return showError('Username and password are required.');
        }

        if (useBackend) {
            try {
                const response = await window.apiRequest(window.API_CONFIG.endpoints.auth.login, {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });
                saveAuthUser(response.user, remember);
                saveAuthToken(response.token, remember);
                await window.CustomRecipeService?.syncFromBackend(true);
                window.location.href = getSafeRedirect('admin.html');
                return;
            } catch (error) {
                showError(error.message || 'Unable to sign in. Please check your credentials.');
                return;
            }
        }

        const accounts = store.load();
        const account = accounts.find(acc => (acc.username || '').toLowerCase() === username);
        if (!account) {
            showError('Invalid username or password.');
            return;
        }

        if (!account.passwordHash) {
            showError('This account does not have a password yet. Ask an admin to set one.');
            return;
        }

        const hashed = await store.hash(password);
        if (hashed !== account.passwordHash) {
            showError('Invalid username or password.');
            return;
        }

        saveAuthUser({ username: account.username, role: account.role, name: account.name || account.username }, remember);
        window.location.href = getSafeRedirect('admin.html');
    });

    function showError(message) {
        notice.style.display = 'block';
        notice.classList.add('active');
        notice.textContent = message;
        notice.focus();
    }

    function showInfo(html) {
        notice.style.display = 'block';
        notice.classList.add('active');
        notice.innerHTML = html;
    }
});
