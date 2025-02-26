import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { JobApplication } from '../../types';

interface ApplicationsState {
  items: JobApplication[];
  loading: boolean;
  error: string | null;
}

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (userId: string | null) => {
    const response = await axios.get(
      userId ? `http://localhost:3001/applications?userId=${userId}` : `http://localhost:3001/applications`
    );
    return response.data;
  }
);

export const submitApplication = createAsyncThunk(
  'applications/submitApplication',
  async ({ jobId, userId }: { jobId: string; userId: string }) => {
    const response = await axios.post('http://localhost:3001/applications', {
      jobId,
      userId,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    });
    return response.data;
  }
);

const initialState: ApplicationsState = {
  items: [],
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch applications';
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default applicationsSlice.reducer;