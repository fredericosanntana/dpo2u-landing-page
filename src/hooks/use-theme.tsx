'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  isSystemTheme: boolean;
}

const ThemeProviderContext = React.createContext<ThemeProviderContext | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'dpo2u-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (theme: 'light' | 'dark') => {
      if (disableTransitionOnChange) {
        const css = document.createElement('style');
        css.appendChild(
          document.createTextNode(
            `* {
              -webkit-transition: none !important;
              -moz-transition: none !important;
              -o-transition: none !important;
              -ms-transition: none !important;
              transition: none !important;
            }`
          )
        );
        document.head.appendChild(css);

        setTimeout(() => {
          document.head.removeChild(css);
        }, 1);
      }

      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      setResolvedTheme(theme);

      // Set CSS custom properties for theme colors
      if (theme === 'dark') {
        root.style.setProperty('--background', '15 23 42'); // slate-900
        root.style.setProperty('--foreground', '248 250 252'); // slate-50
        root.style.setProperty('--card', '30 41 59'); // slate-800
        root.style.setProperty('--card-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--popover', '15 23 42'); // slate-900
        root.style.setProperty('--popover-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--primary', '0 109 255'); // brand-sapphire-500
        root.style.setProperty('--primary-foreground', '255 255 255');
        root.style.setProperty('--secondary', '51 65 85'); // slate-700
        root.style.setProperty('--secondary-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--muted', '51 65 85'); // slate-700
        root.style.setProperty('--muted-foreground', '148 163 184'); // slate-400
        root.style.setProperty('--accent', '51 65 85'); // slate-700
        root.style.setProperty('--accent-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--destructive', '220 38 38'); // red-600
        root.style.setProperty('--destructive-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--border', '51 65 85'); // slate-700
        root.style.setProperty('--input', '51 65 85'); // slate-700
        root.style.setProperty('--ring', '0 109 255'); // brand-sapphire-500
        root.style.setProperty('--radius', '0.75rem');
      } else {
        root.style.setProperty('--background', '255 255 255'); // white
        root.style.setProperty('--foreground', '15 23 42'); // slate-900
        root.style.setProperty('--card', '255 255 255'); // white
        root.style.setProperty('--card-foreground', '15 23 42'); // slate-900
        root.style.setProperty('--popover', '255 255 255'); // white
        root.style.setProperty('--popover-foreground', '15 23 42'); // slate-900
        root.style.setProperty('--primary', '0 109 255'); // brand-sapphire-500
        root.style.setProperty('--primary-foreground', '255 255 255');
        root.style.setProperty('--secondary', '241 245 249'); // slate-100
        root.style.setProperty('--secondary-foreground', '15 23 42'); // slate-900
        root.style.setProperty('--muted', '241 245 249'); // slate-100
        root.style.setProperty('--muted-foreground', '100 116 139'); // slate-500
        root.style.setProperty('--accent', '241 245 249'); // slate-100
        root.style.setProperty('--accent-foreground', '15 23 42'); // slate-900
        root.style.setProperty('--destructive', '220 38 38'); // red-600
        root.style.setProperty('--destructive-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--border', '226 232 240'); // slate-200
        root.style.setProperty('--input', '226 232 240'); // slate-200
        root.style.setProperty('--ring', '0 109 255'); // brand-sapphire-500
        root.style.setProperty('--radius', '0.75rem');
      }
    };

    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    let resolved: 'light' | 'dark';
    if (theme === 'system') {
      resolved = getSystemTheme();
    } else {
      resolved = theme;
    }

    applyTheme(resolved);

    if (theme === 'system' && enableSystem) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const systemTheme = getSystemTheme();
        applyTheme(systemTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    return undefined;
  }, [theme, enableSystem, disableTransitionOnChange]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      localStorage.setItem(storageKey, newTheme);
    },
    resolvedTheme,
    toggleTheme: () => {
      const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem(storageKey, newTheme);
    },
    isSystemTheme: theme === 'system',
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

// Advanced theme utilities
export const useThemeDetection = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    mounted,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  };
};

// Theme-aware component utilities
export const useThemeClass = (lightClass: string, darkClass: string) => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkClass : lightClass;
};

export const useThemeValue = <T,>(lightValue: T, darkValue: T): T => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkValue : lightValue;
};

// Auto theme switcher based on time
export const useAutoTheme = (enabled: boolean = false) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!enabled) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      const isDayTime = hour >= 6 && hour < 18;
      setTheme(isDayTime ? 'light' : 'dark');
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [enabled, setTheme]);
};

// Theme persistence with sync across tabs
export const useThemeSync = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dpo2u-theme' && e.newValue) {
        setTheme(e.newValue as Theme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setTheme]);
};