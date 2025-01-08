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
import { pairsContractAddress, poolBaseTokens } from 'config';
import { useState } from 'react';
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
  const isMobile = useMobile();
  const [baseTokenId, setBaseTokenId] = useState(poolBaseTokens.token1.id);
  const [baseTokenTicker, setBaseTokenTicker] = useState(poolBaseTokens.token1.ticker);
  const [baseTokenImage, setBaseTokenImage] = useState(poolBaseTokens.token1.image);
  const [baseTokenDecimals, setBaseTokenDecimals] = useState(poolBaseTokens.token1.decimals);
  const [secondTokenId, setSecondTokenId] = useState('');
  const [secondTokenTicker, setSecondTokenTicker] = useState('');
  const [secondTokenDecimals, setSecondTokenDecimals] = useState(18);
  const [activeStep, setActiveStep] = useState(0);
  const userTokens = useSelector(selectUserTokens);

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
  const issueLpToken = usePoolsIssueLPToken(pairsContractAddress, baseTokenId.split('-')[0] + secondTokenId.split('-')[0], baseTokenId.split('-')[0] + secondTokenId.split('-')[0]);
  const setLocalRoles = usePoolsSetLocalRoles(pairsContractAddress);
  const addInitialLiquidity = usePoolsAddInitialLiquidity(
    {
      token_id: baseTokenId,
      token_decimals: baseTokenDecimals,
      token_amount: Number(firstTokenAmount)
    },
    {
      token_id: secondTokenId,
      token_decimals: secondTokenDecimals,
      token_amount: Number(secondTokenAmount)
    }
  );

  return (
    <Container className='create-pool-page-height font-rose'>
      <Row>
        <Col xs={12} lg={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Admin</h2>
              <p className='text-white mb-0 text-justified'>Configurations, operations, monitoring</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className={`${isMobile ? 'mt-4' : 'mt-3'} mb-5`}>
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
                    <p className='roles-container fullWidth text-center font-size-sm mb-2 text-uppercase'>{baseTokenId.split('-')[0] + secondTokenId.split('-')[0]}</p>
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
          </div>
        </Col>
      </Row>

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </Container>
  );
}

export default Admin;