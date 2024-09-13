export interface Pair {
  id: string;
  token1: string;
  token2: string;
  source: number;
  sc_address: string;
  state: string;
  created_at: string;
  creator_address: string;
  token1_decimals: number | null;
  token2_decimals: number | null;
  liquidity_token1: string;
  liquidity_token2: string;
  lp_token_id: string;
  updated_at: string;
  fee: number;
}

export type Token = string;

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
  status: 'loading' | 'succeeded' | 'failed';
}

export interface TokensState {
  tokens: Token[];
  status: 'loading' | 'succeeded' | 'failed';
}
