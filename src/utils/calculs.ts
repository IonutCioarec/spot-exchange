import BigNumber from 'bignumber.js';
import toast from 'react-hot-toast';
import { denominatedAmountToAmount } from './formatters';
import { SwapStep, SwapValidationResult } from 'types/backendTypes';

export const getPercentage = (amount: number, totalAmount: number): number => {
  const percentage = totalAmount > 0 ? (amount * 100) / totalAmount : 0;
  return percentage;
}

export const getAmountFromPercentage = (percentage: number, totalAmount: number): number => {
  const amount = (percentage * totalAmount) / 100;
  return amount;
};

export const getPercentageBigNumber = (amount: number, totalAmount: number): number => {
  const bigNumberAmount = new BigNumber(amount);
  const bigNumberTotalAmount = new BigNumber(totalAmount);
  const percentage = totalAmount > 0 ? bigNumberAmount.shiftedBy(2).dividedBy(bigNumberTotalAmount) : 0;

  return Number(percentage);
}

export const getAmountFromPercentageBigNumber = (percentage: number, totalAmount: number): number => {
  const bigNumberPercentage = new BigNumber(percentage);
  const bigNumberTotalAmount = new BigNumber(totalAmount);
  const amount = bigNumberPercentage.multipliedBy(bigNumberTotalAmount).shiftedBy(-2);

  return Number(amount);
};

//Copy to Clipboard Utility
export function CopyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('Successfully copied', { duration: 3000 });
}

// Get the pool user liquidity
export const getUserPoolLiquidity = (userLpTokenBalance: string, supply: string, decimals: number, tvl: string): number => {
  const liquidity = getAmountFromPercentageBigNumber(
    getPercentageBigNumber(
      Number(userLpTokenBalance) || 0,
      (Number(denominatedAmountToAmount(supply || 0, decimals || 18, 20)) ?? 0)
    ),
    Number(tvl)
  );

  return liquidity;
}

// Get the pool share of the user
export const getUserPoolShare = (userLpTokenBalance: string, supply: string, decimals: number): number => {
  const share = getPercentageBigNumber(
    Number(userLpTokenBalance) || 0,
    (Number(denominatedAmountToAmount(supply || 0, decimals || 18, 20)) ?? 0)
  );

  return share;
}

//Generate lp_token_name
export const generateLPTokenName = (token1: string, token2: string): string => {
  // Normalize tokens: remove suffix and convert to lowercase
  const formatToken = (token: string) => token.split('-')[0].toLowerCase();
  
  const formattedToken1 = formatToken(token1);
  const formattedToken2 = formatToken(token2);
  
  // Construct the base LP token name
  let lpTokenName = (formattedToken1 + formattedToken2 + 'lp').toUpperCase();
  
  // Ensure the final name is at most 10 characters
  if (lpTokenName.length > 10) {
      const remainingLength = 10 - 2 - formattedToken1.length; // 2 for 'LP'
      lpTokenName = (formattedToken1 + formattedToken2.substring(0, remainingLength) + 'LP').toUpperCase();
  }
  
  return lpTokenName;
}

export function validateSwapStepsReserve(
  steps: SwapStep[],
  finalOutputRaw: string
) {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const xReserve = parseFloat(step.x_reserve.raw);
    const yReserve = parseFloat(step.y_reserve.raw);
    const xIn = parseFloat(step.x_in.raw);
    const fee = parseFloat(step.swap_fee.raw);

    // Adjust xIn for the fee (subtract the fee from the xIn amount)
    const effectiveXIn = xIn * (1 - fee);

    // Same-step low reserve check with fee adjustment
    if (effectiveXIn > xReserve) {
      return 'low_reserve';
    }

    let nextXIn: number;
    if (i < steps.length - 1) {
      nextXIn = parseFloat(steps[i + 1].x_in.raw);
    } else {
      nextXIn = parseFloat(finalOutputRaw);
    }

    // Adjust nextXIn for the fee (subtract the fee from the next step's xIn)
    const effectiveNextXIn = nextXIn * (1 - fee);

    // Next-step low reserve check with fee adjustment
    if (effectiveNextXIn > yReserve) {
      return 'low_reserve';
    }
  }

  return 'swap_ok';
}
