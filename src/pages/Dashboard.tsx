import { Container } from 'react-bootstrap';
import 'assets/css/home.css';
import 'assets/scss/home.scss';
import { Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <div className="dashboard-page-height">
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Dashboard</h2>
              <p className='text-white text-justified mb-0'>Stay informed with real-time updates on your earnings, staking progress, and overall portfolio health. Access all your stats in one place to make informed decisions and optimize your crypto journey.</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;