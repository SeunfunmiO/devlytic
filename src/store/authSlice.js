import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null, // "developer" | "company"
  accessToken: null,
  isAuthenticated: false,
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
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
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
      state.error = null;
    },
  },
});

export const { setCredentials, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;