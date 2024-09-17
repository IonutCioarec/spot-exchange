import { styled } from '@mui/material/styles';

export default function PoolLiquidityBar({
  token1Amount,
  token2Amount,
}: {
  token1Amount: string;
  token2Amount: string;
}) {
  // Convert the string amounts to numbers
  const token1 = parseFloat(token1Amount);
  const token2 = parseFloat(token2Amount);

  // Calculate percentages for both tokens
  const total = token1 + token2;
  let token1Percentage = total > 0 ? (token1 / total) * 100 : 0;
  let token2Percentage = total > 0 ? (token2 / total) * 100 : 0;

  // Cap the token1, token2 min and max value for better bars display
  if (token1Percentage < 5) token1Percentage = 5;
  if (token1Percentage > 95) token1Percentage = 95;
  if (token2Percentage < 5) token2Percentage = 5;
  if (token2Percentage > 95) token2Percentage = 95;

  const BarContainer = styled('div')({
    position: 'relative',
    height: 13,
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: '7px',
    marginTop: '5px'
  });

  const Token1Bar = styled('div')({
    position: 'absolute',
    height: '100%',
    width: `${token1Percentage}%`,
    backgroundColor: '#01b574',
    borderRadius: '7px',
    border: '1px solid rgb(30,30,30)'
  });

  const Token2Bar = styled('div')({
    position: 'absolute',
    height: '100%',
    width: `${token2Percentage}%`,
    backgroundColor: '#20cbd4',
    right: 0,
    borderRadius: '7px',
    border: '1px solid rgb(30,30,30)'
  });

  return (
    <BarContainer>
      <Token1Bar />
      <Token2Bar />
    </BarContainer>
  );
}