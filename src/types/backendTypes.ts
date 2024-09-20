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
export interface TokenValue {
  token_id: string,
  ticker: string,
  logo_url: string,
  has_branding: boolean,
  decimals: number,
  is_lp_token: boolean,
  price: number | null,
  supply: string
}

export interface Token {
  lp_tokens: TokenValue[],
  pair_tokens: TokenValue[]
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
  status: 'loading' | 'succeeded' | 'failed';
  viewMode: 'all' | 'assets' | 'created'
}

export interface TokensState {
  tokens: Token;
  status: 'loading' | 'succeeded' | 'failed';
}
