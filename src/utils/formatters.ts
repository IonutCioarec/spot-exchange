import BigNumber from 'bignumber.js';

export const denomination = (amount: number, decimals: number) => {
  return new BigNumber(amount).shiftedBy(-18).toNumber().toFixed(decimals);
}