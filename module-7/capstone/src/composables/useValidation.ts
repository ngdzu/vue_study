/**
 * Composable for form validation
 */
export function useValidation() {
    const validateRequired = (value: string): boolean => {
        return !!value && value.trim().length > 0;
    };

    const validateMinLength = (value: string, minLength: number): boolean => {
        return value.length >= minLength;
    };

    const validateMaxLength = (value: string, maxLength: number): boolean => {
        return value.length <= maxLength;
    };

    const validateTaskForm = (data: {
        title: string;
        category: string;
        estimatedDuration: number;
    }): { valid: boolean; errors: Record<string, string> } => {
        const errors: Record<string, string> = {};

        if (!validateRequired(data.title)) {
            errors.title = 'Task title is required';
        }

        if (!validateMaxLength(data.title, 100)) {
            errors.title = 'Title must be 100 characters or less';
        }

        if (!validateRequired(data.category)) {
            errors.category = 'Category is required';
        }

        if (data.estimatedDuration < 0) {
            errors.estimatedDuration = 'Duration must be positive';
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    };

    return {
        validateRequired,
        validateMinLength,
        validateMaxLength,
        validateTaskForm
    };
}
