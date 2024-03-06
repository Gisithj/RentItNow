// import React from 'react'
// import { Provider } from 'react-redux';
// import {  store } from '../../lib/store';
// import { PersistGate } from 'redux-persist/integration/react';
// export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
//     return (
//     <Provider store={store}>
//        {/* <PersistGate loading={null} persistor={persistor}> */}
//        {children}
//     {/* </PersistGate> */}
    
//     </Provider>
//   )};

"use client";
import type { AppStore } from "@/lib/store";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

interface Props {
  readonly children: ReactNode;
}

export const ReduxProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};
