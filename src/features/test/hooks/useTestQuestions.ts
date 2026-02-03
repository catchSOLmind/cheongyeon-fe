import { useState, useEffect } from 'react';
import { getTestQuestions } from '../api/testApi';
import type { TestQuestion } from '../types/test.types';

// hook 반환값 
interface UseTestQuestionsResult {
    questions: TestQuestion[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useTestQuestions(): UseTestQuestionsResult {
    const [questions, setQuestions] = useState<TestQuestion[] | null>(null);
    const [isloading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getTestQuestions();
            setQuestions(response.result.questions);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Failed to fetch test questions.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return {
        questions,
        loading: isloading,
        error,
        refetch: fetchQuestions,
    };
}
