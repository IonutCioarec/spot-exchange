import axios from 'axios';
import { API_URL } from 'config';
import logo from 'assets/img/no_logo.png';
import { CreatedTokens, UserNFTs } from 'types/mvxTypes';
import { denominatedAmountToAmount } from 'utils/formatters';

export const useMvxAPI = () => {
  const getUserTokensBalance = async (
    address: string,
    tokens: { token_id: string; is_lp_token: boolean }[]
  ): Promise<{
    lpTokens: Record<string, { balance: string, decimals: number }>;
    pairTokens: Record<string, { balance: string, decimals: number }>;
  }> => {
    try {
      // Extract token_ids and join them for the API request
      const tokensString = tokens.map(token => token.token_id).join('%2C');
      const response = await axios.get(
        `${API_URL}/accounts/${address}/tokens?identifiers=${tokensString}&includeMetaESDT=true`,
        {
          headers: { Accept: 'application/json' },
        }
      );

      // Initialize balance objects for LP tokens and pair tokens
      const lpTokens: Record<string, { balance: string, decimals: number }> = {};
      const pairTokens: Record<string, { balance: string, decimals: number }> = {};

      // Create a map from the API response for quick lookup
      const tokenData: Record<string, { balance: string, decimals: number }> = {};
      if (response.data) {
        response.data.forEach((token: any) => {
          tokenData[token.identifier] = { balance: denominatedAmountToAmount(token.balance, token.decimals, 20), decimals:  token.decimals};
        });
      }

      // Assign balances to each token based on `is_lp_token` flag, defaulting to '0' if not found
      tokens.forEach((token) => {
        const balance = tokenData[token.token_id]?.balance || '0';
        const decimals = tokenData[token.token_id]?.decimals || 18;
        if (token.is_lp_token) {
          lpTokens[token.token_id] = { balance: balance, decimals: decimals };
        } else {
          pairTokens[token.token_id] = { balance: balance, decimals: decimals };
        }
      });

      return { lpTokens, pairTokens };
    } catch (e) {
      console.error(e);
      return { lpTokens: {}, pairTokens: {} };
    }
  };

  //get tokens created by user
  const getUserCreatedTokens = async (address: string): Promise<CreatedTokens> => {
    try {
      const response = await axios.get(
        `${API_URL}/accounts/${address}/roles/tokens?size=1000&owner=${address}&includeMetaESDT=true`,
        {
          headers: { Accept: 'application/json' },
        }
      );

      const tokenData: CreatedTokens = {};
      if (response.data) {
        response.data.forEach((token: any) => {
          tokenData[token.identifier] = {
            token_id: token.identifier,
            ticker: token.identifier.split('-')[0],
            decimals: token.decimals,
            logo: token?.assets?.pngUrl ?? logo,
            balance: token.balance,
            branded: token?.assets?.pngUrl ? true : false,
            assets: token?.assets ?? {}
          };
        });
      }
      return tokenData;
    } catch (e) {
      console.error(e);
      return {};
    }
  };

  //get user tokens balances
  const getAllUserTokens = async (address: string): Promise<CreatedTokens> => {
    try {
      const response = await axios.get(
        `${API_URL}/accounts/${address}/tokens?size=2000&includeMetaESDT=true`,
        {
          headers: { Accept: 'application/json' },
        }
      );

      const tokenData: CreatedTokens = {};
      if (response.data) {
        response.data.forEach((token: any) => {
          tokenData[token.identifier] = {
            token_id: token.identifier,
            ticker: token.identifier.split('-')[0],
            decimals: token.decimals,
            logo: token?.assets?.pngUrl ?? logo,
            balance: token.balance,
            branded: token?.assets?.pngUrl ? true : false,
            assets: token?.assets ?? {}
          };
        });
      }
      return tokenData;
    } catch (e) {
      console.error(e);
      return {};
    }
  };

  //get user nfts balances
  const getAllUserNFTs = async (address: string): Promise<UserNFTs> => {
    try {
      const response = await axios.get(
        `${API_URL}/accounts/${address}/nfts?size=2000&withSupply=true`,
        {
          headers: { Accept: 'application/json' },
        }
      );

      const nftData: UserNFTs = {};
      if (response.data) {
        response.data.forEach((nft: any) => {
          nftData[nft.identifier] = {
            identifier: nft.identifier,
            collection: nft.collection,
            nonce: nft.nonce,
            type: nft.type,
            name: nft.name,
            creator: nft.creator,
            royalties: nft.royalties,
            logo: nft.url,
            balance: nft.balance,
            supply: nft.supply,
            ticker: nft.ticker,
          };
        });
      }
      return nftData;
    } catch (e) {
      console.error(e);
      return {};
    }
  };

  return {
    getUserTokensBalance,
    getUserCreatedTokens,
    getAllUserTokens,
    getAllUserNFTs
  };
};