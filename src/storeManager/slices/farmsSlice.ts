import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Farm, FarmsState } from 'types/backendTypes';
import { createSelector } from 'reselect';

const initialState: FarmsState = {
  farms: [],
  page: 1,
  limit: 10,
  total: 10,
  total_pages: 1,
  sort_by: 'total_apr',
  sort_direction: 'desc',
  lp_token_search: '',
  status: 'loading'
};

const farmsSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    setFarms: (state, action: PayloadAction<FarmsState>) => {
      const { farms, page, limit, total, total_pages } = action.payload;
      state.farms = farms;
      state.page = page;
      state.limit = limit;
      state.total = total;
      state.total_pages = total_pages;
      state.status = 'succeeded';
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'boosted_apr' | 'fees_apr' | 'total_apr' | 'total_staked' | 'total_rewards' | 'staking_users'>) => {
      state.sort_by = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort_direction = action.payload;
    },
    setLPTokenSearch: (state, action: PayloadAction<string>) => {
      state.lp_token_search = action.payload;
    },
    setStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setFarms, setPage, setLimit, setSortBy, setSortDirection, setLPTokenSearch, setStatus } = farmsSlice.actions;

// Selectors
export const selectFarms = (state: any) => state.farms;
export const selectFarmsPage = (state: any) => state.pairs.page;
export const selectFarmsLimit = (state: any) => state.farms.limit;
export const selectFarmsTotal = (state: any) => state.pairs.total;
export const selectFarmsTotalPages = (state: any) => state.pairs.total_pages;
export const selectFarmsSortBy = (state: any) => state.farms.sort_by;
export const selectFarmsSortDirection = (state: any) => state.farms.sort_direction;
export const selectFarmsLpSearchInput = (state: any) => state.farms.lp_token_search;
export const selectFarmsStatus = (state: any) => state.pairs.status;

// Memoized selector to transform lpTokens into an object keyed by token_id
export const selectFarmsById = createSelector(
  [selectFarms],
  (data: FarmsState) => {
    const farms = data.farms;
    return farms.reduce((acc: Record<string, Farm>, farm: Farm) => {
      acc[farm.farm_address] = farm;
      return acc;
    }, {});
  }
);

export default farmsSlice.reducer;