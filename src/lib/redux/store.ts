import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authSlice} from "./slice/authSlice";

const rootReducer = combineReducers({
    [authSlice.name]: authSlice.reducer,
});

export const makeStore = () =>
    configureStore({
        reducer: rootReducer,
        middleware: gDM => gDM(),
        enhancers: gDE => gDE(),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
