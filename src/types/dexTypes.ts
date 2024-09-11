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

export interface TokenDetails {
  type: string;
  identifier: string;
  collection: string;
  nonce: number;
  name: string;
  ticker: string;
  owner: string;
  minted: string;
  burnt: string;
  initialMinted: string;
  decimals: number;
  isPaused: boolean;
  assets: {
    website: string;
    description: string;
    status: string;
    pngUrl: string;
    name: string;
    svgUrl: string;
    ledgerSignature: string;
    lockedAccounts: string;
    extraTokens: string[];
    preferredRankAlgorithm: string;
  };
  transactions: number;
  transactionsLastUpdatedAt: number;
  transfers: number;
  transfersLastUpdatedAt: number;
  accounts: number;
  accountsLastUpdatedAt: number;
  canUpgrade: boolean;
  canMint: boolean;
  canBurn: boolean;
  canChangeOwner: boolean;
  canAddSpecialRoles: boolean;
  canPause: boolean;
  canFreeze: boolean;
  canWipe: boolean;
  canTransferNftCreateRole: boolean;
  price: number;
  marketCap: number;
  supply: string;
  circulatingSupply: string;
  timestamp: number;
  mexPairType: string;
  totalLiquidity: number;
  totalVolume24h: number;
  isLowLiquidity: boolean;
  lowLiquidityThresholdPercent: number;
  tradesCount: number;
  roles: {
    address: string;
    canLocalMint: boolean;
    canLocalBurn: boolean;
    canCreate: boolean;
    canBurn: boolean;
    canAddQuantity: boolean;
    canUpdateAttributes: boolean;
    canAddUri: boolean;
    canTransfer: boolean;
    roles: string[];
  }[];
  canTransfer: boolean;
}
