import { createSlice } from "@reduxjs/toolkit";
import {fetchUsername, fetchUsers} from "../actions/userActions";

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        currentUsername: "",
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
                state.currentUsername = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsername.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
})

export default userSlice.reducer;