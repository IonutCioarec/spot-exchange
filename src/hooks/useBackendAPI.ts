import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { dexAPI } from 'config';
import { Pair, SwapPrice, Token } from 'types/backendTypes';
import BigNumber from 'bignumber.js';

export const useBackendAPI = () => {
  
  // get the list of token pairs (pools)
  const getPairs = async (): Promise<Pair[] | []> => {
    try {
      const response = await fetch(`${dexAPI}/pairs`, {
        headers: { Accept: 'application/json' },
      });
      const json: Pair[] = await response.json();
      if (json) {
        return json;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  // get the list of the tokens available to swap
  const getTokens = async (): Promise<Token[] | []> => {
    try {
      const response = await fetch(`${dexAPI}/tokens`, {
        headers: { Accept: 'application/json' },
      });
      const json: Token[] = await response.json();
      if (json) {
        return json;
      }
    } catch (e) {
      console.error(e);
    }
  return [];
  };

  // get the price of swaping token1 -> token2
  const getSwapPrice = async (token1: string, token2: string, amount: number, tokenDecimals: number): Promise<SwapPrice | []> => {
    try {
      const totalAmount = new BigNumber(amount).shiftedBy(tokenDecimals);
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
    return [];
  };

  return {
    getPairs,
    getTokens,
    getSwapPrice
  };
};