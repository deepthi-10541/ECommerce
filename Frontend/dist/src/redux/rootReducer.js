import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import categoriesReducer from "./categoriesSlice";

// Combine all your slices here
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer, 
  categories: categoriesReducer,
  // future slices: products, cart, orders, etc.
});

export default rootReducer;


