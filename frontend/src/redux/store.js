import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/userSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});