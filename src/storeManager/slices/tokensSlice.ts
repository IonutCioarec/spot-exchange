import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, TokensState } from 'types/backendTypes';
import { createSelector } from 'reselect';

const initialState: TokensState = {
  tokens: [],
  status: 'loading',
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      // Split tokens into lp_tokens and pair_tokens based on the is_lp_token flag
      state.tokens = action.payload.map(token => ({
        ...token,
        ticker: token.token_id.split('-')[0], // Calculate the ticker from token_id
      }));
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setTokens, setStatus } = tokensSlice.actions;

// Selectors
// Select LP tokens (where is_lp_token is true)
export const selectLpTokens = createSelector(
  [(state: any) => state.tokens.tokens],
  (tokens: Token[]) => tokens.filter((token) => token.is_lp_token)
);

// Select pair tokens (where is_lp_token is false)
export const selectPairTokens = createSelector(
  [(state: any) => state.tokens.tokens],
  (tokens: Token[]) => tokens.filter((token) => !token.is_lp_token)
);

// Select tokens status
export const selectTokensStatus = (state: any) => state.tokens.status;

// Memoized selector to transform lpTokens into an object keyed by token_id
export const selectLpTokensById = createSelector(
  [selectLpTokens],
  (lpTokens: Token[]) => lpTokens.reduce((acc: Record<string, Token>, token: Token) => {
    acc[token.token_id] = token;
    return acc;
  }, {})
);

// Memoized selector to transform pairTokens into an object keyed by token_id
export const selectPairTokensById = createSelector(
  [selectPairTokens],
  (pairTokens: Token[]) => pairTokens.reduce((acc: Record<string, Token>, token: Token) => {
    acc[token.token_id] = token;
    return acc;
  }, {})
);

// Memoized selector combining lp_tokens and pair_tokens
export const selectTokenIds = createSelector(
  [selectLpTokens, selectPairTokens],
  (lp_tokens, pair_tokens) => [...lp_tokens, ...pair_tokens].map((token) => token.token_id)
);

export default tokensSlice.reducer;