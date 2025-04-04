// src/app/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest, removeToken, setToken } from '../../../Services/api';
import { message } from 'antd';
import { mergeCarts } from '../cart/cartSlice';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getRequest('/user-profile/');
      return userData;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else if (err.request) {
        return rejectWithValue('Network error. Please try again.');
      } else {
        return rejectWithValue('An unexpected error occurred.');
      }
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ identifier, password, otp = null }, { dispatch, rejectWithValue }) => {
    try {
      const isOtpLogin = otp !== null;

      const response = await postRequest(isOtpLogin ? '/verify-otp/' : '/login/', 
        isOtpLogin
          ? { identifier, otp } 
          : { identifier, password } 
      );

      setToken(response.token);
      localStorage.setItem('refreshToken', response.refresh_token);
      message.success('Welcome back!');
      dispatch(mergeCarts());
      return response.user;
    } catch (err) {
      message.error('Login failed. Please check your details.');
      return rejectWithValue('Login failed.');
    }
  }
);

export const sendOtp = createAsyncThunk(
  'user/sendOtp',
  async (identifier, { rejectWithValue }) => {
    try {
      await postRequest('/send-otp/', { identifier });
      message.success('OTP sent successfully!');
      return;
    } catch (err) {
      message.error('Failed to send OTP.');
      return rejectWithValue('Failed to send OTP.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      await postRequest('/reset-password/', { email });
      message.success('Password reset link sent.');
      return;
    } catch (err) {
      message.error('Failed to send reset link.');
      return rejectWithValue('Failed to send reset link.');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      removeToken();
      localStorage.removeItem('refreshToken');
      state.data = null;
      message.info('You have logged out.');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.data = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;