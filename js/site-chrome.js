/* Site chrome behaviour: header nav, mobile menu, active links, legal modal and forms. */
(function () {
    'use strict';

    // Replace YOUR_FORM_ID with the real Formspree form ID (https://formspree.io).
    // Until then, forms fall back to opening the visitor's email app.
    var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
    var FALLBACK_EMAIL = 'hello@we2systems.com';
    var endpointReady = FORM_ENDPOINT.indexOf('YOUR_FORM_ID') === -1;

    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

    /* ---------- Skip link target ---------- */
    (function () {
        if (document.getElementById('main-content')) return;
        var target = $('main');
        if (!target) {
            var nav = $('#site-header');
            target = nav && nav.nextElementSibling;
            while (target && (target.tagName === 'SCRIPT' || target.tagName === 'DIV' && !target.offsetHeight)) {
                target = target.nextElementSibling;
            }
        }
        if (!target) return;
        target.id = target.id || 'main-content';
        if (target.id !== 'main-content') {
            var skip = $('.sc-skip');
            if (skip) skip.setAttribute('href', '#' + target.id);
        }
        target.setAttribute('tabindex', '-1');
    })();

    /* ---------- Header: dropdowns ---------- */
    var header = $('#site-header');
    var dropdowns = $$('.sc-dd', header || document);

    function closeDropdowns(except) {
        dropdowns.forEach(function (dd) {
            if (dd === except) return;
            dd.classList.remove('open');
            var b = $('.sc-dd-btn', dd);
            if (b) b.setAttribute('aria-expanded', 'false');
        });
    }

    dropdowns.forEach(function (dd) {
        var btn = $('.sc-dd-btn', dd);
        if (!btn) return;
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = !dd.classList.contains('open');
            closeDropdowns(dd);
            dd.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', String(open));
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest || !e.target.closest('.sc-dd')) closeDropdowns();
    });

    /* ---------- Header: mobile menu ---------- */
    var menuBtn = $('#sc-menu-btn');
    var mobileMenu = $('#sc-mobile-menu');

    function setMobile(open) {
        if (!menuBtn || !mobileMenu) return;
        mobileMenu.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.documentElement.classList.toggle('sc-menu-open', open);
    }

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            setMobile(!mobileMenu.classList.contains('open'));
        });
        $$('a', mobileMenu).forEach(function (a) {
            a.addEventListener('click', function () { setMobile(false); });
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024) setMobile(false);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        closeDropdowns();
        setMobile(false);
        closeLegal();
    });

    /* ---------- Header: scrolled state ---------- */
    if (header) {
        var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Active link (page-level) ---------- */
    function normalise(path) {
        return path.replace(/\/index\.html$/, '/').replace(/\/$/, '/');
    }

    if (header) {
        var here = normalise(window.location.pathname);
        var marked = {};
        $$('a[href]', header).forEach(function (a) {
            var raw = a.getAttribute('href');
            if (!raw || raw.charAt(0) === '#' || raw.indexOf('#') !== -1 || raw.indexOf('mailto:') === 0) return;
            var url;
            try { url = new URL(a.href, window.location.href); } catch (err) { return; }
            if (url.origin !== window.location.origin || normalise(url.pathname) !== here) return;
            if (a.classList.contains('sc-logo')) return;

            // Several menu items may share a URL (e.g. services.html); highlight the first in each menu only.
            var scope = a.closest('.sc-dd-menu, .sc-acc-body, .sc-nav-pill, .sc-mobile-inner');
            var key = (scope && scope.id ? scope.id : '') + (scope ? scope.className : '');
            if (marked[key]) return;
            marked[key] = true;

            a.classList.add('is-active');
            a.setAttribute('aria-current', 'page');
            var dd = a.closest('.sc-dd');
            if (dd) { var b = $('.sc-dd-btn', dd); if (b) b.classList.add('is-active'); }
            var acc = a.closest('.sc-acc');
            if (acc) { var s = $('summary', acc); if (s) s.classList.add('is-active'); }
        });
    }

    /* ---------- Legal modal ---------- */
    var LEGAL = {
        privacy: {
            title: 'Privacy Policy',
            body: 'We2 Systems respects your privacy. We collect only the information necessary to respond to your enquiry \u2014 name, company, email, and message content. We do not sell, share, or distribute your data to third parties. Your information is stored securely and retained only as long as needed to fulfil our business relationship. For questions, contact ' + FALLBACK_EMAIL + '.'
        },
        terms: {
            title: 'Terms of Service',
            body: 'By using the We2 Systems website you agree to these terms. All content, branding, and materials on this site are the intellectual property of We2 Systems. Services described are subject to separate engagement agreements. We make no guarantees regarding uptime of this website. We2 Systems reserves the right to update these terms at any time. For the latest version, contact ' + FALLBACK_EMAIL + '.'
        }
    };
    var modal = $('#sc-legal-modal');
    var lastFocus = null;

    function openLegal(type) {
        if (!modal || !LEGAL[type]) return;
        lastFocus = document.activeElement;
        $('#sc-legal-title', modal).textContent = LEGAL[type].title;
        $('[data-sc-legal-body]', modal).textContent = LEGAL[type].body;
        modal.hidden = false;
        var close = $('[data-sc-legal-close]', modal);
        if (close) close.focus();
    }
    function closeLegal() {
        if (!modal || modal.hidden) return;
        modal.hidden = true;
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    $$('[data-sc-legal]').forEach(function (btn) {
        btn.addEventListener('click', function () { openLegal(btn.getAttribute('data-sc-legal')); });
    });
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal || e.target.closest('[data-sc-legal-close]')) closeLegal();
        });
    }

    var year = $('[data-sc-year]');
    if (year) year.textContent = String(new Date().getFullYear());

    /* ---------- Forms ---------- */
    var INTEREST_LABELS = {
        cybersecurity: 'Cybersecurity & AI Governance',
        proxmox: 'Proxmox Virtualization',
        'data-resilience': 'Data Resilience & Recovery',
        reliability: 'Reliability & AI Operations',
        'enterprise-ai': 'Enterprise AI'
    };

    var interest = new URLSearchParams(window.location.search).get('interest');
    if (interest && INTEREST_LABELS[interest]) {
        $$('form[data-sc-form] input[name="interest"]').forEach(function (input) {
            input.value = INTEREST_LABELS[interest];
            // Show the visitor which topic their enquiry is about.
            var note = document.createElement('p');
            note.className = 'sc-interest-note';
            note.textContent = 'Topic: ' + INTEREST_LABELS[interest];
            input.parentNode.insertBefore(note, input);
        });
    }

    function getMsg(form) {
        var msg = $('[data-sc-form-msg]', form) ||
            (form.nextElementSibling && form.nextElementSibling.matches('[data-sc-form-msg]') ? form.nextElementSibling : null);
        if (!msg) {
            msg = document.createElement('p');
            msg.className = 'sc-form-msg';
            msg.setAttribute('role', 'status');
            msg.setAttribute('aria-live', 'polite');
            msg.setAttribute('data-sc-form-msg', '');
            form.appendChild(msg);
        }
        return msg;
    }

    function setMsg(form, text, type) {
        var msg = getMsg(form);
        msg.textContent = text;
        msg.classList.toggle('is-error', type === 'error');
        msg.classList.toggle('is-success', type === 'success');
    }

    function validate(form) {
        var firstBad = null;
        $$('input, select, textarea', form).forEach(function (el) {
            if (el.type === 'hidden' || el.name === '_gotcha') return;
            var bad = !el.checkValidity() || (el.required && !String(el.value).trim());
            el.classList.toggle('is-invalid', bad);
            el.classList.toggle('error', bad);
            el.setAttribute('aria-invalid', String(bad));
            if (bad && !firstBad) firstBad = el;
        });
        if (firstBad) firstBad.focus();
        return !firstBad;
    }

    function labelFor(form, el) {
        if (el.id) {
            var l = $('label[for="' + el.id + '"]', form);
            if (l) return l.textContent.replace(/\*/g, '').trim();
        }
        return el.getAttribute('placeholder') || el.name;
    }

    function buildMailto(form, subject) {
        var lines = [];
        $$('input, select, textarea', form).forEach(function (el) {
            if (!el.name || el.name === '_gotcha' || el.name.charAt(0) === '_' || !String(el.value).trim()) return;
            lines.push(labelFor(form, el) + ': ' + el.value.trim());
        });
        return 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    }

    function showSuccess(form, viaMail) {
        var target = form.getAttribute('data-sc-success');
        var panel = target ? document.getElementById(target) : null;
        var text = viaMail
            ? (form.getAttribute('data-mailto-text') || 'Your email app should now open with your details — just press send.')
            : (form.getAttribute('data-success-text') || 'Thanks! We\u2019ll be in touch shortly.');

        if (panel) {
            var slot = $('[data-sc-success-text]', panel);
            if (slot) slot.textContent = text;
            var titleSlot = $('[data-sc-success-title]', panel);
            if (titleSlot) {
                titleSlot.textContent = viaMail
                    ? (form.getAttribute('data-mailto-title') || 'Continue in your email app')
                    : (form.getAttribute('data-success-title') || titleSlot.textContent);
            }
            var hideId = form.getAttribute('data-sc-hide');
            var hideEl = hideId ? document.getElementById(hideId) : form;
            if (hideEl) hideEl.hidden = true;
            panel.hidden = false;
            panel.classList.remove('hidden');
            if (panel.focus) { panel.setAttribute('tabindex', '-1'); panel.focus(); }
        } else {
            setMsg(form, text, 'success');
        }
    }

    $$('form[data-sc-form]').forEach(function (form) {
        form.setAttribute('novalidate', '');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            setMsg(form, '', null);
            if (!validate(form)) {
                setMsg(form, 'Please complete the highlighted fields.', 'error');
                return;
            }
            var gotcha = $('input[name="_gotcha"]', form);
            if (gotcha && gotcha.value) return;

            var kind = form.getAttribute('data-sc-form');
            var subject = form.getAttribute('data-sc-subject') || ('Website enquiry (' + kind + ')');
            var interestInput = $('input[name="interest"]', form);
            if (interestInput && interestInput.value) subject += ' \u2014 ' + interestInput.value;

            if (!endpointReady) {
                window.location.href = buildMailto(form, subject);
                showSuccess(form, true);
                return;
            }

            var data = new FormData(form);
            data.append('form_name', kind);
            data.append('_subject', subject);
            data.append('page', window.location.pathname);

            var btn = $('button[type="submit"], button:not([type])', form);
            var btnHtml = btn ? btn.innerHTML : '';
            if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }

            fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    form.reset();
                    if (interestInput && interest && INTEREST_LABELS[interest]) interestInput.value = INTEREST_LABELS[interest];
                    showSuccess(form, false);
                })
                .catch(function () {
                    setMsg(form, 'Something went wrong. Please email us at ' + FALLBACK_EMAIL + '.', 'error');
                })
                .then(function () {
                    if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
                });
        });

        $$('input, select, textarea', form).forEach(function (el) {
            el.addEventListener('input', function () {
                if (el.classList.contains('is-invalid') && el.checkValidity() && String(el.value).trim()) {
                    el.classList.remove('is-invalid', 'error');
                    el.setAttribute('aria-invalid', 'false');
                }
            });
        });
    });
})();
