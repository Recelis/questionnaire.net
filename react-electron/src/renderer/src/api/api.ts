export const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('user_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};
