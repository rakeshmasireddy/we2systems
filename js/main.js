(function () {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const nav = document.getElementById('header');

    function scrollToAnchor(target) {
        if (!target) return;
        const headerOffset = nav ? nav.offsetHeight + 8 : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }

    // Keep smooth in-page navigation but avoid showing #fragment in the URL.
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            scrollToAnchor(target);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        });
    });

    if (window.location.hash) {
        const initialTarget = document.querySelector(window.location.hash);
        if (initialTarget) {
            setTimeout(() => {
                scrollToAnchor(initialTarget);
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }, 0);
        }
    }

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                nav.classList.add('shadow-sm');
            } else {
                nav.classList.remove('shadow-sm');
            }
        });
    }
})();
