(function() {
    const STORAGE_KEY = 'gpAccessibilityPrefs';
    const defaultPrefs = {
        theme: 'standard',
        dyslexic: false,
        highContrast: false
    };
    let prefs = { ...defaultPrefs };

    function loadPrefs() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            prefs = { ...defaultPrefs, ...saved };
        } catch {
            prefs = { ...defaultPrefs };
        }
    }

    function savePrefs() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }

    function applyPrefs() {
        const body = document.body;
        if (!body) return;
        body.classList.toggle('theme-dark', prefs.theme === 'dark');
        body.classList.toggle('theme-contrast', prefs.highContrast);
        body.classList.toggle('font-dyslexia', prefs.dyslexic);
    }

    function createPanel() {
        const trigger = document.createElement('button');
        trigger.id = 'accessibilityTrigger';
        trigger.type = 'button';
        trigger.innerText = 'Accessibility';

        const panel = document.createElement('div');
        panel.id = 'accessibilityPanel';
        panel.innerHTML = `
            <h4>Accessibility Options</h4>
            <label class="toggle-row">
                <span>Dark theme</span>
                <input type="checkbox" id="prefThemeDark" ${prefs.theme === 'dark' ? 'checked' : ''}>
            </label>
            <label class="toggle-row">
                <span>High contrast mode</span>
                <input type="checkbox" id="prefHighContrast" ${prefs.highContrast ? 'checked' : ''}>
            </label>
            <label class="toggle-row">
                <span>Dyslexia-friendly font</span>
                <input type="checkbox" id="prefDyslexia" ${prefs.dyslexic ? 'checked' : ''}>
            </label>
            <p class="panel-note">Preferences will be remembered on this device.</p>
        `;

        trigger.addEventListener('click', () => {
            panel.classList.toggle('visible');
        });

        panel.querySelector('#prefThemeDark').addEventListener('change', (event) => {
            prefs.theme = event.target.checked ? 'dark' : 'standard';
            savePrefs();
            applyPrefs();
        });
        panel.querySelector('#prefHighContrast').addEventListener('change', (event) => {
            prefs.highContrast = event.target.checked;
            savePrefs();
            applyPrefs();
        });
        panel.querySelector('#prefDyslexia').addEventListener('change', (event) => {
            prefs.dyslexic = event.target.checked;
            savePrefs();
            applyPrefs();
        });

        document.body.appendChild(trigger);
        document.body.appendChild(panel);
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadPrefs();
        applyPrefs();
        createPanel();
    });
})();
