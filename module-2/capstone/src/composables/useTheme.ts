// composable for theme management - demonstrates Provide/Inject pattern (Lesson 2.6)
import { ref, computed, inject, provide, readonly, InjectionKey } from 'vue'
import type { Theme, ThemeMode, ThemeContext } from '../types'

const LIGHT_THEME: Theme = {
    mode: 'light',
    colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        surface: '#f3f4f6',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        error: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6',
    },
}

const DARK_THEME: Theme = {
    mode: 'dark',
    colors: {
        primary: '#60a5fa',
        secondary: '#a78bfa',
        background: '#1f2937',
        surface: '#374151',
        text: '#f3f4f6',
        textSecondary: '#d1d5db',
        border: '#4b5563',
        error: '#f87171',
        success: '#34d399',
        warning: '#fbbf24',
        info: '#60a5fa',
    },
}

// Injection key for type-safe provide/inject (Lesson 2.6: Type-safe contexts)
export const ThemeInjectionKey: InjectionKey<ThemeContext> = Symbol('theme')

export function useTheme(): ThemeContext {
    // Try to get from injected context first
    const injected = inject<ThemeContext>(ThemeInjectionKey)
    if (injected) {
        return injected
    }

    // Fallback: create local state (for root component)
    const getInitialTheme = (): ThemeMode => {
        if (typeof window === 'undefined') return 'light'
        return (localStorage.getItem('theme') as ThemeMode) || 'light'
    }

    const mode = ref<ThemeMode>(getInitialTheme())

    const theme = computed((): Theme => {
        return mode.value === 'dark' ? DARK_THEME : LIGHT_THEME
    })

    const toggleTheme = () => {
        mode.value = mode.value === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', mode.value)
        applyThemeToDOM(theme.value)
    }

    const setTheme = (newMode: ThemeMode) => {
        mode.value = newMode
        localStorage.setItem('theme', newMode)
        applyThemeToDOM(theme.value)
    }

    // Apply theme colors to DOM CSS custom properties (Lesson 2.1: Side effects in composable)
    const applyThemeToDOM = (themeData: Theme) => {
        if (typeof document === 'undefined') return
        const root = document.documentElement
        Object.entries(themeData.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value)
        })
        root.setAttribute('data-theme', themeData.mode)
    }

    // Apply initial theme
    applyThemeToDOM(theme.value)

    return {
        theme: readonly(theme) as any,
        mode: readonly(mode) as any,
        toggleTheme,
        setTheme,
    }
}

export function provideTheme(): void {
    const context = useTheme()
    provide(ThemeInjectionKey, context)
}
