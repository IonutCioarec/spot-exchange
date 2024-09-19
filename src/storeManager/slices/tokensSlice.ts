import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, TokensState, TokenValue } from 'types/backendTypes';
import { createSelector } from 'reselect';

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

// Memoized selector to transform lpTokens into an object keyed by token_id
export const selectLpTokensById = createSelector(
  [selectLpTokens],
  (lpTokens: TokenValue[]) => {
    return lpTokens.reduce((acc: Record<string, TokenValue>, token: TokenValue) => {
      acc[token.token_id] = token;
      return acc;
    }, {});
  }
);

// Memoized selector to transform pairTokens into an object keyed by token_id
export const selectPairTokensById = createSelector(
  [selectPairTokens],
  (pairTokens: TokenValue[]) => {
    return pairTokens.reduce((acc: Record<string, TokenValue>, token: TokenValue) => {
      acc[token.token_id] = token;
      return acc;
    }, {});
  }
);

// Memoized selector combining lp_tokens and pair_tokens
export const selectTokenIds = createSelector(
  [selectLpTokens, selectPairTokens],
  (lp_tokens, pair_tokens) => [
    ...lp_tokens,
    ...pair_tokens
  ].map((token) => token.token_id)
);

export default tokensSlice.reducer;