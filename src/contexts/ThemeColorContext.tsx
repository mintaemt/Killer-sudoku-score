import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeColor = 'blue' | 'orange' | 'green' | 'purple' | 'pink' | 'teal';

interface ThemeColorContextType {
    theme: ThemeColor;
    setTheme: (theme: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export const ThemeColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeColor>(() => {
        const savedTheme = localStorage.getItem('killer-sudoku-theme');
        return (savedTheme && ['blue', 'orange', 'green', 'purple', 'pink', 'teal'].includes(savedTheme))
            ? (savedTheme as ThemeColor)
            : 'blue';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('killer-sudoku-theme', theme);
    }, [theme]);

    const setTheme = (newTheme: ThemeColor) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeColorContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeColorContext.Provider>
    );
};

export const useThemeColor = () => {
    const context = useContext(ThemeColorContext);
    if (context === undefined) {
        throw new Error('useThemeColor must be used within a ThemeColorProvider');
    }
    return context;
};
