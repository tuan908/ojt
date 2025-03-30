import type { UserInfo } from "@/features/auth/types";
import { type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../slice";

const initialState: { user?: UserInfo } = {};

export const authSlice = createAppSlice({
    name: "AUTH",
    initialState,
    reducers: create => {
        return {
            setUser: create.reducer(
                (state, action: PayloadAction<UserInfo | undefined>) => {
                    state.user = action.payload;
                }
            ),
        };
    },
    selectors: {
        getUser: x => x.user,
    },
});

export const {
    actions: { setUser },
    selectors: { getUser },
} = authSlice;
