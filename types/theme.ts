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

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
}

export type ThemePreset = 'classic' | 'midnight' | 'sepia' | 'cyber';
