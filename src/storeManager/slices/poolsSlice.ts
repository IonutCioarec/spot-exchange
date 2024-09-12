import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dexAPI, API_URL } from 'config';
import { Pair, Token, PoolsState } from 'types/backendTypes';

// Define the initial state with status
interface ExtendedPoolsState extends PoolsState {
  status: 'loading' | 'succeeded' | 'failed';
}

const initialState: ExtendedPoolsState = {
  pairs: [],
  tokens: [],
  status: 'loading',
};

// Slice definition
const poolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    setPools: (state, action: PayloadAction<PoolsState>) => {
      state.pairs = action.payload.pairs;
      state.tokens = action.payload.tokens;
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setPools, setStatus } = poolsSlice.actions;

// Selectors
export const selectPairs = (state: any) => state.pools.pairs;
export const selectTokens = (state: any) => state.pools.tokens;
export const selectStatus = (state: any) => state.pools.status;

export default poolsSlice.reducer;
