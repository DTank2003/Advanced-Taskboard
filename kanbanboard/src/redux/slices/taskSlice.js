import { createSlice } from "@reduxjs/toolkit";
import {
  addTask,
  deleteTask,
  fetchTasks,
  fetchTasksByProject,
  fetchTasksForUser,
  reorderTasks,
  updateTask,
} from "../actions/taskActions";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.tasks = null;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reorderTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tasks = null;
      })
      .addCase(reorderTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(reorderTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTasksForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
