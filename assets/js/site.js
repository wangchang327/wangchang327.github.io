(() => {
    for (const table of document.querySelectorAll('main table')) {
        const headers = Array.from(table.querySelectorAll('thead th'), cell => cell.textContent.trim());
        if (!headers.length) continue;
        for (const row of Array.from(table.rows).slice(1)) {
            if (row.cells.length === headers.length) {
                Array.from(row.cells).forEach((cell, index) => cell.setAttribute('header', headers[index]));
            }
        }
        table.classList.add('responsive-table');
    }

    const modes = ['light', 'dark', 'auto'];
    const button = document.getElementById('theme-toggle');
    function apply(mode) {
        const current = modes.includes(mode) ? mode : 'auto';
        document.documentElement.dataset.theme = current;
        const next = modes[(modes.indexOf(current) + 1) % modes.length];
        const shortcut = button.accessKeyLabel;
        button.title = 'Theme: ' + current + '. Switch to ' + next + (shortcut ? ' (' + shortcut + ')' : '');
        button.setAttribute('aria-label', button.title);
    }
    apply(document.documentElement.dataset.theme);
    button.hidden = false;
    button.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme;
        const next = modes[(modes.indexOf(current) + 1) % modes.length];
        apply(next);
        try {
            localStorage.setItem('theme', next);
        } catch { }
    });
    window.addEventListener('storage', event => {
        if (event.key === 'theme' || event.key === null) apply(event.newValue);
    });

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        const update = () => {
            backToTop.hidden = window.scrollY < 400;
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            new ResizeObserver(() => {
                backToTop.style.bottom = banner.offsetHeight ? `calc(${banner.offsetHeight}px + 1rem)` : '';
            }).observe(banner);
        }
    }

    for (const info of document.querySelectorAll('.publication-info')) {
        const trigger = info.querySelector('button');
        const tooltip = info.querySelector('[role="tooltip"]');
        const close = () => info.classList.remove('is-open');
        function open() {
            info.classList.add('is-open');
            tooltip.style.left = '0px';
            const rect = tooltip.getBoundingClientRect();
            const width = document.documentElement.clientWidth;
            tooltip.style.left = Math.max(8 - rect.left, Math.min(0, width - 8 - rect.right)) + 'px';
        }
        info.addEventListener('mouseenter', open);
        info.addEventListener('mouseleave', () => {
            if (document.activeElement !== trigger) close();
        });
        trigger.addEventListener('focus', open);
        trigger.addEventListener('click', open);
        info.addEventListener('focusout', close);
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') close();
        });
        document.addEventListener('click', event => {
            if (!info.contains(event.target)) close();
        });
        window.addEventListener('resize', close);
    }
})();
