import axios from 'axios';
import { dexAPI } from 'config';
import { Pair, SwapPrice, TokensState, Token } from 'types/backendTypes';


export const useBackendAPI = () => {

  // get the list of token pairs (pools)
  const getPairs = async (): Promise<Pair[]> => {
    try {
      const response = await axios.get<Pair[]>(`${dexAPI}/pairs/v2`, {
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  // get the list of the tokens available to swap + lp_tokens
  const getTokens = async (
    currentPage: number = 1,
    currentLimit: number = 10,
    search_by_name: string = '',
    only_lp_tokens?: boolean,
    sort_by: string = 'volume24h',
    sort_direction: 'asc' | 'desc' = 'desc'
  ): Promise<TokensState> => {
    try {
      let url = `${dexAPI}/tokens/v2?page=${currentPage}&limit=${currentLimit}&search_by_name=${search_by_name}&sort_by=${sort_by}&sort_direction=${sort_direction}`;

      if (typeof only_lp_tokens === 'boolean') {
        url += `&only_lp_tokens=${only_lp_tokens}`;
      }

      const response = await axios.get(url, {
        headers: { Accept: 'application/json' },
      });

      const { data, page, limit, total, total_pages } = response.data;

      return {
        allTokens: data,
        pairTokens: {
          tokens: data,
          page,
          limit,
          total,
          total_pages,
        },
        lpTokens: data,
        searchInput: search_by_name ? search_by_name : '',
        status: 'succeeded',
      };

    } catch (e) {
      console.error(e);
      return {
        allTokens: [],
        pairTokens: {
          tokens: [],
          page: 1,
          limit: 10,
          total: 0,
          total_pages: 1,
        },
        searchInput: '',
        lpTokens: [],
        status: 'failed',
      };
    }
  };

  // get the price of swaping token1 -> token2
  const getSwapPrice = async (token1: string, token2: string, amount: string): Promise<SwapPrice> => {
    // try {
    //   const response = await axios.get<SwapPrice[]>(`${dexAPI}/swap?token_in=${token1}&token_out=${token2}&amount=${amount}`, {
    //     headers: { Accept: 'application/json' },
    //   });
    //   return response.data[0];
    // } catch (e) {
    //   console.error(e);
    // }
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