import type { ICreateTemplate, IQuestionnaire, ITemplate, IUpdateTemplate } from './types';
import { getAuthHeaders } from './api';

const DEFAULT_BASE_URL = 'http://localhost:5283';

export const apiGetTemplates = async (
    questionnaireId: number
): Promise<ITemplate[] | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Template/questionnaire/${questionnaireId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to get templates. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as ITemplate[];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiGetTemplate = async (templateId: number): Promise<ITemplate | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Template/${templateId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(
                `Failed to get template for id ${templateId}. Status: ${res.status}: ${message}`
            );
        }

        const data = await res.json();
        return data as ITemplate;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiCreateTemplate = async (
    body: ICreateTemplate
): Promise<ICreateTemplate | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Template`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to create template. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as ITemplate;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const apiUpdateTemplate = async (
    id: number,
    body: IUpdateTemplate
): Promise<IQuestionnaire | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/Template/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to update template. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as IQuestionnaire;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
