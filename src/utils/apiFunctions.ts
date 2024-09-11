import { dexAPI, API_URL } from 'config';
import { Pair, Token, SwapPrice, TokenDetails } from 'types/dexTypes';
import BigNumber from 'bignumber.js';

// get the swap price (routes)
export const getSwapPrice = async (token1: string, token2: string, amount: number, decimals: number): Promise<SwapPrice | null> => {
  try {
    const totalAmount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals))
    const response = await fetch(`${dexAPI}/swap?token_in=${token1}&token_out=${token2}&amount=${totalAmount}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    const json: SwapPrice[] = await response.json();
    if (json) {
      return json[0];
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};