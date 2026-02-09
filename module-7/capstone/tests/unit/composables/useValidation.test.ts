import { describe, it, expect } from 'vitest';
import { useValidation } from '@/composables/useValidation';

describe('useValidation', () => {
    it('should validate required field', () => {
        const { validateRequired } = useValidation();
        expect(validateRequired('text')).toBe(true);
        expect(validateRequired('')).toBe(false);
        expect(validateRequired(null as any)).toBe(false);
    });

    it('should validate minimum length', () => {
        const { validateMinLength } = useValidation();
        expect(validateMinLength('hello', 3)).toBe(true);
        expect(validateMinLength('hi', 3)).toBe(false);
        expect(validateMinLength('', 0)).toBe(true);
    });

    it('should validate maximum length', () => {
        const { validateMaxLength } = useValidation();
        expect(validateMaxLength('hello', 10)).toBe(true);
        expect(validateMaxLength('hello world', 5)).toBe(false);
    });

    it('should validate task form', () => {
        const { validateTaskForm } = useValidation();

        const valid = { title: 'My Task', category: 'Work', estimatedDuration: 3600 };
        expect(validateTaskForm(valid)).toEqual({ valid: true, errors: {} });

        const invalid = { title: '', category: '', estimatedDuration: 0 };
        const result = validateTaskForm(invalid);
        expect(result.valid).toBe(false);
        expect(result.errors.title).toBeDefined();
        expect(result.errors.category).toBeDefined();
    });
});
