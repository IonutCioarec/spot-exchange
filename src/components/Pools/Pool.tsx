import { Fragment } from "react/jsx-runtime";
import 'assets/scss/pools.scss';
import { useMobile, useTablet } from 'utils/responsive';
import { Pair, Token } from "types/backendTypes";
import { useEffect, useRef, useState } from "react";
import { intlNumberFormat, intlFormatSignificantDecimals, amountToDenominatedAmount } from 'utils/formatters';
import { KeyboardArrowUp, KeyboardArrowDown, Add } from '@mui/icons-material';
import { Button, IconButton } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { getPercentageBigNumber, getAmountFromPercentageBigNumber } from "utils/calculs";
import { useGetAccountInfo } from 'hooks';
import { Link } from 'react-router-dom';
import { defaultSwapToken1, defaultSwapToken2 } from "config";
import CountUp from 'react-countup';
import { AwesomeButton } from 'react-awesome-button';
import { motion } from "framer-motion";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import WithdrawModal from './WithdrawModal';
import AddModal from './AddModal';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useBackendAPI } from "hooks/useBackendAPI";
import ReduceZerosFormat from "components/ReduceZerosFormat";

interface PoolProps {
  pair: Pair;
  index: number,
  token1Details: Token;
  token2Details: Token;
  userToken1Balance: number;
  userToken2Balance: number;
  userLpTokenBalance: number;
  lpTokenId: string;
  lpTokenSupply: number;
  sortBy: 'liquidity' | 'volume24h' | 'fees24h';
  sortDirection: 'asc' | 'desc';
}

const defaultTokenValues = {
  image_url: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png',
  name: 'TOKEN',
  price: 0,
  decimals: 18
}

export const Pool = ({ pair, index, token1Details, token2Details, userToken1Balance, userToken2Balance, userLpTokenBalance, lpTokenId, lpTokenSupply, sortBy, sortDirection }: PoolProps) => {
  const { getSwapPrice } = useBackendAPI();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const [open, setOpen] = useState(false);
  const { address } = useGetAccountInfo();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const handleWithdrawOpen = () => {
    setIsWithdrawOpen(true);
  }

  const [token1ExchangeRate, setToken1ExchangeRate] = useState('0');
  const [token2ExchangeRate, setToken2ExchangeRate] = useState('0');
  const getPrice = async (fromToken: string, fromTokenDecimals: number, toToken: string, amount: string) => {
    const amountScaled = amountToDenominatedAmount(amount, fromTokenDecimals, 20);
    const priceResponse = await getSwapPrice(fromToken, toToken, amountScaled);

    if (!priceResponse) {
      return '0';
    }

    const price = priceResponse?.cumulative_exchange_rate?.raw || '0';
    return price;
  };

  const [isAddOpen, setIsAddOpen] = useState(false);
  const handleAddOpen = async (fromToken: string, fromTokenDecimals: number, toToken: string, toTokenDecimals: number) => {
    setIsAddOpen(true);
    const price1 = await getPrice(fromToken, fromTokenDecimals, toToken, '1');
    const price2 = await getPrice(toToken, toTokenDecimals, fromToken, '1');

    setToken1ExchangeRate(price1);
    setToken2ExchangeRate(price2);
  }

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [open]);

  if (!isMobile && !isTablet) {
    return (
      <Fragment>
        <div className={`pool text-white ${open ? 'mb-5' : ''}`}>
          <div style={{ padding: '10px' }} onClick={() => setOpen(!open)}>
            <Row className="align-items-center d-flex">
              <Col lg={1} className="text-center">
                {index + 1}
              </Col>
              <Col lg={1}>
                <img
                  src={token1Details?.logo_url ?? defaultTokenValues.image_url}
                  alt={pair.token1}
                  className='d-inline'
                  style={{ width: 35, height: 35, border: '2px solid rgba(63, 172, 90, 0.3)', borderRadius: '20px' }}
                />
                <motion.img
                  src={token2Details?.logo_url ?? defaultTokenValues.image_url}
                  alt={pair.token2}
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
              <Col lg={3}>
                <div className="d-inline-grid mb-0">
                  <p className="mb-0">{token1Details?.ticker ?? defaultTokenValues.name}</p>
                  <p className="mt-0 mb-0 font-size-xxs text-silver">
                    ~ $<ReduceZerosFormat numberString={intlFormatSignificantDecimals(Number(token1Details?.price_usd) ?? defaultTokenValues.price, 3)} />
                  </p>
                </div>
                <div className="d-inline-grid mx-2 mb-0">
                  <span>/</span>
                </div>
                <div className="d-inline-grid">
                  <p className="mb-0">{token2Details?.ticker ?? defaultTokenValues.name}</p>
                  <p className="mt-0 mb-0 font-size-xxs text-silver">
                    ~ $<ReduceZerosFormat numberString={intlFormatSignificantDecimals(Number(token2Details?.price_usd) ?? defaultTokenValues.price, 3)} />
                  </p>
                </div>
              </Col>
              <Col lg={2}>
                <p className={`mb-0 font-size-xxs ${sortBy === 'liquidity' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                  Liquidity
                  {sortBy === 'liquidity' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                  {sortBy === 'liquidity' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                </p>
                $
                <CountUp
                  start={0}
                  end={Number(pair?.tvl)}
                  duration={1.5}
                  separator=","
                  decimals={3}
                  decimal="."
                  delay={0.1}
                />
              </Col>
              <Col lg={2} className="text-right">
                <p className={`mb-0 font-size-xxs ${sortBy === 'fees24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                  Fees (24h)
                  {sortBy === 'fees24h' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                  {sortBy === 'fees24h' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                </p>
                $
                <CountUp
                  start={0}
                  // end={Number(pair?.fees_24h)}
                  end={423.245}
                  duration={1.5}
                  separator=","
                  decimals={3}
                  decimal="."
                  delay={0.1}
                />
              </Col>
              <Col lg={2} className="text-right">
                <p className={`mb-0 font-size-xxs ${sortBy === 'volume24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                  Volume (24h)
                  {sortBy === 'volume24h' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                  {sortBy === 'volume24h' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                </p>
                $
                <CountUp
                  start={0}
                  // end={Number(pair?.volume_24h)}
                  end={4563.764}
                  duration={1.5}
                  separator=","
                  decimals={3}
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
              <Row className="g-1" style={{ marginTop: '0' }}>
                <Col lg={8}>
                  <div className="pool-sub-container px-4 py-2 ">
                    <p className="text-center text-silver mt-1">Pool Assets</p>

                    <div className="d-flex justify-content-between mt-1">
                      <div>
                        <p className="font-size-xs text-silver mb-0">{token1Details?.token_id ?? defaultTokenValues.name}</p>
                        <div className="d-flex justify-content-start">
                          <p className="h5 mb-0">{intlNumberFormat(Number(pair.token1_reserve), 3, 3)}</p>
                          <img
                            src={token1Details?.logo_url ?? defaultTokenValues.image_url}
                            alt={pair.token1}
                            className='ms-2'
                            style={{ width: 25, height: 25 }}
                          />
                          <p className="h5 ms-1 mb-0">{token1Details?.ticker}</p>
                        </div>
                        <p className="mt-0 font-size-xs text-silver mb-1">${intlFormatSignificantDecimals((Number(token1Details?.price_usd) ?? defaultTokenValues.price) * Number(pair.token1_reserve), 3)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-size-xs text-silver mb-0">{token2Details?.token_id ?? defaultTokenValues.name}</p>
                        <div className="d-flex justify-content-end">
                          <p className="h5 mb-0">{intlNumberFormat(Number(pair.token2_reserve), 3, 3)}</p>
                          <img
                            src={token2Details?.logo_url ?? defaultTokenValues.image_url}
                            alt={pair.token2}
                            className='ms-2'
                            style={{ width: 25, height: 25 }}
                          />
                          <p className="h5 ms-1 mb-0">{token2Details?.ticker}</p>
                        </div>
                        <p className="mt-0 font-size-xs text-silver mb-0">${intlFormatSignificantDecimals((Number(token2Details?.price_usd) ?? defaultTokenValues.price) * Number(pair.token2_reserve), 3)}</p>
                      </div>
                    </div>
                  </div>
                  <Row className="g-1">
                    <Col lg={3} className="mt-2">
                      <div className="pool-sub-container p-2 text-center">
                        <p className="text-silver font-size-xs mb-0">Fees (Total)</p>
                        <p className="h5 mb-0">$12.8M</p>
                      </div>
                    </Col>
                    <Col lg={3} className="mt-2">
                      <div className="pool-sub-container p-2 text-center">
                        <p className="text-silver font-size-xs mb-0">Fees (30D)</p>
                        <p className="h5 mb-0">${intlFormatSignificantDecimals(Number(pair?.fees_30d), 3)}</p>
                      </div>
                    </Col>
                    <Col lg={3} className="mt-2">
                      <div className="pool-sub-container p-2 text-center">
                        <p className="text-silver font-size-xs mb-0">Your Fees (Total)</p>
                        <p className="h5 mb-0">${address ? '4M' : '0'}</p>
                      </div>
                    </Col>
                    <Col lg={3} className="mt-2">
                      <div className="pool-sub-container p-2 text-center">
                        <p className="text-silver font-size-xs mb-0">Your Fees (24h)</p>
                        <p className="h5 mb-0">${address ? '48k' : '0'}</p>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={4}>
                  <div className="pool-sub-container px-3 py-2">
                    <div className="d-flex justify-content-between align-items-baseline">
                      <p className="text-white font-size-md font-bold mb-0">Pool Share</p>
                      <p className="text-white font-size-xl font-bold mb-0 text-right">{intlFormatSignificantDecimals(getPercentageBigNumber(userLpTokenBalance ?? 0, lpTokenSupply), 3)}%</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-baseline">
                      <p className="small text-silver mb-0">{token1Details?.token_id ?? defaultTokenValues.name}</p>
                      <div className="d-flex justify-content-end">
                        <p className="font-size-sm mb-0">
                          {intlFormatSignificantDecimals(
                            getAmountFromPercentageBigNumber(
                              getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply),
                              Number(pair.token1_reserve)
                            ), 3, 3)
                          }
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-baseline">
                      <p className="small text-silver mb-0">{token2Details?.token_id ?? defaultTokenValues.name}</p>
                      <div className="d-flex justify-content-end">
                        <p className="font-size-sm mb-0">
                          {intlFormatSignificantDecimals(
                            getAmountFromPercentageBigNumber(
                              getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply),
                              Number(pair.token2_reserve)
                            ), 3, 3)
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pool-sub-container px-3 py-2 mt-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-white font-size-md font-bold mb-0">Your Liquidity</p>
                      </div>
                      <p className="text-white font-size-xl font-bold mb-0">
                        ${intlFormatSignificantDecimals(
                          getAmountFromPercentageBigNumber(
                            getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply),
                            Number(pair?.tvl)
                          ), 3, 3)
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center gap-3 mt-1 mb-1 mx-1">
                      <AwesomeButton className="aws-btn-primary full-width" onPress={() => handleAddOpen(token1Details?.token_id, token1Details?.decimals, token2Details?.token_id, token2Details?.decimals)}>ADD</AwesomeButton>
                      <AddModal
                        isOpen={isAddOpen}
                        setIsOpen={setIsAddOpen}
                        token1={token1Details?.ticker}
                        token2={token2Details?.ticker}
                        token1Id={token1Details?.token_id}
                        token2Id={token2Details?.token_id}
                        token1Decimals={token1Details?.decimals}
                        token2Decimals={token2Details?.decimals}
                        token1MaxAmount={userToken1Balance}
                        token2MaxAmount={userToken2Balance}
                        token1Image={token1Details?.logo_url}
                        token2Image={token2Details?.logo_url}
                        token1ExchangeRate={token1ExchangeRate}
                        token2ExchangeRate={token2ExchangeRate}
                      />
                      <AwesomeButton className="aws-btn-danger full-width" onPress={handleWithdrawOpen}>REMOVE</AwesomeButton>
                      <WithdrawModal
                        isOpen={isWithdrawOpen}
                        setIsOpen={setIsWithdrawOpen}
                        lpTokenId={lpTokenId}
                        lpTokenMaxAmount={userLpTokenBalance}
                      />
                      <Link to={`/swap?token1=${token1Details?.token_id || defaultSwapToken1}&token2=${token2Details?.token_id || defaultSwapToken2}`}>
                        <AwesomeButton className="aws-btn-warning full-width">SWAP</AwesomeButton>
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </motion.div>
        </div>
      </Fragment >
    );
  } else {
    return (
      <Fragment>
        <div className={`pool scroll-margin-top text-white ${open ? 'mb-5' : 'mb-3'}`} ref={containerRef}>
          <div onClick={() => setOpen(!open)}>
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start align-items-center">
                <img
                  src={token1Details?.logo_url ?? defaultTokenValues.image_url}
                  alt={pair.token1}
                  className='d-inline'
                  style={{ width: 27, height: 27, border: '1px solid rgba(63, 172, 90, 0.3)', borderRadius: '20px' }}
                />
                <motion.img
                  src={token2Details?.logo_url ?? defaultTokenValues.image_url}
                  alt={pair.token2}
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
                    border: '1px solid rgba(63, 172, 90, 0.3)',
                    borderRadius: '20px',
                    position: 'relative',
                    left: '0px',
                  }}
                />
                <div className=" mb-0 ms-4">
                  <p className="mb-0 font-size-sm">{token1Details?.ticker ?? defaultTokenValues.name}</p>
                  <p className="m-t-n-xs mb-0 font-size-xxs text-silver">~ ${intlFormatSignificantDecimals(Number(token1Details?.price_usd) ?? defaultTokenValues.price, 3)}
                  </p>
                </div>
                <div className="mx-2 mb-0">
                  <span>/</span>
                </div>
                <div className="">
                  <p className="mb-0 font-size-sm">{token2Details?.ticker ?? defaultTokenValues.name}</p>
                  <p className="m-t-n-xs mb-0 font-size-xxs text-silver">~ ${intlFormatSignificantDecimals(Number(token2Details?.price_usd) ?? defaultTokenValues.price, 3)}
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
                <p className={`mb-0 font-size-sm ${sortBy === 'liquidity' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                  Liquidity
                  {sortBy === 'liquidity' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                  {sortBy === 'liquidity' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                </p>
                <p className="mb-0 font-size-sm text-silver">
                  $
                  <CountUp
                    start={0}
                    end={Number(pair?.tvl)}
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
                <p className={`mb-0 font-size-sm ${sortBy === 'volume24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                  Volume (24h)
                  {sortBy === 'volume24h' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                  {sortBy === 'volume24h' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                </p>
                <p className="mb-0 font-size-sm text-silver">
                  $
                  <CountUp
                    start={0}
                    // end={Number(pair?.volume_24h)}
                    end={4563.764}
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
                <p className={`mb-0 font-size-sm ${sortBy === 'fees24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                  Fees (24h)
                  {sortBy === 'fees24h' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                  {sortBy === 'fees24h' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                </p>
                <p className="mb-0 font-size-sm text-silver">
                  $
                  <CountUp
                    start={0}
                    // end={Number(pair?.fees_24h)}
                    end={423.245}
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
                  <p className="mb-0 font-size-sm text-silver">Volume (Total)</p>
                  <p className="mb-0 font-size-sm text-silver">
                    ${intlFormatSignificantDecimals(Number(pair?.volume_30d), 3)}
                  </p>
                </div>
              </div>
              <div className="pool-sub-container p-1 mt-1">
                <div className="d-flex justify-content-between">
                  <p className="mb-0 font-size-sm text-silver">Fees (Total)</p>
                  <p className="mb-0 font-size-sm text-silver">
                    ${intlFormatSignificantDecimals(Number(pair?.fees_30d), 3)}
                  </p>
                </div>
              </div>
              <div className="pool-sub-container p-1 mt-1">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-0 font-size-sm text-silver">Your Fee (Total)</p>
                    <p className="mb-0 mt-1 font-size-xs text-white font-bold">$4,052,123.1</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-0 font-size-sm text-silver">Your Fee (24h)</p>
                    <p className="mb-0 mt-1 font-size-xs text-white font-bold">
                      $152,123.1
                    </p>
                  </div>
                </div>
              </div>

              <div className="pool-sub-container p-1 mt-1">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-white font-size-sm font-bold mb-0">Pool Share</p>
                  <p className="text-white font-size-sm font-bold mb-0 text-right">{intlFormatSignificantDecimals(getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply), 3)}%</p>
                </div>
                <div className="d-flex justify-content-between align-items-baseline">
                  <p className="small text-silver font-size-xs mb-0">{token1Details?.token_id ?? defaultTokenValues.name}</p>
                  <div className="d-flex justify-content-end">
                    <p className="font-size-xs mb-0">
                      {intlNumberFormat(
                        getAmountFromPercentageBigNumber(
                          getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply),
                          Number(pair?.token1_reserve)
                        ), 3, 3)
                      }
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-baseline">
                  <p className="small text-silver font-size-xs mb-0">{token2Details?.token_id ?? defaultTokenValues.name}</p>
                  <div className="d-flex justify-content-end">
                    <p className="font-size-xs mb-0">
                      {intlNumberFormat(
                        getAmountFromPercentageBigNumber(
                          getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply),
                          Number(pair?.token2_reserve)
                        ), 3, 3)
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="pool-sub-container p-1 mt-1">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-white font-size-sm font-bold mb-0">Your Liquidity</p>
                  </div>
                  <p className="text-white font-size-sm font-bold mb-0">
                    ${intlFormatSignificantDecimals(
                      getAmountFromPercentageBigNumber(
                        getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply),
                        Number(pair?.tvl)
                      ), 3, 3)
                    }
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center gap-2 mt-1 mx-1">
                  <AwesomeButton className="aws-btn-primary full-width" onPress={() => handleAddOpen(token1Details?.token_id, token1Details?.decimals, token2Details?.token_id, token2Details?.decimals)}>ADD</AwesomeButton>
                  <AddModal
                    isOpen={isAddOpen}
                    setIsOpen={setIsAddOpen}
                    token1={token1Details?.ticker}
                    token2={token2Details?.ticker}
                    token1Id={token1Details?.token_id}
                    token2Id={token2Details?.token_id}
                    token1Decimals={token1Details?.decimals}
                    token2Decimals={token2Details?.decimals}
                    token1MaxAmount={userToken1Balance}
                    token2MaxAmount={userToken2Balance}
                    token1Image={token1Details?.logo_url}
                    token2Image={token2Details?.logo_url}
                    token1ExchangeRate={token1ExchangeRate}
                    token2ExchangeRate={token2ExchangeRate}
                  />
                  <AwesomeButton className="aws-btn-danger full-width" onPress={handleWithdrawOpen}>REMOVE</AwesomeButton>
                  <WithdrawModal
                    isOpen={isWithdrawOpen}
                    setIsOpen={setIsWithdrawOpen}
                    lpTokenId={lpTokenId}
                    lpTokenMaxAmount={userLpTokenBalance}
                  />
                  <Link to={`/swap?token1=${token1Details?.token_id || defaultSwapToken1}&token2=${token2Details?.token_id || defaultSwapToken2}`}>
                    <AwesomeButton className="aws-btn-warning full-width">SWAP</AwesomeButton>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Fragment >
    );
  }
}