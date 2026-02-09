import { describe, it, expect } from 'vitest';
import { formatDuration, calculateTotalDuration, parseDuration, getTaskStats } from '@/utils/taskHelpers';

describe('Task Helpers', () => {
    describe('formatDuration', () => {
        it('should format seconds to HH:MM:SS', () => {
            expect(formatDuration(3661)).toBe('01:01:01');
            expect(formatDuration(120)).toBe('00:02:00');
            expect(formatDuration(59)).toBe('00:00:59');
            expect(formatDuration(0)).toBe('00:00:00');
        });

        it('should handle large durations', () => {
            expect(formatDuration(86400)).toBe('24:00:00');
            expect(formatDuration(359999)).toBe('99:59:59');
        });
    });

    describe('calculateTotalDuration', () => {
        it('should sum all task durations', () => {
            const tasks = [
                { id: 1, duration: 60, completed: true },
                { id: 2, duration: 120, completed: true },
                { id: 3, duration: 30, completed: false }
            ];
            expect(calculateTotalDuration(tasks)).toBe(210);
        });

        it('should handle empty tasks', () => {
            expect(calculateTotalDuration([])).toBe(0);
        });

        it('should only count completed tasks when filtered', () => {
            const tasks = [
                { id: 1, duration: 60, completed: true },
                { id: 2, duration: 120, completed: false }
            ];
            const completed = tasks.filter(t => t.completed);
            expect(calculateTotalDuration(completed)).toBe(60);
        });
    });

    describe('parseDuration', () => {
        it('should parse HH:MM:SS to seconds', () => {
            expect(parseDuration('01:01:01')).toBe(3661);
            expect(parseDuration('00:02:00')).toBe(120);
            expect(parseDuration('00:00:59')).toBe(59);
        });

        it('should handle invalid format', () => {
            expect(parseDuration('invalid')).toBe(0);
            expect(parseDuration('')).toBe(0);
        });
    });

    describe('getTaskStats', () => {
        it('should calculate task statistics', () => {
            const tasks = [
                { id: 1, completed: true, duration: 60, category: 'Work' },
                { id: 2, completed: true, duration: 120, category: 'Work' },
                { id: 3, completed: false, duration: 30, category: 'Personal' },
                { id: 4, completed: false, duration: 0, category: 'Personal' }
            ];
            const stats = getTaskStats(tasks);
            expect(stats.total).toBe(4);
            expect(stats.completed).toBe(2);
            expect(stats.active).toBe(2);
            expect(stats.totalDuration).toBe(210);
        });

        it('should return zeros for empty tasks', () => {
            const stats = getTaskStats([]);
            expect(stats.total).toBe(0);
            expect(stats.completed).toBe(0);
            expect(stats.active).toBe(0);
            expect(stats.totalDuration).toBe(0);
        });
    });
});
