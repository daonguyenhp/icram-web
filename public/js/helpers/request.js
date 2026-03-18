import { Toast } from './alert.js';

export const request = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (result.code === 401 || result.code === 403) {
            Toast("Login session expired, redirecting...", "error");
            setTimeout(() => window.location.href = "/auth/login", 2000);
            return null;
        }

        return result;
    } catch (error) {
        Toast("Server connection error!", "error");
        return null;
    }
};