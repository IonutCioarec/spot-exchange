import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pair, PairsState } from 'types/backendTypes';

const initialState: PairsState = {
  pairs: [],
  status: 'loading',
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
  },
});

export const { setPairs, setStatus } = pairsSlice.actions;

// Selectors
export const selectPairs = (state: any) => state.pairs.pairs;
export const selectPairsStatus = (state: any) => state.pairs.status;

export default pairsSlice.reducer;