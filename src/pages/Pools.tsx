import { useSelector } from 'react-redux';
import { selectPairs, selectPairsStatus } from 'storeManager/slices/pairsSlice';
import { selectLpTokens, selectPairTokensById } from 'storeManager/slices/tokensSlice';
import Loader from 'components/Loader';
import { Container, Row, Col } from 'react-bootstrap';
import { Pair } from 'types/backendTypes';
import 'assets/css/pools.css';
import { Pool } from 'components/Pools/Pool';

const Pools = () => {
  const pairs = useSelector(selectPairs);
  const pairtokens = useSelector(selectPairTokensById);
  const lptokens = useSelector(selectLpTokens);
  const pairsStatus = useSelector(selectPairsStatus);
  //console.log(JSON.stringify(pairs, null, 2));

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
              />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Pools;