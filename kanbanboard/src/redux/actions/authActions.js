import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, role, _id } = response.data;
      localStorage.setItem('authToken', token);
      return { token, role, userId: _id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (formData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/auth/register', formData);
        const { token, role, _id } = response.data;
        localStorage.setItem('authToken', token);
        return { token, role, userId: _id };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');
      }
    }
  );