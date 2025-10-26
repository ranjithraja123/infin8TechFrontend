import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';

export const fetchOrganizations = createAsyncThunk(
  'organization/getOrganization',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/organization/getOrganization`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to fetch organizations');
    }
  }
);

const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    organizations: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.organizations = action.payload.organizations;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);  // Optional: shows toast message
      });
  }
});

export default organizationSlice.reducer;
