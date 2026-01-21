import type { ICreateQuestion, IQuestion, IUpdateQuestion } from './types';
import { getAuthHeaders } from './api';

const DEFAULT_BASE_URL = 'http://localhost:5283';

export const apiGetQuestions = async (
    templateId: number
): Promise<IQuestion[] | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Question/template/${templateId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to get questions. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as IQuestion[];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiCreateQuestion = async (
    body: ICreateQuestion
): Promise<IQuestion | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Question`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to create question. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as IQuestion;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiUpdateQuestion = async (
    id: number,
    body: IUpdateQuestion
): Promise<IQuestion | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Question/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to update question. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as IQuestion;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiDeleteQuestion = async (id: number): Promise<void> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Question/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to delete question. Status: ${res.status}: ${message}`);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};
