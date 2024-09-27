import axios from 'axios';
import { dexAPI } from 'config';
import { Pair, SwapPrice, Token } from 'types/backendTypes';

export const useBackendAPI = () => {

  // get the list of token pairs (pools)
  const getPairs = async (): Promise<Pair[]> => {
    try {
      const response = await axios.get<Pair[]>(`${dexAPI}/pairs`, {
        headers: { Accept: 'application/json' },
      });
      return response.data;
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  // get the list of the tokens available to swap
  const getTokens = async (): Promise<Token> => {
    try {
      const response = await axios.get<Token>(`${dexAPI}/tokens`, {
        headers: { Accept: 'application/json' },
      });
      return response.data;
    } catch (e) {
      console.error(e);
    }
    return {
      lp_tokens: [],
      pair_tokens: []
    };
  };

  // get the price of swaping token1 -> token2
  const getSwapPrice = async (token1: string, token2: string, amount: string): Promise<SwapPrice> => {
    try {
      const response = await axios.get<SwapPrice[]>(`${dexAPI}/swap?token_in=${token1}&token_out=${token2}&amount=${amount}`, {
        headers: { Accept: 'application/json' },
      });
      return response.data[0];
    } catch (e) {
      console.error(e);
    }
    return {
      cumulative_exchange_rate: {
        formatted: '',
        raw: ''
      },
      final_output: {
        formatted: '',
        raw: ''
      },
      steps: []
    };
  };

  return {
    getPairs,
    getTokens,
    getSwapPrice
  };
};