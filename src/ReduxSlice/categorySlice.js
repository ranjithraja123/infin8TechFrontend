import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { toast } from "react-toastify";

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/expense/getCategories`);
            console.log(response, "catRedux")

            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    });

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
    }

})

export default categorySlice.reducer;

