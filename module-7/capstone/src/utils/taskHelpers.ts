// Utility functions for task management

export interface Task {
    id: number;
    title: string;
    description?: string;
    category: string;
    duration: number; // in seconds
    estimatedDuration: number; // in seconds
    completed: boolean;
    createdAt: string;
    completedAt?: string;
}

export interface TaskStats {
    total: number;
    completed: number;
    active: number;
    totalDuration: number;
    averageDuration: number;
}

/**
 * Format seconds to HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Parse HH:MM:SS to seconds
 */
export function parseDuration(timeStr: string): number {
    const parts = timeStr.split(':');
    if (parts.length !== 3) return 0;

    try {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);

        return hours * 3600 + minutes * 60 + seconds;
    } catch {
        return 0;
    }
}

/**
 * Calculate total duration of tasks
 */
export function calculateTotalDuration(tasks: Task[]): number {
    return tasks.reduce((sum, task) => sum + task.duration, 0);
}

/**
 * Get task statistics
 */
export function getTaskStats(tasks: Task[]): TaskStats {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const totalDuration = calculateTotalDuration(tasks);
    const averageDuration = total > 0 ? Math.round(totalDuration / total) : 0;

    return { total, completed, active, totalDuration, averageDuration };
}

/**
 * Filter tasks by category
 */
export function filterByCategory(tasks: Task[], category: string): Task[] {
    if (category === 'All') return tasks;
    return tasks.filter(t => t.category === category);
}

/**
 * Get unique categories from tasks
 */
export function getCategories(tasks: Task[]): string[] {
    const categories = new Set(tasks.map(t => t.category));
    return Array.from(categories).sort();
}

/**
 * Sort tasks by property
 */
export function sortTasks(tasks: Task[], sortBy: 'created' | 'completed' | 'duration'): Task[] {
    const sorted = [...tasks];

    switch (sortBy) {
        case 'created':
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case 'completed':
            return sorted.sort((a, b) => Number(b.completed) - Number(a.completed));
        case 'duration':
            return sorted.sort((a, b) => b.duration - a.duration);
        default:
            return sorted;
    }
}

/**
 * Generate unique ID for task
 */
export function generateTaskId(): number {
    return Date.now();
}
