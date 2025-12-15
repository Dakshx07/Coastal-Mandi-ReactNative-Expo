import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeColors {
    background: string;
    surface: string;
    surfaceLight: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    success: string;
    error: string;
    warning: string;
}

interface ThemeContextType {
    mode: ThemeMode;
    colors: ThemeColors;
    toggleTheme: () => void;
    isDark: boolean;
}

const darkColors: ThemeColors = {
    background: '#0b0f19',
    surface: '#1e293b',
    surfaceLight: '#334155',
    border: '#334155',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    primary: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#eab308',
};

const lightColors: ThemeColors = {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceLight: '#f1f5f9',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    primary: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#eab308',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('dark');

    const toggleTheme = () => {
        setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const colors = mode === 'dark' ? darkColors : lightColors;
    const isDark = mode === 'dark';

    return (
        <ThemeContext.Provider value={{ mode, colors, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

// Export colors for use in files that can't use hooks
export { darkColors, lightColors };
