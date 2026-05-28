import api from './api';

export const initiatePayment = async (jobId, email) => {
    const response = await api.post('/payments/initiate', { jobId, email });
    return response.data;
};

export const verifyPayment = async (reference) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
};