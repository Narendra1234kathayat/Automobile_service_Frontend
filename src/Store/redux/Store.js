import { configureStore } from "@reduxjs/toolkit";
import SidebarReducer from "../Slices/SidebarSlice.js";
import SearchReducer from "../Slices/SearchSlice.js";
import SparePartsReducer from "../Slices/SparePartsSlice.js";
import CarReducer from "../Slices/CartSlice.js";
import { persistStore,persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const rootReducer=combineReducers({
  sidebar: SidebarReducer,
  search: SearchReducer,
  spareparts:SparePartsReducer,
  cart:CarReducer
})
// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart","sidebar","spareparts"], // only persist cart (you can add others if needed)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
 reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

export const persistor = persistStore(store);
