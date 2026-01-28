import { ref } from 'vue'
import type { Settings } from '../types'

/**
 * useSettings - Manages application settings
 * Demonstrates: ref, reactive objects, methods
 */
export const useSettings = () => {
    const settings = ref<Settings>({
        theme: 'light',
        language: 'en',
        temperatureUnit: 'C',
        notificationsEnabled: true
    })

    const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        settings.value[key] = value
    }

    const toggleTheme = () => {
        settings.value.theme = settings.value.theme === 'light' ? 'dark' : 'light'
    }

    return {
        settings,
        updateSetting,
        toggleTheme
    }
}
