import { createSlice } from "@reduxjs/toolkit";
import { fetchActivityLogs } from "../actions/activityLogActions"

const activityLogSlice = createSlice( {
    name: 'activitySlice',
    initialState: {
        logs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload;
            })
            .addCase(fetchActivityLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default activityLogSlice.reducer;