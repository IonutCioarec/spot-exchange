import { forwardRef, useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, TextField, DialogTitle, IconButton, Button } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface WithdrawModal {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  token1: string;
  token2: string;
  token1MaxAmount: number;
  token2MaxAmount: number;
  token1Image: string;
  token2Image: string;
  token1ExchangeRate: string;
  token2ExchangeRate: string;
}

const AddModal: React.FC<WithdrawModal> = ({
  isOpen,
  setIsOpen,
  token1,
  token2,
  token1MaxAmount,
  token2MaxAmount,
  token1Image,
  token2Image,
  token1ExchangeRate,
  token2ExchangeRate,
}) => {
  const [amountToken1, setAmountToken1] = useState('');
  const [amountToken2, setAmountToken2] = useState('');
  const isMobile = useMobile();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAmountToken1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      setAmountToken1('');
      return;
    }

    setAmountToken1((value));
  };
  const handleAmountToken2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      setAmountToken2('');
      return;
    }

    setAmountToken2(value);
  };

  const handleMaxToken1Amount = () => {
    setAmountToken1(token1MaxAmount.toString());
  };
  const handleMaxToken2Amount = () => {
    setAmountToken2(token1MaxAmount.toString());
  };

  const handleAdd = () => {
    setIsOpen(false);
    setAmountToken1('');
    setAmountToken2('');
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        style={{ borderRadius: '10px' }}
        TransitionComponent={Transition}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          style: { backgroundColor: 'rgba(20, 20, 20, 0.9)', borderRadius: '10px', minHeight: '100px', zIndex: 1300 },
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
            autoFocus
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
            autoFocus
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
            <p className='px-2 font-size-xs text-silver mb-0'>Tokens rate: </p>
            <div>
              <p className={`px-2 ${isMobile ? 'font-size-xxs' : 'font-size-xs'} mb-0 text-white`}>1 {token1} ≃ {intlNumberFormat(Number(formatSignificantDecimals(Number(token1ExchangeRate), 3)), 0, 20)} {token2}</p>
              <p className={`px-2 ${isMobile ? 'font-size-xxs' : 'font-size-xs'} mb-0 text-white`}>1 {token2} ≃ {intlNumberFormat(Number(formatSignificantDecimals(Number(token2ExchangeRate), 3)), 0, 20)} {token1}</p>
            </div>
          </div>


          <Button
            className="btn-intense-green hover-btn fullWidth mt-3"
            onClick={handleAdd}
            sx={{ minWidth: isMobile ? '100px' : '120px', height: '30px' }}
          >
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddModal;