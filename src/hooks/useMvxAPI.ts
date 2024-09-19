import axios from 'axios';
import { API_URL } from 'config';

export const useMvxAPI = () => {
  const getUserTokensBalance = async (address: string, tokens: string[]): Promise<Record<string, { balance: string }>> => {
    try {
      const tokensString = tokens.join('-');
      const response = await axios.get(`${API_URL}/accounts/${address}/tokens?identifiers=${tokensString}&includeMetaESDT=true`, {
        headers: { Accept: 'application/json' },
      });
      const balances: Record<string, { balance: string }> = {};
      if (response.data) {
        // Create a set of tokens returned from the API for quick lookup
        const tokenData: Record<string, { balance: string }> = {};
        response.data.forEach((token: any) => {
          tokenData[token.identifier] = { balance: token.balance };
        });

        // Loop through all tokens from input and assign balances, defaulting to 0 if not found
        tokens.forEach((tokenItem) => {
          if (tokenData[tokenItem]) {
            balances[tokenItem] = tokenData[tokenItem];
          } else {
            balances[tokenItem] = { balance: '0' };
          }
        });
      }
      return balances;
    } catch (e) {
      console.error(e);
    }
    return {};
  };
  return {
    getUserTokensBalance
  };
};