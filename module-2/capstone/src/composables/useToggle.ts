// Composable for toggle state - demonstrates reactive refs (Lesson 2.2)
import { ref, computed } from 'vue'

export function useToggle(initialValue: boolean = false) {
    const value = ref(initialValue)

    const toggle = () => {
        value.value = !value.value
    }

    const on = () => {
        value.value = true
    }

    const off = () => {
        value.value = false
    }

    return {
        value,
        toggle,
        on,
        off,
    }
}
