import { useState } from 'react';
import { formatNumberWithCommas, intlNumberFormat } from 'utils/formatters';
import { useMobile, useTablet } from 'utils/responsive';
import { Button, FormControlLabel, styled, Switch, TextField } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import { useGetIsLoggedIn } from 'hooks';
import { Link } from 'react-router-dom';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-switchBase': {
    transitionDuration: '300ms',
    '&.Mui-checked': {
      color: '#3FAC5A',
      '& + .MuiSwitch-track': {
        backgroundColor: 'transparent',
        border: '1px solid #3FAC5A',
      },
      '& + .MuiSwitch-thumb': {
        backgroundColor: '#3FAC5A',
      },
    },
    '&.Mui-disabled': {
      color: 'silver',
      '& + .MuiSwitch-track': {
        backgroundColor: 'transparent',
        border: '1px solid silver',
      },
      '& + .MuiSwitch-thumb': {
        backgroundColor: 'silver',
      },
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 10,
    backgroundColor: 'transparent',
    border: '1px solid #3FAC5A',
    height: 18,
    width: 38,
    margin: 'auto',
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 14,
    height: 14,
    margin: 3,
    transition: 'all 300ms ease'
  },
}));

const CreateToken = () => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const isLoggedIn = useGetIsLoggedIn();

  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);

    if (!newName) {
      setNameError('Required');
    } else if (newName.length < 3 || newName.length > 50) {
      setNameError('Must be between 3 - 50 characters long');
    } else if (!/^[a-zA-Z0-9]*$/.test(newName)) {
      setNameError('Alphanumeric characters only');
    } else {
      setNameError('');
    }
  };

  const [ticker, setTicker] = useState<string>('');
  const [tickerError, setTickerError] = useState<string | null>(null);
  const handleTickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const value = rawValue.toUpperCase();
    setTicker(value);

    if (!value) {
      setTickerError('Required');
    } else if (value.length < 3 || value.length > 10) {
      setTickerError('Must be between 3 - 10 characters long');
    } else if (!/^[A-Z0-9]*$/.test(value)) {
      setTickerError('Alphanumeric uppercase characters only');
    } else {
      setTickerError('');
    }
  };

  const [amount, setAmount] = useState<string>('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const handleAmountChange = (input: any) => {
    let value: string;
    if (typeof input === 'string') {
      value = input;
    } else {
      value = input.target.value;
    }
    const rawValue = value.replace(/,/g, '');

    if (rawValue === '') {
      setAmount('');
      setAmountError('Required');
    } else {
      setAmountError('');
    }

    if (isNaN(Number(rawValue)) || !rawValue) {
      return;
    }
    setAmount(intlNumberFormat(parseFloat(rawValue), 0, 20));
  };

  const [decimals, setDecimals] = useState<string>('18');
  const [decimalsError, setDecimalsError] = useState<string | null>(null);
  const handleDecimalsChange = (input: any) => {
    let value: string;
    if (typeof input === 'string') {
      value = input;
    } else {
      value = input.target.value;
    }

    if (!value || value === '') {
      setDecimalsError('Required');
    } else if (Number(value) < 0 || Number(value) > 18) {
      setDecimalsError('Must be between 0 - 18');
    } else if (!/^[0-9]*$/.test(value)) {
      setDecimalsError('Invalid value');
    }else {
      setDecimalsError('');
    }

    setDecimals(value);
  };

  const [freezable, setFreezable] = useState<boolean>(false);
  const handleFreezableToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFreezable(event.target.checked);
  };

  const [wipeable, setWipeable] = useState<boolean>(false);
  const handleWipeableToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setWipeable(event.target.checked);
  };

  const [pauseable, setPauseable] = useState<boolean>(false);
  const handlePauseableToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPauseable(event.target.checked);
  };

  const [upgradeable, setUpgradeable] = useState<boolean>(true);
  const handleUpgradeableToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpgradeable(event.target.checked);
  };

  const [changeable, setChangeable] = useState<boolean>(false);
  const handleChangeableToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeable(event.target.checked);
  };

  const [specialRoles, setSpecialRoles] = useState<boolean>(true);
  const handleSpecialRolesToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialRoles(event.target.checked);
  };

  return (
    <div>
      <div className='create-token-container mt-3'>
        <p className='h5 mt-1 mb-0 text-white text-center mb-3'>Issue Token</p>
        <p className='small ms-1 mb-0 text-silver required'>Name</p>
        <TextField
          type='text'
          fullWidth
          size='small'
          variant='outlined'
          value={name}
          autoComplete="off"
          onChange={handleNameChange}
          error={!!nameError}
          helperText={
            nameError ? (
              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                {nameError}
              </span>
            ) : null
          }
          className='mt-1'
          InputProps={{
            style: { color: 'silver', fontFamily: 'Red Rose' },
          }}
          InputLabelProps={{
            style: { color: 'silver', fontFamily: 'Red Rose' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
                background: 'rgba(18, 18, 18, 0.3)',
                borderRadius: '5px',
                color: 'silver',
                fontSize: '14px',
              },
              '&:hover fieldset': {
                borderColor: nameError ? '#d32f2f' : '#3FAC5A',
              },
              '&.Mui-focused fieldset': {
                borderColor: nameError ? '#d32f2f' : '#3FAC5A',
              },
              fontFamily: 'Red Rose',
              fontSize: '14px',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              appearance: 'none',
            },
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
        />

        <p className='small mt-4 mb-0 text-silver ms-1'>Ticker</p>
        <TextField
          type='text'
          fullWidth
          size='small'
          variant='outlined'
          value={ticker}
          autoComplete="off"
          onChange={handleTickerChange}
          error={!!tickerError}
          helperText={
            tickerError ? (
              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                {tickerError}
              </span>
            ) : null
          }
          className='mt-1'
          InputProps={{
            style: { color: 'silver', fontFamily: 'Red Rose' },
          }}
          InputLabelProps={{
            style: { color: 'silver', fontFamily: 'Red Rose' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
                background: 'rgba(18, 18, 18, 0.3)',
                borderRadius: '5px',
                color: 'silver',
                fontSize: '14px',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
              fontFamily: 'Red Rose',
              fontSize: '14px',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              appearance: 'none',
            },
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
        />

        <p className='small mt-4 mb-0 text-silver ms-1'>Mint Amount</p>
        <TextField
          type='text'
          fullWidth
          size='small'
          variant='outlined'
          value={amount}
          autoComplete="off"
          onChange={handleAmountChange}
          error={!!amountError}
          helperText={
            amountError ? (
              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                {amountError}
              </span>
            ) : null
          }
          className='mt-1'
          InputProps={{
            style: { color: 'silver', fontFamily: 'Red Rose' },
          }}
          InputLabelProps={{
            style: { color: 'silver', fontFamily: 'Red Rose' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
                background: 'rgba(18, 18, 18, 0.3)',
                borderRadius: '5px',
                color: 'silver',
                fontSize: '14px',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
              fontFamily: 'Red Rose',
              fontSize: '14px',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              appearance: 'none',
            },
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
        />

        <p className='small mt-4 mb-0 text-silver ms-1'>Decimals</p>
        <TextField
          type='text'
          fullWidth
          size='small'
          variant='outlined'
          value={decimals}
          autoComplete="off"
          onChange={handleDecimalsChange}
          error={!!decimalsError}
          helperText={
            decimalsError ? (
              <span style={{ fontFamily: 'Red Rose', marginLeft: '-10px' }}>
                {decimalsError}
              </span>
            ) : null
          }
          className='mt-1'
          InputProps={{
            style: { color: 'silver', fontFamily: 'Red Rose' },
          }}
          InputLabelProps={{
            style: { color: 'silver', fontFamily: 'Red Rose' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
                background: 'rgba(18, 18, 18, 0.3)',
                borderRadius: '5px',
                color: 'silver',
                fontSize: '14px',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
              fontFamily: 'Red Rose',
              fontSize: '14px',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              appearance: 'none',
            },
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
        />

        <Row className='mt-4'>
          <Col xs={12} lg={6}>
            <div className={`d-flex justify-content-between align-items-center ${isMobile ? '' : 'mx-3'}`}>
              <p className={`font-size-sm mb-0 ${freezable ? 'text-[#3FAC5A]' : 'text-silver'}`}>Freezable</p>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={freezable}
                    onChange={handleFreezableToggle}
                  />
                }
                label={false}
                style={{ marginRight: '0' }}
              />
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <div className={`d-flex justify-content-between align-items-center ${isMobile ? '' : 'mx-3'}`}>
              <p className={`font-size-sm mb-0 ${wipeable ? 'text-[#3FAC5A]' : 'text-silver'}`}>Wipeable</p>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={wipeable}
                    onChange={handleWipeableToggle}
                  />
                }
                label={false}
                style={{ marginRight: '0' }}
              />
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <div className={`d-flex justify-content-between align-items-center ${isMobile ? '' : 'mx-3'}`}>
              <p className={`font-size-sm mb-0 ${pauseable ? 'text-[#3FAC5A]' : 'text-silver'}`}>Pauseable</p>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={pauseable}
                    onChange={handlePauseableToggle}
                  />
                }
                label={false}
                style={{ marginRight: '0' }}
              />
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <div className={`d-flex justify-content-between align-items-center ${isMobile ? '' : 'mx-3'}`}>
              <p className={`font-size-sm mb-0 ${upgradeable ? 'text-[#3FAC5A]' : 'text-silver'}`}>Upgradeable</p>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={upgradeable}
                    onChange={handleUpgradeableToggle}
                  />
                }
                label={false}
                style={{ marginRight: '0' }}
              />
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <div className={`d-flex justify-content-between align-items-center ${isMobile ? '' : 'mx-3'}`}>
              <p className={`font-size-sm mb-0 ${changeable ? 'text-[#3FAC5A]' : 'text-silver'}`}>Changeable Owner</p>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={changeable}
                    onChange={handleChangeableToggle}
                  />
                }
                label={false}
                style={{ marginRight: '0' }}
              />
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <div className={`d-flex justify-content-between align-items-center ${isMobile ? '' : 'mx-3'}`}>
              <p className={`font-size-sm mb-0 ${specialRoles ? 'text-[#3FAC5A]' : 'text-silver'}`}>Can Add Special Roles</p>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={specialRoles}
                    onChange={handleSpecialRolesToggle}
                  />
                }
                label={false}
                style={{ marginRight: '0' }}
              />
            </div>
          </Col>
        </Row>

        {isLoggedIn ? (
          <Button
            className="btn-intense-default b-r-xs hover-btn btn-intense-success2 mt-4 fullWidth"
            sx={{ height: '30px' }}
          >
            Issue Token
          </Button>
        ) : (
          <Button
            className="btn-intense-default b-r-xs hover-btn btn-intense-success2 mt-4 fullWidth"
            sx={{ height: '30px' }}
            component={Link}
            to="/unlock"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateToken;