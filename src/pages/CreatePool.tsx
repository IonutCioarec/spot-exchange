import { Container } from 'react-bootstrap';
import 'assets/scss/createPool.scss';
import { Row, Col } from 'react-bootstrap';

const CreatePool = () => {
  return (
    <Container className='create-pool-page-height font-rose'>
      <Row>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Create Pool</h2>
              <p className='text-white mb-0 text-justified'>Create a pool now and enjoy full benefits</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CreatePool;