import BigNumber from 'bignumber.js';
import { getAmountFromPercentageBigNumber, getPercentageBigNumber } from './calculs';
import { Pair, Token } from 'types/backendTypes';
import defaultLogo from 'assets/img/default_token_image.png';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';

export const denominatedAmountToAmount = (amount: number | string, denomination: number, decimals: number) => {
  return new BigNumber(amount).shiftedBy(-denomination).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toString(10);
}

export const amountToDenominatedAmount = (amount: number | string, denomination: number, decimals: number) => {
  return new BigNumber(amount).shiftedBy(denomination).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toString(10);
}

export const formatSignificantDecimals = (input: number, decimals: number = 2): string => {
  if (input === 0) {
    return '0';
  }

  const inputStr = input.toFixed(20);
  const regexPattern = new RegExp(`^-?\\d*\\.?0*\\d{0,${decimals}}`);
  const match = inputStr.match(regexPattern);

  if (Number.isInteger(input)) {
    return input.toFixed(decimals);
  }

  if (match) {
    return match[0];
  } else {
    return '0';
  }
};

export function intlNumberFormat(
  number: number,
  minDigits: number = 2,
  maxDigits: number = 2,
  locales?: string | string[]
): string {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  };

  return new Intl.NumberFormat(locales || 'en-GB', options).format(number);
}

export const denominatedAmountToIntlFormattedAmount = (
  amount: number | string,
  denomination: number,
  decimals: number,
): string => {
  const auxAmount = denominatedAmountToAmount(amount, denomination, decimals);
  return intlNumberFormat(parseFloat(auxAmount), decimals, decimals);
}

export const parseFormattedNumber = (formatted: string) => {
  return parseFloat(formatted.replace(/,/g, ''));
};

export const formatNumberWithCommas = (value: any) => {
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

// Return first signifiant decimals fromatted with intl
export const intlFormatSignificantDecimals = (
  input: number,
  decimals: number = 2,
  minDigits: number = 0,
  maxDigits: number = 20,
  locales?: string | string[]
): string => {
  const significantDecimals = Number(formatSignificantDecimals(input, decimals));
  return intlNumberFormat(significantDecimals, minDigits, maxDigits, locales);
};

// Formats large numbers into a more readable format (K for thousands, M for millions, B for billions, etc.)
export const abbreviateNumber = (num: number, decimals = 2): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + "B"; // Billion
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + "M"; // Million
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + "K"; // Thousand
  } else {
    return num.toFixed(decimals); // Less than 1K
  }
};

// Get the pool user liquidity
export const getFormattedUserPoolLiquidity = (userLpTokenBalance: string, tokenSupply: string, tokenDecimals: number, tvl: string, decimals: number = 3): string => {
  const liquidity = intlFormatSignificantDecimals(
    getAmountFromPercentageBigNumber(
      getPercentageBigNumber(
        Number(userLpTokenBalance) || 0,
        (Number(denominatedAmountToAmount(tokenSupply || 0, tokenDecimals || 18, 20)) ?? 0)
      ),
      Number(tvl)
    ), decimals, decimals)

  return liquidity;
}

// Get a list with all the user pools liquidities
export const getUserPoolsLiquidityList = (
  pairs: Pair[],
  userLpBalances: Record<string, { balance: string }>,
  allTokens: Record<string, { supply: string; decimals: number }>
): Record<string, string> => {
  return pairs.reduce((acc, pair) => {
    const userBalance = userLpBalances[pair.lp_token_id].balance || "0";
    const tokenData = allTokens[pair.lp_token_id] || { supply: "0", decimals: 18 };

    acc[pair.lp_token_id] = getFormattedUserPoolLiquidity(
      userBalance,
      tokenData.supply,
      tokenData.decimals,
      pair.tvl
    );

    return acc;
  }, {} as Record<string, string>);
};

// Get the user total pools liquidity
export const getUserPoolsLiquidityTotal = (
  pairs: Pair[],
  userLpBalances: Record<string, { balance: string }>,
  allTokens: Record<string, Token>,
  decimals: number = 3
): string => {
  const totalLiquidity = pairs.reduce((sum, pair) => {
    const userLiquidity = getFormattedUserPoolLiquidity(
      userLpBalances[pair.lp_token_id].balance || "0",
      allTokens[pair.lp_token_id]?.supply || "0",
      allTokens[pair.lp_token_id]?.decimals || 18,
      pair.tvl,
      decimals
    );

    const numericLiquidity = parseFloat(userLiquidity.replace(/,/g, '')) || 0;
    return sum + numericLiquidity;
  }, 0);

  return intlFormatSignificantDecimals(totalLiquidity, decimals, decimals);
};

// Get the formatted pool share of the user
export const getFormattedUserPoolShare = (userLpTokenBalance: string, tokenSupply: string, tokenDecimals: number, decimals: number = 3): string => {
  const share = intlFormatSignificantDecimals(getPercentageBigNumber(
    Number(userLpTokenBalance) || 0,
    (Number(denominatedAmountToAmount(tokenSupply || 0, tokenDecimals || 18, 20)) ?? 0)
  ), decimals)

  return share;
}

// return swap tokens image
export const getTokenLogo = (
  tokenType: 'token1' | 'token2',
  allTokens: Record<string, Token>,
  selectedToken?: string
) => {
  const tokenKey =
    selectedToken ||
    (tokenType === 'token2' ? defaultSwapToken2 : defaultSwapToken1);

  const logoUrl = allTokens[tokenKey]?.logo_url;

  return logoUrl && logoUrl !== 'N/A' ? logoUrl : defaultLogo;
};