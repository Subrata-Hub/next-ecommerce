"use client";
import { appStore, persistor } from "@/store/appStore";
import { logout } from "@/store/slices/authSlice";
import React, { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Loadings from "./Loadings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

/**
 * This component runs AFTER Redux-Persist rehydrates.
 * We validate token only when store is ready.
 */
const AuthInitializer = () => {
  const auth = useSelector((state) => state.authStore.auth); // token & data

  useEffect(() => {
    if (!auth) return; // do not validate if user is not logged in

    // Validate session
    const validateUser = async () => {
      try {
        await axios.get("/api/auth/validate");
      } catch (error) {
        // appStore.dispatch(logout());
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          appStore.dispatch(logout());
        }
      }
    };
    validateUser();

    // Setup global axios interceptor
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          appStore.dispatch(logout());
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [auth]); // run only when token is available

  return null;
};

const GlobalProvider = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={appStore}>
        <PersistGate loading={<Loadings />} persistor={persistor}>
          {/* 🔥 Run token validation AFTER Redux-Persist hydration */}
          <AuthInitializer />
          {children}
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
};

export default GlobalProvider;
