(function () {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const nav = document.getElementById('header');

    // === Smooth scrolling ===
    function scrollToAnchor(target) {
        if (!target) return;
        const headerOffset = nav ? nav.offsetHeight + 8 : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        var href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        anchor.addEventListener('click', function (event) {
            var target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            scrollToAnchor(target);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        });
    });

    if (window.location.hash) {
        var initialTarget = document.querySelector(window.location.hash);
        if (initialTarget) {
            setTimeout(function () {
                scrollToAnchor(initialTarget);
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }, 0);
        }
    }

    // === Mobile menu ===
    if (btn && menu) {
        btn.addEventListener('click', function () { menu.classList.toggle('hidden'); });
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { menu.classList.add('hidden'); });
        });
    }

    // === Nav shadow on scroll ===
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                nav.classList.add('shadow-lg', 'shadow-black/20');
            } else {
                nav.classList.remove('shadow-lg', 'shadow-black/20');
            }
        }, { passive: true });
    }

    // === Scroll Progress Bar ===
    var progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', function () {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        }, { passive: true });
    }

    // === Terminal typing animation ===
    (function initTerminal() {
        var termBody = document.getElementById('terminal-body');
        if (!termBody) return;

        var lines = [
            { prompt: '$ ', cmd: 'kubectl apply -f platform/cluster.yaml', delay: 0 },
            { output: '<span class="text-green-400">✓</span> <span class="text-slate-400">cluster/production configured — 24 nodes ready</span>', delay: 800 },
            { prompt: '$ ', cmd: 'w2s security scan --policy zero-trust', delay: 1600 },
            { output: '<span class="text-green-400">✓</span> <span class="text-slate-400">zero-trust policy applied — 0 vulnerabilities found</span>', delay: 2400 },
            { prompt: '$ ', cmd: 'w2s backup verify --target all-namespaces', delay: 3200 },
            { output: '<span class="text-green-400">✓</span> <span class="text-slate-400">backup verified — 142 workloads protected, RPO &lt; 15 min</span>', delay: 4000 },
            { prompt: '$ ', cmd: 'w2s status', delay: 4800 },
            { output: '<span class="text-green-400">✓</span> <span class="text-cyan-400 font-semibold">All systems operational</span> <span class="text-slate-500">— platform healthy</span>', delay: 5600 },
        ];

        var started = false;

        function runTerminal() {
            if (started) return;
            started = true;
            lines.forEach(function (line, i) {
                var div = document.createElement('div');
                div.className = 'terminal-line';
                if (line.cmd) {
                    div.innerHTML = '<span class="text-green-400">' + line.prompt + '</span><span class="text-slate-200" id="term-cmd-' + i + '"></span>';
                } else {
                    div.innerHTML = line.output;
                }
                termBody.appendChild(div);
                setTimeout(function () {
                    div.classList.add('visible');
                    if (line.cmd) typeText('term-cmd-' + i, line.cmd, 30);
                }, line.delay);
            });
            setTimeout(function () {
                var cursorLine = document.createElement('div');
                cursorLine.className = 'terminal-line';
                cursorLine.innerHTML = '<span class="text-green-400">$ </span><span class="terminal-cursor"></span>';
                termBody.appendChild(cursorLine);
                setTimeout(function () { cursorLine.classList.add('visible'); }, 100);
            }, lines[lines.length - 1].delay + 600);
        }

        function typeText(elId, text, speed) {
            var el = document.getElementById(elId);
            if (!el) return;
            var idx = 0;
            var interval = setInterval(function () {
                el.textContent += text[idx];
                idx++;
                if (idx >= text.length) clearInterval(interval);
            }, speed);
        }

        if ('IntersectionObserver' in window) {
            var termObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { runTerminal(); termObs.unobserve(entry.target); }
                });
            }, { threshold: 0.3 });
            termObs.observe(termBody);
        } else {
            runTerminal();
        }
    })();

    // === Scroll-triggered animations (fade-up, fade-left, fade-right) ===
    var animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    if (animEls.length && 'IntersectionObserver' in window) {
        var animObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        animEls.forEach(function (el) { animObs.observe(el); });
    } else {
        animEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // === Hero Word Stagger Animation ===
    (function heroStagger() {
        var words = document.querySelectorAll('.hero-word');
        var subtitle = document.querySelector('.hero-subtitle');
        var desc = document.querySelector('.hero-desc');
        if (!words.length) return;
        words.forEach(function (w, i) {
            setTimeout(function () { w.classList.add('visible'); }, 300 + i * 200);
        });
        if (subtitle) setTimeout(function () { subtitle.classList.add('visible'); }, 300 + words.length * 200);
        if (desc) setTimeout(function () { desc.classList.add('visible'); }, 300 + words.length * 200 + 200);
    })();

    // === Glow Card Mouse Tracking ===
    document.querySelectorAll('.glow-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
        });
    });

    // === Animated Counter ===
    (function initCounters() {
        var counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        function animateCounter(el) {
            var target = parseFloat(el.dataset.target);
            var suffix = el.dataset.suffix || '';
            var isDecimal = el.dataset.decimal === 'true';
            var duration = 2000;
            var start = performance.now();

            function update(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                var ease = 1 - Math.pow(1 - progress, 3);
                var current = ease * target;
                el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }

        if ('IntersectionObserver' in window) {
            var counterObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(function (c) { counterObs.observe(c); });
        } else {
            counters.forEach(animateCounter);
        }
    })();

    // === Particle Network Canvas ===
    (function initParticles() {
        var canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: null, y: null };
        var particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        var connectDist = 150;

        function resize() {
            var hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 1.5 + 0.5;
        }

        for (var i = 0; i < particleCount; i++) particles.push(new Particle());

        canvas.parentElement.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.parentElement.addEventListener('mouseleave', function () {
            mouse.x = null; mouse.y = null;
        });

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
                ctx.fill();

                // Connect to nearby particles
                for (var j = i + 1; j < particles.length; j++) {
                    var p2 = particles[j];
                    var dx = p.x - p2.x, dy = p.y - p2.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = 'rgba(14, 165, 233, ' + (0.12 * (1 - dist / connectDist)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x !== null) {
                    var dmx = p.x - mouse.x, dmy = p.y - mouse.y;
                    var mdist = Math.sqrt(dmx * dmx + dmy * dmy);
                    if (mdist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.2 * (1 - mdist / 200)) + ')';
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }

        // Only run particles if no reduced-motion preference
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            draw();
        }
    })();

    // === Back to Top Button ===
    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 600) {
                backToTop.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                backToTop.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            } else {
                backToTop.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                backToTop.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
        }, { passive: true });
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // === Active Nav Section Highlight ===
    (function initActiveNav() {
        var navLinks = document.querySelectorAll('#header .hidden.md\\:flex a[href^="#"]');
        var sections = [];
        navLinks.forEach(function (link) {
            var id = link.getAttribute('href');
            if (id && id !== '#') {
                var sec = document.querySelector(id);
                if (sec) sections.push({ el: sec, link: link });
            }
        });
        if (!sections.length) return;

        function updateActive() {
            var scrollY = window.scrollY + 120;
            var active = null;
            sections.forEach(function (s) {
                if (s.el.offsetTop <= scrollY) active = s;
            });
            navLinks.forEach(function (l) { l.classList.remove('nav-link-active'); });
            if (active) active.link.classList.add('nav-link-active');
        }
        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    })();

})();
