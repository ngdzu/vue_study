import { ref, computed } from 'vue'

/**
 * useTime - Manages current time, date, and greeting
 * Demonstrates: ref, computed, watchers (setInterval)
 */
export const useTime = () => {
    const currentTime = ref(new Date())
    const currentDate = ref(new Date())

    // Update time every second
    setInterval(() => {
        currentTime.value = new Date()
    }, 1000)

    const formattedTime = computed(() => {
        return currentTime.value.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })
    })

    const formattedDate = computed(() => {
        return currentDate.value.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    })

    const greeting = computed(() => {
        const hour = currentTime.value.getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    })

    return {
        currentTime,
        currentDate,
        formattedTime,
        formattedDate,
        greeting
    }
}
