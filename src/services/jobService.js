import api from './api';

export const getAllJobs = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/jobs?${params}`);
    return response.data;
};

export const getJobById = async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
};

export const createJob = async (data) => {
    const response = await api.post('/jobs', data);
    return response.data;
};

export const updateJob = async (id, data) => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
};

export const getCompanyJobs = async () => {
    const response = await api.get('/jobs/company/mine');
    return response.data;
};

export const toggleSaveJob = async (id) => {
    const response = await api.put(`/jobs/${id}/save`);
    return response.data;
};

export const getSavedJobs = async () => {
    const response = await api.get('/jobs/saved');
    return response.data;
};