export interface Pair {
  creator_address: string,
  fee: number,
  fees_1h: string,
  fees_24h: string,
  fees_30d: string,
  fees_7d: string,
  lp_token_id: string,
  pair_id: string,
  state: string,
  token1: string,
  token1_reserve: string,
  token1_reserve_denominated: string,
  token2: string,
  token2_reserve: string,
  token2_reserve_denominated: string,
  tvl: string,
  volume_1h: string,
  volume_24h: string,
  volume_30d: string,
  volume_7d: string
}
export interface Token {
  token_id: string,
  ticker: string,
  logo_url: string,
  has_branding: boolean,
  decimals: number,
  is_lp_token: boolean,
  price_usd: string,
  price_change_24h: string,
  price_change_7d: string,
  price_change_30d: string,
  volume_24h: string,
  volume_7d: string,
  volume_30d: string,
  supply: string
}

export interface FormattedRawValue {
  formatted: string;
  raw: string;
}

export interface SwapStep {
  price_impact: FormattedRawValue;
  sc_address: string;
  swap_fee: FormattedRawValue;
  token_in: string;
  token_out: string;
  x_in: FormattedRawValue;
  x_reserve: FormattedRawValue;
  y_reserve: FormattedRawValue;
}

export interface SwapPrice {
  cumulative_exchange_rate: FormattedRawValue;
  final_output: FormattedRawValue;
  steps: SwapStep[];
}

export interface PairsState {
  pairs: Pair[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  token_search: string;
  my_deposits: boolean;
  lp_token_search: string[];
  sort_by: 'liquidity' | 'volume24h' | 'fees24h',
  sort_direction: 'asc' | 'desc',
  status: 'loading' | 'succeeded' | 'failed';  
}

export interface TokensState {
  allTokens: Token[];
  pairTokens: {
    tokens: Token[];
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  lpTokens: Token[];
  searchInput: string;
  sort_by: 'volume24h' | 'volume7d' | 'volume30d' | 'price_usd' | 'price_change24h',
  sort_direction: 'asc' | 'desc',
  status: 'loading' | 'succeeded' | 'failed';
}

export interface Farm {
  token1: string;
  token2: string;
  feesAPR: string;
  boostedAPR: string;
  totalAPR: string;
  totalStaked: string;
  totalRewards: string;
  stakingUsers: number;
  lp_token_id: string;
  totalRewardsList: { token: string; value: string }[];
}

export type FarmsState = Record<string, Farm>;

export interface UserFarm {
  staked: string;
  rewards: string;
  rewardsList: {
    token: string;
    value: string;
  }[];
}

export type UserFarmsState = Record<string, UserFarm>;

export type SwapValidationResult = 'low_reserve' | 'slippage_exceeded' | 'swap_ok';

export interface SwapRawPrice {
  pairs : [
    {
      'sc_address': string;
      'token_in': string;
      'token_out': string;
      'price': number;
      'fee_percentage': number;
      'fee_amount': number;
    }
  ]
  final_price: number;
}