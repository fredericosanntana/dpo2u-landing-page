'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Moon, Sun, Palette, Zap, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useTheme, useThemeDetection, useAutoTheme } from '@/hooks/use-theme';

interface ThemeToggleProps {
  variant?: 'default' | 'floating' | 'minimal' | 'premium';
  showAutoMode?: boolean;
  className?: string;
}

const iconAnimation = {
  initial: { rotate: -90, opacity: 0, scale: 0.8 },
  animate: { rotate: 0, opacity: 1, scale: 1 },
  exit: { rotate: 90, opacity: 0, scale: 0.8 },
  transition: { duration: 0.2, ease: 'easeInOut' }
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'default',
  showAutoMode = false,
  className 
}) => {
  const { theme, setTheme, resolvedTheme, isSystemTheme } = useTheme();
  const { mounted, isDark } = useThemeDetection();
  const [autoThemeEnabled, setAutoThemeEnabled] = React.useState(false);

  useAutoTheme(autoThemeEnabled);

  if (!mounted) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className={className}
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const getThemeIcon = () => {
    if (isSystemTheme) return Monitor;
    return isDark ? Moon : Sun;
  };

  const getThemeLabel = () => {
    if (autoThemeEnabled) return 'Auto (Time-based)';
    if (isSystemTheme) return 'System';
    return isDark ? 'Dark' : 'Light';
  };

  const ThemeIcon = getThemeIcon();

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={className}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTheme}
            {...iconAnimation}
          >
            <ThemeIcon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        </AnimatePresence>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm border-brand-gray-200/50 shadow-2xl hover:scale-110 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={resolvedTheme}
                  {...iconAnimation}
                >
                  <ThemeIcon className="h-5 w-5 text-brand-gray-700" />
                </motion.div>
              </AnimatePresence>
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Theme</span>
              <Badge variant="outline" size="sm">
                {getThemeLabel()}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
            {showAutoMode && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setAutoThemeEnabled(!autoThemeEnabled)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Auto (Time)</span>
                  {autoThemeEnabled && (
                    <Zap className="ml-auto h-3 w-3 text-brand-green-500" />
                  )}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    );
  }

  if (variant === 'premium') {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 text-sm text-brand-gray-600">
          <Palette className="h-4 w-4" />
          <span>Theme:</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 px-3 bg-gradient-to-r from-white to-brand-platinum-50 border-brand-gray-200/50 hover:from-brand-platinum-50 hover:to-white shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={resolvedTheme}
                  {...iconAnimation}
                  className="mr-2"
                >
                  <ThemeIcon className="h-3 w-3" />
                </motion.div>
              </AnimatePresence>
              <span className="text-xs font-medium">{getThemeLabel()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setTheme('light')}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Sun className="mr-2 h-4 w-4" />
                <div>
                  <div className="font-medium">Light</div>
                  <div className="text-xs text-muted-foreground">Default theme</div>
                </div>
              </div>
              {theme === 'light' && (
                <div className="w-2 h-2 bg-brand-sapphire-500 rounded-full" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme('dark')}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Moon className="mr-2 h-4 w-4" />
                <div>
                  <div className="font-medium">Dark</div>
                  <div className="text-xs text-muted-foreground">Easier on the eyes</div>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="w-2 h-2 bg-brand-sapphire-500 rounded-full" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme('system')}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Monitor className="mr-2 h-4 w-4" />
                <div>
                  <div className="font-medium">System</div>
                  <div className="text-xs text-muted-foreground">Use system preference</div>
                </div>
              </div>
              {theme === 'system' && (
                <div className="w-2 h-2 bg-brand-sapphire-500 rounded-full" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <AnimatePresence mode="wait">
            <motion.div
              key={resolvedTheme}
              {...iconAnimation}
            >
              <ThemeIcon className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Quick Theme Switcher Component
export const QuickThemeSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { mounted } = useThemeDetection();

  if (!mounted) return null;

  const themes = [
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className={`flex items-center space-x-1 p-1 bg-brand-gray-100 rounded-xl dark:bg-brand-gray-800 ${className}`}>
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            theme === key
              ? 'bg-white text-brand-gray-900 shadow-sm dark:bg-brand-gray-700 dark:text-white'
              : 'text-brand-gray-600 hover:text-brand-gray-900 dark:text-brand-gray-400 dark:hover:text-white'
          }`}
          title={`Switch to ${label} theme`}
        >
          <Icon className="h-3 w-3" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;