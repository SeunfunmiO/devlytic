import api from './api';

export const applyToJob = async (jobId, data) => {
    const response = await api.post(`/applications/${jobId}`, data);
    return response.data;
};

export const getDeveloperApplications = async () => {
    const response = await api.get('/applications/developer/mine');
    return response.data;
};

export const getJobApplicants = async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
};

export const updateApplicationStatus = async (id, status) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
};

export const archiveApplication = async (id) => {
    const response = await api.put(`/applications/${id}/archive`);
    return response.data;
};