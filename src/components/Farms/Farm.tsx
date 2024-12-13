import { forwardRef, Fragment, useEffect, useState, useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { selectPage, selectPairTokens, selectPairTokensById, selectSearchInput, selectTotalPages, setPage, setSearchInput, selectPairTokensNumber } from 'storeManager/slices/tokensSlice';
import { Token } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { debounce } from 'lodash';
import { debounceSearchTime } from 'config';
import { motion } from "framer-motion";
import { poolBaseTokens } from 'config';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FarmProps {
  title: string;
  cardImage: number;
  subContainerBg: string;
}

const Farm: React.FC<FarmProps> = ({
  title,
  cardImage,
  subContainerBg
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  return (
    <>
      <div className={`farm-container${cardImage}`}>
        <div className={`farm-card`}>

          <div className='d-flex align-items-center justify-content-center'>
            <div>
              <img
                src={poolBaseTokens.token2.image}
                alt={poolBaseTokens.token2.image}
                className='d-inline'
                style={{ width: 45, height: 45, border: '2px solid rgba(63, 172, 90, 0)', borderRadius: '20px' }}
              />              
              <img
                src={poolBaseTokens.token3.image}
                alt={poolBaseTokens.token3.image}
                className='d-inline m-l-n-md'
                style={{ width: 45, height: 45, border: '2px solid rgba(63, 172, 90, 0)', borderRadius: '20px' }}
              />
            </div>
          </div>
          <p className='mb-0 mx-auto text-center font-bold' style={{ fontSize: '25px' }}>USDCEGLD</p>

          <div className='b-r-sm p-2 mt-2' style={{ backgroundColor: subContainerBg }}>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0 font-size-sm'>Total APR</p>
              <p className='mb-0 font-size-md'>58%</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Fees APR</p>
              <p className='mb-0'>34%</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Boosted APR</p>
              <p className='mb-0'>24%</p>
            </div>
          </div>

          <div className='b-r-sm p-2 mt-2' style={{ backgroundColor: subContainerBg }}>
            
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Total Staked</p>
              <p className='mb-0'>$1,888,999.23</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Total Rewards</p>
              <p className='mb-0'>$1,987.29</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Staking Users</p>
              <p className='mb-0'>234</p>
            </div>
          </div>

          <div className='b-r-sm p-2 mt-2' style={{ backgroundColor: subContainerBg }}>            
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Your Stake</p>
              <p className='mb-0'>$1,987.29</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Your Rewards</p>
              <p className='mb-0'>$1,987.29</p>
            </div>
          </div>

          <Button
            variant="contained"
            className='mt-3 btn-intense-default hover-btn btn-intense-info fullWidth xxs'
          >
            Stake
          </Button>
          <Button
            variant="contained"
            className='mt-1 btn-intense-default hover-btn btn-intense-success fullWidth xxs'
          >
            Claim
          </Button>
          <Button
            variant="contained"
            className='mt-1 btn-intense-default hover-btn btn-intense-danger fullWidth xxs'
          >
            Unstake
          </Button>

        </div>
      </div>
    </>
  );
};

export default Farm;