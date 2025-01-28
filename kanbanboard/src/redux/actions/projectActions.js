import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axiosInstance.get('/projects', {
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

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.post("/projects", projectData, {
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

export const editProject = createAsyncThunk(
    'projects/editProject',
    async ({ projectId, projectData }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axiosInstance.put(`/projects/${projectId}`, projectData, {
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

  export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (projectId, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        await axiosInstance.delete(`/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return projectId;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const fetchTasksByProject = createAsyncThunk(
  'projects/fetchTaskByProject',
  async(projectId, {rejectWithValue}) => {
    try {
      const token = localStorage.getItem('authToken');
      const {data} = await axiosInstance.get(`tasks/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch(error) {
      return rejectWithValue(error.response.data);
    }
  }
)

  export const fetchManagerProject = createAsyncThunk(
    'projects/fetchManagerProject',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axiosInstance.get('/projects/manager', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return data[0]; // Assuming the manager has only one project
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const fetchProjectAnalytics = createAsyncThunk(
    'projects/fetchProjectAnalytics',
    async (projectId, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axiosInstance.get(`/projects/analytics/${projectId}`, {
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