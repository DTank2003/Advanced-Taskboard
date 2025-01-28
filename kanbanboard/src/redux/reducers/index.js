import { combineReducers } from "@reduxjs/toolkit";
import notificationReducer from "../slices/notificationSlice";
import activityLogReducer from "../slices/activityLogSlice"
import commentReducer from "../slices/commentSlice"
import projectReducer from '../slices/projectSlice';
import userReducer from '../slices/userSlice';
import taskReducer from '../slices/taskSlice';
import authReducer from '../slices/authSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    tasks: taskReducer,
    users: userReducer,
    projects: projectReducer,
    comments: commentReducer, 
    notifications: notificationReducer,
    activityLogs: activityLogReducer, 
});

export default rootReducer;