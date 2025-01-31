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

  if (parseFloat(fixedInput) === parseInt(fixedInput, 10)) {
    return parseFloat(fixedInput).toFixed(decimals);
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