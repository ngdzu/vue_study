import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeContext {
    mode: ThemeMode
    isDark: boolean
    toggleTheme: () => void
    setTheme: (theme: ThemeMode) => void
}

const THEME_KEY = 'dashboard-theme'

const currentTheme = ref<ThemeMode>('auto')
const isDarkMode = computed(() => {
    if (currentTheme.value === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return currentTheme.value === 'dark'
})

let mediaQueryList: MediaQueryList | null = null

const setupMediaQuery = () => {
    if (typeof window !== 'undefined') {
        mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQueryList.addEventListener('change', applyTheme)
    }
}

const applyTheme = () => {
    const isDark = isDarkMode.value
    if (isDark) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
    updateCSSVariables()
}

const updateCSSVariables = () => {
    const isDark = isDarkMode.value
    const root = document.documentElement

    if (isDark) {
        root.style.setProperty('--bg-primary', '#0f172a')
        root.style.setProperty('--bg-secondary', '#1e293b')
        root.style.setProperty('--text-primary', '#f1f5f9')
        root.style.setProperty('--text-secondary', '#cbd5e1')
        root.style.setProperty('--border-color', '#334155')
    } else {
        root.style.setProperty('--bg-primary', '#ffffff')
        root.style.setProperty('--bg-secondary', '#f8fafc')
        root.style.setProperty('--text-primary', '#1e293b')
        root.style.setProperty('--text-secondary', '#64748b')
        root.style.setProperty('--border-color', '#e2e8f0')
    }

    root.style.setProperty('--color-primary', '#667eea')
    root.style.setProperty('--color-secondary', '#764ba2')
    root.style.setProperty('--color-accent', '#00d4ff')
    root.style.setProperty('--color-success', '#10b981')
    root.style.setProperty('--color-warning', '#f59e0b')
    root.style.setProperty('--color-error', '#ef4444')
}

export function useTheme(): ThemeContext {
    setupMediaQuery()

    watch(isDarkMode, applyTheme, { immediate: true })

    onMounted(() => {
        const saved = localStorage.getItem(THEME_KEY)
        if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
            currentTheme.value = saved as ThemeMode
        }
    })

    onUnmounted(() => {
        if (mediaQueryList) {
            mediaQueryList.removeEventListener('change', applyTheme)
        }
    })

    return {
        mode: currentTheme.value,
        isDark: isDarkMode.value,
        toggleTheme: () => {
            currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
            localStorage.setItem(THEME_KEY, currentTheme.value)
        },
        setTheme: (theme: ThemeMode) => {
            currentTheme.value = theme
            localStorage.setItem(THEME_KEY, theme)
        }
    }
}
