import { useState } from 'react';
import { submitTestAnswers } from '../api/testApi';
import type { TestAnswer, TestResult } from '../types/test.types';

interface UseSubmitTestReturn {
  submitTest: (answers: TestAnswer[]) => Promise<TestResult | null>;
  isSubmitting: boolean;
  error: Error | null;
}

export function useSubmitTest(): UseSubmitTestReturn {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const submitTest = async (answers: TestAnswer[]): Promise<TestResult | null> => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await submitTestAnswers(answers);
            return response.result;
        } catch (err) {
            setError(err as Error);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        submitTest,
        isSubmitting,
        error,
    };
}  