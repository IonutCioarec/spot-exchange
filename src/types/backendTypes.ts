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
};

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
};

export interface ExtraToken {
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
  supply: string;
  balance: string;
};

export interface FormattedRawValue {
  formatted: string;
  raw: string;
};

export interface SwapStep {
  price_impact: FormattedRawValue;
  sc_address: string;
  swap_fee: FormattedRawValue;
  token_in: string;
  token_out: string;
  x_in: FormattedRawValue;
  x_reserve: FormattedRawValue;
  y_reserve: FormattedRawValue;
};

export interface SwapPrice {
  cumulative_exchange_rate: FormattedRawValue;
  final_output: FormattedRawValue;
  steps: SwapStep[];
};

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
};

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
};

export interface UserFarm {
  staked: string;
  rewards: string;
  rewardsList: {
    token: string;
    value: string;
  }[];
};

export type UserFarmsState = Record<string, UserFarm>;

export type SwapValidationResult = 'low_reserve' | 'slippage_exceeded' | 'swap_ok';

export interface SwapRawPrice {
  pairs: [
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
};

export interface AuthState {
  isAuthenticated: boolean;
  address: string;
  origin: string;
  issued: number;
  expires: number;
  signature: string;
  blockHash: string;
  ttl: number;
  status: 'loading' | 'succeeded' | 'failed';
};

export interface CreateBrandingPRResponse {
  status: 'succeeded' | 'failed';
  success?: boolean;
  pullRequestUrl?: string;
  pullRequestNumber?: number;
  error?: string;
};

export interface CheckBrandingPRResponse {
  status: 'succeeded' | 'failed';
  success?: boolean;
  prs?: Array<{
    prInProgress: boolean;
    prUrl: string;
    state: string;
    token_id: string;
  }>;
  error?: string;
};

export interface Farm {
  farm_address: string;
  token1: string;
  token2: string;
  fees_apr: string;
  boosted_apr: string;
  total_apr: string;
  total_staked: string;
  total_rewards: string;
  staking_users: number;
  lp_token_id: string;
  apr_boost?: {
    rewardToken: string;
    fromRound: number;
    toRound: number;
    totalAmount: number;
  }[];
  total_rewards_list: {
    token: string;
    amount: number;
    value: string;
  }[];
};

export type FarmState = Record<string, Farm>;

export interface FarmsState {
  farms: Farm[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  lp_token_search: string;
  sort_by: 'boosted_apr' | 'fees_apr' | 'total_apr' | 'total_staked' | 'total_rewards' | 'staking_users';
  sort_direction: 'asc' | 'desc';
  status: 'loading' | 'succeeded' | 'failed';
};

export interface PendingPair {
  pair_address: string;
  token1: string;
  token2: string;
  currentStatus: string;
  nextPossibleSteps: string[];
};

export interface PendingPairsState {
  pendingPairs: PendingPair[];
  status: 'loading' | 'succeeded' | 'failed';
}