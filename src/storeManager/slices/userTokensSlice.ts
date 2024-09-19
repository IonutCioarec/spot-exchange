import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTokensState } from 'types/mvxTypes';
import { createSelector } from 'reselect';

const initialState: UserTokensState = {
  userTokens: {},
  status: 'loading',
};

const userTokensSlice = createSlice({
  name: 'userTokens',
  initialState,
  reducers: {
    setUserTokens: (state, action: PayloadAction<Record<string, { balance: string }>>) => {
      state.userTokens = action.payload;
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setUserTokens, setStatus } = userTokensSlice.actions;

// Selectors
export const selectUserTokens = (state: any) => state.userTokens.userTokens;
export const selectUserTokensStatus = (state: any) => state.userTokens.status;

export default userTokensSlice.reducer;