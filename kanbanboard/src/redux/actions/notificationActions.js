import axiosInstance from "../../utils/axiosInstance";
import { setNotifications, markAsRead } from "../slices/notificationSlice";

export const fetchNotifications = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axiosInstance.get(`/notifications`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    dispatch(setNotifications(response.data));
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
  }
};

export const markNotificationAsRead = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("authToken");
    await axiosInstance.patch(`/notifications/markAsRead/${id}`,{},
        { headers: {
            Authorization: `Bearer ${token}`,
          },}
    );
    dispatch(markAsRead({ id, read: true }));
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
  }
};

export const markAllAsRead = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("authToken");
    await axiosInstance.patch(`/notifications/markAllAsRead`, {},
      { headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(markAsRead({ all: true }));
  } catch (error) {
    console.error("Error marking all notifications as read:", error.message);
  }
};