// Type definitions for the component library

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type InputType = 'text' | 'email' | 'password' | 'number'
export type CardVariant = 'default' | 'elevated' | 'outlined'
export type ModalSize = 'sm' | 'md' | 'lg' | 'full'
export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ThemeMode = 'light' | 'dark'

export interface Theme {
    mode: ThemeMode
    colors: {
        primary: string
        secondary: string
        background: string
        surface: string
        text: string
        textSecondary: string
        border: string
        error: string
        success: string
        warning: string
        info: string
    }
}

export interface ThemeContext {
    theme: Theme
    mode: ThemeMode
    toggleTheme: () => void
    setTheme: (mode: ThemeMode) => void
}

export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

export interface ToastContext {
    toasts: Toast[]
    showToast: (message: string, type: ToastType, duration?: number) => void
    removeToast: (id: string) => void
}

export interface DataColumn {
    key: string
    label: string
    sortable?: boolean
    width?: string
}

export interface TabsContext {
    activeTab: string
    registerTab: (id: string, label: string) => void
    unregisterTab: (id: string) => void
    selectTab: (id: string) => void
}
