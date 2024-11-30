import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pair, PairsState } from 'types/backendTypes';
import { createSelector } from 'reselect';
import { selectUserTokens } from './userTokensSlice';

const initialState: PairsState = {
  pairs: [],
  page: 1,
  limit: 10,
  total: 10,
  total_pages: 1,
  token_search: '',
  lp_token_search: [],
  my_deposits: false,
  sort_by: 'liquidity',
  sort_direction: 'desc',
  status: 'loading'
};

const pairsSlice = createSlice({
  name: 'pairs',
  initialState,
  reducers: {
    setPairs: (state, action: PayloadAction<PairsState>) => {
      const { pairs, page, limit, total, total_pages } = action.payload;
      state.pairs = pairs;
      state.page = page;
      state.limit = limit;
      state.total = total;
      state.total_pages = total_pages;
      state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
    setTokenSearch: (state, action: PayloadAction<string>) => {
      state.token_search = action.payload;
    },
    setLPTokenSearch: (state, action: PayloadAction<string[]>) => {
      state.lp_token_search = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setMyDeposits: (state, action: PayloadAction<boolean>) => {
      state.my_deposits = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'liquidity' | 'volume24h' | 'fees24h'>) => {
      state.sort_by = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort_direction = action.payload;
    },
  },
});

export const { setPairs, setStatus, setTokenSearch, setPage, setMyDeposits, setLPTokenSearch, setSortBy, setSortDirection } = pairsSlice.actions;

// Selectors
export const selectPairs = (state: any) => state.pairs.pairs;
export const selectPairsStatus = (state: any) => state.pairs.status;
export const selectPairsPage = (state: any) => state.pairs.page;
export const selectPairsTotalPages = (state: any) => state.pairs.total_pages;
export const selectPairsSearchInput = (state: any) => state.pairs.token_search;
export const selectPairsLpSearchInput = (state: any) => state.pairs.lp_token_search;
export const selectPairsMyDeposits = (state: any) => state.pairs.my_deposits;
export const selectPairsSortBy = (state: any) => state.pairs.sort_by;
export const selectPairsSortDirection = (state: any) => state.pairs.sort_direction;

export default pairsSlice.reducer;