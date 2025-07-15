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
import { Pair } from 'types/backendTypes';
import { usePoolsRemoveLiquidity } from 'hooks/transactions/usePoolsRemoveLiquidity';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';

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
  userLpTokenBalance: number;
  pair: Pair;
  token1Id: string;
  token2Id: string;
  token1Decimals: number;
  token2Decimals: number;
}

const WithdrawModal: React.FC<WithdrawModal> = ({
  isOpen,
  setIsOpen,
  lpTokenId,
  userLpTokenBalance,
  pair,
  token1Id,
  token2Id,
  token1Decimals,
  token2Decimals
}) => {
  const [amountToWithdraw, setAmountToWithdraw] = useState('')
  const isMobile = useMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isLoggedIn = useGetIsLoggedIn();
  const allTokens = useSelector(selectAllTokensById);

  const handleWithdrawAmounts = () => {
    if (!amountToWithdraw || new BigNumber(amountToWithdraw).isZero()) {
      return { token1Amount: new BigNumber(0), token2Amount: new BigNumber(0) };
    }

    const withdrawAmountBN = new BigNumber(amountToWithdraw);
    if (withdrawAmountBN.gt(userLpTokenBalance)) {
      return { token1Amount: new BigNumber(0), token2Amount: new BigNumber(0) };
    }

    const shareOfPool = withdrawAmountBN.dividedBy(new BigNumber(allTokens[lpTokenId]?.supply));
    const token1AmountToReceive = new BigNumber(pair.token1_reserve).multipliedBy(shareOfPool);
    const token2AmountToReceive = new BigNumber(pair.token2_reserve).multipliedBy(shareOfPool);

    return { token1Amount: token1AmountToReceive, token2Amount: token2AmountToReceive };
  };

  const handleClose = () => {
    setAmountToWithdraw('');
    setIsOpen(false);
  };

  const handleAmountChange = (e: any) => {
    const value = e.target.value;
    setAmountToWithdraw(value);
  };

  const handleMaxAmount = () => {
    setAmountToWithdraw(userLpTokenBalance.toString());
  };

  const handleWithdraw = () => {
    setIsOpen(false);
    setAmountToWithdraw('');
  };

  useEffect(() => {
    if (isOpen && isMobile && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isOpen, isMobile]);


  // add liquidity hook
  const withdrawLiquidity = usePoolsRemoveLiquidity(
    pair.pair_id,
    {
      token_id: token1Id,
      token_decimals: token1Decimals,
      token_amount: Number(handleWithdrawAmounts().token1Amount)
    },
    {
      token_id: token2Id,
      token_decimals: token2Decimals,
      token_amount: Number(handleWithdrawAmounts().token2Amount)
    },
    lpTokenId,
    Number(amountToWithdraw)
  );

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
            value={amountToWithdraw}
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
            <p className='text-white font-size-xs mb-0 me-2 mt-1'><span>{intlNumberFormat(Number(formatSignificantDecimals(Number(userLpTokenBalance), 3)), 0, 20)} {lpTokenId}</span></p>
          </div>
          {isLoggedIn ? (
            <Button
              className="btn-intense-default btn-intense-danger hover-btn smaller fullWidth"
              onClick={() => { withdrawLiquidity(); handleWithdraw(); }}
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