import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// Combine all your slices here
const rootReducer = combineReducers({
  auth: authReducer,
  // future slices: products, cart, orders, etc.
});

export default rootReducer;
