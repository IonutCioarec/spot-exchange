import { Container } from 'react-bootstrap';
import 'assets/scss/createPool.scss';
import { Row, Col } from 'react-bootstrap';
import { Button, OutlinedInput, SelectChangeEvent } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { useGetAccountInfo } from 'hooks';
import { useMobile } from 'utils/responsive';
import { adminAddresses, pairsContractAddress, poolBaseTokens } from 'config';
import { Fragment, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { Check } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { StepIconProps } from '@mui/material/StepIcon';
import AddIcon from '@mui/icons-material/Add';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LightSpot from 'components/LightSpot';
import { useBackendAPI } from 'hooks/useBackendAPI';
import { usePoolsAdminCreatePool } from 'hooks/transactions/usePoolsAdminCreatePool';
import { usePoolsAddInitialLiquidity } from 'hooks/transactions/usePoolsAddInitialLiquidity';
import { usePoolsSetLocalRoles } from 'hooks/transactions/usePoolsSetLocalRoles';
import { usePoolsIssueLPToken } from 'hooks/transactions/usePoolsIssueLPToken';
import { selectUserTokens } from 'storeManager/slices/userTokensSlice';
import { useSelector } from 'react-redux';
import { getRouterBaseTokens, getPairCreationState, getBurnAddress, getVaultAddress } from 'helpers/scRouterRequests';
import ScrollToTopButton from 'components/ScrollToTopButton';
import toast from 'react-hot-toast';
import { usePoolsEnableSwap } from 'hooks/transactions/usePoolsEnableSwap';
import { usePoolsResume } from 'hooks/transactions/usePoolsResume';
import { usePoolsPairCreation } from 'hooks/transactions/usePoolsPairCreation';
import { useGetPendingTransactions } from 'hooks';
import { CopyToClipboard, generateLPTokenName } from "utils/calculs";
import { useRouterResume } from 'hooks/transactions/useRouterResume';
import { Link, useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import HorizontalStatusConnector from 'components/HorizontalStatusConnector';
import { PendingPair } from 'types/backendTypes';

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: '#f47272',
  marginLeft: '-5px',
  zIndex: 1,
  color: 'white',
  width: 34,
  height: 34,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor: '#fd9b38',
        boxShadow: '0 0 10px 0 rgba(0,0,0,.25)',
        color: 'white'
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor: '#3FAC5A',
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps & { index: number }) {
  const { active, completed, className, index } = props;

  const icons: { [key: number]: React.ReactElement } = {
    1: <AddIcon style={{ fontSize: '18px' }} />,
    2: <AddModeratorIcon style={{ fontSize: '18px' }} />,
    3: <SettingsIcon style={{ fontSize: '18px' }} />,
    4: <MonetizationOnIcon style={{ fontSize: '18px' }} />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? (
        <Check />
      ) : (
        icons[index]
      )}
    </ColorlibStepIconRoot>
  );
}

const CustomStepConnector = () => (
  <StepConnector
    sx={{
      [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
        borderColor: '#3FAC5A',
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: '#3FAC5A',
        },
      },
    }}
  />
);


const Admin = () => {
  const { address } = useGetAccountInfo();
  const isAdmin = adminAddresses.includes(address);
  const isMobile = useMobile();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { getUserPendingPairs } = useBackendAPI();
  const navigate = useNavigate();
  const [pendingUserAddress, setPendingUserAddress] = useState(address);
  const [pendingPairs, setPendingPairs] = useState<Record<string, PendingPair>>({});

  //Redirect the user to the home page if he is not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const [routerBaseTokens, setRouterBaseTokens] = useState([]);
  const getRouterBaseTokensData = async () => {
    const data = await getRouterBaseTokens();
    if (data) {
      setRouterBaseTokens(data);
    }
  };

  const [pairCreationState, setPairCreationState] = useState(false);
  const enablePoolsPairCreation = usePoolsPairCreation(true);
  const disablePoolsPairCreation = usePoolsPairCreation(false);
  const getPairCreationStateData = async () => {
    const data = await getPairCreationState();
    if (data) {
      setPairCreationState(data);
    }
  };

  const [routerBurnAddress, setBurnAddress] = useState('');
  const getRouterBurnAddressData = async () => {
    const data = await getBurnAddress();
    if (data) {
      setBurnAddress(data.toString());
    }
  };

  const [routerVaultAddress, setVaultAddress] = useState('');
  const getRouterVaultAddressData = async () => {
    const data = await getVaultAddress();
    if (data) {
      setVaultAddress(data.toString());
    }
  };

  useEffect(() => {
    if (address) {
      getRouterBaseTokensData();
      getPairCreationStateData();
      getRouterBurnAddressData();
      getRouterVaultAddressData();
    }
  }, [address, hasPendingTransactions]);

  // get the pending pairs for the specified address
  const loadUserPendingPairs = async (address: string) => {
    const newPendingPairs = await getUserPendingPairs(address);
    const newPendingPairsByIds = newPendingPairs.pendingPairs.reduce((acc: Record<string, PendingPair>, pair: PendingPair) => {
      acc[pair.pair_address] = pair;
      return acc;
    }, {});
    setPendingPairs(newPendingPairsByIds);
  }

  const handleUserAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPendingUserAddress(value);
  };

  return (
    <Container className='create-pool-page-height font-rose mb-5'>
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ minHeight: '60px' }}>
            <div className={`p-3 mb-3  ${isMobile ? 'mt-2' : 'mt-4'}`}>
              <h2 className='text-white text-center'>Admin</h2>
            </div>
          </div>
        </Col>
      </Row>
      <ScrollToTopButton targetRefId='topSection' right='30px' />

      <Row className={`${isMobile ? 'mt-4' : 'mt-3'} mb-5`}>
        <Col xs={12} lg={6}>
          <Row>
            <Col xs={12}>
              <div className={`create-container text-white`}>
                <p className='font-bold font-size-xxl text-center text-intense-green underline'>Enable / Disable creating pools</p>
                <div className='mt-4'>
                  <p className='mb-1'>Current Pools Creating State:</p>
                  <p className='mb-0 font-size-sm'>- {pairCreationState ? 'Enabled' : 'Disabled'}</p>
                  <div className="mt-3 d-flex" style={{ borderTop: '2px solid rgba(255, 255, 255, 0.5)' }}>
                    <Button
                      className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3'
                      variant='contained'
                      size='small'
                      onClick={() => { getPairCreationStateData(); toast.success('Creating pairs state refreshed successfully', { duration: 3000 }); }}
                    >
                      Refresh Data
                    </Button>
                    <Button
                      className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3 ms-2'
                      variant='contained'
                      size='small'
                      onClick={() => enablePoolsPairCreation()}
                    >
                      Enable Creating
                    </Button>
                    <Button
                      className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3 ms-2'
                      variant='contained'
                      size='small'
                      onClick={() => disablePoolsPairCreation()}
                    >
                      Disable Creating
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} className='mt-3'>
              <div className={`create-container text-white`}>
                <p className='font-bold font-size-xxl text-center text-intense-green underline'>Get Creating Pools Base Tokens</p>
                <div className='mt-4'>
                  <p className='mb-1'>Current base tokens:</p>
                  {routerBaseTokens.length > 0 ? (
                    routerBaseTokens.map((token: string, index: number) => (
                      <p className='mb-0 font-size-sm' key={`token-${token}`}>{(index + 1).toString()}. {token}</p>
                    ))
                  ) : (
                    <p className='font-size-sm text-danger'>- No base tokens found</p>
                  )}
                  <div className="mt-3" style={{ borderTop: '2px solid rgba(255, 255, 255, 0.5)' }}>
                    <Button
                      className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3'
                      variant='contained'
                      size='small'
                      onClick={() => { getRouterBaseTokensData(); toast.success('Tokens refreshed successfully', { duration: 3000 }); }}
                    >
                      Refresh Tokens
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} className='mt-3'>
              <div className={`create-container text-white`}>
                <p className='font-bold font-size-xxl text-center text-intense-green underline'>Swap Burn Address</p>
                <div className='mt-4'>
                  <p className='mb-1'>Current Burn Address:</p>
                  <p className='mb-0 font-size-sm text-intense-green' style={{ wordBreak: 'break-word' }}>{routerBurnAddress}</p>
                  <div className="mt-3 d-flex" style={{ borderTop: '2px solid rgba(255, 255, 255, 0.5)' }}>
                    <Button
                      className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3'
                      variant='contained'
                      size='small'
                      onClick={() => { getRouterBurnAddressData(); toast.success('Burn address refreshed successfully', { duration: 3000 }); }}
                    >
                      Refresh Data
                    </Button>
                    <Button
                      className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3 ms-3'
                      variant='contained'
                      size='small'
                      onClick={() => { CopyToClipboard(routerBurnAddress); }}
                    >
                      Copy Address
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} className='mt-3'>
              <div className={`create-container text-white`}>
                <p className='font-bold font-size-xxl text-center text-intense-green underline'>Swap Vault Address</p>
                <div className='mt-4'>
                  <p className='mb-1'>Current Vault Address:</p>
                  <p className='mb-0 font-size-sm text-intense-green' style={{ wordBreak: 'break-word' }}>{routerVaultAddress}</p>
                  <div className="mt-3 d-flex" style={{ borderTop: '2px solid rgba(255, 255, 255, 0.5)' }}>
                    <Button
                      className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3'
                      variant='contained'
                      size='small'
                      onClick={() => { getRouterVaultAddressData(); toast.success('Vault address refreshed successfully', { duration: 3000 }); }}
                    >
                      Refresh Data
                    </Button>
                    <Button
                      className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3 ms-3'
                      variant='contained'
                      size='small'
                      onClick={() => { CopyToClipboard(routerVaultAddress); }}
                    >
                      Copy Address
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

          </Row>
        </Col>

        <Col xs={12} lg={6}>
          <div className={`create-container text-white`}>
            <p className='font-bold font-size-xxl text-center text-intense-green underline'>CREATE POOL</p>
            <p className='font-size-sm mt-3 mb-1 ms-2'>Add Wallet Address:</p>
            <TextField
              id="user-wallet-address"
              placeholder='User Wallet Address'
              type="text"
              value={pendingUserAddress}
              autoComplete="off"
              onChange={handleUserAddressChange}
              size="medium"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: {
                  color: 'white',
                  fontSize: isMobile ? '17px' : '14px',
                  caretColor: 'white',
                  paddingLeft: '15px',
                  fontFamily: 'Red Rose',
                  paddingTop: '3px',
                  paddingBottom: '3px'
                },
              }}
              className='mb-0 token-container fullWidth b-r-md'
              style={{ border: '1px solid rgba(63, 142, 90, 0.1)' }}
            />
            <Button
              onClick={() => loadUserPendingPairs(pendingUserAddress)}
              className={`btn-intense-default btn-intense-success2 smaller font-size-xxs b-r-sm hover-btn text-white fullWidth mt-2`}
              sx={{ height: '30px', minWidth: isMobile ? '170px' : '100px' }}
            >
              Load Pending Pairs
            </Button>

            <div className="mt-4 pt-3 text-white" style={{ borderTop: '2px solid rgba(255, 255, 255, 0.5)' }}>
              {(Object.values(pendingPairs).length > 0) ? (
                <div>
                  <p className='font-size-sm text-justified mt-3 mb-0'>The created / pending pools for the requested address:</p>
                  {Object.values(pendingPairs).map((pair: PendingPair) => (
                    <div key={`pending-pair-${pair.pair_address}`}>
                      <div className={`mt-1 p-3 b-r-sm text-silver`} style={{ backgroundColor: 'rgba(10,10,10,0.7)' }}>
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
                              to={`/admin-create-pool/${pair.pair_address}/${pendingUserAddress}`}
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
                    to={`/admin-create-pool/new-pool/new-address`}
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
                    <p className='font-size-xs text-justified mb-0 mt-0 mx-3'>The provided address has no pairs in pending</p>
                  </div>
                  <Button
                    component={Link}
                    to={`/admin-create-pool/new-pool/new-address`}
                    className={`btn-intense-default btn-intense-success2 smaller font-size-xxs b-r-sm hover-btn text-white fullWidth mt-2`}
                    sx={{ height: '30px', minWidth: isMobile ? '170px' : '100px' }}
                  >
                    Create New Pair
                  </Button>
                </Fragment>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </Container>
  );
}

export default Admin;