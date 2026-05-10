import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null, //developer/company
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    setInitialized: (state) => {
      state.isInitializing = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.error = null;
    },
  },
});

export const { setCredentials, setInitialized, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;