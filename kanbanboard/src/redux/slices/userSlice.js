import { createSlice } from "@reduxjs/toolkit";
import {fetchManagersWithNoProjects, fetchUsername, fetchUsers, updateUserList} from "../actions/userActions";

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        managersWithNoProject: null,
        currentUsername: "",
        currentUserId: "",
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsername.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsername.fulfilled, (state, action) => {
                state.currentUsername = action.payload.username;
                state.currentUserId = action.payload._id;
                state.loading = false;
            })
            .addCase(fetchUsername.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(fetchManagersWithNoProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManagersWithNoProjects.fulfilled, (state, action) => {
                console.log(action.payload);
                state.managersWithNoProject = action.payload;
                state.loading = false;
            })
            .addCase(fetchManagersWithNoProjects.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(updateUserList, (state, action) => {
                const { userId, latestMessage } = action.payload;
                const existingUser = state.users.find((user) => user._id === userId);
        
                if (existingUser) {
                  // Move user to top and update the latest message
                  state.users = [
                    { ...existingUser, latestMessage, hasNewMessage: true },
                    ...state.users.filter((user) => user._id !== userId),
                  ];
                }
              }); 
    },
})

export default userSlice.reducer;