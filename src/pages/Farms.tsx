import { Container } from 'react-bootstrap';
import 'assets/scss/farms.scss';
import { Row, Col } from 'react-bootstrap';

const Farms = () => {
  return (
    <div className='farms-page-height'>
      <Row>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Farms</h2>
              <p className='text-white mb-0'>Stake your tokens in following farms and earn great rewards</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Farms;