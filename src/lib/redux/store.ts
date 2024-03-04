import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authSlice} from "./slice/authSlice";

const rootReducer = combineReducers({
    [authSlice.name]: authSlice.reducer,
});

export function makeStore() {
    const store = configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddlewares => getDefaultMiddlewares(),
        enhancers: getDefaultEnhancers => getDefaultEnhancers(),
    });

    return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
