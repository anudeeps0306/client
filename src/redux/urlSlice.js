import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fetch URLs
export const fetchUrls = createAsyncThunk(
  'url/fetchUrls',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/url`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Error fetching URLs');
    }
  }
);

// Create URL
export const createUrl = createAsyncThunk(
  'url/createUrl',
  async (urlData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/url`, urlData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Error creating URL');
    }
  }
);

// Delete URL
export const deleteUrl = createAsyncThunk(
  'url/deleteUrl',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/url/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Error deleting URL');
    }
  }
);

// Fetch URL Analytics
export const fetchUrlAnalytics = createAsyncThunk(
  'url/fetchUrlAnalytics',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/url/${id}/analytics`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Error fetching analytics');
    }
  }
);

const initialState = {
  urls: [],
  analytics: null,
  loading: false,
  error: null
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload;
        state.error = null;
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUrl.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.urls.unshift(action.payload);
        state.error = null;
      })
      .addCase(createUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUrl.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = state.urls.filter(url => url._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUrlAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUrlAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(fetchUrlAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = urlSlice.actions;

export default urlSlice.reducer;