import { createSlice } from "@reduxjs/toolkit";
import { addProject, deleteProject, editProject, fetchManagerProject, fetchProjects } from '../actions/projectActions';

const projectSlice = createSlice( {
    name: "projects",
    initialState: {
        projects: [],
        managerProject: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchProjects.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchProjects.fulfilled, (state, action) => {
            state.loading = false;
            state.projects = action.payload;
          })
          .addCase(fetchProjects.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(addProject.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(addProject.fulfilled, (state, action) => {
            state.loading = false;
            state.projects.push(action.payload);
          })
          .addCase(addProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(editProject.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(editProject.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.projects.findIndex(
              (project) => project._id === action.payload._id
            );
            if (index !== -1) {
              state.projects[index] = action.payload;
            }
          })
          .addCase(editProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(deleteProject.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteProject.fulfilled, (state, action) => {
            state.loading = false;
            state.projects = state.projects.filter(
              (project) => project._id !== action.payload
            );
          })
          .addCase(deleteProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }) 
          .addCase(fetchManagerProject.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchManagerProject.fulfilled, (state, action) => {
            state.loading = false;
            state.managerProject = action.payload;
          })
          .addCase(fetchManagerProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    },
});

export default projectSlice.reducer;