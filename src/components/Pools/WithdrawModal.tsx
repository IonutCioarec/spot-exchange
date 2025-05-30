import { forwardRef, Fragment, useEffect, useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, DialogTitle, Divider, IconButton, Button } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { KeyboardArrowDown, Search, ArrowDropDown } from '@mui/icons-material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import SimpleLoader from 'components/SimpleLoader';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import CloseIcon from '@mui/icons-material/Close';
import { useGetIsLoggedIn } from 'hooks';
import { Link } from 'react-router-dom';

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
  lpTokenId: string;
  lpTokenMaxAmount: number;
}

const WithdrawModal: React.FC<WithdrawModal> = ({
  isOpen,
  setIsOpen,
  lpTokenId,
  lpTokenMaxAmount
}) => {
  const [amount, setAmount] = useState('');
  const isMobile = useMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isLoggedIn = useGetIsLoggedIn();

  const handleClose = () => {
    setAmount('');
    setIsOpen(false);
  };

  const handleAmountChange = (e: any) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handleMaxAmount = () => {
    setAmount(lpTokenMaxAmount.toString());
  };

  const handleWithdraw = () => {
    setIsOpen(false);
    setAmount('');
  };

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
          if (reason !== 'backdropClick') handleClose(); // Prevent accidental close
        }}
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
            <p className='text-white mx-auto mb-0'>Remove Liquidity</p>
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
          <TextField
            type='text'
            placeholder='Token amount'
            fullWidth
            size='small'
            variant='outlined'
            value={amount}
            autoComplete="off"
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d*\.?\d*$/.test(input)) {
                handleAmountChange(e);
              }
            }}
            ref={inputRef}
            className='withdraw-input'
            InputProps={{
              endAdornment: (
                <Button
                  onClick={handleMaxAmount}
                  sx={{
                    minWidth: 'unset',
                    padding: '0 8px',
                    color: '#f47272',
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
                  borderColor: 'rgba(244, 114, 114, 0.7)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(244, 114, 114, 0.7)',
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
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <p className='text-white font-size-xs mb-0 ms-2 mt-1'>Balance:</p>
            <p className='text-white font-size-xs mb-0 me-2 mt-1'><span>{intlNumberFormat(Number(formatSignificantDecimals(Number(lpTokenMaxAmount), 3)), 0, 20)} {lpTokenId}</span></p>
          </div>
          {isLoggedIn ? (
            <Button
              className="btn-intense-default btn-intense-danger hover-btn smaller fullWidth"
              onClick={handleWithdraw}
              sx={{ minWidth: isMobile ? '100px' : '120px', height: '30px' }}
            >
              Remove
            </Button>
          ) : (
            <Button
              className="btn-intense-default btn-intense-danger hover-btn smaller fullWidth"
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

export default WithdrawModal;