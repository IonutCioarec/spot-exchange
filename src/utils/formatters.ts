import BigNumber from 'bignumber.js';

export const DenominatedAmountToAmount = (amount: number, denomination: number, decimals: number) => {
  return new BigNumber(amount).shiftedBy(-denomination).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toString();
}

export const AmountToDenominatedAmount = (amount: number, denomination: number, decimals: number) => {
  return new BigNumber(amount).shiftedBy(denomination).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toString();
}