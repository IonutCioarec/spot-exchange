import BigNumber from 'bignumber.js';
import toast from 'react-hot-toast';

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
