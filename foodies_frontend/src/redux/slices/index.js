import { combineReducers } from "redux";
import userSlice from "./userSlice";

export default combineReducers({ 
    user: userSlice
  })