import api from './api';

export const registerDeveloper = async (data) => {
    const response = await api.post('/auth/register/developer', data);
    return response.data;
};

export const registerCompany = async (data) => {
    const response = await api.post('/auth/register/company', data);
    return response.data;
};

export const loginUser = async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const refreshTokenService = async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
};

export const logoutUser = async (refreshToken) => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
};