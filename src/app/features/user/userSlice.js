import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest, patchRequest, removeToken, setToken } from '../../../Services/api';
import { message } from 'antd';
import { mergeCarts } from '../cart/cartSlice';

// Helper to log state changes (simplified as hasBeenPromptedForInfo is removed)
const logState = (state, actionType, msg) => {
  console.log(`[userSlice] ${actionType}: ${msg}`);
  console.log(`[userSlice] Current state after ${actionType}:`, {
    data: state.data ? { id: state.data.id, email: state.data.email, full_name: state.data.full_name, phone_number: state.data.phone_number } : null, // Clone and select fields to avoid large logs
    isLoading: state.isLoading,
    error: state.error,
  });
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[userSlice] fetchUser: Attempting to fetch user profile...');
      const userData = await getRequest('/user-profile/');
      console.log('[userSlice] fetchUser: User profile fetched successfully:', userData);
      return userData;
    } catch (err) {
      console.error('[userSlice] fetchUser: Error fetching user profile:', err.response || err.message);
      if (err.response) {
        if (err.response.status === 401) {
          removeToken();
          localStorage.removeItem('refreshToken');
          console.log('[userSlice] fetchUser: 401 Unauthorized. Session expired. Token/refreshToken removed.');
          return rejectWithValue('Session expired. Please log in again.');
        }
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
      console.log(`[userSlice] login: Attempting ${isOtpLogin ? 'OTP' : 'password'} login for identifier: ${identifier}`);

      const response = await postRequest(isOtpLogin ? '/verify-otp/' : '/login/',
        isOtpLogin
          ? { identifier, otp }
          : { identifier, password }
      );

      setToken(response.token);
      localStorage.setItem('refreshToken', response.refresh_token);
      message.success('Welcome back!');
      console.log('[userSlice] login: Login successful. Tokens set. Merging carts...');
      dispatch(mergeCarts()); // Dispatch to merge anonymous cart with user's cart
      return response.user;
    } catch (err) {
      console.error('[userSlice] login: Login failed:', err.response ? err.response.data : err.message);
      message.error('Login failed. Please check your details.');
      return rejectWithValue(err.response ? err.response.data : 'Login failed.');
    }
  }
);

export const sendOtp = createAsyncThunk(
  'user/sendOtp',
  async (identifier, { rejectWithValue }) => {
    try {
      console.log('[userSlice] sendOtp: Attempting to send OTP to:', identifier);
      await postRequest('/send-otp/', { identifier });
      message.success('OTP sent successfully!');
      console.log('[userSlice] sendOtp: OTP sent.');
      return;
    } catch (err) {
      console.error('[userSlice] sendOtp: Failed to send OTP:', err.response ? err.response.data : err.message);
      message.error('Failed to send OTP.');
      return rejectWithValue(err.response ? err.response.data : 'Failed to send OTP.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      console.log('[userSlice] resetPassword: Attempting to send reset link to:', email);
      await postRequest('/reset-password/', { email });
      message.success('Password reset link sent.');
      console.log('[userSlice] resetPassword: Reset link sent.');
      return;
    } catch (err) {
      console.error('[userSlice] resetPassword: Failed to send reset link:', err.response ? err.response.data : err.message);
      message.error('Failed to send reset link.');
      return rejectWithValue(err.response ? err.response.data : 'Failed to send reset link.');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ full_name, phone_number }, { rejectWithValue }) => {
    try {
      console.log('[userSlice] updateProfile: Attempting to update user profile with:', { full_name, phone_number });
      const response = await patchRequest('/user-profile/', { full_name, phone_number });
      message.success('Profile updated successfully!');
      console.log('[userSlice] updateProfile: Profile updated successfully. New user data:', response.user);
      return response.user;
    } catch (err) {
      console.error('[userSlice] updateProfile: Failed to update profile:', err.response ? err.response.data : err.message);
      message.error('Failed to update profile.');
      return rejectWithValue(err.response ? err.response.data : 'Failed to update profile.');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
    // hasBeenPromptedForInfo removed from here
  },
  reducers: {
    // Moved hasBeenPromptedForInfo state to TopNav, so setHasBeenPromptedForInfo is also removed.
    logout: (state) => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
      removeToken();
      localStorage.removeItem('refreshToken');
      // No longer managing hasBeenPromptedForInfo in Redux, so no localStorage.removeItem('hasBeenPromptedForInfo'); here.
      message.info('You have been logged out.');
      logState(state, 'logout', 'User logged out.');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        logState(state, 'fetchUser.pending', 'Fetching user data...');
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        // No longer managing hasBeenPromptedForInfo here
        logState(state, 'fetchUser.fulfilled', 'User profile fetched successfully.');
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.data = null;
        logState(state, 'fetchUser.rejected', 'Failed to fetch user data. User data cleared.');
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        logState(state, 'login.pending', 'Attempting user login...');
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        // No longer managing hasBeenPromptedForInfo here
        logState(state, 'login.fulfilled', 'Login successful.');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        logState(state, 'login.rejected', 'Login failed.');
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        logState(state, 'updateProfile.pending', 'Attempting to update user profile...');
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        // No longer managing hasBeenPromptedForInfo here
        logState(state, 'updateProfile.fulfilled', 'Profile updated successfully.');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        logState(state, 'updateProfile.rejected', 'Failed to update profile.');
      });
  },
});

export const { logout } = userSlice.actions; // setHasBeenPromptedForInfo is removed
export default userSlice.reducer;