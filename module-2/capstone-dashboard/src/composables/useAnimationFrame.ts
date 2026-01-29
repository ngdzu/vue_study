import { ref, onUnmounted } from 'vue'

// Smooth animations with requestAnimationFrame
export function useAnimationFrame(
    callback: (deltaTime: number) => void,
    fps: number = 60
) {
    const isRunning = ref(false)
    let rafId: number | null = null
    let lastTime = Date.now()
    const frameTime = 1000 / fps

    const frame = () => {
        const now = Date.now()
        const deltaTime = now - lastTime

        if (deltaTime >= frameTime) {
            callback(deltaTime)
            lastTime = now
        }

        if (isRunning.value) {
            rafId = requestAnimationFrame(frame)
        }
    }

    const start = () => {
        if (!isRunning.value) {
            isRunning.value = true
            lastTime = Date.now()
            rafId = requestAnimationFrame(frame)
        }
    }

    const stop = () => {
        isRunning.value = false
        if (rafId !== null) {
            cancelAnimationFrame(rafId)
            rafId = null
        }
    }

    onUnmounted(() => {
        stop()
    })

    return {
        isRunning,
        start,
        stop
    }
}

// Animate a value over time
export function useAnimateValue(
    startValue: number,
    endValue: number,
    duration: number = 1000
) {
    const currentValue = ref(startValue)
    const progress = ref(0)
    let startTime: number | null = null
    let rafId: number | null = null

    const animate = (currentTime: number) => {
        if (startTime === null) {
            startTime = currentTime
        }

        const elapsed = currentTime - startTime
        progress.value = Math.min(elapsed / duration, 1)

        // Easing function: easeOutQuad
        const eased = 1 - Math.pow(1 - progress.value, 2)
        currentValue.value = startValue + (endValue - startValue) * eased

        if (progress.value < 1) {
            rafId = requestAnimationFrame(animate)
        } else {
            currentValue.value = endValue
            startTime = null
            rafId = null
        }
    }

    const start = () => {
        startTime = null
        rafId = requestAnimationFrame(animate)
    }

    onUnmounted(() => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId)
        }
    })

    return {
        currentValue,
        progress,
        start
    }
}
