(() => {
    const key = 'analytics-consent-v1';
    const lifetime = 180 * 24 * 60 * 60 * 1000;
    const id = document.getElementById('consent-script').dataset.analyticsId;
    const banner = document.getElementById('cookie-banner');
    const settings = document.getElementById('cookie-settings');
    const status = document.getElementById('cookie-status');
    const denied = {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
    };
    let loaded = false;
    let choice = null;
    let temporaryChoice = false;
    let expiryTimer = null;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', denied);
    window['ga-disable-' + id] = true;

    function readChoice() {
        try {
            const saved = JSON.parse(localStorage.getItem(key));
            if (saved && ['accepted', 'rejected'].includes(saved.value) && saved.expires > Date.now()) return saved;
            localStorage.removeItem(key);
        } catch { }
        return null;
    }

    function showBanner(show) {
        banner.hidden = !show;
        settings.setAttribute('aria-expanded', String(show));
    }

    function clearAnalyticsCookies() {
        const parts = location.hostname.split('.');
        const domains = ['', ...parts.map((_, index) => parts.slice(index).join('.'))];
        for (const cookie of document.cookie.split(';')) {
            const name = cookie.trim().split('=')[0];
            if (!/^(_ga($|_)|_gid$|_gat($|_)|_gac_)/.test(name)) continue;
            for (const domain of domains) {
                document.cookie = name + '=; Max-Age=0; Path=/' + (domain ? '; Domain=' + domain : '');
            }
        }
    }

    function scheduleExpiry() {
        clearTimeout(expiryTimer);
        expiryTimer = null;
        if (!choice) return;
        const remaining = choice.expires - Date.now();
        if (remaining <= 0) {
            apply(null);
            return;
        }
        // Browser timers are limited to a signed 32-bit delay; recheck longer choices in chunks.
        expiryTimer = setTimeout(scheduleExpiry, Math.min(remaining, 2_147_483_647));
    }

    function apply(saved, canReload = true) {
        choice = saved;
        const accepted = saved && saved.value === 'accepted';
        showBanner(!saved);
        status.textContent = '';
        window['ga-disable-' + id] = !accepted;
        window.gtag('consent', 'update', accepted ? { ...denied, analytics_storage: 'granted' } : denied);
        if (accepted && id && !loaded) {
            loaded = true;
            window.gtag('js', new Date());
            window.gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });
            const script = document.createElement('script');
            script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
            script.async = true;
            script.dataset.analytics = '';
            document.head.appendChild(script);
        } else if (!accepted) {
            clearAnalyticsCookies();
            // Keep the disabled tag for reuse when a temporary choice prevents reloading.
            if (loaded && canReload) {
                for (const script of document.querySelectorAll('script[data-analytics]')) script.remove();
                loaded = false;
                location.reload();
            }
        }
        scheduleExpiry();
    }

    document.getElementById('cookie-controls').hidden = false;
    settings.addEventListener('click', () => {
        showBanner(true);
        banner.focus({ preventScroll: true });
    });
    for (const button of banner.querySelectorAll('[data-consent]')) {
        button.addEventListener('click', () => {
            const saved = { value: button.dataset.consent, expires: Date.now() + lifetime };
            temporaryChoice = false;
            try {
                localStorage.setItem(key, JSON.stringify(saved));
            } catch {
                temporaryChoice = true;
                try {
                    localStorage.removeItem(key);
                } catch { }
            }
            apply(saved, !temporaryChoice);
            if (temporaryChoice) status.textContent = ' · Your browser could not save this choice; it applies to this page.';
            settings.focus({ preventScroll: true });
        });
    }
    banner.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            showBanner(false);
            settings.focus({ preventScroll: true });
        }
    });
    window.addEventListener('storage', event => {
        if (event.key === key || event.key === null) apply(readChoice());
    });
    window.addEventListener('pageshow', event => {
        if (!event.persisted) return;
        if (temporaryChoice) scheduleExpiry();
        else apply(readChoice());
    });
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) scheduleExpiry();
    });
    apply(readChoice());
})();
