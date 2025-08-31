import { configureStore } from "@reduxjs/toolkit";
import SidebarReducer from "../Slices/SidebarSlice.js";

const store = configureStore({
  reducer: {
    sidebar: SidebarReducer,
  },
});

export default store;
