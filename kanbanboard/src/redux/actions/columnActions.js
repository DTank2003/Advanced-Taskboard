import { getTitle } from '../../constants/constants';
import axiosInstance from '../../utils/axiosInstance';

export const fetchColumnsByProject = (projectId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(`/columns/${projectId}`);
    dispatch({ type: getTitle("FETCH_COLUMNS"), payload: data });
  } catch (error) {
    console.error('Failed to fetch columns:', error);
  }
};

export const addColumn = (columnData) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post('/columns/create', columnData);
    dispatch({ type: getTitle("ADD_COLUMN"), payload: data });
  } catch (error) {
    console.error('Failed to add column:', error);
  }
};