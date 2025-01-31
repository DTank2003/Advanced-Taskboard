import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("User is not authenticated.");
      }
      const { data } = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchManagersWithNoProjects = createAsyncThunk(
  "users/fetchManagers",
  async(_, {rejectWithValue}) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("User is not authenticated.");
      }
      const { data } = await axiosInstance.get(`/projects/managers/no-projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const fetchUsername = createAsyncThunk(
  "users/fetchUsername",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("User is not authenticated.");
      }
      const { data } = await axiosInstance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.username;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
