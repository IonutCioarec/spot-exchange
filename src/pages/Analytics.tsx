import 'assets/scss/analytics.scss';
import { Row, Col } from 'react-bootstrap';
import Badge from '@mui/material/Badge';
import EChartsPseudo3DExample from 'components/EChartsPseudo3DExample';
import LineChartWithButtons from 'components/LineChartWithButtons';
import Portofolio from 'components/Analytics/Portofolio';

const Analytics = () => {
  const portofolioData = [
    { name: 'Tokens', value: 300.78},
    { name: 'Pools', value: 100},
    { name: 'Farms', value: 153},
  ];

  const rewardsData = [
    { name: 'Fees', value: 84.36},    
    { name: 'Boosted Farms', value: 26.07},
    { name: 'Farms', value: 43.35},
  ];

  return (
    <div className="analytics-page-height mb-5">
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Analytics</h2>
              <p className='text-white text-justified mb-0'>Gain Insights with Our Analytics Page: real-time portfolio updates, track trading volumes, liquidity trends, pools stats and others to make informed decisions. Stay ahead with real-time data and historical analysis.</p>
            </div>
          </div>
        </Col>
      </Row>

      <Portofolio data={portofolioData} rewardsData={rewardsData} walletBalance={453.78} rewardsBalance={153.78} />

      <Row className='mt-3'>
        <Col xs={12}>
          <h3 className='mt-4 text-white'>Burned Token Details</h3>
          <div className='b-r-sm ' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-3'>
              <div className='burning-section b-r-sm px-4 py-3'>
                <Row>
                  <Col xs={12} lg={6}>
                    <p className='mb-0'>Total Burned:</p>
                    <div className='mb-0 h3 d-flex align-items-center mt-1'>
                      <p className='mb-0 h3'>25,000,000</p>
                      <span className='label2-bg font-size-sm py-1 b-r-xs ms-2 px-2'>25.00%</span>
                    </div>
                    <p className='font-size-sm m-t-n-xs mb-0'>$456,786.23</p>
                    <p className='mb-0 font-size-sm mt-3'><span className='label-bg py-1 px-2 b-r-xs'>Adresses amount that burned token: 345</span></p>
                  </Col>
                  <Col xs={12} lg={6}>
                    <p className='mb-0'>Left Supply:</p>
                    <div className='mb-0 h3 d-flex align-items-center mt-1'>
                      <p className='mb-0 h3'>75,000,000</p>
                      <span className='label2-bg font-size-sm py-1 b-r-xs ms-2 px-2'>75.00%</span>
                    </div>
                    <p className='font-size-sm m-t-n-xs mb-0'>$1,256,786.23</p>
                    <p className='mb-0 font-size-sm mt-3'><span className='label-bg py-1 px-2 b-r-xs'>Obtained from total supply minus total burned</span></p>
                  </Col>
                </Row>
              </div>
              <div className='mt-2 text-white d-flex justify-content-around align-items-center'>
                <div className='text-center font-size-sm'>
                  <p className='mb-0'>500,000</p>
                  <div>
                    <Badge
                      variant="dot"
                      sx={{
                        '& .MuiBadge-dot': {
                          backgroundColor: '#B0C4DE',
                        },
                      }}
                    />
                    <span className='ms-2'>24 Hours</span>
                  </div>
                </div>
                <div className='text-center font-size-sm'>
                  <p className='mb-0'>5,300,000</p>
                  <div>
                    <Badge
                      variant="dot"
                      sx={{
                        '& .MuiBadge-dot': {
                          backgroundColor: '#FF6F61',
                        },
                      }}
                    />
                    <span className='ms-2'>7 Days</span>
                  </div>
                </div>
                <div className='text-center font-size-sm'>
                  <p className='mb-0'>10,500,000</p>
                  <div>
                    <Badge
                      variant="dot"
                      sx={{
                        '& .MuiBadge-dot': {
                          backgroundColor: '#FFD700',
                        },
                      }}
                    />
                    <span className='ms-2'>30 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          {/* Top pools by liquidity */}
          <h3 className='mt-4 text-white mt-5'>TOP Liquidity Pools</h3>
          <div className='b-r-sm' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <EChartsPseudo3DExample />
          </div>

          {/* Top pools by liquidity */}
          <h3 className='mt-4 text-white mt-5'>Chart example 2</h3>
          <div className='b-r-sm' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <LineChartWithButtons />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;