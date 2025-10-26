import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';


export const registerUser = createAsyncThunk('auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/register`, userData);
      console.log(response, "res")
      return response.data;
    } catch (error) {
      console.log(error, 'mess')
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
)


export const login = createAsyncThunk('auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/login`, userData);
      const wallid = response?.data?.user?._id;


      // Send OTP using wallid
      await axios.post(`http://localhost:3000/api/auth/generateAndSendToken`, { wallid });

      toast.success(response?.data?.message);

      let userInfo = { wallid: response?.data?.user?._id, username: response?.data?.user?.username, email:response?.data?.user?.email, usertype:response?.data?.user?.usertype, orgid:response?.data?.user?.orgid};

      sessionStorage.setItem(`userInfo`, JSON.stringify(userInfo));

      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Login failed";
      toast.error(errorMsg);
      // console.log("ERR", errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;