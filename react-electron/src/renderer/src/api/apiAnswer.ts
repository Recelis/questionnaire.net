import type { IAnswer, ICreateAnswer, ICreateQuestion, IQuestion, IUpdateAnswer, IUpdateQuestion } from './types';
import { getAuthHeaders } from './api';

const DEFAULT_BASE_URL = 'http://localhost:5283';

export const apiGetAnswer = async (
    answerId: number
): Promise<IAnswer | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Answer/${answerId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to get answer. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as IAnswer;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiGetAnswerBySubmissionQuestion = async (
    submissionId: number,
    questionId: number
): Promise<IAnswer | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/answer/submission/${submissionId}/question/${questionId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (res.status === 404) {
            // No existing answer found, return undefined
            return undefined;
        }

        else if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to get answer. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as IAnswer;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiCreateAnswer = async (
    body: ICreateAnswer
): Promise<IAnswer | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Answer`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to create answer. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as IAnswer;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiUpdateAnswer = async (
    id: number,
    body: IUpdateAnswer
): Promise<IAnswer | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Answer/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to update answer. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as IAnswer;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
