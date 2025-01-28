import { createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async(taskId, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
              return rejectWithValue("User is not authenticated.");
            }
            const {data} = await axiosInstance.get(`/comments/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch(error) {
            return rejectWithValue(error.reponse.data);
        }
    }
);

export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ taskId, text }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axiosInstance.post(
          '/comments',
          { taskId, text },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );