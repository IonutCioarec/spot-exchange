import 'assets/scss/tools.scss';
import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useGetIsLoggedIn } from 'hooks';
import { useMobile, useTablet } from 'utils/responsive';
import ScrollToTopButton from 'components/ScrollToTopButton';
import LightSpot from 'components/LightSpot';
import { useNavigate } from 'react-router-dom';
import CreateToken from 'components/Tools/CreateToken';
import OwnedTokens from 'components/Tools/OwnedTokens';
import createTokenImage from 'assets/img/create_token.png';
import brandingTokenImage from 'assets/img/branding_token.png';
import ToolWidget from 'components/Tools/ToolWidget';

const Tools = () => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();

  const [openCreateToken, setOpenCreateToken] = useState(false);
  const [openBrandingToken, setOpenBrandingToken] = useState(false);

  const handleCreateToken = () => {
    setOpenCreateToken(!openCreateToken);
    setOpenBrandingToken(false);
  };
  const handleBrandingToken = () => {
    setOpenBrandingToken(!openBrandingToken);
    setOpenCreateToken(false);
  };

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

      {/* Tools Widgets */}
      <Row className='mb-5'>
        <Col xs={6} md={3} lg={2} className='mt-4'>
          <ToolWidget
            tokenImage={createTokenImage}
            handleToken={handleCreateToken}
            title='Create Token'
            active={openCreateToken}
          />
        </Col>
        <Col xs={6} md={3} lg={2} className='mt-4'>
          <ToolWidget
            tokenImage={brandingTokenImage}
            handleToken={handleBrandingToken}
            title='Brand Token'
            active={openBrandingToken}
          />
        </Col>
      </Row>

      {/* Create Token Section */}
      <Row>
        <Col xs={12} md={{ offset: 2, span: 8 }} lg={{ offset: 3, span: 6 }} className='mt-2'>
          <CreateToken
            open={openCreateToken}
            setOpen={handleCreateToken}
          />
        </Col>
      </Row>

      {/* Branding Tokens Section */}
      <Row>
        <Col xs={12} md={{ offset: 2, span: 8 }} lg={{ offset: 3, span: 6 }} className='mt-2'>
          <OwnedTokens
            open={openBrandingToken}
            setOpen={handleBrandingToken}
          />
        </Col>
      </Row>

      <p className='my-5'>&nbsp;</p>
      {/* Add light spots */}
      <LightSpot size={isMobile ? 220 : 350} x={isMobile ? '25%' : '40%'} y="40%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </div>
  );
}

export default Tools;
