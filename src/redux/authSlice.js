import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Load User
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get(`${API_URL}/api/auth/user`);
      return res.data;
    } catch (err) {
      localStorage.removeItem('token');
      return rejectWithValue(err.response?.data?.msg || 'Authentication failed');
    }
  }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const body = JSON.stringify({ email, password });
  
      try {
        const res = await axios.post(`${API_URL}/api/auth/login`, body, config);
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.msg || 'Login failed');
      }
    }
  );
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };
  
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout: (state) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = null;
      },
      clearError: (state) => {
        state.error = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(loadUser.pending, (state) => {
          state.loading = true;
        })
        .addCase(loadUser.fulfilled, (state, action) => {
          state.isAuthenticated = true;
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(loadUser.rejected, (state, action) => {
          state.token = null;
          state.isAuthenticated = false;
          state.loading = false;
          state.user = null;
          state.error = action.payload;
        })
        .addCase(login.pending, (state) => {
          state.loading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
          localStorage.setItem('token', action.payload.token);
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.loading = false;
        })
        .addCase(login.rejected, (state, action) => {
          localStorage.removeItem('token');
          state.token = null;
          state.isAuthenticated = false;
          state.loading = false;
          state.user = null;
          state.error = action.payload;
        });
    }
  });
  
  export const { logout, clearError } = authSlice.actions;
  
  export default authSlice.reducer;