import BigNumber from 'bignumber.js';

interface SlippageResult {
  slippage: number;
  newPriceToken1InToken2: number;
}

export function calculateSlippage(
  token1_decimals: number | null,
  token2_decimals: number | null,
  liquidity_token1: string,
  liquidity_token2: string,
  amountToken1: number,
  feePercent: number = 1
): SlippageResult {
  // Default decimals to 18 if not provided
  const decimalsToken1 = token1_decimals !== null ? token1_decimals : 18;
  const decimalsToken2 = token2_decimals !== null ? token2_decimals : 18;

  // Normalize the liquidity values using BigNumber and shiftedBy
  const liquidityToken1 = new BigNumber(liquidity_token1).shiftedBy(-decimalsToken1);
  const liquidityToken2 = new BigNumber(liquidity_token2).shiftedBy(-decimalsToken2);

  // Calculate the current price of Token1 in terms of Token2
  const priceToken1InToken2 = liquidityToken2.dividedBy(liquidityToken1);

  // Normalize the amount of Token1 to be swapped
  const normalizedAmountToken1 = new BigNumber(amountToken1).shiftedBy(-decimalsToken1);

  // Calculate the amount of Token2 that would be received without fees
  const amountToken2WithoutFee = liquidityToken2.multipliedBy(normalizedAmountToken1).dividedBy(liquidityToken1.plus(normalizedAmountToken1));

  // Apply the fee (subtract 1% from the received amount)
  const feeMultiplier = new BigNumber(1).minus(new BigNumber(feePercent).dividedBy(100));
  const amountToken2WithFee = amountToken2WithoutFee.multipliedBy(feeMultiplier);

  // Simulate the new liquidity after the swap
  const newLiquidityToken1 = liquidityToken1.plus(normalizedAmountToken1);
  const newLiquidityToken2 = liquidityToken2.minus(amountToken2WithFee);

  // Calculate the new price of Token1 in terms of Token2 after accounting for the fee
  const newPriceToken1InToken2 = newLiquidityToken2.dividedBy(newLiquidityToken1);

  // Calculate the slippage percentage
  let slippage = newPriceToken1InToken2.minus(priceToken1InToken2)
    .dividedBy(priceToken1InToken2)
    .multipliedBy(100);

  // Truncate slippage to 3 decimal places without rounding
  slippage = new BigNumber(slippage.toFixed(3, BigNumber.ROUND_DOWN));

  // Return the slippage and new price as a result
  return {
    slippage: slippage.toNumber(), 
    newPriceToken1InToken2: parseFloat(newPriceToken1InToken2.toFixed(18))
  };
}

