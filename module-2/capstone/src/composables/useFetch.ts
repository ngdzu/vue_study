// Composable for async data fetching - demonstrates onMounted/onUnmounted (Lesson 2.1) and composition (Lesson 2.3)
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface FetchState<T> {
    data: T | null
    loading: boolean
    error: Error | null
}

export function useFetch<T>(url: string, options?: RequestInit) {
    const data = ref<T | null>(null)
    const loading = ref(false)
    const error = ref<Error | null>(null)
    let abortController: AbortController | null = null

    const state = computed((): FetchState<T> => ({
        data: data.value,
        loading: loading.value,
        error: error.value,
    }))

    const fetch_data = async () => {
        loading.value = true
        error.value = null
        abortController = new AbortController()

        try {
            // Lesson 2.1: Using AbortController for cleanup
            const response = await fetch(url, {
                ...options,
                signal: abortController.signal,
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            data.value = await response.json()
        } catch (err) {
            // Ignore AbortError (component unmounted)
            if (err instanceof Error && err.name !== 'AbortError') {
                error.value = err
            }
        } finally {
            loading.value = false
        }
    }

    // Lesson 2.1: Run fetch on mount, cleanup on unmount
    onMounted(() => {
        fetch_data()
    })

    // Lesson 2.1: Proper cleanup with AbortController (prevent memory leaks)
    onUnmounted(() => {
        if (abortController) {
            abortController.abort()
        }
    })

    return {
        data,
        loading,
        error,
        state,
        refetch: fetch_data,
    }
}
