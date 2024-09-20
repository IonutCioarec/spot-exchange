import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pair, PairsState } from 'types/backendTypes';
import { createSelector } from 'reselect';
import { selectUserTokens } from './userTokensSlice';

const initialState: PairsState = {
  pairs: [],
  status: 'loading',
  viewMode: 'all',
};

const pairsSlice = createSlice({
  name: 'pairs',
  initialState,
  reducers: {
    setPairs: (state, action: PayloadAction<Pair[]>) => {
      state.pairs = action.payload;
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'all' | 'my'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setPairs, setStatus, setViewMode } = pairsSlice.actions;

// Selectors
export const selectPairs = (state: any) => state.pairs.pairs;
export const selectPairsStatus = (state: any) => state.pairs.status;
export const selectViewMode = (state: any) => state.pairs.viewMode;

// Filtered pairs based on viewMode
export const selectFilteredPairs = createSelector(
  [selectPairs, selectViewMode, selectUserTokens],
  (pairs, viewMode, userTokens) => {
    if (viewMode === 'my') {
      // Filter pairs where user has LP tokens
      return pairs.filter((pair: Pair) => {
        const userBalance = userTokens[pair.lp_token_id]?.balance ?? 0;
        return userBalance > 0;
      });
    }
    // If viewMode is 'all', return all pairs
    return pairs;
  }
);

export default pairsSlice.reducer;