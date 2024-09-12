import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, TokensState } from 'types/backendTypes';

const initialState: TokensState = {
  tokens: [],
  status: 'loading',
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload;
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setTokens, setStatus } = tokensSlice.actions;

// Selectors
export const selectTokens = (state: any) => state.tokens.tokens;
export const selectTokensStatus = (state: any) => state.tokens.status;

export default tokensSlice.reducer;