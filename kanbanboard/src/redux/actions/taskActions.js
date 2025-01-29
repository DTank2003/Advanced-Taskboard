import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/tasks/manager-project-tasks", {
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

export const fetchTasksForUser = createAsyncThunk(
  "tasks/fetchTasksForUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.get("/tasks/user-tasks", {
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

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.post("/tasks", taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/editTask",
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axiosInstance.put(`/tasks/${taskId}`, taskData, {
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

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const {data} = await axiosInstance.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {data, taskId};
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const setTasks = createAction("tasks/setTasks");

export const reorderTasks = createAsyncThunk(
  "tasks/reorderTasks",
  async ({ updatedTask, tasks, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.put(
        "/tasks/reorder",
        { updatedTask, tasks, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const taskks = tasks;
      //await dispatchEvent(fetchTasksForUser());
      return { updatedTask, taskks, status };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
