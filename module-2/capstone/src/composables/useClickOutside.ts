// Composable for detecting clicks outside an element - demonstrates lifecycle hooks (Lesson 2.1)
import { ref, onMounted, onUnmounted } from 'vue'

export function useClickOutside(callback: () => void) {
    const elementRef = ref<HTMLElement | null>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
            callback()
        }
    }

    // Lesson 2.1: Add listener on mount
    onMounted(() => {
        document.addEventListener('click', handleClickOutside, true)
    })

    // Lesson 2.1: Remove listener on unmount (important for cleanup!)
    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside, true)
    })

    return elementRef
}
