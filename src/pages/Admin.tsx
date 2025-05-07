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
import { useNavigate } from 'react-router-dom';

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
  const [baseTokenId, setBaseTokenId] = useState(poolBaseTokens.token1.id);
  const [baseTokenTicker, setBaseTokenTicker] = useState(poolBaseTokens.token1.ticker);
  const [baseTokenImage, setBaseTokenImage] = useState(poolBaseTokens.token1.image);
  const [baseTokenDecimals, setBaseTokenDecimals] = useState(poolBaseTokens.token1.decimals);
  const [secondTokenId, setSecondTokenId] = useState('');
  const [secondTokenTicker, setSecondTokenTicker] = useState('');
  const [secondTokenDecimals, setSecondTokenDecimals] = useState(18);
  const [activeStep, setActiveStep] = useState(0);
  const userTokens = useSelector(selectUserTokens);
  const navigate = useNavigate();

  //Redirect the user to the home page if he is not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

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
    setFirstTokenAmount(userTokens[baseTokenId]?.balance ?? '0');
  };

  const handleMaxToken2Amount = () => {
    setSecondTokenAmount(userTokens[secondTokenId]?.balance ?? '0');
  };

  // create pair hook (for all steps)
  const createPool = usePoolsAdminCreatePool(baseTokenId, secondTokenId);
  const issueLpToken = usePoolsIssueLPToken('erd1qqqqqqqqqqqqqpgqc3y7nvyfhq4cfpq89aq6tp3uelcyafs4v2vstxwtz8', generateLPTokenName('LEGLD-e8378b', 'SPOT-ec8f71'), generateLPTokenName('LEGLD-e8378b', 'SPOT-ec8f71'));
  const setLocalRoles = usePoolsSetLocalRoles('erd1qqqqqqqqqqqqqpgqc3y7nvyfhq4cfpq89aq6tp3uelcyafs4v2vstxwtz8');
  // const addInitialLiquidity = usePoolsAddInitialLiquidity(
  //   {
  //     token_id: baseTokenId,
  //     token_decimals: baseTokenDecimals,
  //     token_amount: Number(firstTokenAmount)
  //   },
  //   {
  //     token_id: secondTokenId,
  //     token_decimals: secondTokenDecimals,
  //     token_amount: Number(secondTokenAmount)
  //   }
  // );

  const addInitialLiquidity = usePoolsAddInitialLiquidity(
    'erd1qqqqqqqqqqqqqpgqc3y7nvyfhq4cfpq89aq6tp3uelcyafs4v2vstxwtz8',
    {
      token_id: 'LEGLD-e8378b',
      token_decimals: 18,
      token_amount: 0.01
    },
    {
      token_id: 'SPOT-ec8f71',
      token_decimals: 18,
      token_amount: 10000
    }
  );
  const resumePoolSwap = useRouterResume('erd1qqqqqqqqqqqqqpgqc3y7nvyfhq4cfpq89aq6tp3uelcyafs4v2vstxwtz8');
  const resumePoolSwap2 = usePoolsResume('erd1qqqqqqqqqqqqqpgq9hsk0d9d8dze228ljpt3wm69tv7ad4cjv2vswpgv9e');

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
            <div className='d-flex justify-content-end'>
              <Button className='cursor-pointer mx-1 font-size-xxs btn-intense-default hover-btn btn-intense-success2 xxs b-r-xs' variant='contained' size='small' onClick={() => handleStepChange(0)}> Step 1 </Button>
              <Button className='cursor-pointer mx-1 font-size-xxs btn-intense-default hover-btn btn-intense-success2 xxs b-r-xs' variant='contained' size='small' onClick={() => handleStepChange(1)}> Step 2 </Button>
              <Button className='cursor-pointer mx-1 font-size-xxs btn-intense-default hover-btn btn-intense-success2 xxs b-r-xs' variant='contained' size='small' onClick={() => handleStepChange(2)}> Step 3 </Button>
              <Button className='cursor-pointer mx-1 font-size-xxs btn-intense-default hover-btn btn-intense-success2 xxs b-r-xs' variant='contained' size='small' onClick={() => handleStepChange(3)}> Step 4 </Button>
            </div>
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
                      onClick={createPool}
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
                      onClick={issueLpToken}
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
                    <p className='roles-container fullWidth text-center font-size-sm mb-2 text-uppercase'>{generateLPTokenName('LEGLD-e8378b', 'SPOT-ec8f71')}</p>
                    <Button
                      variant="contained"
                      onClick={setLocalRoles}
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
                    <p className='font-size-sm mt-3 mb-1 ms-2 text-uppercase'>{baseTokenId.split('-')[0]}</p>
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
                    <p className='mb-0 mt-1 me-2 font-size-xs text-right text-silver'>Balance: {intlNumberFormat(Number(userTokens[baseTokenId]?.balance ?? '0'))} <span className='text-uppercase'>{baseTokenTicker}</span></p>

                    <p className='font-size-sm mb-1 ms-2 text-uppercase'>{secondTokenId.split('-')[0]}</p>
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
                    <p className='mb-0 mt-1 me-2 font-size-xs text-right text-silver'>Balance: {intlNumberFormat(Number(userTokens[secondTokenId]?.balance ?? '0'))} <span className='text-uppercase'>{secondTokenId.split('-')[0]}</span></p>

                    <Button
                      variant="contained"
                      onClick={addInitialLiquidity}
                      className='mt-3 btn-intense-default hover-btn btn-intense-success2 fullWidth smaller'
                    >
                      Add Liquidity
                    </Button>
                  </div>
                </StepContent>
              </Step>
            </Stepper>

            <div className="mt-3" style={{ borderTop: '2px solid rgba(255, 255, 255, 0.5)' }}>
              <Button
                className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3'
                variant='contained'
                size='small'
                onClick={() => resumePoolSwap()}
              >
                Enable Admin SWAP
              </Button>
              <Button
                className='cursor-pointer mb-0 font-size- btn-intense-default hover-btn btn-intense-success2 smaller sm b-r-xs mt-3 ms-2'
                variant='contained'
                size='small'
                onClick={() => resumePoolSwap2()}
              >
                Enable SWAP 2
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </Container>
  );
}

export default Admin;