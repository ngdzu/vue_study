import { ref, onMounted, onUnmounted } from 'vue'

export function useDashboardTime() {
    const now = ref(new Date())
    const time = ref('')
    const greeting = ref('')
    const dayOfWeek = ref('')
    const dateStr = ref('')

    const updateTime = () => {
        now.value = new Date()
        time.value = now.value.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })

        const hour = now.value.getHours()
        if (hour < 12) {
            greeting.value = 'Good Morning'
        } else if (hour < 18) {
            greeting.value = 'Good Afternoon'
        } else {
            greeting.value = 'Good Evening'
        }

        dayOfWeek.value = now.value.toLocaleDateString('en-US', { weekday: 'long' })
        dateStr.value = now.value.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    let intervalId: ReturnType<typeof setInterval> | null = null

    onMounted(() => {
        updateTime()
        intervalId = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
        if (intervalId) {
            clearInterval(intervalId)
        }
    })

    return {
        time,
        greeting,
        dayOfWeek,
        dateStr,
        now
    }
}
