import { useSelector } from 'react-redux';
import { selectPairs, selectTokens, selectStatus } from 'storeManager/slices/poolsSlice';
import Loader from 'components/Loader';
import { Container, Row, Col } from 'react-bootstrap';
import { Pair } from 'types/backendTypes';
import 'assets/css/pools.css';
import { Pool } from 'components/Pools/Pool';

const Pools = () => {
  const pairs = useSelector(selectPairs);
  const tokens = useSelector(selectTokens);
  const status = useSelector(selectStatus);

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <Container>
      <Row className='mb-5'>
        <Col xs={12} lg={12}>
          <div className='mt-5 mb-5'>
            {pairs.map((pair: Pair, index: number) => (
              <Pool pair={pair} key={`pairs-${index}`}/>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Pools;