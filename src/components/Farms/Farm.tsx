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
import { intlFormatSignificantDecimals } from 'utils/formatters';
import UnstakeModal from './UnstakeModal';
import StakeModal from './StakeModal';
import DisplayModal from './DisplayModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import CustomTooltip from 'components/CustomTooltip';

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
  imageToken1: string;
  imageToken2: string;
  totalAPR: number;
  feesAPR: number;
  boostedAPR: number;
  totalStaked: number;
  totalRewards: number;
  stakingUsers: string;
  userStake: number;
  userRewards: number;
  lpTokenId: string;
  userLpTokenBalance: number;
}

const Farm: React.FC<FarmProps> = ({
  title,
  cardImage,
  subContainerBg,
  imageToken1,
  imageToken2,
  totalAPR,
  feesAPR,
  boostedAPR,
  totalStaked,
  totalRewards,
  stakingUsers,
  userStake,
  userRewards,
  lpTokenId,
  userLpTokenBalance
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false);
  const handleUnstakeOpen = () => {
    setIsUnstakeOpen(true);
  }

  const [isStakeOpen, setIsStakeOpen] = useState(false);
  const handleStakeOpen = () => {
    setIsStakeOpen(true);
  }

  const [isAPRModalOpen, setIsAPRModalOpen] = useState(false);
  const handleAPRModal = () => {
    setIsAPRModalOpen(true);
  }
  const aprModalContent =
    <div className='font-rose text-white font-size-sm'>
      <p className='mb-0'><span className='text-intense-green'>Total APR</span>: dex_token + boosted token</p>
      <p className='mb-0'><span className='text-intense-green'>Fees APR</span>: you receive dex_token or 0.4% of the lp fees</p>
      <p className='mb-0'><span className='text-intense-green'>Boosted APR</span>: the reward token is XPRIZE (1,000.34 left) </p>
    </div>;

  const [isTotalsModalOpen, setIsTotalsModalOpen] = useState(false);
  const handleTotalsModal = () => {
    setIsTotalsModalOpen(true);
  }
  const totalsModalContent =
    <div className='font-rose text-white font-size-sm'>
      <div className='d-flex align-items-center justify-content-between'>
        <p className='mb-0'>Total Staked Amount</p>
        <p className='mb-0'>100,234.87 PRIZEEGLD</p>
      </div>
      <div className='d-flex align-items-center justify-content-between'>
        <p className='mb-0'>Total Rewards Amount</p>
        <p className='mb-0'>100,234.87 XPRIZE</p>
      </div>
    </div>;

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const handleUserModal = () => {
    setIsUserModalOpen(true);
  }
  const userModalContent =
    <div className='font-rose text-white font-size-sm'>
      <div className='d-flex align-items-center justify-content-between'>
        <p className='mb-0'>Your Staked Amount</p>
        <p className='mb-0'>10,234.87 PRIZEEGLD</p>
      </div>
      <hr className='my-1' style={{opacity: '0.3'}}/>
      <div className='d-flex justify-content-between'>
        <p className='mb-0'>Your Rewards</p>
        <div className='text-right text-intense-green'>
          <p className='mb-0'>100,234.87 XPRIZE</p>
          <p className='mb-0'>20,234.87 XRRDS</p>
          <p className='mb-0'>1,234.87 ASFT</p>
        </div>
      </div>
    </div>;

  return (
    <>
      <div className={`farm-container${cardImage}`}>
        <div className={`farm-card`}>

          <div className='d-flex align-items-center justify-content-center'>
            <div>
              <img
                src={imageToken1}
                alt={imageToken1}
                className='d-inline'
                style={{ width: isMobile ? 40 : 45, height: isMobile ? 40 : 45, border: '2px solid rgba(63, 172, 90, 0)', borderRadius: '20px' }}
              />
              <img
                src={imageToken2}
                alt={imageToken2}
                className='d-inline m-l-n-md'
                style={{ width: isMobile ? 40 : 45, height: isMobile ? 40 : 45, border: '2px solid rgba(63, 172, 90, 0)', borderRadius: '20px' }}
              />
            </div>
          </div>
          <p className='mb-0 mx-auto text-center font-bold' style={{ fontSize: isMobile ? '20px' : '25px' }}>{title}</p>

          <div className='b-r-sm p-2 mt-2' style={{ backgroundColor: subContainerBg }}>
            <div className='d-flex justify-content-end align-items-center'>
              <CustomTooltip key="aprModal" title={`Press to view details about the farm APR`} placement='bottom-end'>
                <FontAwesomeIcon icon={faCircleInfo} className="ms-1 mb-1 cursor-pointer" onClick={handleAPRModal} />
              </CustomTooltip>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0 font-size-sm'>Total APR</p>
              <p className='mb-0 font-size-md'>{intlFormatSignificantDecimals(totalAPR, 2)}%</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Fees APR</p>
              <p className='mb-0'>{intlFormatSignificantDecimals(feesAPR, 2)}%</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Boosted APR</p>
              <p className='mb-0'>{intlFormatSignificantDecimals(boostedAPR, 2)}%</p>
            </div>
          </div>

          <div className='b-r-sm p-2 mt-2' style={{ backgroundColor: subContainerBg }}>
            <div className='d-flex justify-content-end align-items-center'>
              <CustomTooltip key="totalsModal" title={`Press to view details about the farm totals`} placement='bottom-end'>
                <FontAwesomeIcon icon={faCircleInfo} className="ms-1 mb-1 cursor-pointer" onClick={handleTotalsModal} />
              </CustomTooltip>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Total Staked</p>
              <p className='mb-0'>${intlFormatSignificantDecimals(totalStaked, 2)}</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Total Rewards</p>
              <p className='mb-0'>${intlFormatSignificantDecimals(totalRewards, 2)}</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Staking Users</p>
              <p className='mb-0'>{stakingUsers}</p>
            </div>
          </div>

          <div className='b-r-sm p-2 mt-2' style={{ backgroundColor: subContainerBg }}>
            <div className='d-flex justify-content-end align-items-center'>
              <CustomTooltip key="userModal" title={`Press to view details about the user farming details`} placement='bottom-end'>
                <FontAwesomeIcon icon={faCircleInfo} className="ms-1 mb-1 cursor-pointer" onClick={handleUserModal} />
              </CustomTooltip>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Your Stake</p>
              <p className='mb-0'>${intlFormatSignificantDecimals(userStake, 2)}</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0'>Your Rewards</p>
              <p className='mb-0'>${intlFormatSignificantDecimals(userRewards, 2)}</p>
            </div>
          </div>

          <div className='d-flex justify-content-between align-items-center mt-2 gap-1 mb-2'>
            <Button
              variant="contained"
              className='mt-1 btn-intense-default hover-btn btn-intense-success2 fullWidth xxs b-r-xs'
              onClick={handleStakeOpen}
            >
              Stake LP
            </Button>
            <Button
              variant="contained"
              className='mt-1 btn-intense-default hover-btn btn-intense-success2 fullWidth xxs b-r-xs'
            >
              Claim
            </Button>
            <Button
              variant="contained"
              className='mt-1 btn-intense-default hover-btn btn-intense-success2 fullWidth xxs b-r-xs'
              onClick={handleUnstakeOpen}
            >
              Unstake
            </Button>
          </div>

        </div>
      </div>

      <StakeModal
        isOpen={isStakeOpen}
        setIsOpen={setIsStakeOpen}
        lpTokenId={lpTokenId}
        lpTokenMaxAmount={userLpTokenBalance}
      />

      <UnstakeModal
        isOpen={isUnstakeOpen}
        setIsOpen={setIsUnstakeOpen}
        lpTokenId={lpTokenId}
        lpTokenMaxAmount={userStake}
      />

      <DisplayModal
        isOpen={isAPRModalOpen}
        setIsOpen={setIsAPRModalOpen}
        title='Farm APR Details'
        content={aprModalContent}
      />

      <DisplayModal
        isOpen={isTotalsModalOpen}
        setIsOpen={setIsTotalsModalOpen}
        title='Farm Totals Details'
        content={totalsModalContent}
      />

      <DisplayModal
        isOpen={isUserModalOpen}
        setIsOpen={setIsUserModalOpen}
        title='User Farming Details'
        content={userModalContent}
      />
    </>
  );
};

export default Farm;