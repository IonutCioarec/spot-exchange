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
  balance: string;
  branded: boolean;
}
export type CreatedTokens = Record<string, CreatedToken>;

export interface NFTData {
  identifier: string;
  collection: string;
  nonce: number;
  type: string;
  name: string;
  creator: string;
  royalties: number,
  logo: string;
  balance: string;
  supply: string;
  ticker: string;
}
export type UserNFTs = Record<string, NFTData>;