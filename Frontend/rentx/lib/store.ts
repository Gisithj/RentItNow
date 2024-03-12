// "use client";
// import { combineReducers, configureStore  } from '@reduxjs/toolkit';
// import authSlice, { login } from './features/authSlice';
// import storage from 'redux-persist/lib/storage';
// import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore, } from 'redux-persist';
// import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';


// // const persistConfig = {
// //   key: 'root',
// //   storage, 
// //   whitelist: ["authSlice"], 
// // };

// const rootReducer = combineReducers({
//   auth: authSlice,
//   // Add other reducers here
// });

// // const persistedReducer = persistReducer(persistConfig, rootReducer);
// // const middleware = ['createStateSyncMiddleware']
// export const store = configureStore({
//   reducer: rootReducer,
//   // middleware: (getDefaultMiddleware) =>
//   // getDefaultMiddleware().prepend(
//   //   createStateSyncMiddleware({
//   //     predicate: (action) => {
//   //       const blacklist = [PERSIST, PURGE, REHYDRATE, REGISTER, FLUSH, PAUSE];
//   //       if (typeof action !== "function") {
//   //         if (Array.isArray(blacklist)) {
//   //           return blacklist.indexOf(action.type) < 0;
//   //         }
//   //       }
//   //       return false;
//   //     },
//   //   })
//   // ) as any,
//   })
//   // initMessageListener(store);
// // export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;
//  export type AppDispatch = typeof store.dispatch;

import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import {authSlice} from "./features/authSlice";
import {navbarSlice} from "./features/navbarSlice";

const rootReducer = combineSlices(
    authSlice,
    navbarSlice
);
export type RootState = ReturnType<typeof rootReducer>;

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat();
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
