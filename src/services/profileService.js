import api from './api';

export const updateDeveloperProfile = async (data) => {
    const response = await api.put('/profile/developer', data);
    return response.data;
};

export const updateCompanyProfile = async (data) => {
    const response = await api.put('/profile/company', data);
    return response.data;
};