import {type UserInfo} from "@/app/actions/auth";
import {type PayloadAction} from "@reduxjs/toolkit";
import {createAppSlice} from "../../configs/base-slice.config";

const initialState: {user?: UserInfo} = {};

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
    actions: {setUser},
    selectors: {getUser},
} = authSlice;
