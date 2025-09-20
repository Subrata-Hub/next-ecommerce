"use client";
import { appStore, persistor } from "@/store/appStore";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import Loadings from "./Loadings";

const GlobalProvider = ({ children }) => {
  return (
    <div>
      <Provider store={appStore}>
        <PersistGate loading={<Loadings />} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </div>
  );
};

export default GlobalProvider;
