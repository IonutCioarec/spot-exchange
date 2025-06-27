import { Fragment } from "react/jsx-runtime";
import 'assets/scss/pools.scss';
import { useMobile, useTablet } from 'utils/responsive';
import { Farm, Pair, Token, UserFarm } from "types/backendTypes";
import { useEffect, useRef, useState } from "react";
import { intlNumberFormat, intlFormatSignificantDecimals, amountToDenominatedAmount } from 'utils/formatters';
import { KeyboardArrowUp, KeyboardArrowDown, Add } from '@mui/icons-material';
import { Button, IconButton } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { getPercentageBigNumber, getAmountFromPercentageBigNumber } from "utils/calculs";
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import { Link } from 'react-router-dom';
import { defaultSwapToken1, defaultSwapToken2 } from "config";
import CountUp from 'react-countup';
import { AwesomeButton } from 'react-awesome-button';
import { motion } from "framer-motion";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import WithdrawModal from "components/Pools/WithdrawModal";
import AddModal from 'components/Pools/AddModal';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useBackendAPI } from "hooks/useBackendAPI";
import ReduceZerosFormat from "components/ReduceZerosFormat";
import { useSelector } from "react-redux";
import { selectAllTokensById } from "storeManager/slices/tokensSlice";
import { abbreviateNumber } from 'utils/formatters';
import UnstakeModal from 'components/Farms/UnstakeModal';
import StakeModal from 'components/Farms/StakeModal';
import { userFarmsDummy } from "utils/dummyData";
import { selectUserLpTokens, selectUserTokens } from "storeManager/slices/userTokensSlice";

interface FarmProps {
  farm: Farm;
  userFarm: UserFarm;
  index: number;
  sortBy: string;
  sortDirection: string;
}

const defaultTokenValues = {
  image_url: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png',
  name: 'TOKEN',
  price: 0,
  decimals: 18
}

export const FarmItem = ({ farm, userFarm, index, sortBy, sortDirection }: FarmProps) => {
  const allTokens = useSelector(selectAllTokensById);
  const userLPTokens = useSelector(selectUserLpTokens);
  const { getSwapPrice } = useBackendAPI();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const [open, setOpen] = useState(false);
  const { address } = useGetAccountInfo();
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = useGetIsLoggedIn();

  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false);
  const handleUnstakeOpen = () => {
    setIsUnstakeOpen(true);
  }

  const [isStakeOpen, setIsStakeOpen] = useState(false);
  const handleStakeOpen = () => {
    setIsStakeOpen(true);
  }

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [open]);

  const farmName = farm.token1.split('-')[0] + farm.token2.split('-')[0];

  if (!isMobile && !isTablet) {
    return (
      <div className={`pool text-white ${open ? 'mb-5' : ''}`} key={`farm-key-${farm.lp_token_id}`}>
        <div style={{ padding: '10px' }} onClick={() => setOpen(!open)}>
          <Row className="align-items-center d-flex">
            <Col lg={1} style={{ whiteSpace: 'nowrap' }}>
              <span className="mx-2">{index + 1}</span>
              <img
                src={allTokens[farm.token1]?.logo_url && allTokens[farm.token1]?.logo_url !== 'N/A' ? allTokens[farm.token1].logo_url : defaultTokenValues.image_url}
                alt={farm.token1}
                className='d-inline'
                style={{ width: 35, height: 35, border: '2px solid rgba(63, 172, 90, 0.3)', borderRadius: '20px' }}
              />
              <motion.img
                src={allTokens[farm.token2]?.logo_url && allTokens[farm.token2]?.logo_url !== 'N/A' ? allTokens[farm.token2].logo_url : defaultTokenValues.image_url}
                alt={farm.token2}
                className="d-inline m-l-n-xxl"
                initial={{ x: 0 }}
                animate={{ x: 20 }}
                transition={{
                  duration: 2.5,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
                style={{
                  width: 35,
                  height: 35,
                  border: '2px solid rgba(63, 172, 90, 0.3)',
                  borderRadius: '20px',
                  position: 'relative',
                  left: '0px',
                }}
              />
            </Col>
            <Col lg={2}>
              <div className="ms-3">
                <div className="d-inline-grid mb-0">
                  <p className="mb-0">{farmName ?? defaultTokenValues.name}</p>
                  <p className="mt-0 mb-0 font-size-xxs text-silver">
                    ~ $<ReduceZerosFormat numberString={intlFormatSignificantDecimals(Number(allTokens[farm.lp_token_id]?.price_usd) ?? defaultTokenValues.price, 3)} />
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={1}>
              <p className={`mb-0 no-wrap font-size-xxs text-silver`}>
                Total APR
              </p>
              <p className="font-size-sm mb-0">{intlFormatSignificantDecimals(Number(farm.total_apr), 2)}%</p>
            </Col>
            <Col lg={1}>
              <p className={`mb-0 no-wrap font-size-xxs text-silver`}>
                Fees APR
              </p>
              <p className="font-size-sm mb-0">{intlFormatSignificantDecimals(Number(farm.fees_apr), 2)}%</p>
            </Col>
            <Col lg={1}>
              <p className={`mb-0 no-wrap font-size-xxs text-silver`}>
                Boosted APR
              </p>
              <p className="font-size-sm mb-0">{intlFormatSignificantDecimals(Number(farm.boosted_apr), 2)}%</p>
            </Col>
            <Col lg={2} className="text-right">
              <p className={`mb-0 no-wrap font-size-xxs ${sortBy === 'total_staked' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                Total Staked
                {sortBy === 'total_staked' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                {sortBy === 'total_staked' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
              </p>
              $
              <CountUp
                start={0}
                end={Number(farm?.total_staked)}
                duration={1.5}
                separator=","
                decimals={3}
                decimal="."
                delay={0.1}
              />
            </Col>
            <Col lg={2} className="text-right">
              <p className={`mb-0 no-wrap font-size-xxs ${sortBy === 'total_rewards' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                Total Rewards
                {sortBy === 'total_rewards' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                {sortBy === 'total_rewards' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
              </p>
              $
              <CountUp
                start={0}
                end={Number(farm?.total_rewards)}
                duration={1.5}
                separator=","
                decimals={3}
                decimal="."
                delay={0.1}
              />
            </Col>
            <Col lg={1} className="text-right">
              <p className={`mb-0 font-size-xxs ${sortBy === 'total_users' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                Users
                {sortBy === 'total_users' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                {sortBy === 'total_users' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
              </p>
              <CountUp
                start={0}
                end={Number(farm?.staking_users)}
                duration={1.5}
                separator=","
                decimals={0}
                decimal="."
                delay={0.1}
              />
            </Col>
            <Col lg={1} className="text-center">
              <IconButton
                className="m-0"
                size="small"
                color="success"
                onClick={() => setOpen(!open)}
              >
                {open ? (<KeyboardArrowUp sx={{ marginTop: '-2px', fontSize: '30px' }} />) : (<KeyboardArrowDown sx={{ marginTop: '-2px', fontSize: '30px' }} />)}
              </IconButton>
            </Col>
          </Row>
        </div>
        <motion.div
          style={{ overflow: 'hidden' }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        >
          <div className="mt-2" style={{ borderTop: '3px solid rgba(10, 10, 10, 0.3)', padding: '10px' }}>
            <Row className="g-2">
              <Col lg={10}>
                <Row className="g-2">
                  <Col lg={3}>
                    <div className="pool-sub-container p-2 text-center" style={{ minHeight: '105px' }}>
                      <p className="text-silver font-size-sm mb-0 no-wrap">Total Staked</p>
                      <p className="font-size-sm mb-0 mt-3">{abbreviateNumber(Number(farm.total_staked), 2)} {farmName}</p>
                      <p className="font-size-sm mb-0">(${abbreviateNumber(Number(farm?.total_staked) * 2.4, 2)})</p>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="pool-sub-container p-2 text-center" style={{ minHeight: '105px' }}>
                      <p className="text-silver font-size-sm mb-0 no-wrap">Your Staked</p>
                      <p className="font-size-sm mb-0 mt-3">{abbreviateNumber(Number(userFarm?.staked ?? '0'), 2)} {farmName}</p>
                      <p className="font-size-sm mb-0">(${abbreviateNumber(Number(userFarm?.staked ?? '0') * 2.4, 2)})</p>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="pool-sub-container p-2 text-center" style={{ minHeight: '105px' }}>
                      <p className="text-silver font-size-sm mb-0 no-wrap">Total Rewards</p>
                      <div className="mt-3">
                        {farm.total_rewards_list.length ? (
                          farm.total_rewards_list.map((item) => (
                            <p className="font-size-sm mb-0" key={`farm-${item.token}-${item.value}`}>{abbreviateNumber(Number(item.value ?? '0'), 2)} {item.token.split('-')[0]}</p>
                          ))
                        ) : (
                          <p className="font-size-sm mb-0">-</p>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="pool-sub-container p-2 text-center" style={{ minHeight: '105px' }}>
                      <p className="text-silver font-size-sm mb-0">Your Rewards</p>
                      <div className="mt-3">
                        {userFarm?.rewardsList.length ? (
                          userFarm?.rewardsList.map((item) => (
                            <p className="font-size-sm mb-0" key={`user-${item.token}-${item.value}`}>{abbreviateNumber(Number(item.value), 2)} {item.token.split('-')[0]}</p>
                          ))
                        ) : (
                          <p className="font-size-sm mb-0">-</p>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg={2}>
                <div className="mx-2" style={{ minHeight: '100px' }}>
                  <AwesomeButton className="aws-btn-primary mt-1 full-width smaller" onPress={handleStakeOpen}>STAKE LP</AwesomeButton>
                  {isLoggedIn ? (
                    <AwesomeButton className="aws-btn-warning mt-1 full-width smaller">CLAIM</AwesomeButton>
                  ) : (
                    <Link to='/unlock'>
                      <AwesomeButton className="aws-btn-warning mt-1 full-width smaller">CLAIM</AwesomeButton>
                    </Link>
                  )}
                  <AwesomeButton className="aws-btn-danger mt-1 full-width smaller" onPress={handleUnstakeOpen}>UNSTAKE</AwesomeButton>
                </div>
              </Col>
            </Row>
          </div>
        </motion.div>

        <StakeModal
          isOpen={isStakeOpen}
          setIsOpen={setIsStakeOpen}
          lpTokenId={farm.lp_token_id}
          lpTokenMaxAmount={Number(userLPTokens[farm.lp_token_id]?.balance)}
        />

        <UnstakeModal
          isOpen={isUnstakeOpen}
          setIsOpen={setIsUnstakeOpen}
          lpTokenId={farm.lp_token_id}
          lpTokenMaxAmount={Number(userFarm?.staked)}
        />
      </div>
    );
  } else {
    return (
      <Fragment>
        <div className={`pool scroll-margin-top text-white ${open ? 'mb-5' : 'mb-3'}`} ref={containerRef}>
          <div onClick={() => setOpen(!open)}>
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start align-items-center">
                <span className="mx-2">{index + 1}</span>
                <img
                  src={allTokens[farm.token1]?.logo_url && allTokens[farm.token1]?.logo_url !== 'N/A' ? allTokens[farm.token1].logo_url : defaultTokenValues.image_url}
                  alt={farm.token1}
                  className='d-inline'
                  style={{ width: 27, height: 27, border: '2px solid rgba(63, 172, 90, 0.3)', borderRadius: '20px' }}
                />
                <motion.img
                  src={allTokens[farm.token2]?.logo_url && allTokens[farm.token2]?.logo_url !== 'N/A' ? allTokens[farm.token2].logo_url : defaultTokenValues.image_url}
                  alt={farm.token2}
                  className="d-inline m-l-n-xxl"
                  initial={{ x: 0 }}
                  animate={{ x: 20 }}
                  transition={{
                    duration: 2.5,
                    ease: 'easeInOut',
                    delay: 0.3,
                  }}
                  style={{
                    width: 27,
                    height: 27,
                    border: '2px solid rgba(63, 172, 90, 0.3)',
                    borderRadius: '20px',
                    position: 'relative',
                    left: '0px',
                  }}
                />
                <div className="mb-0 ms-4">
                  <p className="mb-0 font-size-sm">{farmName ?? defaultTokenValues.name}</p>
                  <p className="m-t-n-xs mb-0 font-size-xxs text-silver">
                    ~ $<ReduceZerosFormat numberString={intlFormatSignificantDecimals(Number(allTokens[farm.lp_token_id]?.price_usd) ?? defaultTokenValues.price, 3)} />
                  </p>
                </div>
              </div>
              <div>
                <IconButton
                  className="m-0 btn-success ms-2"
                  size="small"
                  color="success"
                  onClick={() => setOpen(!open)}
                >
                  {open ? (<KeyboardDoubleArrowUpIcon sx={{ fontSize: '15px' }} />) : (<KeyboardDoubleArrowDownIcon sx={{ fontSize: '15px' }} />)}
                </IconButton>
              </div>
            </div>
            <div className="pool-sub-container p-2 mt-1">
              <div className="d-flex justify-content-between">
                <p className={`mb-0 font-size-sm text-silver`}>
                  Total APR
                </p>
                <p className="mb-0 font-size-sm text-silver">{intlFormatSignificantDecimals(Number(farm.total_apr), 2)}%</p>
              </div>
            </div>
            <div className="pool-sub-container p-2 mt-1">
              <div className="d-flex justify-content-between">
                <p className={`mb-0 font-size-sm ${sortBy === 'total_staked' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                  Total Staked
                  {sortBy === 'total_staked' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                  {sortBy === 'total_staked' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                </p>
                <p className="mb-0 font-size-sm text-silver">
                  $
                  <CountUp
                    start={0}
                    end={Number(farm?.total_staked)}
                    duration={1.5}
                    separator=","
                    decimals={3}
                    decimal="."
                    delay={0.1}
                  />
                </p>
              </div>
            </div>
            <div className="pool-sub-container p-2 mt-1">
              <div className="d-flex justify-content-between">
                <p className={`mb-0 font-size-sm ${sortBy === 'total_rewards' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                  Total Rewards
                  {sortBy === 'total_rewards' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                  {sortBy === 'total_rewards' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                </p>
                <p className="mb-0 font-size-sm text-silver">
                  $
                  <CountUp
                    start={0}
                    end={Number(farm?.total_rewards)}
                    duration={1.5}
                    separator=","
                    decimals={3}
                    decimal="."
                    delay={0.1}
                  />
                </p>
              </div>
            </div>
          </div>
          <motion.div
            style={{ overflow: 'hidden' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          >
            <div className="b-r-sm mt-2 p-2" style={{ border: '1px solid rgba(100,100,100, 0.7)' }}>
              <div className="pool-sub-container p-1 mt-1">
                <div className="d-flex justify-content-between">
                  <p className="mb-0 font-size-sm text-silver">Fees APR</p>
                  <p className="mb-0 font-size-sm text-silver">
                    {intlFormatSignificantDecimals(Number(farm.fees_apr), 2)}%
                  </p>
                </div>
              </div>
              <div className="pool-sub-container p-1 mt-1">
                <div className="d-flex justify-content-between">
                  <p className="mb-0 font-size-sm text-silver">Boosted APR</p>
                  <p className="mb-0 font-size-sm text-silver">
                    {intlFormatSignificantDecimals(Number(farm.boosted_apr), 2)}%
                  </p>
                </div>
              </div>
              <div className="pool-sub-container p-1 mt-1">
                <div className="d-flex justify-content-between">
                  <p className="mb-0 font-size-sm text-silver">Staking Users</p>
                  <p className="mb-0 font-size-sm text-silver">
                    <CountUp
                      start={0}
                      end={Number(farm?.staking_users)}
                      duration={1.5}
                      separator=","
                      decimals={0}
                      decimal="."
                      delay={0.1}
                    />
                  </p>
                </div>
              </div>


              <div className="pool-sub-container p-1 mt-1">
                <p className="mb-1 text-center text-silver font-size-sm">Total Staked</p>
                <div className="d-flex justify-content-between mt-1">
                  <div>
                    <p className="mb-0 font-size-xs text-white font-bold">{abbreviateNumber(Number(farm.total_staked), 2)} {farmName}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-0 font-size-xs text-white font-bold">${abbreviateNumber(Number(farm?.total_staked) * 2.4, 2)}</p>
                  </div>
                </div>
              </div>

              <div className="pool-sub-container p-1 mt-1">
                <p className="mb-1 text-center text-silver font-size-sm">Total Rewards</p>
                <div className="d-flex justify-content-between mt-1">
                  <div>
                    {farm.total_rewards_list.length ? (
                      farm.total_rewards_list.map((item) => (
                        <p className="mb-0 font-size-xs text-white font-bold" key={`farm-${item.token}-${item.value}`}>{abbreviateNumber(Number(item.value), 2)} {item.token.split('-')[0]}</p>
                      ))
                    ) : (
                      <p className="mb-0 font-size-xs text-white font-bold">-</p>
                    )}
                  </div>
                  <div className="text-right">
                    {farm.total_rewards_list.length ? (
                      farm.total_rewards_list.map((item) => (
                        <p className="mb-0 font-size-xs text-white font-bold" key={`farm-${item.token}-${item.value}`}>${abbreviateNumber(Number(item.value) * 2.2, 2)}</p>
                      ))
                    ) : (
                      <p className="mb-0 font-size-xs text-white font-bold">-</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pool-sub-container p-1 mt-1">
                <p className="mb-1 text-center text-silver font-size-sm">Your Staked</p>
                <div className="d-flex justify-content-between mt-1">
                  <div>
                    <p className="mb-0 font-size-xs text-white font-bold">{abbreviateNumber(Number(userFarm?.staked ?? '0'), 2)} {farmName}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-0 font-size-xs text-white font-bold">${abbreviateNumber(Number(userFarm?.staked ?? '0') * 2.4, 2)}</p>
                  </div>
                </div>
              </div>

              <div className="pool-sub-container p-1 mt-1">
                <p className="mb-1 text-center text-silver font-size-sm">Your Rewards</p>
                <div className="d-flex justify-content-between mt-1">
                  <div>
                    {userFarm?.rewardsList.length ? (
                      userFarm?.rewardsList.map((item) => (
                        <p className="mb-0 font-size-xs text-white font-bold" key={`farm-${item.token}-${item.value}`}>{abbreviateNumber(Number(item.value ?? '0'), 2)} {item.token.split('-')[0]}</p>
                      ))
                    ) : (
                      <p className="mb-0 font-size-xs text-white font-bold">-</p>
                    )}
                  </div>
                  <div className="text-right">
                    {userFarm?.rewardsList.length ? (
                      userFarm?.rewardsList.map((item) => (
                        <p className="mb-0 font-size-xs text-white font-bold" key={`farm-${item.token}-${item.value}`}>${abbreviateNumber(Number(item.value ?? '0') * 2.2, 2)}</p>
                      ))
                    ) : (
                      <p className="mb-0 font-size-xs text-white font-bold">-</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center gap-2 mt-1 mx-1">
                  <AwesomeButton className="aws-btn-primary mt-1 full-width smaller" onPress={handleStakeOpen}>STAKE</AwesomeButton>
                  {isLoggedIn ? (
                    <AwesomeButton className="aws-btn-warning mt-1 full-width smaller">CLAIM</AwesomeButton>
                  ) : (
                    <Link to='/unlock'>
                      <AwesomeButton className="aws-btn-warning mt-1 full-width smaller">CLAIM</AwesomeButton>
                    </Link>
                  )}
                  <AwesomeButton className="aws-btn-danger mt-1 full-width smaller" onPress={handleUnstakeOpen}>UNSTAKE</AwesomeButton>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <StakeModal
          isOpen={isStakeOpen}
          setIsOpen={setIsStakeOpen}
          lpTokenId={farm.lp_token_id}
          lpTokenMaxAmount={Number(userLPTokens[farm.lp_token_id]?.balance)}
        />

        <UnstakeModal
          isOpen={isUnstakeOpen}
          setIsOpen={setIsUnstakeOpen}
          lpTokenId={farm.lp_token_id}
          lpTokenMaxAmount={Number(userFarm?.staked)}
        />
      </Fragment >
    );
  }
}