export interface UserTokensState {
  userTokens: Record<string, { balance: string }>;
  userLpTokens: Record<string, { balance: string }>;
  status: 'loading' | 'succeeded' | 'failed';
}