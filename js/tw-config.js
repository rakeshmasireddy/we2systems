/* Shared Tailwind theme for every page. Load immediately after the Tailwind CDN script.
 *
 * Palette rules
 *   primary / accent  brand colours. DEFAULT shades pass WCAG AA as text on white;
 *                     use the `light` shades only for decoration (dots, glows, illustrations).
 *   health            HMS / healthcare sub-brand. Only on HMS-related elements.
 *   field             FMS / field-operations sub-brand. Only on FMS-related elements.
 *   status            emerald = active, amber = in development, slate = planned.
 *   ink               dark navy for the closing CTA band (.sc-band-dark).
 *   Neutrals come from Tailwind's slate scale.
 */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
                heading: ['Inter', 'Helvetica Neue', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
            },
            colors: {
                primary: { DEFAULT: '#0277b6', light: '#0ea5e9', soft: '#e0f2fe' },
                primaryHover: '#0369a1',
                accent: { DEFAULT: '#4f46e5', light: '#6366f1', soft: '#e0e7ff' },
                accentHover: '#4338ca',
                health: { DEFAULT: '#047857', light: '#10b981', soft: '#d1fae5' },
                field: { DEFAULT: '#b45309', light: '#f59e0b', soft: '#fef3c7' },
                ink: { DEFAULT: '#0b1324', 800: '#111c33', 700: '#1e2a44' },
                // Legacy light-surface scale used by older sections (not a dark theme).
                dark: {
                    950: '#f8fafc',
                    900: '#ffffff',
                    800: '#f1f5f9',
                    700: '#e2e8f0',
                    600: '#cbd5e1',
                    500: '#94a3b8',
                },
            },
            maxWidth: { site: '1200px' },
            boxShadow: {
                glow: '0 0 25px rgba(14, 165, 233, 0.35)',
                'glow-lg': '0 0 50px rgba(14, 165, 233, 0.2)',
                'glow-accent': '0 0 25px rgba(99, 102, 241, 0.35)',
            },
        },
    },
};
