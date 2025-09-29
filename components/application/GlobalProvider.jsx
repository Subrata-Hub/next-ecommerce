"use client";
import { appStore, persistor } from "@/store/appStore";
import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import Loadings from "./Loadings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const GlobalProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={appStore}>
        <PersistGate loading={<Loadings />} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
};

export default GlobalProvider;
