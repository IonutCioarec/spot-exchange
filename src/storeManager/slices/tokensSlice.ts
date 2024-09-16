import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, TokensState } from 'types/backendTypes';

const initialState: TokensState = {
  tokens: {
    lp_tokens: [],
    pair_tokens: []
  },
  status: 'loading',
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token>) => {
      state.tokens.lp_tokens = action.payload.lp_tokens;
      state.tokens.pair_tokens = action.payload.pair_tokens;
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setTokens, setStatus } = tokensSlice.actions;

// Selectors
export const selectLpTokens = (state: any) => state.tokens.tokens.lp_tokens;
export const selectPairTokens = (state: any) => state.tokens.tokens.pair_tokens;
export const selectTokensStatus = (state: any) => state.tokens.status;

export default tokensSlice.reducer;