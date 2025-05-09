import 'assets/scss/tools.scss';
import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useGetIsLoggedIn } from 'hooks';
import { useMobile, useTablet } from 'utils/responsive';
import ScrollToTopButton from 'components/ScrollToTopButton';
import LightSpot from 'components/LightSpot';
import { useNavigate } from 'react-router-dom';
import CreateToken from 'components/Tools/CreateToken';

const Tools = () => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();


  return (
    <div className="tools-page-height">
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ minHeight: '60px' }}>
            <div className={`p-3 mb-2  ${isMobile ? 'mt-2' : 'mt-4'}`}>
              <h2 className='text-white text-center'>Tools</h2>
            </div>
          </div>
        </Col>
      </Row>
      {isMobile && (
        <ScrollToTopButton targetRefId='topSection' />
      )}

      {/* Create Token Section */}
      <Row>
        <Col xs={12} lg={6}>
          <CreateToken />
        </Col>
      </Row>

      {/* Add light spots */}
      <LightSpot size={isMobile ? 220 : 350} x={isMobile ? '25%' : '40%'} y="40%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </div>
  );
}

export default Tools;
