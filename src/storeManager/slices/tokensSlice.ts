import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, TokensState } from 'types/backendTypes';
import { createSelector } from 'reselect';

const initialState: TokensState = {
  allTokens: [],
  pairTokens: {
    tokens: [],
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  },
  lpTokens: [],
  searchInput: '',
  status: 'loading',
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setAllTokens: (state, action: PayloadAction<Token[]>) => {
      state.allTokens = action.payload.map(token => ({
        ...token,
        ticker: token.token_id.split('-')[0],
      }));
      state.status = 'succeeded';
    },
    setPairTokens: (state, action: PayloadAction<{ tokens: Token[], page: number, limit: number, total: number, total_pages: number }>) => {
      const { tokens, page, limit, total, total_pages } = action.payload;
      state.pairTokens.tokens = tokens.map(token => ({
        ...token,
        ticker: token.token_id.split('-')[0],
      }));
      state.pairTokens.page = page;
      state.pairTokens.limit = limit;
      state.pairTokens.total = total;
      state.pairTokens.total_pages = total_pages;
      state.status = 'succeeded';
    },
    setLpTokens: (state, action: PayloadAction<Token[]>) => {
      state.lpTokens = action.payload.map(token => ({
        ...token,
        ticker: token.token_id.split('-')[0],
      }));
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pairTokens.page = action.payload;
    },
  },
});

export const { setAllTokens, setPairTokens, setLpTokens, setStatus, setSearchInput, setPage } = tokensSlice.actions;

// Selectors
export const selectAllTokens = (state: any) => state.tokens.allTokens;
export const selectPairTokens = (state: any) => state.tokens.pairTokens.tokens;
export const selectLpTokens = (state: any) => state.tokens.lpTokens;
export const selectPage = (state: any) => state.tokens.pairTokens.page;
export const selectTotalPages = (state: any) => state.tokens.pairTokens.total_pages;
export const selectPairTokensNumber = (state: any) => state.tokens.pairTokens.total;
export const selectTokensStatus = (state: any) => state.tokens.status;
export const selectSearchInput = (state: any) => state.tokens.searchInput;

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
  selectAllTokens,
  (allTokens) => allTokens.map((token: Token) => ({
    token_id: token.token_id,
    is_lp_token: token.is_lp_token,
  }))
);

export const selectAllTokensById = createSelector(
  [selectAllTokens],
  (pairTokens: Token[]) => pairTokens.reduce((acc: Record<string, Token>, token: Token) => {
    acc[token.token_id] = token;
    return acc;
  }, {})
);

export default tokensSlice.reducer;