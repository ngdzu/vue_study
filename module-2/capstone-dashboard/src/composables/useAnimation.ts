import { ref, onMounted, onUnmounted } from 'vue'

// Lesson 2.1: Lifecycle hooks with proper cleanup
export function useAnimation() {
    const isVisible = ref(false)
    let observerInstance: IntersectionObserver | null = null

    onMounted(() => {
        // Use IntersectionObserver for efficient scroll detection
        observerInstance = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    isVisible.value = true
                    // Once visible, stop observing (optional)
                    // observerInstance?.unobserve(entry.target)
                }
            })
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        })
    })

    onUnmounted(() => {
        // Proper cleanup: remove observer on unmount
        if (observerInstance) {
            observerInstance.disconnect()
            observerInstance = null
        }
    })

    const observe = (el: Element) => {
        if (observerInstance && el) {
            observerInstance.observe(el)
        }
    }

    return {
        isVisible,
        observe
    }
}

export function useScrollAnimation(callback: (scrollY: number) => void) {
    let rafId: number | null = null
    let lastScrollY = 0

    const handleScroll = () => {
        lastScrollY = window.scrollY
        callback(lastScrollY)
    }

    const throttledScroll = () => {
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                handleScroll()
                rafId = null
            })
        }
    }

    onMounted(() => {
        window.addEventListener('scroll', throttledScroll)
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', throttledScroll)
        if (rafId !== null) {
            cancelAnimationFrame(rafId)
        }
    })

    return { lastScrollY }
}
