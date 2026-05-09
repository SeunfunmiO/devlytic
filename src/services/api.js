import axios from 'axios';
import { store } from '../store/store';
import { logout, setCredentials } from '../store/authSlice';
import { refreshTokenService } from './authService';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto refresh token on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const data = await refreshTokenService(refreshToken);
                store.dispatch(setCredentials({
                    user: store.getState().auth.user,
                    role: store.getState().auth.role,
                    accessToken: data.accessToken,
                }));
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch {
                store.dispatch(logout());
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;