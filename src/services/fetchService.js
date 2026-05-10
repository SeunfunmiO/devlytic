import api from './api';

export const fetchDeveloper = async () => {
    const response = await api.get('/fetch/developer');
    return response.data;
};

export const fetchCompany = async () => {
    const response = await api.get('/fetch/company');
    return response.data;
};