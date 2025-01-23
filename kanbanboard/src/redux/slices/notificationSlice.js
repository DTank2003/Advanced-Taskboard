import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    markAsRead: (state, action) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload ? { ...notification, read: true } : notification
      );
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
    },
  },
});

export const { setNotifications, markAsRead, markAllAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;