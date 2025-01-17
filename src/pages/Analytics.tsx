import { Container } from 'react-bootstrap';
import 'assets/scss/analytics.scss';
import { Row, Col } from 'react-bootstrap';

const Analytics = () => {
  return (
    <div className="analytics-page-height">
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Analytics</h2>
              <p className='text-white text-justified mb-0'>Gain Insights with Our Analytics Page: Track trading volumes, liquidity trends, pools stats, etc to make informed decisions. Stay ahead with real-time data and historical analysis.</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;