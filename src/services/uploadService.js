import api from './api';

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post('/upload/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};