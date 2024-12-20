export interface UserTokensState {
  userTokens: Record<string, { balance: string }>;
  userLpTokens: Record<string, { balance: string }>;
  status: 'loading' | 'succeeded' | 'failed';
}

export interface CreatedToken {
  token_id: string;
  ticker: string;
  decimals: number;
  logo: string;
  balance: number;
}
export type CreatedTokens = Record<string, CreatedToken>;