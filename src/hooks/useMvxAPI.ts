import axios from 'axios';
import { API_URL } from 'config';

export const useMvxAPI = () => {
  const getUserTokensBalance = async (
    address: string,
    tokens: { token_id: string; is_lp_token: boolean }[]
  ): Promise<{
    lpTokens: Record<string, { balance: string }>;
    pairTokens: Record<string, { balance: string }>;
  }> => {
    try {
      // Extract token_ids and join them for the API request
      const tokensString = tokens.map(token => token.token_id).join('-');
      const response = await axios.get(
        `${API_URL}/accounts/${address}/tokens?identifiers=${tokensString}&includeMetaESDT=true`,
        {
          headers: { Accept: 'application/json' },
        }
      );

      // Initialize balance objects for LP tokens and pair tokens
      const lpTokens: Record<string, { balance: string }> = {};
      const pairTokens: Record<string, { balance: string }> = {};

      // Create a map from the API response for quick lookup
      const tokenData: Record<string, { balance: string }> = {};
      if (response.data) {
        response.data.forEach((token: any) => {
          tokenData[token.identifier] = { balance: token.balance };
        });
      }

      // Assign balances to each token based on `is_lp_token` flag, defaulting to '0' if not found
      tokens.forEach((token) => {
        const balance = tokenData[token.token_id]?.balance || '0';
        if (token.is_lp_token) {
          lpTokens[token.token_id] = { balance };
        } else {
          pairTokens[token.token_id] = { balance };
        }
      });

      return { lpTokens, pairTokens };
    } catch (e) {
      console.error(e);
      return { lpTokens: {}, pairTokens: {} };
    }
  };

  return {
    getUserTokensBalance
  };
};