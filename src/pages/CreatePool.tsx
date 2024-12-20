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
import { poolBaseTokens } from 'config';
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
import { CreatedTokens } from 'types/mvxTypes';

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

const CreatePool = () => {
  const { address } = useGetAccountInfo();
  const { getValidationSignature } = useBackendAPI();
  const isMobile = useMobile();
  const [baseTokenId, setBaseTokenId] = useState(poolBaseTokens.token1.id);
  const [baseTokenTicker, setBaseTokenTicker] = useState(poolBaseTokens.token1.ticker);
  const [baseTokenImage, setBaseTokenImage] = useState(poolBaseTokens.token1.image);
  const [secondTokenId, setSecondTokenId] = useState('');
  const [secondTokenTicker, setSecondTokenTicker] = useState('');
  const [secondTokenImage, setSecondTokenImage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [signature, setSignature] = useState('');
  const { getUserCreatedTokens } = useMvxAPI();
  const [createdTokens, setCreatedTokens] = useState<CreatedTokens>({});

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
        break;
      case poolBaseTokens.token2.id:
        setBaseTokenId(poolBaseTokens.token2.id);
        setBaseTokenTicker(poolBaseTokens.token2.ticker);
        setBaseTokenImage(poolBaseTokens.token2.image);
        break;
      case poolBaseTokens.token3.id:
        setBaseTokenId(poolBaseTokens.token3.id);
        setBaseTokenTicker(poolBaseTokens.token3.ticker);
        setBaseTokenImage(poolBaseTokens.token3.image);
        break;
      default:
        setBaseTokenId(poolBaseTokens.token1.id);
        setBaseTokenTicker(poolBaseTokens.token1.ticker);
        setBaseTokenImage(poolBaseTokens.token1.image);
        break;
    }
  };

  const handleSecondTokenChange = (event: SelectChangeEvent) => {
    const selectedTokenId = event.target.value;
    const selectedToken = createdTokens[selectedTokenId];

    if (selectedToken) {
      setSecondTokenId(selectedToken.token_id);
      setSecondTokenTicker(selectedToken.ticker);
      setSecondTokenImage(selectedToken.logo);
      handleValidation(selectedToken.token_id);
    }
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
    setFirstTokenAmount('123.23');
  };

  const handleMaxToken2Amount = () => {
    setSecondTokenAmount('6673.231');
  };

  //get the validation message
  const handleValidation = async (token: string) => {
    const message = await getValidationSignature(token);
    setSignature(message.signature);
  };

  // load the tokens created by the user through the api
  const loadCreatedTokens = async () => {
    if (address) {
      const userTokens = await getUserCreatedTokens(address);
      setCreatedTokens(userTokens);
      const defaultTokenValues = Object.entries(userTokens)[0][1];
      setSecondTokenId(defaultTokenValues.token_id);
      setSecondTokenTicker(defaultTokenValues.ticker);
      setSecondTokenImage(defaultTokenValues.logo);
      handleValidation(defaultTokenValues.token_id);
    }
  };

  useEffect(() => {
    loadCreatedTokens();
  }, [address]);

  // create pair hook
  const createPool = usePoolsCreatePool(baseTokenId, secondTokenId, signature);

  return (
    <Container className='create-pool-page-height font-rose'>
      <Row>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Create Pool</h2>
              <p className='text-white mb-0 text-justified'>Create a pool now and enjoy full benefits</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className={`${isMobile ? 'mt-4' : 'mt-3'} mb-5`}>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className={`create-container text-white`}>
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

                    <p className='font-size-sm mt-3 mb-1 ms-2'>Pool second token</p>
                    <Select
                      id="second_token"
                      value={secondTokenId}
                      onChange={handleSecondTokenChange}
                      input={<OutlinedInput />}
                      size='small'
                      renderValue={() => (
                        <div className='font-size-sm font-regular text-white d-flex align-items-center'>
                          <img
                            src={secondTokenImage}
                            alt={secondTokenId}
                            style={{ width: 18, height: 18, flexShrink: 0 }}
                            className='me-1'
                          />
                          {secondTokenTicker}
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
                      {Object.values(createdTokens).length && (
                        Object.values(createdTokens).map((token: any) => (
                          <MenuItem key={token?.token_id} value={token?.token_id} className={`font-rose select-menu-item font-size-xs`}>
                            <img
                              src={token.logo}
                              alt={token.ticker}
                              style={{ width: 16, height: 16, flexShrink: 0 }}
                              className='me-1'
                            />
                            {token?.ticker}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <p className='mb-0 mt-1 me-2 font-size-xs text-right text-silver'>*Only created tokens by you can be used</p>
                    <div className='d-flex justify-content-between'>
                      <p className='mb-0 mt-1 ms-2 font-size-sm'>Pool Fee</p>
                      <p className='mb-0 mt-1 me-2 font-size-sm text-right'>1%</p>
                    </div>

                    <Button
                      variant="contained"
                      onClick={createPool}
                      className='btn-intense-default hover-btn btn-intense-success mt-2 fullWidth smaller'
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
                      onClick={() => handleStepChange(2)}
                      className='btn-intense-default hover-btn btn-intense-success fullWidth smaller'
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
                    <p className='roles-container fullWidth text-center font-size-sm mb-2'>ELGDPRIZE-a6789</p>
                    <Button
                      variant="contained"
                      onClick={() => handleStepChange(3)}
                      className='btn-intense-default hover-btn btn-intense-success fullWidth smaller'
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
                    <p className='font-size-sm mt-3 mb-1 ms-2'>xEGLD</p>
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
                    <p className='mb-0 mt-1 me-2 font-size-xs text-right text-silver'>Balance: {intlNumberFormat(123.23)} xEGLD</p>

                    <p className='font-size-sm mb-1 ms-2'>XTICKET</p>
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
                    <p className='mb-0 mt-1 me-2 font-size-xs text-right text-silver'>Balance: {intlNumberFormat(6673.231)} XTICKET</p>

                    <Button
                      variant="contained"
                      onClick={() => handleStepChange(0)}
                      className='mt-3 btn-intense-default hover-btn btn-intense-success fullWidth smaller'
                    >
                      Add Liquidity
                    </Button>
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

export default CreatePool;