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
import { useGetAccountInfo, useGetIsLoggedIn, useGetPendingTransactions } from 'hooks';
import { useMobile } from 'utils/responsive';
import { adminAddresses, pairsContractAddress, poolBaseTokens } from 'config';
import { useEffect, useState } from 'react';
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
import { useMvxAPI } from 'hooks/useMvxAPI';
import { usePoolsCreatePool } from 'hooks/transactions/usePoolsCreatePool';
import { usePoolsIssueLPToken } from 'hooks/transactions/usePoolsIssueLPToken';
import { usePoolsSetLocalRoles } from 'hooks/transactions/usePoolsSetLocalRoles';
import { usePoolsAddInitialLiquidity } from 'hooks/transactions/usePoolsAddInitialLiquidity';
import { CreatedTokens } from 'types/mvxTypes';
import { selectUserTokens } from 'storeManager/slices/userTokensSlice';
import { useSelector } from 'react-redux';
import { generateLPTokenName } from 'utils/calculs';
import { usePoolsResume } from 'hooks/transactions/usePoolsResume';
import { useNavigate, useParams } from 'react-router-dom';
import { selectPendingPairsById, selectPendingPairs } from 'storeManager/slices/userPendingPairsSlice';
import { PendingPair } from 'types/backendTypes';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { usePoolsAdminCreatePool } from 'hooks/transactions/usePoolsAdminCreatePool';
import { useRouterResume } from 'hooks/transactions/useRouterResume';

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
    5: <CheckCircleIcon style={{ fontSize: '18px' }} />,
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

const AdminCreatePool = () => {
  const { address } = useGetAccountInfo() || '';
  const isLoggedIn = useGetIsLoggedIn();
  const isAdmin = adminAddresses.includes(address);
  const navigate = useNavigate();
  const { getUserPendingPairs } = useBackendAPI();
  const isMobile = useMobile();
  const [baseTokenId, setBaseTokenId] = useState(poolBaseTokens.token1.id);
  const [baseTokenTicker, setBaseTokenTicker] = useState(poolBaseTokens.token1.ticker);
  const [baseTokenImage, setBaseTokenImage] = useState(poolBaseTokens.token1.image);
  const [baseTokenDecimals, setBaseTokenDecimals] = useState(poolBaseTokens.token1.decimals);
  const [secondTokenId, setSecondTokenId] = useState('');
  const [secondTokenTicker, setSecondTokenTicker] = useState('');
  const [secondTokenImage, setSecondTokenImage] = useState('');
  const [secondTokenDecimals, setSecondTokenDecimals] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const { getUserCreatedTokens } = useMvxAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const allTokens = useSelector(selectAllTokensById);
  const userTokens = useSelector(selectUserTokens);
  const { pair_id, user_address } = useParams<{ pair_id: string, user_address: string }>();
  const [currentPair, setCurrentPair] = useState<PendingPair>({
    currentStatus: '',
    nextPossibleSteps: [''],
    pair_address: '',
    token1: '',
    token2: ''
  });
  const [pendingPairs, setPendingPairs] = useState<Record<string, PendingPair>>({});

  //Redirect the user to the home page if he is not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const loadUserPendingPairs = async (address: string) => {
    const newPendingPairs = await getUserPendingPairs(address);
    const newPendingPairsByIds = newPendingPairs.pendingPairs.reduce((acc: Record<string, PendingPair>, pair: PendingPair) => {
      acc[pair.pair_address] = pair;
      return acc;
    }, {});
    setPendingPairs(newPendingPairsByIds);
  }

  useEffect(() => {
    if (pair_id && pair_id !== 'new-pool' && user_address && user_address !== 'new-address') {
      loadUserPendingPairs(user_address);
      if (pendingPairs) {
        const newPair = pendingPairs[pair_id];
        if (newPair) {
          setCurrentPair(newPair);
          if (newPair.nextPossibleSteps.length > 0) {
            switch (newPair.nextPossibleSteps[0]) {
              case 'Created': setActiveStep(0); break;
              case 'issueLpToken': setActiveStep(1); break;
              case 'setRoles': setActiveStep(2); break;
              case 'FarmCreated': setActiveStep(3); break;
              case 'createFarm': setActiveStep(4); break;
              case 'Ready': setActiveStep(5); break;
              default: setActiveStep(5); break;
            }
          }
        }
      }
    }
  }, [pendingPairs, hasPendingTransactions]);

  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const handleBaseTokenChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;

    switch (selectedValue) {
      case poolBaseTokens.token1.id:
        setBaseTokenId(poolBaseTokens.token1.id);
        setBaseTokenTicker(poolBaseTokens.token1.ticker);
        setBaseTokenImage(poolBaseTokens.token1.image);
        setBaseTokenDecimals(poolBaseTokens.token1.decimals);
        break;
      case poolBaseTokens.token2.id:
        setBaseTokenId(poolBaseTokens.token2.id);
        setBaseTokenTicker(poolBaseTokens.token2.ticker);
        setBaseTokenImage(poolBaseTokens.token2.image);
        setBaseTokenDecimals(poolBaseTokens.token2.decimals);
        break;
      case poolBaseTokens.token3.id:
        setBaseTokenId(poolBaseTokens.token3.id);
        setBaseTokenTicker(poolBaseTokens.token3.ticker);
        setBaseTokenImage(poolBaseTokens.token3.image);
        setBaseTokenDecimals(poolBaseTokens.token3.decimals);
        break;
      default:
        setBaseTokenId(poolBaseTokens.token1.id);
        setBaseTokenTicker(poolBaseTokens.token1.ticker);
        setBaseTokenImage(poolBaseTokens.token1.image);
        setBaseTokenDecimals(poolBaseTokens.token1.decimals);
        break;
    }
  };

  const handleSecondTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSecondTokenId(value);
  };

  const handleFirstTokenAmount = (event: any) => {
    const value = event.target.value;
    setFirstTokenAmount(value);
  };

  const handleSecondTokenAmount = (event: any) => {
    const value = event.target.value;
    setSecondTokenAmount(value);
  };

  const handleMaxToken1Amount = () => {
    setFirstTokenAmount(userTokens[currentPair.token1]?.balance ?? '0');
  };

  const handleMaxToken2Amount = () => {
    setSecondTokenAmount(userTokens[currentPair.token2]?.balance ?? '0');
  };

  // create pair hook (for all steps)
  const createPool = usePoolsAdminCreatePool(baseTokenId, secondTokenId, '/admin-operations');
  const issueLpToken = usePoolsIssueLPToken(
    currentPair.pair_address,
    generateLPTokenName(currentPair.token1, currentPair.token2),
    generateLPTokenName(currentPair.token1, currentPair.token2)
  );
  const setLocalRoles = usePoolsSetLocalRoles(currentPair.pair_address);
  const addInitialLiquidity = usePoolsAddInitialLiquidity(
    currentPair.pair_address,
    {
      token_id: currentPair.token1,
      token_decimals: userTokens[currentPair.token1]?.decimals || 18,
      token_amount: Number(firstTokenAmount)
    },
    {
      token_id: currentPair.token2,
      token_decimals: userTokens[currentPair.token2]?.decimals || 18,
      token_amount: Number(secondTokenAmount)
    }
  );
  const resumePoolSwap = usePoolsResume(currentPair.pair_address);
  const resumeAdminPoolSwap = useRouterResume(currentPair.pair_address);

  return (
    <Container className='create-pool-page-height font-rose'>
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ minHeight: '60px' }}>
            <div className={`p-3 mb-2  ${isMobile ? 'mt-2' : 'mt-4'}`}>
              <h2 className='text-white text-center'>Admin Create Pool</h2>
            </div>
          </div>
        </Col>
      </Row>
      <Row className={`${isMobile ? 'mt-2' : 'mt-2'} mb-5`}>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className={`create-container text-white mb-5`}>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              connector={<CustomStepConnector />}
            >
              <Step>
                <StepLabel StepIconComponent={(props) => (<ColorlibStepIcon {...props} index={1} />)}>
                  <p className='font-rose text-white font-size-lg ms-1 mb-0 mt-0'>Create Swap Pool</p>
                </StepLabel>
                <StepContent>
                  <div className='mb-3 mt-3'>
                    <p className='font-size-sm mb-1 ms-2'>Pool first token</p>
                    <Select
                      id="sort-by"
                      value={baseTokenId}
                      onChange={handleBaseTokenChange}
                      input={<OutlinedInput />}
                      size='small'
                      renderValue={() => (
                        <div className='font-size-sm font-regular text-white d-flex align-items-center'>
                          <img
                            src={baseTokenImage}
                            alt={baseTokenId}
                            style={{ width: 18, height: 18, flexShrink: 0 }}
                            className='me-1'
                          />
                          {baseTokenTicker}
                        </div>
                      )}
                      className='fullWidth token-container b-r-md'
                      sx={{
                        color: 'white',
                        fontSize: '12px',
                        fontFamily: 'Red Rose',
                        padding: 0,
                        '.MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                          marginLeft: '-50px !important'
                        },
                        backgroundColor: 'transparent',
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: 'rgba(32, 32, 32, 1)',
                            color: 'white',
                            fontFamily: 'Red Rose',
                            borderRadius: '12px',
                          },
                        },
                      }}
                    >
                      <MenuItem value={poolBaseTokens.token1.id} className={`font-rose select-menu-item font-size-xs`}>
                        <img
                          src={poolBaseTokens.token1.image}
                          alt={poolBaseTokens.token1.ticker}
                          style={{ width: 16, height: 16, flexShrink: 0 }}
                          className='me-1'
                        />
                        {poolBaseTokens.token1.ticker}
                      </MenuItem>
                      <MenuItem value={poolBaseTokens.token2.id} className={`font-rose select-menu-item font-size-xs`}>
                        <img
                          src={poolBaseTokens.token2.image}
                          alt={poolBaseTokens.token2.ticker}
                          style={{ width: 16, height: 16, flexShrink: 0 }}
                          className='me-1'
                        />
                        {poolBaseTokens.token2.ticker}
                      </MenuItem>
                      <MenuItem value={poolBaseTokens.token3.id} className={`font-rose select-menu-item font-size-xs`} style={{ marginBottom: '-4px' }}>
                        <img
                          src={poolBaseTokens.token3.image}
                          alt={poolBaseTokens.token3.ticker}
                          style={{ width: 16, height: 16, flexShrink: 0 }}
                          className='me-1'
                        />
                        {poolBaseTokens.token3.ticker}
                      </MenuItem>
                    </Select>

                    <p className='font-size-sm mt-3 mb-1 ms-2'>Pool second token ID</p>
                    <TextField
                      id="second-token"
                      placeholder='Token ticker'
                      type="text"
                      value={secondTokenId}
                      autoComplete="off"
                      onChange={handleSecondTokenChange}
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

                    <p className='font-size-sm mt-3 mb-1 ms-2'>Pool second token decimals</p>
                    <TextField
                      id="second-token-decimals"
                      placeholder='Token decimals'
                      type="text"
                      value={secondTokenDecimals}
                      autoComplete="off"
                      onChange={handleSecondTokenChange}
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
                    <div className='d-flex justify-content-between'>
                      <p className='mb-0 mt-1 ms-2 font-size-sm'>Pool Fee</p>
                      <p className='mb-0 mt-1 me-2 font-size-sm text-right'>1%</p>
                    </div>

                    <Button
                      variant="contained"
                      onClick={() => { createPool(); }}
                      className='btn-intense-default hover-btn btn-intense-success2 mt-2 fullWidth smaller'
                    >
                      Create Pool
                    </Button>
                  </div>
                </StepContent>
              </Step>
              <Step>
                <StepLabel StepIconComponent={(props) => (<ColorlibStepIcon {...props} index={2} />)}>
                  <p className='font-rose text-white font-size-lg ms-1 mb-0 mt-0'>Issue LP Token</p>
                </StepLabel>
                <StepContent>
                  <div className='mt-3 mb-3'>
                    <p className='text-center text-intense-green mt-2 font-size-md font-bold mb-2'>Press the button to automatically generate and create the LP token</p>
                    <Button
                      variant="contained"
                      onClick={() => { issueLpToken(); }}
                      className='btn-intense-default hover-btn btn-intense-success2 fullWidth smaller'
                    >
                      Token Issue
                    </Button>
                  </div>
                </StepContent>
              </Step>
              <Step>
                <StepLabel StepIconComponent={(props) => (<ColorlibStepIcon {...props} index={3} />)}>
                  <p className='font-rose text-white font-size-lg ms-1 mb-0 mt-0'>Set Role</p>
                </StepLabel>
                <StepContent>
                  <div className='my-3'>
                    <p className='text-center text-intense-green mt-2 font-size-md font-bold'>MINT/BURN LP TOKEN ROLES</p>
                    <p className='roles-container fullWidth text-center font-size-sm mb-2 text-uppercase'>{generateLPTokenName(currentPair.token1, currentPair.token2)}</p>
                    <Button
                      variant="contained"
                      onClick={() => { setLocalRoles(); }}
                      className='btn-intense-default hover-btn btn-intense-success2 fullWidth smaller'
                    >
                      Set Roles
                    </Button>
                  </div>
                </StepContent>
              </Step>
              <Step>
                <StepLabel StepIconComponent={(props) => (<ColorlibStepIcon {...props} index={4} />)}>
                  <p className='font-rose text-white font-size-lg ms-1 mb-0 mt-0'>Add Initial Liquidity</p>
                </StepLabel>
                <StepContent>
                  <div className='my-3'>
                    <p className='font-size-sm mt-3 mb-1 ms-2 text-uppercase'>{currentPair.token1}</p>
                    <TextField
                      id="first-token"
                      placeholder='First token amount'
                      type="text"
                      value={firstTokenAmount}
                      autoComplete="off"
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^\d*\.?\d*$/.test(input)) {
                          handleFirstTokenAmount(e);
                        }
                      }}
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                          <Button
                            onClick={handleMaxToken1Amount}
                            sx={{
                              minWidth: 'unset',
                              padding: '0 8px',
                              color: 'white',
                              textTransform: 'none',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              fontFamily: 'Red Rose'
                            }}
                            className='hover:text-[#131313]'
                          >
                            Max
                          </Button>
                        ),
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

                      size="medium"
                      variant="standard"
                      className='mb-0 token-container fullWidth b-r-md'
                      style={{ border: '1px solid rgba(63, 142, 90, 0.1)' }}
                    />
                    <p className='mb-0 mt-1 me-2 font-size-xs text-right text-silver'>Balance: {intlNumberFormat(Number(userTokens[currentPair.token1]?.balance ?? '0'))} <span className='text-uppercase'>{currentPair.token1.split('-')[0]}</span></p>

                    <p className='font-size-sm mb-1 ms-2 text-uppercase'>{currentPair.token2}</p>
                    <TextField
                      id="second-token"
                      placeholder='Second token amount'
                      type="text"
                      value={secondTokenAmount}
                      autoComplete="off"
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^\d*\.?\d*$/.test(input)) {
                          handleSecondTokenAmount(e);
                        }
                      }}
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                          <Button
                            onClick={handleMaxToken2Amount}
                            sx={{
                              minWidth: 'unset',
                              padding: '0 8px',
                              color: 'white',
                              textTransform: 'none',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              fontFamily: 'Red Rose'
                            }}
                            className='hover:text-[#131313]'
                          >
                            Max
                          </Button>
                        ),
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

                      size="medium"
                      variant="standard"
                      className='mb-0 token-container fullWidth b-r-md'
                      style={{ border: '1px solid rgba(63, 142, 90, 0.1)' }}
                    />
                    <p className='mb-0 mt-1 me-2 font-size-xs text-right text-silver'>Balance: {intlNumberFormat(Number(userTokens[currentPair.token2]?.balance ?? '0'))} <span className='text-uppercase'>{currentPair.token2.split('-')[0]}</span></p>

                    <Button
                      variant="contained"
                      onClick={() => { addInitialLiquidity(); }}
                      className='mt-3 btn-intense-default hover-btn btn-intense-success2 fullWidth smaller'
                    >
                      Add Liquidity
                    </Button>
                  </div>
                </StepContent>
              </Step>
              <Step>
                <StepLabel StepIconComponent={(props) => (<ColorlibStepIcon {...props} index={5} />)}>
                  <p className='font-rose text-white font-size-lg ms-1 mb-0 mt-0'>Enable Swap</p>
                </StepLabel>
                <StepContent>
                  <div className='mt-3 mb-3'>
                    <p className='text-center text-intense-green mt-2 font-size-md font-bold mb-2'>Press the button to enable the pool tokens swap</p>
                    <div className='grid-between-center'>
                      <Button
                        variant="contained"
                        onClick={() => { resumePoolSwap(); }}
                        className='btn-intense-default hover-btn btn-intense-success2 smaller b-r-xs fullWidth'
                      >
                        Enable Swap1
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => { resumePoolSwap(); }}
                        className='btn-intense-default hover-btn btn-intense-success2 smaller b-r-xs ms-1 fullWidth'
                      >
                        Enable Swap2
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            </Stepper>
          </div>
        </Col>
      </Row>

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </Container>
  );
}

export default AdminCreatePool;