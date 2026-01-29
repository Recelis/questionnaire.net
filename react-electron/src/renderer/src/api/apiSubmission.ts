import type { ICreateSubmission, ISubmission } from './types';
import { getAuthHeaders } from './api';

const DEFAULT_BASE_URL = 'http://localhost:5283';

// export const apiGetSubmissions = async (
//     templateId: number
// ): Promise<IQuestion[] | undefined> => {
//     try {
//         const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
//         const res = await fetch(`${baseUrl}/Question/template/${templateId}`, {
//             method: 'GET',
//             headers: getAuthHeaders(),
//         });

//         if (!res.ok) {
//             const message = await res.text();
//             throw new Error(`Failed to get questions. Status: ${res.status}: ${message}`);
//         }

//         const data = await res.json();
//         return data as IQuestion[];
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// };

// export const apiGetSubmission = async (
//     templateId: number
// ): Promise<IQuestion[] | undefined> => {
//     try {
//         const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
//         const res = await fetch(`${baseUrl}/Question/template/${templateId}`, {
//             method: 'GET',
//             headers: getAuthHeaders(),
//         });

//         if (!res.ok) {
//             const message = await res.text();
//             throw new Error(`Failed to get questions. Status: ${res.status}: ${message}`);
//         }

//         const data = await res.json();
//         return data as IQuestion[];
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// };

export const apiCreateSubmission = async (
    body: ICreateSubmission
): Promise<ISubmission | undefined> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
        const res = await fetch(`${baseUrl}/submission`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`Failed to create question. Status: ${res.status}: ${message}`);
        }

        const data = await res.json();
        return data as ISubmission;
    } catch (err) {
        console.error(err);
        throw err;
    }
};