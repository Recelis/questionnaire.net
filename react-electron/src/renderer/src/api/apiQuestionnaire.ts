import type { ICreateQuestionnaire,IQuestionnaire,IUpdateQuestionnaire } from "./types";

const DEFAULT_BASE_URL = "http://localhost:5283";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("user_token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const apiCreateQuestionnaire = async (
  body: ICreateQuestionnaire
): Promise<IQuestionnaire | undefined> => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
    const res = await fetch(`${baseUrl}/Questionnaire`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`Failed to create questionnaire. Status: ${res.status}: ${message}`);
    }

    const data = await res.json();
    return data as IQuestionnaire;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const apiGetQuestionnaires = async (
  userId: number
): Promise<IQuestionnaire[] | undefined> => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
    const res = await fetch(`${baseUrl}/Questionnaire/user/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`Failed to get questionnaires. Status: ${res.status}: ${message}`);
    }

    const data = await res.json();
    return data as IQuestionnaire[];
  } catch (err) {
    console.error(err);
    throw err;
  }
};



export const apiUpdateQuestionnaire = async (
  id: number,
  body: IUpdateQuestionnaire
): Promise<IQuestionnaire | undefined> => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
    const res = await fetch(`${baseUrl}/Questionnaire/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`Failed to update questionnaire. Status: ${res.status}: ${message}`);
    }

    const data = await res.json();
    return data as IQuestionnaire;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const apiDeleteQuestionnaire = async (
  questionnaireId: number
): Promise<boolean> => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
    const res = await fetch(`${baseUrl}/Questionnaire/${questionnaireId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return false;
      }
      const message = await res.text();
      throw new Error(`Failed to delete questionnaire. Status: ${res.status}: ${message}`);
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
