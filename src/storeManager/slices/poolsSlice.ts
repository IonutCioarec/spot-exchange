import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dexAPI, API_URL } from 'config';
import { Pair, Token } from 'types/dexTypes';

// Define the initial state
interface PoolsState {
  pairs: Pair[];
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PoolsState = {
  pairs: [],
  tokens: [],
  isLoading: false,
  error: null,
};

// Fetch pairs data
export const fetchPairsData = createAsyncThunk('pools/fetchPairs', async () => {
  const response = await fetch(`${dexAPI}/pairs`, {
    headers: { Accept: 'application/json' },
  });
  return (await response.json()) as Pair[];
});

// Fetch tokens data
export const fetchTokensData = createAsyncThunk('pools/fetchTokens', async () => {
  const response = await fetch(`${dexAPI}/tokens`, {
    headers: { Accept: 'application/json' },
  });
  return (await response.json()) as Token[];
});

// Slice definition
const poolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPairsData.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchPairsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pairs = action.payload;
      })
      .addCase(fetchPairsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch pairs';
      })
      .addCase(fetchTokensData.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchTokensData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tokens = action.payload;
      })
      .addCase(fetchTokensData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tokens';
      });
  },
});

export const selectPairs = (state: any) => state.pools.pairs;
export const selectTokens = (state: any) => state.pools.tokens;
export const selectIsLoading = (state: any) => state.pools.isLoading;

export default poolsSlice.reducer;
