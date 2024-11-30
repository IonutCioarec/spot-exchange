import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTokensState } from 'types/mvxTypes';
import { createSelector } from 'reselect';

const initialState: UserTokensState = {
  userTokens: {},
  userLpTokens: {},
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
    setUserLpTokens: (state, action: PayloadAction<Record<string, { balance: string }>>) => {
      state.userLpTokens = action.payload;
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setUserTokens, setUserLpTokens, setStatus } = userTokensSlice.actions;

// Selectors
export const selectUserTokens = (state: any): Record<string, { balance: string }> => state.userTokens.userTokens;
export const selectUserLpTokens = (state: any): Record<string, { balance: string }> => state.userTokens.userLpTokens;
export const selectUserTokensStatus = (state: any) => state.userTokens.status;

// Memoized selector to get LP token IDs with balance > 0
export const selectNonZeroBalanceLpTokenIds = createSelector(
  [selectUserLpTokens],
  (userLpTokens) =>
    Object.entries(userLpTokens)
      .filter(([, tokenData]) => parseFloat(tokenData.balance) > 0)
      .map(([token_id]) => token_id)
);

export default userTokensSlice.reducer;