import {type PayloadAction} from '@reduxjs/toolkit';
import type {IUserInfo} from '~/features/auth/types';
import {createAppSlice} from '../slice';

const initialState: {user?: IUserInfo} = {};

export const authSlice = createAppSlice({
  name: 'AUTH',
  initialState,
  reducers: create => {
    return {
      setUser: create.reducer(
        (state, action: PayloadAction<IUserInfo | undefined>) => {
          state.user = action.payload;
        },
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
