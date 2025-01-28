import { createSlice } from "@reduxjs/toolkit";
import { addComment, fetchComments } from "../actions/commentActions";

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        error: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder 
            .addCase(fetchComments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addComment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = [action.payload, ...state.comments];
            })
            .addCase(addComment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default commentSlice.reducer;