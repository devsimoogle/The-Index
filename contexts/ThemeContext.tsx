import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types/theme';
import { THEMES, DEFAULT_THEME } from '../constants/themes';

interface ThemeContextType {
    currentTheme: Theme;
    setTheme: (themeId: string) => void;
    updateThemeColors: (colors: Partial<Theme['colors']>) => void;
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

    }, [currentTheme]);

    const setTheme = (themeId: string) => {
        const theme = THEMES[themeId];
        if (theme) {
            setCurrentThemeState(theme);
            localStorage.setItem('lis_journal_theme_id', themeId);
            localStorage.removeItem('lis_journal_custom_theme'); // Clear custom overrides
        }
    };

    const updateThemeColors = (colors: Partial<Theme['colors']>) => {
        setCurrentThemeState(prev => {
            const newTheme = {
                ...prev,
                id: 'custom',
                name: 'Custom Theme',
                colors: { ...prev.colors, ...colors }
            };
            localStorage.setItem('lis_journal_custom_theme', JSON.stringify(newTheme));
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            setTheme,
            updateThemeColors,
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
