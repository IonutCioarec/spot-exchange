import { useSelector } from 'react-redux';
import { selectPairs, selectPairsStatus } from 'storeManager/slices/pairsSlice';
import { selectPairTokensById, selectLpTokensById } from 'storeManager/slices/tokensSlice';
import { selectUserTokens } from 'storeManager/slices/userTokensSlice';
import Loader from 'components/Loader';
import { Container, Row, Col } from 'react-bootstrap';
import { Pair } from 'types/backendTypes';
import 'assets/css/pools.css';
import { Pool } from 'components/Pools/Pool';
import { denominatedAmountToAmount } from 'utils/formatters';

const Pools = () => {
  const pairs = useSelector(selectPairs);
  const pairtokens = useSelector(selectPairTokensById);
  const lptokens = useSelector(selectLpTokensById);
  const pairsStatus = useSelector(selectPairsStatus);
  const userTokens = useSelector(selectUserTokens);
  //console.log(JSON.stringify(lptokens, null, 2));

  if (pairsStatus === 'loading') {
    return <Loader />;
  }

  return (
    <Container>
      <Row className='mb-5'>
        <Col xs={12} lg={12}>
          <div className='mt-5 mb-5'>
            {pairs.map((pair: Pair, index: number) => (
              <Pool
                key={`pairs-${index}`}
                pair={pair}
                index={index}
                token1Details={pairtokens[pair.token1]}
                token2Details={pairtokens[pair.token2]}
                userToken1Balance={Number(userTokens[pair.token1]?.balance ?? 0)}
                userToken2Balance={Number(userTokens[pair.token2]?.balance ?? 0)}
                // userLpTokenBalance={Number(denominatedAmountToAmount(userTokens[pair.lp_token_id]?.balance, lptokens[pair.lp_token_id].decimals, 20) || 0)}
                userLpTokenBalance={Number(0.6)}
                lpTokenSupply={(Number(denominatedAmountToAmount(lptokens[pair.lp_token_id].supply, lptokens[pair.lp_token_id].decimals, 20)) ?? 0)}
              />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Pools;