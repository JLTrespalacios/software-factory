import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = {
    id: string;
    name: string;
};

type ThemeContextType = {
    theme: string;
    themes: Theme[];
    setTheme: (id: string) => Promise<void>;
    isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<string>('hybrid');
    const [themes, setThemes] = useState<Theme[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = 'http://localhost:3011/api';

    useEffect(() => {
        const initTheme = async () => {
            try {
                const [themesRes, selectedRes] = await Promise.all([
                    fetch(`${API_URL}/themes`),
                    fetch(`${API_URL}/selected-theme`)
                ]);
                
                const themesData = await themesRes.json();
                const selectedData = await selectedRes.json();

                setThemes(themesData);
                setThemeState(selectedData.id);
            } catch (error) {
                console.error('Error initializing theme:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initTheme();
    }, []);

    const setTheme = async (id: string) => {
        // Optimistic update
        setThemeState(id);
        
        try {
            await fetch(`${API_URL}/selected-theme`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
        } catch (error) {
            console.error('Error saving theme:', error);
            // Revert on error? For now we keep optimistic state
        }
    };

    // Apply theme class to body/html
    useEffect(() => {
        document.documentElement.className = ''; // Reset
        document.documentElement.classList.add(`theme-${theme}`);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, themes, setTheme, isLoading }}>
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
