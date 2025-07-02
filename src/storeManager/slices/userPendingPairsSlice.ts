import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PendingPairsState, PendingPair } from 'types/backendTypes';
import { createSelector } from 'reselect';

const initialState: PendingPairsState = {
  pendingPairs: [],
  status: 'loading'
};

const userPendingPairsSlice = createSlice({
  name: 'pendingPairs',
  initialState,
  reducers: {
    setPendingPairs: (state, action: PayloadAction<PendingPairsState>) => {
      const { pendingPairs } = action.payload;
      state.pendingPairs = pendingPairs;
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setPendingPairs, setStatus } = userPendingPairsSlice.actions;

// Selectors
export const selectPendingPairs = (state: any) => state.userPendingPairs.pendingPairs;
export const selectPendingPairsStatus = (state: any) => state.userPendingPairs.status;

// Memoized selector to transform lpTokens into an object keyed by token_id
export const selectPendingPairsById = createSelector(
  [selectPendingPairs],
  (pendingPairs: PendingPair[]) => {
    return pendingPairs.reduce((acc: Record<string, PendingPair>, pair: PendingPair) => {
      acc[pair.pair_address] = pair;
      return acc;
    }, {});
  }
);

export default userPendingPairsSlice.reducer;