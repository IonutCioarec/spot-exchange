import { Container } from 'react-bootstrap';
import 'assets/scss/createPool.scss';
import { Row, Col } from 'react-bootstrap';
import { Button } from '@mui/material';
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import { useMobile } from 'utils/responsive';
import { Fragment, useEffect, useState } from 'react';
import LightSpot from 'components/LightSpot';
import { useBackendAPI } from 'hooks/useBackendAPI';
import { useMvxAPI } from 'hooks/useMvxAPI';
import { CreatedTokens } from 'types/mvxTypes';
import { selectUserTokens } from 'storeManager/slices/userTokensSlice';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectPendingPairsById } from 'storeManager/slices/userPendingPairsSlice';
import { PendingPair } from 'types/backendTypes';
import InfoIcon from '@mui/icons-material/Info';
import HorizontalStatusConnector from 'components/HorizontalStatusConnector';

const PendingPools = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const userTokens = useSelector(selectUserTokens);
  const pendingPairs = useSelector(selectPendingPairsById);

  //Redirect the user to the unlock page if he is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/unlock');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Container className='create-pool-page-height font-rose'>
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ minHeight: '60px' }}>
            <div className={`p-3 mb-2  ${isMobile ? 'mt-2' : 'mt-4'}`}>
              <h2 className='text-white text-center'>Create Pool</h2>
            </div>
          </div>
        </Col>
      </Row>
      <Row className={`${isMobile ? 'mt-2' : 'mt-2'} mb-5`}>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className={`create-container text-white mb-5`}>
            {(Object.values(pendingPairs).length > 0) ? (
              <div>
                <p className='text-silver font-size-md text-center'>Your current created / pending pools:</p>
                {Object.values(pendingPairs).map((pair: PendingPair) => (
                  <div key={`pending-pair-${pair.pair_address}`}>
                    <div className={`mt-2 p-3 b-r-sm text-silver`} style={{ backgroundColor: 'rgba(10,10,10,0.7)' }}>
                      <div className='d-flex justify-content-between align-items-center font-bold'>
                        <p className='font-size-sm mb-0 text-justified text-[#3FAC5A]'>{pair.token1}</p>
                        <div className={`height-1 w-5 mx-5 bg-[#3FAC5A]`}></div>
                        <p className='text-right font-size-sm mb-0 text-justified text-[#3FAC5A]'>{pair.token2}</p>
                      </div>
                      <hr className='mt-2 mb-0' style={{ opacity: '0.3', color: 'silver' }} />
                      <HorizontalStatusConnector currentStatus={pair.currentStatus} />
                      <hr className='mt-2' style={{ opacity: '0.3', color: 'silver' }} />
                      <div className='grid-start-center'>
                        {pair.nextPossibleSteps.length === 0 ? (
                          <Button
                            className="btn-intense-default btn-disabled px-3 py-1 btn-intense-success2 hover-btn text-white b-r-xs font-size-xxs"
                            disabled
                          >
                            Pair Creation Complete
                          </Button>
                        ) : (
                          <Button
                            component={Link}
                            to={`/create-pool/${pair.pair_address}`}
                            className="btn-intense-default px-3 py-1 btn-intense-success2 hover-btn text-white b-r-xs font-size-xxs"
                          >
                            Continue Creating Pool
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  component={Link}
                  to={`/create-pool/new-pool`}
                  className={`btn-intense-default btn-intense-success2 smaller font-size-xxs b-r-sm hover-btn text-white fullWidth mt-4`}
                  sx={{ height: '30px', minWidth: isMobile ? '170px' : '100px' }}
                >
                  Create New Pair
                </Button>
              </div>
            ) : (
              <Fragment>
                <div className={`mt-2 p-3 b-r-sm text-silver ${isMobile ? '' : 'd-flex'} justify-content-center align-items-center`} style={{ backgroundColor: 'rgba(10,10,10,0.7)' }}>
                  <InfoIcon fontSize='medium' color='info' />
                  <p className='font-size-xs text-justified mb-0 mt-0 mx-3'>You have no pairs in pending, create one bellow</p>
                </div>
                <Button
                  component={Link}
                  to={`/create-pool/new-pool`}
                  className={`btn-intense-default btn-intense-success2 smaller font-size-xxs b-r-sm hover-btn text-white fullWidth mt-4`}
                  sx={{ height: '30px', minWidth: isMobile ? '170px' : '100px' }}
                >
                  Create New Pair
                </Button>
              </Fragment>
            )}
          </div>
        </Col>
      </Row>

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </Container >
  );
}

export default PendingPools;