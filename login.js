document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const notice = document.getElementById('loginNotice');
    const store = window.AdminUserStore || {
        load: () => [],
        hash: async (value) => value
    };

    const existingUser = getAuthUser();
    if (existingUser) {
        showInfo(`
            You are already signed in as <strong>${existingUser.name || existingUser.username}</strong>.
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
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || 'admin.html';
        window.location.href = redirect;
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
