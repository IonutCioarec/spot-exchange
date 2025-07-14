import { forwardRef, useEffect, useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, TextField, DialogTitle, IconButton, Button } from '@mui/material';
import { amountToDenominatedAmount, formatNumberWithCommas, formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import CloseIcon from '@mui/icons-material/Close';
import { usePoolsAddLiquidity } from "hooks/transactions/usePoolsAddLiquidity";
import { useBackendAPI } from 'hooks/useBackendAPI';
import { debounce } from 'lodash';
import { debounceSearchTime } from 'config';
import { useSelector } from 'react-redux';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import BigNumber from 'bignumber.js';
import { useGetIsLoggedIn } from 'hooks';
import { Link } from 'react-router-dom';
import { Pair } from 'types/backendTypes';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AddModal {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  token1: string;
  token2: string;
  token1Id: string;
  token2Id: string;
  token1MaxAmount: number;
  token2MaxAmount: number;
  token1Image: string;
  token2Image: string;
  token1ExchangeRate: string;
  token2ExchangeRate: string;
  token1Decimals: number;
  token2Decimals: number;
  pair_address: string;
  pair: Pair;
}

const AddModal: React.FC<AddModal> = ({
  isOpen,
  setIsOpen,
  token1,
  token2,
  token1Id,
  token2Id,
  token1MaxAmount,
  token2MaxAmount,
  token1Image,
  token2Image,
  token1ExchangeRate,
  token2ExchangeRate,
  token1Decimals,
  token2Decimals,
  pair_address,
  pair
}) => {
  const [amountToken1, setAmountToken1] = useState('');
  const [amountToken2, setAmountToken2] = useState('');
  const allTokens = useSelector(selectAllTokensById);
  const isMobile = useMobile();
  const { getSwapPrice, getSwapRawPrice } = useBackendAPI();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isLoggedIn = useGetIsLoggedIn();

  const getRawPrice = async (fromToken: string, toToken: string) => {
    const response = await getSwapRawPrice(fromToken, toToken);
    const price = response ? response.final_price : 0;

    return price;
  };

  const handleClose = () => {
    setIsOpen(false);
    setAmountToken1('');
    setAmountToken2('');
  };

  const handleAmountToken1Change = (input: any) => {
    let value: string;
    if (typeof input === 'string') {
      value = input;
    } else {
      value = input.target.value;
    }
    const rawValue = value.replace(/,/g, '');

    if (rawValue === '' || isNaN(Number(rawValue)) || !rawValue) {
      debouncedToken1Calculation.cancel();
      setAmountToken1('');
      setAmountToken2('');
      return;
    }

    if (parseFloat(rawValue) === 0 && !rawValue.includes('.')) {
      debouncedToken1Calculation.cancel();
      setAmountToken1('0');
      setAmountToken2('0');
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setAmountToken1(formattedValue);

    if (!token1Id || !token2Id) return;
    debouncedToken1Calculation(rawValue);
  };

  const handleAmountToken2Change = (input: any) => {
    let value: string;
    if (typeof input === 'string') {
      value = input;
    } else {
      value = input.target.value;
    }
    const rawValue = value.replace(/,/g, '');

    if (rawValue === '' || isNaN(Number(rawValue)) || !rawValue) {
      debouncedToken2Calculation.cancel();
      setAmountToken1('');
      setAmountToken2('');

      return;
    }

    if (parseFloat(rawValue) === 0 && !rawValue.includes('.')) {
      debouncedToken2Calculation.cancel();
      setAmountToken1('0');
      setAmountToken2('0');
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setAmountToken2(formattedValue);

    if (!token1Id || !token2Id) return;
    debouncedToken2Calculation(rawValue);
  };

  // Define the debounced functions
  const debouncedToken1Calculation = useCallback(
    debounce(async (value: string) => {
      if (!token1Id || !token2Id) return;

      const ration = new BigNumber(pair.token2_reserve).dividedBy(new BigNumber(pair.token1_reserve));
      const amount = new BigNumber(ration).multipliedBy(Number(value));

      setAmountToken2(intlNumberFormat(parseFloat(formatSignificantDecimals(Number(amount), 3)), 0, 20));
    }, debounceSearchTime),
    [token1Id, token2Id]
  );

  const debouncedToken2Calculation = useCallback(
    debounce(async (value: string) => {
      if (!token1Id || !token2Id) return;

      const ration = new BigNumber(pair.token1_reserve).dividedBy(new BigNumber(pair.token2_reserve));
      const amount = new BigNumber(ration).multipliedBy(Number(value));

      setAmountToken1(intlNumberFormat(parseFloat(formatSignificantDecimals(Number(amount), 3)), 0, 20));
    }, debounceSearchTime),
    [token1Id, token2Id]
  );

  const handleMaxToken1Amount = () => {
    handleAmountToken1Change(token1MaxAmount.toString());
  };
  const handleMaxToken2Amount = () => {
    handleAmountToken2Change(token2MaxAmount.toString());
  };

  const handleAdd = () => {
    setIsOpen(false);
    setAmountToken1('');
    setAmountToken2('');
  };

  // add liquidity hook
  const addLiquidity = usePoolsAddLiquidity(
    pair_address,
    {
      token_id: token1Id,
      token_decimals: token1Decimals,
      token_amount: parseFloat(amountToken1)
    },
    {
      token_id: token2Id,
      token_decimals: token2Decimals,
      token_amount: parseFloat(amountToken2)
    },
  );

  useEffect(() => {
    if (isOpen && isMobile && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isOpen, isMobile]);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={(e, reason) => {
          if (reason !== 'backdropClick') handleClose();
        }}
        style={{ borderRadius: '10px' }}
        TransitionComponent={Transition}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'rgba(20, 20, 20, 0.9)',
            borderRadius: '10px',
            minHeight: '100px',
            zIndex: 1300,
            display: 'flex',
          },
        }}
      >
        <DialogTitle id="scroll-dialog-title">
          <div className='d-flex justify-content-between font-rose align-items-center'>
            <p className='text-white mx-auto mb-0'>Add Liquidity</p>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              className='text-right text-white close-button'
              sx={{ borderRadius: '20px !important' }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex justify-content-start align-items-center'>
              <p className={`text-silver ${isMobile ? 'font-size-xs' : 'font-size-md'} mb-0 ms-2`}>First token:</p>
              <p className={`text-white ${isMobile ? 'font-size-xs' : 'font-size-md'} mb-0 ms-2`}>
                {token1}
              </p>
              <img
                src={token1Image}
                alt={token1}
                style={{ width: isMobile ? 15 : 20, height: isMobile ? 15 : 20 }}
                className='ms-1 m-t-n-xxs'
              />
            </div>
            <p className='text-silver font-size-xs mb-0 me-2'>Balance: <span className='text-white'>{intlNumberFormat(Number(formatSignificantDecimals(Number(token1MaxAmount), 3)), 0, 20)}</span></p>
          </div>
          <TextField
            type='text'
            placeholder='First token amount'
            fullWidth
            size='small'
            variant='outlined'
            value={amountToken1}
            autoComplete="off"
            onChange={handleAmountToken1Change}
            className='withdraw-input'
            InputProps={{
              endAdornment: (
                <Button
                  onClick={handleMaxToken1Amount}
                  sx={{
                    minWidth: 'unset',
                    padding: '0 8px',
                    color: '#3fac5a',
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Red Rose'
                  }}
                >
                  Max
                </Button>
              ),
              style: { color: 'silver', fontFamily: 'Red Rose' },
            }}
            InputLabelProps={{
              style: { color: 'silver', fontFamily: 'Red Rose' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'silver',
                  borderRadius: '15px',
                  color: 'silver',
                  fontSize: '12px'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(63, 172, 90, 0.6)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(63, 172, 90, 0.6)',
                },
                fontFamily: 'Red Rose',
                fontSize: '12px',
                height: '30px'
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

          <div className='d-flex justify-content-between align-items-center mt-2'>
            <div className='d-flex justify-content-start align-items-center'>
              <p className={`text-silver ${isMobile ? 'font-size-xs' : 'font-size-md'} mb-0 ms-2`}>Second token:</p>
              <p className={`text-white ${isMobile ? 'font-size-xs' : 'font-size-md'} mb-0 ms-2`}>
                {token2}
              </p>
              <img
                src={token2Image}
                alt={token2}
                style={{ width: isMobile ? 15 : 20, height: isMobile ? 15 : 20 }}
                className='ms-1 m-t-n-xxs'
              />
            </div>
            <p className='text-silver font-size-xs mb-0 me-2'>Balance: <span className='text-white'>{intlNumberFormat(Number(formatSignificantDecimals(Number(token2MaxAmount), 3)), 0, 20)}</span></p>
          </div>
          <TextField
            type='text'
            placeholder='Second token amount'
            fullWidth
            size='small'
            variant='outlined'
            value={amountToken2}
            autoComplete="off"
            onChange={handleAmountToken2Change}
            className='withdraw-input'
            ref={inputRef}
            InputProps={{
              endAdornment: (
                <Button
                  onClick={handleMaxToken2Amount}
                  sx={{
                    minWidth: 'unset',
                    padding: '0 8px',
                    color: '#3fac5a',
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Red Rose'
                  }}
                >
                  Max
                </Button>
              ),
              style: { color: 'silver', fontFamily: 'Red Rose' },
            }}
            InputLabelProps={{
              style: { color: 'silver', fontFamily: 'Red Rose' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'silver',
                  borderRadius: '15px',
                  color: 'silver',
                  fontSize: '12px'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(63, 172, 90, 0.6)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(63, 172, 90, 0.6)',
                },
                fontFamily: 'Red Rose',
                fontSize: '12px',
                height: '30px'
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
          <div className='d-flex justify-content-between mt-2'>
            <p className='px-2 font-size-xs text-silver mb-0'>Rate: </p>
            <div>
              <p className={`px-2 ${isMobile ? 'font-size-xxs' : 'font-size-xs'} mb-0 text-white`}>1 {token1} ≃ {intlNumberFormat(Number(formatSignificantDecimals(Number(token1ExchangeRate), 3)), 0, 20)} {token2}</p>
              <p className={`px-2 ${isMobile ? 'font-size-xxs' : 'font-size-xs'} mb-0 text-white`}>1 {token2} ≃ {intlNumberFormat(Number(formatSignificantDecimals(Number(token2ExchangeRate), 3)), 0, 20)} {token1}</p>
            </div>
          </div>


          {isLoggedIn ? (
            <Button
              className="btn-intense-default hover-btn btn-intense-success2 mt-2 smaller fullWidth mt-3"
              onClick={() => { addLiquidity(); handleAdd(); }}
              sx={{ minWidth: isMobile ? '100px' : '120px', height: '30px' }}
            >
              Add
            </Button>
          ) : (
            <Button
              className="btn-intense-default hover-btn btn-intense-success2 mt-2 smaller fullWidth mt-3"
              sx={{ minWidth: isMobile ? '100px' : '120px', height: '30px' }}
              component={Link}
              to="/unlock"
            >
              Connect Wallet
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddModal;