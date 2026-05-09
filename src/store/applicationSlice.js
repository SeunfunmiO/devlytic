import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    applications: [],
    loading: false,
    error: null,
};

const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        setApplications: (state, action) => {
            state.applications = action.payload;
        },
        addApplication: (state, action) => {
            state.applications.unshift(action.payload);
        },
        updateApplicationStatus: (state, action) => {
            const index = state.applications.findIndex(
                (app) => app._id === action.payload.id
            );
            if (index !== -1) {
                state.applications[index].status = action.payload.status;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setApplications, addApplication, updateApplicationStatus, setLoading, setError } = applicationSlice.actions;
export default applicationSlice.reducer;