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

    // Terminal typing animation
    (function initTerminal() {
        const termBody = document.getElementById('terminal-body');
        if (!termBody) return;

        const lines = [
            { prompt: '$ ', cmd: 'kubectl apply -f platform/cluster.yaml', delay: 0 },
            { output: '<span class="text-green-400">✓</span> <span class="text-slate-400">cluster/production configured — 24 nodes ready</span>', delay: 800 },
            { prompt: '$ ', cmd: 'w2s security scan --policy zero-trust', delay: 1600 },
            { output: '<span class="text-green-400">✓</span> <span class="text-slate-400">zero-trust policy applied — 0 vulnerabilities found</span>', delay: 2400 },
            { prompt: '$ ', cmd: 'w2s backup verify --target all-namespaces', delay: 3200 },
            { output: '<span class="text-green-400">✓</span> <span class="text-slate-400">backup verified — 142 workloads protected, RPO &lt; 15 min</span>', delay: 4000 },
            { prompt: '$ ', cmd: 'w2s status', delay: 4800 },
            { output: '<span class="text-green-400">✓</span> <span class="text-cyan-400 font-semibold">All systems operational</span> <span class="text-slate-500">— platform healthy</span>', delay: 5600 },
        ];

        let started = false;

        function runTerminal() {
            if (started) return;
            started = true;

            lines.forEach(function(line, i) {
                var div = document.createElement('div');
                div.className = 'terminal-line';

                if (line.cmd) {
                    div.innerHTML = '<span class="text-green-400">' + line.prompt + '</span><span class="text-slate-200" id="term-cmd-' + i + '"></span>';
                } else {
                    div.innerHTML = line.output;
                }

                termBody.appendChild(div);

                setTimeout(function() {
                    div.classList.add('visible');
                    if (line.cmd) {
                        typeText('term-cmd-' + i, line.cmd, 30);
                    }
                }, line.delay);
            });

            // Add blinking cursor at the end
            setTimeout(function() {
                var cursorLine = document.createElement('div');
                cursorLine.className = 'terminal-line';
                cursorLine.innerHTML = '<span class="text-green-400">$ </span><span class="terminal-cursor"></span>';
                termBody.appendChild(cursorLine);
                setTimeout(function() { cursorLine.classList.add('visible'); }, 100);
            }, lines[lines.length - 1].delay + 600);
        }

        function typeText(elId, text, speed) {
            var el = document.getElementById(elId);
            if (!el) return;
            var idx = 0;
            var interval = setInterval(function() {
                el.textContent += text[idx];
                idx++;
                if (idx >= text.length) clearInterval(interval);
            }, speed);
        }

        // Start when terminal scrolls into view
        if ('IntersectionObserver' in window) {
            var termObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        runTerminal();
                        termObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            termObs.observe(termBody);
        } else {
            runTerminal();
        }
    })();

    // Scroll-triggered fade-up animations
    const fadeEls = document.querySelectorAll('.fade-up');
    if (fadeEls.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        fadeEls.forEach((el) => observer.observe(el));
    } else {
        // Fallback: show everything immediately
        fadeEls.forEach((el) => el.classList.add('visible'));
    }
})();
