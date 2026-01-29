// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeContext {
    mode: ThemeMode
    isDark: boolean
    toggleTheme: () => void
    setTheme: (theme: ThemeMode) => void
}

// Task types
export interface Task {
    id: string
    title: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
    dueDate: string
}

// Notification types
export interface Notification {
    id: string
    type: 'task' | 'system' | 'reminder' | 'message'
    title: string
    message: string
    timestamp: Date
    read: boolean
}

// Activity types
export interface Activity {
    id: string
    type: 'task' | 'event' | 'note' | 'update'
    description: string
    timestamp: Date
    avatar?: string
    user?: string
}

// Weather types
export interface WeatherData {
    temp: number
    condition: string
    humidity: number
    windSpeed: number
    icon: string
}

// Stat types
export interface Stat {
    label: string
    value: number
    unit?: string
    color: string
    trend?: 'up' | 'down' | 'neutral'
}
