import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchActivityLogs = createAsyncThunk(
    'activityLogs/fetchActivityLogs',
    async(taskId, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem("authToken");
            const {data} = await axiosInstance.get(`/activity-logs/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("fetched activity logs:");
            return data;
        } catch(error) {
            return rejectWithValue(error.response.data);
        }
    }
);