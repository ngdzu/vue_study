// Type definitions for Personal Dashboard

export interface User {
    id: string
    name: string
    email: string
    avatar: string
    role: 'admin' | 'user' | 'viewer'
    status: 'online' | 'offline' | 'away'
}

export interface Task {
    id: string
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    status: 'pending' | 'in-progress' | 'completed'
    dueDate: string
    createdAt: string
}

export interface Notification {
    id: string
    type: 'task_complete' | 'task_due' | 'system'
    message: string
    timestamp: string
    read: boolean
}

export interface Settings {
    theme: 'light' | 'dark' | 'auto'
    language: 'en' | 'es' | 'fr'
    temperatureUnit: 'C' | 'F'
    notificationsEnabled: boolean
}

export interface WeatherData {
    temp: number
    condition: string
    humidity: number
    windSpeed: number
    forecast: WeatherForecast[]
}

export interface WeatherForecast {
    day: string
    high: number
    low: number
    condition: string
}

export interface Stats {
    tasksCompletedToday: number
    tasksDueSoon: number
    totalTasks: number
    completionPercentage: number
}
