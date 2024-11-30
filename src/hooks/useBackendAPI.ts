import axios from 'axios';
import { dexAPI } from 'config';
import { Pair, SwapPrice, TokensState, Token, PairsState } from 'types/backendTypes';


export const useBackendAPI = () => {
  // get the list of token pairs (pools)
  const getPairs = async (
    currentPage: number = 1,
    currentLimit: number = 10,
    sort_by: 'liquidity' | 'volume24h' | 'fees24h' = 'liquidity',
    sort_direction: 'asc' | 'desc' = 'desc',
    token_search: string = '',
    my_deposits: boolean = false,
    lp_token_search?: string[]
  ): Promise<PairsState> => {
    try {
      let url = `${dexAPI}/pairs/v2?page=${currentPage}&limit=${currentLimit}&sort_by=${sort_by}&sort_direction=${sort_direction}&token_search=${token_search}`;

      let lp_tokens = <string[]>[];
      if (lp_token_search?.length) {
        lp_token_search.map((token: string) => {
          url += `&lp_token_search=${token}`;
          lp_tokens.push(token);
        })
      }

      const response = await axios.get(url, {
        headers: { Accept: 'application/json' },
      });
      const { data, page, limit, total, total_pages } = response.data;

      return {
        pairs: data,
        page,
        limit,
        total,
        total_pages,
        token_search: token_search ? token_search : '',
        my_deposits: my_deposits,
        sort_by: sort_by,
        sort_direction: sort_direction,
        lp_token_search: lp_token_search?.length ? lp_tokens : [],
        status: 'succeeded',
      };

    } catch (e) {
      console.error(e);
    }
    return {
      pairs: [],
      page: 0,
      limit: 0,
      total: 0,
      total_pages: 0,
      token_search: '',
      sort_by: 'liquidity',
      sort_direction: 'desc',
      lp_token_search: [],
      my_deposits: false,
      status: 'failed',
    };
  };

  // get the list of the tokens available to swap + lp_tokens
  const getTokens = async (
    currentPage: number = 1,
    currentLimit: number = 10,
    search_by_name: string = '',
    only_lp_tokens?: boolean,
    sort_by: 'volume24h' | 'volume7d'| 'volume30d'| 'price_usd'| 'price_change24h' = 'price_usd',
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
          page: 0,
          limit: 0,
          total: 0,
          total_pages: 0,
        },
        searchInput: '',
        lpTokens: [],
        status: 'failed',
      };
    }
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