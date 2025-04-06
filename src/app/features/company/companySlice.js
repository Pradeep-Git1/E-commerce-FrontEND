
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest } from '../../../Services/api';
import { message } from 'antd';

export const fetchCompanyInfo = createAsyncThunk(
  'company/fetchCompanyInfo',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getRequest('/company-info/');
      return data;
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

export const updateCompanyInfo = createAsyncThunk(
  'company/updateCompanyInfo',
  async (payload, { rejectWithValue }) => {
    try {
      const updatedData = await postRequest('/company-info/update/', payload);
      message.success('Company info updated successfully!');
      return updatedData;
    } catch (err) {
      message.error('Failed to update company info.');
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

const companySlice = createSlice({
  name: 'company',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCompanyState: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCompanyInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCompanyInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(updateCompanyInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompanyState } = companySlice.actions;
export default companySlice.reducer;
