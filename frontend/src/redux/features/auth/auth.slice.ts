import { createAppSlice } from "@/redux/slice";
import { UserInfo } from "@/types/auth";
import { type PayloadAction } from "@reduxjs/toolkit";

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
