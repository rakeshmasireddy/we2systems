/* we2systems - Main JavaScript */
/* Modular and error-safe functionality */

(function() {
    'use strict';

    const appState = {
        industry: 'financial-services',
        industryLabel: 'Financial Services',
        readinessScore: null,
        readinessBadge: 'Not scored',
        readinessMessages: {
            low: 'Your resilience posture needs immediate hardening. Start with immutable backups, tested runbooks, and clear incident ownership.',
            medium: 'You have a baseline in place. Focus next on regular drill validation, Kubernetes restore confidence, and stronger governance automation.',
            high: 'Strong posture. Your next advantage is optimization: reduce recovery friction further and automate evidence for audits.'
        }
    };

    /* ===========================
       Utility Functions
       =========================== */
    
    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.error('Error selecting element:', selector, error);
            return null;
        }
    }

    function safeQuerySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.error('Error selecting elements:', selector, error);
            return [];
        }
    }

    /* ===========================
       Fluid Background Effect
       =========================== */
    
    function initFluidBackground() {
        const fluidBg = safeQuerySelector('#fluid-bg');
        if (!fluidBg) return;

        try {
            // Initial setup - center the gradient
            fluidBg.style.setProperty('--x', '50%');
            fluidBg.style.setProperty('--y', '50%');

            // Update gradient position on mouse movement
            document.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth * 100).toFixed(2);
                    const y = (e.clientY / window.innerHeight * 100).toFixed(2);
                    fluidBg.style.setProperty('--x', `${x}%`);
                    fluidBg.style.setProperty('--y', `${y}%`);
                });
            });
        } catch (error) {
            console.error('Error initializing fluid background:', error);
        }
    }

    /* ===========================
       Mobile Menu
       =========================== */
    
    function initMobileMenu() {
        const mobileBtn = safeQuerySelector('#mobileMenuBtn');
        const mobileMenu = safeQuerySelector('#mobileMenu');
        
        if (!mobileBtn || !mobileMenu) return;

        try {
            // Toggle menu on button click
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // Close menu when clicking a link (FIX)
            const menuLinks = mobileMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
        } catch (error) {
            console.error('Error initializing mobile menu:', error);
        }
    }

    /* ===========================
       Service Slider
       =========================== */
    
    function initServiceSlider() {
        const tabs = safeQuerySelectorAll('.service-tab');
        const tabsContainer = safeQuerySelector('#serviceTabs');
        const slider = safeQuerySelector('#sliderWrapper');
        const prevBtn = safeQuerySelector('#prevBtn');
        const nextBtn = safeQuerySelector('#nextBtn');
        const display = safeQuerySelector('#serviceDisplay');
        
        if (!tabs.length || !slider || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        let autoScrollInterval = null;
        let restartTimeout = null;

        // Color classes for different services
        const glowClasses = [
            'border-cyan-400/60',
            'border-green-400/60', 
            'border-blue-500/60',
            'border-blue-300/60',
            'border-yellow-400/60'
        ];

        function slideTo(index) {
            try {
                // Ensure index is within bounds
                if (index < 0 || index >= tabs.length) return;

                // Update slider position
                slider.style.transform = `translateX(-${index * 100}%)`;

                // Update display glow
                if (display) {
                    glowClasses.forEach(cls => display.classList.remove(cls));
                    display.classList.add(glowClasses[index]);
                }

                // Update tab styles
                tabs.forEach((tab, idx) => {
                    if (idx === index) {
                        tab.classList.add('bg-primary-blue', 'text-white');
                        tab.classList.remove('bg-card-bg');
                    } else {
                        tab.classList.remove('bg-primary-blue', 'text-white');
                        tab.classList.add('bg-card-bg');
                    }
                });

                currentIndex = index;
            } catch (error) {
                console.error('Error sliding to index:', index, error);
            }
        }

        function startAutoScroll() {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                const next = (currentIndex + 1) % tabs.length;
                slideTo(next);
            }, 4000); // Slower auto-scroll for better UX
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        function scheduleAutoScrollRestart(delayMs) {
            if (restartTimeout) {
                clearTimeout(restartTimeout);
            }

            restartTimeout = setTimeout(() => {
                startAutoScroll();
                restartTimeout = null;
            }, delayMs);
        }

        try {
            // Tab click handlers
            tabs.forEach((tab, idx) => {
                // Make tabs keyboard-focusable for accessibility and parity with hover behavior.
                tab.setAttribute('tabindex', '0');

                tab.addEventListener('click', () => {
                    stopAutoScroll();
                    slideTo(idx);
                    // Restart auto-scroll after user interaction
                    scheduleAutoScrollRestart(8000);
                });

                // Hover should immediately activate the related tile.
                tab.addEventListener('mouseenter', () => {
                    stopAutoScroll();
                    slideTo(idx);
                    scheduleAutoScrollRestart(8000);
                });

                tab.addEventListener('focus', () => {
                    stopAutoScroll();
                    slideTo(idx);
                    scheduleAutoScrollRestart(8000);
                });

                tab.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        stopAutoScroll();
                        slideTo(idx);
                        scheduleAutoScrollRestart(8000);
                    }
                });
            });

            // Navigation button handlers
            prevBtn.addEventListener('click', () => {
                stopAutoScroll();
                const prev = (currentIndex - 1 + tabs.length) % tabs.length;
                slideTo(prev);
                scheduleAutoScrollRestart(8000);
            });

            nextBtn.addEventListener('click', () => {
                stopAutoScroll();
                const next = (currentIndex + 1) % tabs.length;
                slideTo(next);
                scheduleAutoScrollRestart(8000);
            });

            // Initialize first slide
            slideTo(0);
            startAutoScroll();

            // Pause auto-scroll when user hovers over the service display
            if (display) {
                display.addEventListener('mouseenter', stopAutoScroll);
                display.addEventListener('mouseleave', startAutoScroll);
            }

            if (tabsContainer) {
                tabsContainer.addEventListener('mouseenter', stopAutoScroll);
                tabsContainer.addEventListener('mouseleave', () => {
                    scheduleAutoScrollRestart(1200);
                });
            }

        } catch (error) {
            console.error('Error initializing service slider:', error);
        }
    }

    /* ===========================
       Smooth Scroll
       =========================== */
    
    function initSmoothScroll() {
        try {
            const links = safeQuerySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (!href || href === '#') return;

                    const target = safeQuerySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error initializing smooth scroll:', error);
        }
    }

    /* ===========================
       Parallax Effect
       =========================== */
    
    function initParallax() {
        const parallaxText = safeQuerySelector('#parallaxText');
        if (!parallaxText) return;

        try {
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrollY = window.scrollY;
                        const speed = 0.15; // Subtle movement
                        parallaxText.style.transform = `translateY(${scrollY * speed}px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        } catch (error) {
            console.error('Error initializing parallax:', error);
        }
    }

    /* ===========================
       Industry Personalization
       =========================== */

    function initIndustryPersonalization() {
        const selector = safeQuerySelector('#industryContextSelect');
        if (!selector) return;

        const industryContent = {
            'financial-services': {
                note: 'Tailored for regulated, audit-heavy environments with strict recovery and governance expectations.',
                proof: [
                    { value: '99.95%', label: 'backup job reliability across protected workloads' },
                    { value: '42%', label: 'faster disaster-recovery drill execution' },
                    { value: '31%', label: 'less manual infra operations through automation' }
                ],
                cases: [
                    {
                        tag: 'Financial Services',
                        title: 'From fragmented backup tools to a unified immutable strategy',
                        problem: '<strong>Problem:</strong> DR tests were inconsistent across virtual machines and Kubernetes clusters, with uncertain recovery windows.',
                        change: '<strong>What we changed:</strong> Designed a unified Veeam + Kasten protection architecture with immutable backup tiers, policy-driven restores, and quarterly DR runbooks.',
                        outcome: 'Outcome: Recovery drill completion time reduced by 42% and audit evidence collection moved from days to hours.'
                    },
                    {
                        tag: 'Retail Banking',
                        title: 'Strengthening data governance under accelerating compliance pressure',
                        problem: '<strong>Problem:</strong> Sensitive data discovery was incomplete and policy evidence was spread across disconnected systems.',
                        change: '<strong>What we changed:</strong> Implemented continuous data discovery workflows and policy-linked evidence trails integrated with platform operations.',
                        outcome: 'Outcome: Compliance reporting preparation time reduced by 48% with improved control visibility for internal audits.'
                    }
                ],
                readinessItems: [
                    'We have immutable backups for critical workloads.',
                    'We test RTO and RPO targets at least quarterly.',
                    'Kubernetes applications have restore runbooks.',
                    'Sensitive data is continuously discovered and classified.',
                    'Platform changes are automated through controlled pipelines.',
                    'Recovery ownership and incident escalation are clearly defined.'
                ],
                readinessMessages: {
                    low: 'For financial services, strengthen immutable backup posture and formalize runbooks mapped to regulatory controls first.',
                    medium: 'You have a solid base. Next focus on repeatable evidence capture, cross-team drill cadence, and policy automation depth.',
                    high: 'Strong resilience for a regulated environment. Prioritize reducing recovery variability and advancing proactive risk analytics.'
                },
                architecture: {
                    beforeTitle: 'Siloed controls and reactive governance',
                    before: [
                        'Multiple backup silos with inconsistent retention policies',
                        'Manual restore paths and unclear incident ownership',
                        'Delayed evidence collection for audit windows',
                        'Ticket-driven platform changes with limited policy traceability'
                    ],
                    afterTitle: 'Unified, policy-linked, and audit-ready platform',
                    after: [
                        'Single protection strategy across VM and container workloads',
                        'Runbook-driven recovery aligned to target RTO and RPO',
                        'Continuous data discovery tied to governance controls',
                        'Automated platform changes with full audit traceability'
                    ]
                }
            },
            'manufacturing': {
                note: 'Tailored for uptime-critical operations where production continuity and OT/IT coordination are key.',
                proof: [
                    { value: '37%', label: 'reduction in unplanned platform maintenance effort' },
                    { value: '55%', label: 'faster restoration of production-critical services' },
                    { value: '29%', label: 'fewer manual deployment handoffs across teams' }
                ],
                cases: [
                    {
                        tag: 'Manufacturing',
                        title: 'Hybrid platform modernization without production disruption',
                        problem: '<strong>Problem:</strong> Platform teams were overloaded with repetitive cluster tasks, and maintenance windows impacted production confidence.',
                        change: '<strong>What we changed:</strong> Introduced policy-based automation, hardened OpenShift baseline controls, and staged release guardrails.',
                        outcome: 'Outcome: Manual platform operations reduced by 31% with more predictable maintenance execution.'
                    },
                    {
                        tag: 'Industrial Operations',
                        title: 'Disaster recovery consistency across plant and central systems',
                        problem: '<strong>Problem:</strong> Recovery ownership between site teams and central infra teams was unclear during drills.',
                        change: '<strong>What we changed:</strong> Standardized DR runbooks, ownership matrix, and restore sequencing for shared dependencies.',
                        outcome: 'Outcome: Cross-team recovery drills completed 55% faster with clearer escalation pathways.'
                    }
                ],
                readinessItems: [
                    'Critical plant and corporate workloads use immutable backup copies.',
                    'Recovery drills include both site and central platform teams.',
                    'Containerized production apps have tested restore sequencing.',
                    'Sensitive production and supplier data is classified continuously.',
                    'Maintenance and patch operations are automated via controlled pipelines.',
                    'On-call ownership for outages is clearly defined across teams.'
                ],
                readinessMessages: {
                    low: 'For manufacturing, start with outage ownership clarity and reliable immutable backups for production-critical systems.',
                    medium: 'You are progressing well. Improve cross-site drill discipline and dependency-aware restoration for key operations.',
                    high: 'Strong posture for uptime-sensitive environments. Next target mean-time-to-recover optimization and proactive failure simulation.'
                },
                architecture: {
                    beforeTitle: 'Manual operations under uptime pressure',
                    before: [
                        'Patch and release cycles rely on manual coordination',
                        'Production recovery paths differ by site and platform',
                        'Visibility gaps between OT-facing services and central infra',
                        'Escalation paths vary across shifts and locations'
                    ],
                    afterTitle: 'Predictable operations with recovery-by-design',
                    after: [
                        'Automated release and maintenance controls across clusters',
                        'Standardized site-to-core recovery orchestration',
                        'Unified visibility into critical data and service dependencies',
                        'Clear role-based escalation and incident ownership model'
                    ]
                }
            },
            healthcare: {
                note: 'Tailored for patient-data protection, service continuity, and high-trust compliance operations.',
                proof: [
                    { value: '44%', label: 'faster recovery validation for clinical support systems' },
                    { value: '96%', label: 'coverage of sensitive data classification workflows' },
                    { value: '33%', label: 'reduction in manual compliance evidence preparation' }
                ],
                cases: [
                    {
                        tag: 'Healthcare',
                        title: 'Resilience uplift for patient-service critical workloads',
                        problem: '<strong>Problem:</strong> Clinical-support systems lacked consistently tested recovery procedures across mixed infrastructure.',
                        change: '<strong>What we changed:</strong> Built a tiered recovery model with immutable backups, service-priority restoration, and regular drill governance.',
                        outcome: 'Outcome: Recovery validation for critical services improved by 44% with stronger operational confidence.'
                    },
                    {
                        tag: 'Hospital Network',
                        title: 'Data governance alignment for privacy-sensitive operations',
                        problem: '<strong>Problem:</strong> Data discovery and policy evidence were fragmented, slowing internal privacy reviews.',
                        change: '<strong>What we changed:</strong> Deployed continuous discovery and governance mapping tied to infrastructure and backup controls.',
                        outcome: 'Outcome: Compliance evidence turnaround improved by 33% with clearer control ownership.'
                    }
                ],
                readinessItems: [
                    'Patient-service critical systems have immutable backups and tested restore plans.',
                    'Recovery drills validate target recovery windows for clinical impact scenarios.',
                    'Containerized healthcare applications include dependency-aware restore runbooks.',
                    'Sensitive patient and partner data is continuously discovered and tagged.',
                    'Operational changes follow automated and auditable deployment controls.',
                    'Incident ownership is mapped to both technical and business response teams.'
                ],
                readinessMessages: {
                    low: 'For healthcare, prioritize continuity of critical services and continuous protection of privacy-sensitive data.',
                    medium: 'Baseline is in place. Strengthen drill realism, dependency-aware restores, and automated evidence capture.',
                    high: 'Strong posture for healthcare operations. Next focus on reducing recovery variance during peak service periods.'
                },
                architecture: {
                    beforeTitle: 'Critical services with fragmented protection controls',
                    before: [
                        'Backup and restore standards differ by workload type',
                        'Recovery drills focus on infra, not full service dependencies',
                        'Privacy evidence collection remains manual and time-consuming',
                        'Operational changes lack consistent risk gates'
                    ],
                    afterTitle: 'Continuity-focused platform with embedded governance',
                    after: [
                        'Unified protection policies across virtual and container workloads',
                        'Service-level recovery plans validated through recurring drills',
                        'Continuous discovery and governance evidence linked to controls',
                        'Automated change pipelines with clear risk checkpoints'
                    ]
                }
            },
            saas: {
                note: 'Tailored for fast-moving product teams balancing release velocity with reliability and security.',
                proof: [
                    { value: '39%', label: 'faster incident recovery for customer-facing services' },
                    { value: '46%', label: 'reduction in manual platform toil for DevOps teams' },
                    { value: '28%', label: 'improvement in deployment consistency and auditability' }
                ],
                cases: [
                    {
                        tag: 'SaaS',
                        title: 'Scaling platform reliability without slowing release velocity',
                        problem: '<strong>Problem:</strong> The team faced increasing incidents as growth outpaced operational process maturity.',
                        change: '<strong>What we changed:</strong> Implemented policy-based infra automation, recovery playbooks, and observability-backed incident triage.',
                        outcome: 'Outcome: Mean recovery time for priority services improved by 39% while release cadence remained stable.'
                    },
                    {
                        tag: 'B2B Technology',
                        title: 'From reactive backups to product-grade resilience',
                        problem: '<strong>Problem:</strong> Backup and restore operations were ad hoc and difficult to validate during customer escalations.',
                        change: '<strong>What we changed:</strong> Built immutable backup workflows, restore confidence testing, and ownership-aligned runbooks.',
                        outcome: 'Outcome: Operational toil dropped by 46% and incident response consistency improved across on-call rotations.'
                    }
                ],
                readinessItems: [
                    'Customer-facing services are protected by immutable backup policies.',
                    'Recovery targets are tested against realistic outage scenarios.',
                    'Kubernetes workloads have documented and validated restore workflows.',
                    'Sensitive customer data is continuously classified and monitored.',
                    'Platform operations are automated with guardrails in CI/CD.',
                    'On-call escalation and incident ownership are clearly defined.'
                ],
                readinessMessages: {
                    low: 'For SaaS teams, first secure predictable recovery and clear on-call ownership for customer-impacting incidents.',
                    medium: 'You are progressing. Next tighten restore validation and automate policy enforcement in delivery pipelines.',
                    high: 'Strong resilience baseline. Next optimize for lower operational toil and faster customer-impact containment.'
                },
                architecture: {
                    beforeTitle: 'Fast releases, inconsistent resilience controls',
                    before: [
                        'Release velocity outpaces backup and restore discipline',
                        'Recovery playbooks vary across product teams',
                        'Data governance checks are delayed and mostly manual',
                        'On-call reliability depends on tribal knowledge'
                    ],
                    afterTitle: 'Product-grade platform with reliability guardrails',
                    after: [
                        'Immutable protection integrated into delivery lifecycle',
                        'Standardized service-priority restore runbooks',
                        'Continuous governance controls for sensitive customer data',
                        'Clear ownership and automated incident orchestration'
                    ]
                }
            }
        };

        function setTextById(id, text, allowHtml) {
            const element = safeQuerySelector(`#${id}`);
            if (!element) return;

            if (allowHtml) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }

        function formatIndustryLabel(industryKey) {
            return industryKey
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
        }

        function updateUrlIndustryParam(industryKey) {
            try {
                const url = new URL(window.location.href);
                url.searchParams.set('industry', industryKey);
                window.history.replaceState({}, '', url.toString());
            } catch (error) {
                console.error('Error updating URL industry parameter:', error);
            }
        }

        function animateIndustrySwitch() {
            const dynamicBlocks = safeQuerySelectorAll('[data-industry-dynamic]');
            dynamicBlocks.forEach(block => {
                block.classList.remove('industry-fade');
                // Force reflow so repeated switches replay the animation.
                void block.offsetWidth;
                block.classList.add('industry-fade');
            });
        }

        function updateContactContextFields() {
            const subjectField = safeQuerySelector('#contactSubject');
            const industryField = safeQuerySelector('#contactIndustryField');
            const scoreField = safeQuerySelector('#contactScoreField');
            const badgeField = safeQuerySelector('#contactBadgeField');

            const scoreText = appState.readinessScore === null ? 'Not scored' : `${appState.readinessScore}/6`;
            const subject = `New Consultation Request - we2systems | ${appState.industryLabel} | Readiness ${scoreText}`;

            if (subjectField) subjectField.value = subject;
            if (industryField) industryField.value = appState.industry;
            if (scoreField) scoreField.value = scoreText;
            if (badgeField) badgeField.value = appState.readinessBadge;
        }

        function resolveInitialIndustry() {
            try {
                const url = new URL(window.location.href);
                const rawValue = (url.searchParams.get('industry') || '').trim().toLowerCase();
                if (rawValue && industryContent[rawValue]) {
                    return rawValue;
                }
            } catch (error) {
                console.error('Error reading URL industry parameter:', error);
            }
            return selector.value || 'financial-services';
        }

        function applyIndustry(industryKey) {
            const selected = industryContent[industryKey] || industryContent['financial-services'];
            appState.industry = industryKey;
            appState.industryLabel = formatIndustryLabel(industryKey);
            appState.readinessMessages = selected.readinessMessages;

            setTextById('industryContextNote', selected.note, false);

            selected.proof.forEach((item, index) => {
                setTextById(`proofValue${index + 1}`, item.value, false);
                setTextById(`proofLabel${index + 1}`, item.label, false);
            });

            setTextById('case1Tag', selected.cases[0].tag, false);
            setTextById('case1Title', selected.cases[0].title, false);
            setTextById('case1Problem', selected.cases[0].problem, true);
            setTextById('case1Change', selected.cases[0].change, true);
            setTextById('case1Outcome', selected.cases[0].outcome, false);

            setTextById('case2Tag', selected.cases[1].tag, false);
            setTextById('case2Title', selected.cases[1].title, false);
            setTextById('case2Problem', selected.cases[1].problem, true);
            setTextById('case2Change', selected.cases[1].change, true);
            setTextById('case2Outcome', selected.cases[1].outcome, false);

            const readinessItems = safeQuerySelectorAll('[data-readiness-item]');
            readinessItems.forEach((item, index) => {
                if (selected.readinessItems[index]) {
                    item.textContent = selected.readinessItems[index];
                }
            });

            setTextById('beforeTitle', selected.architecture.beforeTitle, false);
            setTextById('afterTitle', selected.architecture.afterTitle, false);
            selected.architecture.before.forEach((entry, index) => {
                setTextById(`beforeItem${index + 1}`, entry, false);
            });
            selected.architecture.after.forEach((entry, index) => {
                setTextById(`afterItem${index + 1}`, entry, false);
            });

            animateIndustrySwitch();
            updateContactContextFields();
        }

        selector.addEventListener('change', () => {
            applyIndustry(selector.value);
            updateUrlIndustryParam(selector.value);
        });

        const initialIndustry = resolveInitialIndustry();
        selector.value = initialIndustry;
        applyIndustry(initialIndustry);
        updateUrlIndustryParam(initialIndustry);
    }

    /* ===========================
       Recovery Timeline
       =========================== */

    function initRecoveryTimeline() {
        const steps = safeQuerySelectorAll('.timeline-step');
        const timelineRail = safeQuerySelector('#timelineRail');
        const timelinePanel = safeQuerySelector('#timelinePanel');
        const timelineTitle = safeQuerySelector('#timelineTitle');
        const timelineText = safeQuerySelector('#timelineText');

        if (!steps.length || !timelineTitle || !timelineText) return;

        const timelineData = [
            {
                title: 'Signal detected in under 90 seconds',
                text: 'Runtime alerting flags unusual backup behavior. Playbooks auto-route response ownership to the on-call platform squad.'
            },
            {
                title: 'Containment policies activate instantly',
                text: 'Risky paths are isolated while immutable backups remain protected and write access controls tighten automatically.'
            },
            {
                title: 'Priority services restored by policy',
                text: 'Tiered restore workflows recover business-critical services first, including Kubernetes application dependencies.'
            },
            {
                title: 'Integrity and compliance verified',
                text: 'Recovery validation, audit evidence capture, and post-incident actions are completed in one structured handoff.'
            }
        ];

        let currentStep = 0;
        let autoTimeline = null;

        function applyStep(index) {
            const boundedIndex = (index + timelineData.length) % timelineData.length;
            const selected = timelineData[boundedIndex];

            steps.forEach((step, stepIndex) => {
                const isActive = stepIndex === boundedIndex;
                step.classList.toggle('is-active', isActive);
                step.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            timelineTitle.textContent = selected.title;
            timelineText.textContent = selected.text;
            currentStep = boundedIndex;
        }

        function stopAutoTimeline() {
            if (autoTimeline) {
                clearInterval(autoTimeline);
                autoTimeline = null;
            }
        }

        function startAutoTimeline() {
            stopAutoTimeline();
            autoTimeline = setInterval(() => {
                applyStep(currentStep + 1);
            }, 2800);
        }

        steps.forEach((step, stepIndex) => {
            step.addEventListener('click', () => {
                stopAutoTimeline();
                applyStep(stepIndex);
                startAutoTimeline();
            });

            step.addEventListener('mouseenter', () => {
                stopAutoTimeline();
                applyStep(stepIndex);
            });

            step.addEventListener('mouseleave', startAutoTimeline);
            step.addEventListener('focus', () => applyStep(stepIndex));
        });

        if (timelineRail) {
            timelineRail.addEventListener('mouseenter', stopAutoTimeline);
            timelineRail.addEventListener('mouseleave', startAutoTimeline);
        }

        if (timelinePanel) {
            timelinePanel.addEventListener('mouseenter', stopAutoTimeline);
            timelinePanel.addEventListener('mouseleave', startAutoTimeline);
        }

        applyStep(0);
        startAutoTimeline();
    }

    /* ===========================
       Readiness Snapshot
       =========================== */

    function initReadinessSnapshot() {
        const form = safeQuerySelector('#readinessForm');
        const button = safeQuerySelector('#readinessScoreBtn');
        const result = safeQuerySelector('#readinessResult');
        const scoreValue = safeQuerySelector('#readinessScoreValue');
        const scoreBadge = safeQuerySelector('#readinessScoreBadge');
        const advice = safeQuerySelector('#readinessAdvice');

        if (!form || !button || !result || !scoreValue || !scoreBadge || !advice) return;

        function getRecommendation(score) {
            const context = appState.readinessMessages;

            if (score <= 2) {
                return {
                    badge: 'High Risk',
                    message: context.low
                };
            }

            if (score <= 4) {
                return {
                    badge: 'Developing',
                    message: context.medium
                };
            }

            return {
                badge: 'Mature',
                message: context.high
            };
        }

        button.addEventListener('click', () => {
            const checks = form.querySelectorAll('input[name="check"]:checked');
            const score = checks.length;
            const recommendation = getRecommendation(score);

            scoreValue.textContent = `${score}/6`;
            scoreBadge.textContent = recommendation.badge;
            advice.textContent = recommendation.message;

            appState.readinessScore = score;
            appState.readinessBadge = recommendation.badge;

            const subjectField = safeQuerySelector('#contactSubject');
            const industryField = safeQuerySelector('#contactIndustryField');
            const scoreField = safeQuerySelector('#contactScoreField');
            const badgeField = safeQuerySelector('#contactBadgeField');
            const scoreText = `${score}/6`;
            const subject = `New Consultation Request - we2systems | ${appState.industryLabel} | Readiness ${scoreText}`;

            if (subjectField) subjectField.value = subject;
            if (industryField) industryField.value = appState.industry;
            if (scoreField) scoreField.value = scoreText;
            if (badgeField) badgeField.value = recommendation.badge;

            result.classList.remove('hidden');
        });
    }

    /* ===========================
       Architecture Toggle
       =========================== */

    function initArchitectureToggle() {
        const buttons = safeQuerySelectorAll('.compare-btn');
        const beforePanel = safeQuerySelector('#beforePanel');
        const afterPanel = safeQuerySelector('#afterPanel');

        if (!buttons.length || !beforePanel || !afterPanel) return;

        function setView(view) {
            const showBefore = view === 'before';

            buttons.forEach(button => {
                const isActive = button.dataset.view === view;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            beforePanel.classList.toggle('is-visible', showBefore);
            afterPanel.classList.toggle('is-visible', !showBefore);
            beforePanel.setAttribute('aria-hidden', showBefore ? 'false' : 'true');
            afterPanel.setAttribute('aria-hidden', showBefore ? 'true' : 'false');
        }

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                setView(button.dataset.view || 'before');
            });
        });

        setView('before');
    }

    /* ===========================
       Form Validation (Basic)
       =========================== */
    
    function initFormValidation() {
        const form = safeQuerySelector('#contactForm') || safeQuerySelector('#contact form');
        if (!form) return;

        const submitButton = safeQuerySelector('#contactSubmitBtn');
        const statusEl = safeQuerySelector('#contactFormStatus');

        function setStatus(message, isError) {
            if (!statusEl) return;

            statusEl.textContent = message;
            statusEl.classList.remove('hidden', 'text-green-400', 'text-red-400', 'text-gray-300');
            statusEl.classList.add(isError ? 'text-red-400' : 'text-green-400');
        }

        function setLoadingState(isLoading) {
            if (!submitButton) return;

            submitButton.disabled = isLoading;
            submitButton.classList.toggle('opacity-70', isLoading);
            submitButton.classList.toggle('cursor-not-allowed', isLoading);
            submitButton.textContent = isLoading ? 'Sending...' : 'Send Consultation Request';
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        try {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Basic validation
                const name = form.querySelector('#name');
                const email = form.querySelector('#email');
                const message = form.querySelector('#message');
                const service = form.querySelector('#service');
                const endpoint = form.dataset.formEndpoint || form.getAttribute('action');

                if (!name?.value || !email?.value || !message?.value || !service?.value) {
                    setStatus('Please fill in all required fields.', true);
                    return;
                }

                if (!isValidEmail(email.value.trim())) {
                    setStatus('Please enter a valid work email address.', true);
                    email.focus();
                    return;
                }

                if (!endpoint || endpoint === '#') {
                    setStatus('Form endpoint is not configured yet. Please set data-form-endpoint on the form.', true);
                    return;
                }

                const payload = {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    service: service.value,
                    message: message.value.trim()
                };

                setStatus('', false);
                if (statusEl) {
                    statusEl.classList.add('hidden');
                }
                setLoadingState(true);

                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(`Form submission failed with status ${response.status}`);
                    }

                    setStatus('Thank you for your consultation request. Our team will reach out shortly.', false);
                    form.reset();
                } catch (submitError) {
                    console.error('Contact form submission error:', submitError);
                    setStatus('Unable to send your request right now. Please try again in a few minutes.', true);
                } finally {
                    setLoadingState(false);
                }

            });
        } catch (error) {
            console.error('Error initializing form validation:', error);
        }
    }

    /* ===========================
       Leadership Slider
       =========================== */
    
    function initLeadershipSlider() {
        const slider = safeQuerySelector('#leadershipSlider');
        const prevBtn = safeQuerySelector('#leadershipPrevBtn');
        const nextBtn = safeQuerySelector('#leadershipNextBtn');
        const indicators = safeQuerySelectorAll('.leadership-indicator');
        
        if (!slider || !prevBtn || !nextBtn || !indicators.length) return;

        let currentSlide = 0;
        const totalSlides = 2; // We have 2 slides in the leadership section
        let autoSlideInterval = null;

        function goToSlide(slideIndex) {
            try {
                // Ensure index is within bounds
                if (slideIndex < 0) slideIndex = totalSlides - 1;
                if (slideIndex >= totalSlides) slideIndex = 0;

                // Update slider position
                slider.style.transform = `translateX(-${slideIndex * 100}%)`;

                // Update indicators
                indicators.forEach((indicator, idx) => {
                    if (idx === slideIndex) {
                        indicator.classList.remove('bg-gray-600');
                        indicator.classList.add('bg-primary-blue');
                    } else {
                        indicator.classList.remove('bg-primary-blue');
                        indicator.classList.add('bg-gray-600');
                    }
                });

                currentSlide = slideIndex;
            } catch (error) {
                console.error('Error navigating to slide:', slideIndex, error);
            }
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 6000); // Change slide every 6 seconds
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        try {
            // Previous button
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(currentSlide - 1);
                setTimeout(startAutoSlide, 10000); // Restart after 10 seconds
            });

            // Next button
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(currentSlide + 1);
                setTimeout(startAutoSlide, 10000);
            });

            // Indicator buttons
            indicators.forEach((indicator, idx) => {
                indicator.addEventListener('click', () => {
                    stopAutoSlide();
                    goToSlide(idx);
                    setTimeout(startAutoSlide, 10000);
                });
            });

            // Pause on hover
            slider.addEventListener('mouseenter', stopAutoSlide);
            slider.addEventListener('mouseleave', startAutoSlide);

            // Initialize
            goToSlide(0);
            startAutoSlide();

        } catch (error) {
            console.error('Error initializing leadership slider:', error);
        }
    }

    /* ===========================
       Initialize All
       =========================== */
    
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        try {
            initFluidBackground();
            initMobileMenu();
            initServiceSlider();
            initSmoothScroll();
            initParallax();
            initIndustryPersonalization();
            initRecoveryTimeline();
            initReadinessSnapshot();
            initArchitectureToggle();
            initFormValidation();
            initLeadershipSlider();
            
            console.log('we2systems: All components initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    // Start initialization
    init();

})();
