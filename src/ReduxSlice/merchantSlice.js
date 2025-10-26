import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Async thunk to fetch merchants
export const fetchMerchants = createAsyncThunk(
  'merchants/getOrganizationMerchant',
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(sessionStorage.getItem('userInfo'));

      const response = await axios.post(`http://localhost:3000/api/expense/getOganizationMerchant`, {
        "orgid": user.orgid
      });
     
      if (response.status !== 200) {
        throw new Error('Failed to fetch merchants');
      }

      return response.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const merchantSlice = createSlice({
  name: 'merchants',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerchants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchants.fulfilled, (state, action) => {
        state.data = action.payload.data || [];
        state.loading = false;
      })
      .addCase(fetchMerchants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        toast.error(action.payload);
      });
  }
});

export default merchantSlice.reducer;
