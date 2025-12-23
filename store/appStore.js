import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import localStorage from "redux-persist/es/storage";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// const { configureStore, combineReducers } = require("@reduxjs/toolkit");
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import settingReducer from "./slices/settingSlice";
import searchReducer from "./slices/searchSlice";
import favouriteReducer from "./slices/favouriteSlice";

// 2. Create a "Noop" (No Operation) storage for the server
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["authStore", "cartStore", "favouriteStore"],
};

// "authStore", "cartStore", "favouriteStore"

// Combine your reducer
const rootReducer = combineReducers({
  authStore: authReducer,
  cartStore: cartReducer,
  settingStore: settingReducer,
  searchStore: searchReducer,
  favouriteStore: favouriteReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist saves non-serializable values
    }),
});

// Create a persistor
export const persistor = persistStore(appStore);
