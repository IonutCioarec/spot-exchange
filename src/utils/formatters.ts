import BigNumber from 'bignumber.js';

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

  const regexPattern = new RegExp(`^-?\\d*\\.?0*\\d{0,${decimals}}`);
  const fixedInput = input.toFixed(20);
  const match = fixedInput.match(regexPattern);

  if (match) {
    return match[0];
  } else {
    return '0';
  }
};