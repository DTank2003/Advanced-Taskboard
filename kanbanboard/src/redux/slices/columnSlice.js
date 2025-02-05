import { getTitle } from "../../constants/constants";

const initialState = {
  columns: [],
};

export const columnReducer = (state = initialState, action) => {
  switch (action.type) {
    case getTitle("FETCH_COLUMNS"):
      return { ...state, columns: action.payload };
    case getTitle("ADD_COLUMN"):
      return { ...state, columns: [...state.columns, action.payload] };
    default:
      return state;
  }
};