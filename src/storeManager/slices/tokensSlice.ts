import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, TokensState, TokenValue } from 'types/backendTypes';

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

// Transform lpTokens into an object keyed by token_id
export const selectLpTokensById = (state: any) => {
  return state.tokens.tokens.lp_tokens.reduce((acc: Record<string, TokenValue>, token: TokenValue) => {
    acc[token.token_id] = token;
    return acc;
  }, {});
};

// Transform pairTokens into an object keyed by token_id
export const selectPairTokensById = (state: any) => {
  return state.tokens.tokens.pair_tokens.reduce((acc: Record<string, TokenValue>, token: TokenValue) => {
    acc[token.token_id] = token;
    return acc;
  }, {});
};

export default tokensSlice.reducer;