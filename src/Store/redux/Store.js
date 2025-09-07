import { configureStore } from "@reduxjs/toolkit";
import SidebarReducer from "../Slices/SidebarSlice.js";
import SearchReducer from "../Slices/SearchSlice.js";
import SparePartsReducer from "../Slices/SparePartsSlice.js";
const store = configureStore({
  reducer: {
    sidebar: SidebarReducer,
    search: SearchReducer,
    spareparts:SparePartsReducer,
  },
});

export default store;
