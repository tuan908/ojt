import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {baseApi} from "./base-api.config";
import {authSlice} from "../features/auth/auth.slice";
import {loadingSlice} from "../features/loading/loading.slice";

const rootReducer = combineReducers({
    [authSlice.name]: authSlice.reducer,
    [loadingSlice.name]: loadingSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

export function makeStore() {
    const store = configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddlewares =>
            getDefaultMiddlewares().concat(baseApi.middleware),
        enhancers: getDefaultEnhancers => getDefaultEnhancers(),
    });

    return store;
}

setupListeners(makeStore().dispatch);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
