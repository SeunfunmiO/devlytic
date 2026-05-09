import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  selectedJob: null,
  filters: {
    jobType: '',
    workMode: '',
    location: '',
    skills: [],
  },
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { jobType: '', workMode: '', location: '', skills: [] };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setJobs, setSelectedJob, setFilters, clearFilters, setLoading, setError } = jobSlice.actions;
export default jobSlice.reducer;