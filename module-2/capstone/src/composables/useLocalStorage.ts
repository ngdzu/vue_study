// Composable for local storage - demonstrates Composition API patterns (Lesson 2.2 & 2.3)
import { ref, Ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T): [Ref<T>, (value: T) => void] {
    // Try to read from localStorage
    const readValue = (): T => {
        if (typeof window === 'undefined') return initialValue

        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    }

    const storedValue = ref<T>(readValue())

    // Update localStorage when value changes
    const setValue = (value: T) => {
        try {
            storedValue.value = value
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value))
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    }

    // Sync across tabs (Lesson 2.1: Event listeners for side effects)
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key && e.newValue) {
            storedValue.value = JSON.parse(e.newValue)
        }
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('storage', handleStorageChange)
    }

    return [storedValue, setValue]
}
