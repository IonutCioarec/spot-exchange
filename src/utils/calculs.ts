import BigNumber from 'bignumber.js';
import toast from 'react-hot-toast';
import { denominatedAmountToAmount } from './formatters';

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
