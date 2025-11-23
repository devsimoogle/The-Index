export interface ThemeColors {
    paper: string;
    ink: string;
    graphite: string;
    mist: string;
    accent: string;
}

export interface ThemeColors {
    paper: string;
    ink: string;
    graphite: string;
    mist: string;
    accent: string;
}

export interface ThemeFonts {
    serif: string;
    sans: string;
    mono: string;
}

export type LayoutTemplate = 'classic' | 'grid' | 'magazine' | 'minimal';

export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ThemeScale = 0.9 | 0.95 | 1 | 1.05 | 1.1;

export interface Theme {
    id: string;
    name: string;
    layout: LayoutTemplate;
    colors: ThemeColors;
    fonts: ThemeFonts;
    borderRadius: BorderRadius;
    scale: ThemeScale;
}

export type ThemePreset = 'classic' | 'midnight' | 'sepia' | 'cyber';
