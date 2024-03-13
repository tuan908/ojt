import {type UserDto} from "@/app/actions/login";
import {type PayloadAction} from "@reduxjs/toolkit";
import {createAppSlice} from "../baseSlice";

const initialState: {user?: Omit<UserDto, "password">} = {};

export const authSlice = createAppSlice({
    name: "AUTH",
    initialState,
    reducers: create => ({
        setUser: create.reducer(
            (
                state,
                action: PayloadAction<Omit<UserDto, "password"> | undefined>
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
