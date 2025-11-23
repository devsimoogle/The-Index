import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, LayoutTemplate, ThemeFonts, BorderRadius, ThemeScale } from '../types/theme';
import { THEMES, DEFAULT_THEME } from '../constants/themes';

interface ThemeContextType {
    currentTheme: Theme;
    setTheme: (themeId: string) => void;
    updateThemeColors: (colors: Partial<Theme['colors']>) => void;
    updateThemeLayout: (layout: LayoutTemplate) => void;
    updateThemeFonts: (fonts: Partial<ThemeFonts>) => void;
    updateThemeScale: (scale: ThemeScale) => void;
    updateThemeRadius: (radius: BorderRadius) => void;
    availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTheme, setCurrentThemeState] = useState<Theme>(DEFAULT_THEME);

    // Load theme from local storage on mount
    useEffect(() => {
        const savedThemeId = localStorage.getItem('lis_journal_theme_id');
        const savedCustomTheme = localStorage.getItem('lis_journal_custom_theme');

        if (savedCustomTheme) {
            try {
                setCurrentThemeState(JSON.parse(savedCustomTheme));
            } catch (e) {
                console.error("Failed to parse custom theme", e);
            }
        } else if (savedThemeId && THEMES[savedThemeId]) {
            setCurrentThemeState(THEMES[savedThemeId]);
        }
    }, []);

    // Apply theme to CSS variables
    useEffect(() => {
        const root = document.documentElement;

        // Colors
        root.style.setProperty('--color-paper', currentTheme.colors.paper);
        root.style.setProperty('--color-ink', currentTheme.colors.ink);
        root.style.setProperty('--color-graphite', currentTheme.colors.graphite);
        root.style.setProperty('--color-mist', currentTheme.colors.mist);
        root.style.setProperty('--color-accent', currentTheme.colors.accent);

        // Fonts
        root.style.setProperty('--font-serif', currentTheme.fonts.serif);
        root.style.setProperty('--font-sans', currentTheme.fonts.sans);
        root.style.setProperty('--font-mono', currentTheme.fonts.mono);

        // Scale (Base Font Size)
        const scalePercentage = (currentTheme.scale || 1) * 100;
        root.style.fontSize = `${scalePercentage}%`;

        // Border Radius
        const radiusMap: Record<BorderRadius, string> = {
            'none': '0px',
            'sm': '0.25rem',
            'md': '0.5rem',
            'lg': '1rem',
            'full': '9999px'
        };
        root.style.setProperty('--radius', radiusMap[currentTheme.borderRadius || 'none']);

    }, [currentTheme]);

    const updateTheme = (updates: Partial<Theme>) => {
        setCurrentThemeState(prev => {
            const newTheme = {
                ...prev,
                id: 'custom',
                name: 'Custom Theme',
                ...updates
            };
            localStorage.setItem('lis_journal_custom_theme', JSON.stringify(newTheme));
            return newTheme;
        });
    };

    const setTheme = (themeId: string) => {
        const theme = THEMES[themeId];
        if (theme) {
            setCurrentThemeState(theme);
            localStorage.setItem('lis_journal_theme_id', themeId);
            localStorage.removeItem('lis_journal_custom_theme'); // Clear custom overrides
        }
    };

    const updateThemeColors = (colors: Partial<Theme['colors']>) => {
        updateTheme({ colors: { ...currentTheme.colors, ...colors } });
    };

    const updateThemeLayout = (layout: LayoutTemplate) => {
        updateTheme({ layout });
    };

    const updateThemeFonts = (fonts: Partial<ThemeFonts>) => {
        updateTheme({ fonts: { ...currentTheme.fonts, ...fonts } });
    };

    const updateThemeScale = (scale: ThemeScale) => {
        updateTheme({ scale });
    };

    const updateThemeRadius = (borderRadius: BorderRadius) => {
        updateTheme({ borderRadius });
    };

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            setTheme,
            updateThemeColors,
            updateThemeLayout,
            updateThemeFonts,
            updateThemeScale,
            updateThemeRadius,
            availableThemes: Object.values(THEMES)
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
