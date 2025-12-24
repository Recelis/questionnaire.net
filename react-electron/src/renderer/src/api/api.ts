import type { IUser } from "../context/types";

const DEFAULT_BASE_URL = "http://localhost:5283";

export const apiUserLogin = async (body: {
  email: string;
  password: string;
}): Promise<string | undefined> => {
  try {
    const res = await fetch(`${DEFAULT_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 404) {
        throw new Error("Invalid email or password");
      }
      throw new Error(`Failed to sign in. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const apiUserSignup = async (body: {
  email: string;
  name: string;
  password: string;
}): Promise<IUser | undefined> => {
  try {
    const res = await fetch(`${DEFAULT_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 409) {
        const errorData = await res.json().catch(() => ({ message: "User already exists" }));
        throw new Error(errorData.message || "User with this email already exists");
      }
      throw new Error(`Failed to create account. Status: ${res.status}`);
    }

    const data = await res.json();
    return data as IUser;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const apiGetUser = async (id: string): Promise<IUser | undefined> => {
  try {
    if (!/^\d+$/.test(id)) {
      throw new Error("Invalid user ID — must be a numeric string");
    }

    const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;
    const token = localStorage.getItem("user_token");

    const url = new URL(`/user/${encodeURIComponent(id)}`, baseUrl).toString();

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, { method: "GET", headers });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`API Error (${res.status}): ${message}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Expected JSON response");
    }

    return (await res.json()) as IUser;
  } catch (err) {
    console.error(err);
  }
};
