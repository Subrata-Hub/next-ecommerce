import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import localStorage from "redux-persist/es/storage";

const { configureStore, combineReducers } = require("@reduxjs/toolkit");
import authReducer from "./slices/authSlice";

const persistConfig = {
  key: "root",
  storage: localStorage,
};

// Combine your reducer
const rootReducer = combineReducers({
  authStore: authReducer,
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
