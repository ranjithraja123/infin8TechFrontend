import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';


export const getExpenses = createAsyncThunk(
    'expense/getExpenses',
    async (filter, thunkAPI) => {
        try {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || null;
            const response = await axios.get(`http://localhost:3000/api/expense/getExpenses?logeduser=${userInfo?.wallid}&merchant=${filter?.merchant?.trim() || ''}&category=${filter?.category?.trim() || ''}&status=${filter?.status?.trim() || ''}&submitters=${filter?.submitters?.trim() || ''}&approval=${filter?.approval?.trim() || ''}&from=${filter?.from?.trim() || ''}&to=${filter?.to?.trim() || ''}`);
            console.log(response,"resredux")
            
            return response.data.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const expenseSlice = createSlice({
    name: 'expense',
    initialState: {
        expenses: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.expenses = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
    }
})



export default expenseSlice.reducer;
