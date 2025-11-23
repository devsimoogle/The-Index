import { Theme } from '../types/theme';

export const THEMES: Record<string, Theme> = {
    classic: {
        id: 'classic',
        name: 'The Index (Classic)',
        layout: 'classic',
        borderRadius: 'none',
        scale: 1,
        colors: {
            paper: '#ffffff',
            ink: '#0a0a0a',
            graphite: '#52525b',
            mist: '#f4f4f5',
            accent: '#0a0a0a'
        },
        fonts: {
            serif: '"Cormorant Garamond"',
            sans: '"Inter"',
            mono: '"JetBrains Mono"'
        }
    },
    midnight: {
        id: 'midnight',
        name: 'Midnight Archive',
        layout: 'grid',
        borderRadius: 'lg',
        scale: 1,
        colors: {
            paper: '#0f172a',
            ink: '#e2e8f0',
            graphite: '#94a3b8',
            mist: '#1e293b',
            accent: '#38bdf8'
        },
        fonts: {
            serif: '"Merriweather"',
            sans: '"Inter"',
            mono: '"JetBrains Mono"'
        }
    },
    sepia: {
        id: 'sepia',
        name: 'Sepia Manuscript',
        layout: 'classic',
        borderRadius: 'sm',
        scale: 1.05,
        colors: {
            paper: '#fdf6e3',
            ink: '#433422',
            graphite: '#93a1a1',
            mist: '#eee8d5',
            accent: '#b58900'
        },
        fonts: {
            serif: '"Lora"',
            sans: '"Inter"',
            mono: '"JetBrains Mono"'
        }
    },
    cyber: {
        id: 'cyber',
        name: 'Cyber Librarian',
        layout: 'minimal',
        borderRadius: 'none',
        scale: 0.95,
        colors: {
            paper: '#050505',
            ink: '#00ff41',
            graphite: '#008f11',
            mist: '#0d0208',
            accent: '#00ff41'
        },
        fonts: {
            serif: '"Space Mono"',
            sans: '"Space Mono"',
            mono: '"Space Mono"'
        }
    }
};

export const DEFAULT_THEME = THEMES.classic;
