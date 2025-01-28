import { createSlice } from "@reduxjs/toolkit";
import { addTask, deleteTask, fetchTasks, fetchTasksForUser, reorderTasks, updateTask } from "../actions/taskActions";

const taskSlice = createSlice({
    name: 'tasks',
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
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      }) 
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload
        );
      }) 
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reorderTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderTasks.fulfilled, (state, action) => {
        state.loading = false;
        const { tasks, status } = action.payload;
        const column = state.tasks.find((col) => col.status === status);
        if (column) {
          column.items = tasks;
        }
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