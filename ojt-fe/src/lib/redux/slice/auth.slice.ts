import {type PayloadAction} from "@reduxjs/toolkit";
import {createAppSlice} from "../base.slice";
import {type AccountDto} from "@/app/actions/auth";

const initialState: {user?: Omit<AccountDto, "password">} = {};

export const authSlice = createAppSlice({
    name: "AUTH",
    initialState,
    reducers: create => ({
        setUser: create.reducer(
            (
                state,
                action: PayloadAction<Omit<AccountDto, "password"> | undefined>
            ) => {
                state.user = action.payload;
            }
        ),
    }),
    selectors: {
        getUser: x => x.user,
    },
});

export const {
    actions: {setUser},
    selectors: {getUser},
} = authSlice;
