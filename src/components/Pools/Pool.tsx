import { Fragment } from "react/jsx-runtime";
import 'assets/scss/pools.scss';
import { useMobile, useTablet } from 'utils/responsive';
import { Pair, Token } from "types/backendTypes";
import { useState } from "react";
import { denominatedAmountToIntlFormattedAmount, denominatedAmountToAmount, formatSignificantDecimals, intlNumberFormat, intlFormatSignificantDecimals } from 'utils/formatters';
import { KeyboardArrowUp, KeyboardArrowDown, Add } from '@mui/icons-material';
import { Button, IconButton } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import PoolLiquidityBar from "./PoolLiquidityBar";
import { getPercentageBigNumber, getAmountFromPercentageBigNumber } from "utils/calculs";
import { useGetAccountInfo } from 'hooks';
import { Link } from 'react-router-dom';
import { defaultSwapToken1, defaultSwapToken2 } from "config";
import CountUp from 'react-countup';
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from 'react-awesome-button';

interface PoolProps {
  pair: Pair;
  index: number,
  token1Details: Token;
  token2Details: Token;
  userToken1Balance: number;
  userToken2Balance: number;
  userLpTokenBalance: number;
  lpTokenSupply: number;
}

const defaultTokenValues = {
  image_url: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png',
  name: 'TOKEN',
  price: 0,
  decimals: 18
}

export const Pool = ({ pair, index, token1Details, token2Details, userToken1Balance, userToken2Balance, userLpTokenBalance, lpTokenSupply }: PoolProps) => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const [open, setOpen] = useState(false);
  const { address } = useGetAccountInfo();

  if (!isMobile && !isTablet) {
    return (
      <Fragment>
        <div className={`pool text-white ${open ? 'mb-5' : ''}`}>
          <Row className="align-items-center d-flex">
            <Col lg={1} className="text-center">
              {index + 1}
            </Col>
            <Col lg={1}>
              <img
                src={token1Details?.logo_url ?? defaultTokenValues.image_url}
                alt={pair.token1}
                className='d-inline'
                style={{ width: 30, height: 30, border: '1px solid #303030', borderRadius: '20px' }}
              />
              <img
                src={token2Details?.logo_url ?? defaultTokenValues.image_url}
                alt={pair.token2}
                className='d-inline'
                style={{ width: 30, height: 30, border: '1px solid #303030', borderRadius: '20px' }}
              />
            </Col>
            <Col lg={3}>
              <div className="d-inline-grid mb-0">
                <p className="mb-0">{token1Details?.ticker ?? defaultTokenValues.name}</p>
                <p className="mt-0 mb-0 font-size-xxs text-silver">~ ${intlFormatSignificantDecimals(Number(token1Details?.price_usd) ?? defaultTokenValues.price, 3)}
                </p>
              </div>
              <div className="d-inline-grid mx-2 mb-0">
                <span>/</span>
              </div>
              <div className="d-inline-grid text-center">
                <p className="mb-0">{token2Details?.ticker ?? defaultTokenValues.name}</p>
                <p className="mt-0 mb-0 font-size-xxs text-silver">~ ${intlFormatSignificantDecimals(Number(token2Details?.price_usd) ?? defaultTokenValues.price, 3)}
                </p>
              </div>
            </Col>
            <Col lg={2}>
              <p className="mb-0 font-size-xxs text-silver">Liquidity</p>
              ${intlFormatSignificantDecimals(Number(pair?.tvl), 3)}
            </Col>
            <Col lg={2} className="text-right">
              <p className="mb-0 font-size-xxs text-silver">Fees (24h)</p>
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
              <p className="mb-0 font-size-xxs text-silver">Volume (24h)</p>
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
          {open && (
            <div className="mt-2" style={{ borderTop: '3px solid rgba(10, 10, 10, 0.3)' }}>
              <Row className="g-1" style={{ marginTop: '0' }}>
                <Col lg={8}>
                  <div className="pool-sub-container px-4 py-2 ">
                    <p className="text-center text-silver mt-1">Pool Assets</p>

                    <div className="d-flex justify-content-between mt-1">
                      <div>
                        <p className="font-size-xs text-silver mb-0">{token1Details?.token_id ?? defaultTokenValues.name}</p>
                        <div className="d-flex justfy-content-start">
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
                        <div className="d-flex justfy-content-end">
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
                      <div className="d-flex justfy-content-end">
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
                      <AwesomeButton className="aws-btn-primary full-width">ADD</AwesomeButton>
                      <AwesomeButton className="aws-btn-danger full-width">WITHDRAW</AwesomeButton>
                      <AwesomeButton className="aws-btn-warning full-width">SWAP</AwesomeButton>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Fragment >
    );
  } else {
    return (
      <Fragment>
        <div className={`pool text-white ${open ? 'mb-5' : 'mb-3'}`}>
          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
              <img
                src={token1Details?.logo_url ?? defaultTokenValues.image_url}
                alt={pair.token1}
                style={{ width: 40, height: 40 }}
              />
              <div className="mb-0 ms-3">
                <p className="mb-0">{token1Details?.ticker ?? defaultTokenValues.name}</p>
                <p className="mt-0 mb-0 font-size-xxs text-silver">~ ${intlFormatSignificantDecimals(Number(token1Details?.price_usd) ?? defaultTokenValues.price, 3)}
                </p>
              </div>
            </div>
            <span>/</span>
            <div className="d-flex justify-content-end">
              <div className="text-right me-3">
                <p className="mb-0">{token2Details?.ticker ?? defaultTokenValues.name}</p>
                <p className="mt-0 mb-0 font-size-xxs text-silver">~ ${intlFormatSignificantDecimals(Number(token2Details?.price_usd) ?? defaultTokenValues.price, 3)}
                </p>
              </div>
              <img
                src={token2Details?.logo_url ?? defaultTokenValues.image_url}
                alt={pair.token2}
                style={{ width: 40, height: 40 }}
              />
            </div>
          </div>
          <div className="pool-sub-container p-2 mt-3">
            <div className="d-flex justify-content-between">
              <p className="mb-0 font-size-sm text-silver">Liquidity</p>
              <p className="mb-0 font-size-sm text-silver">
                ${intlFormatSignificantDecimals(Number(pair?.tvl), 3)}
              </p>
            </div>
          </div>
          <div className="pool-sub-container p-2 mt-1">
            <div className="d-flex justify-content-between">
              <p className="mb-0 font-size-sm text-silver">Volume (24h)</p>
              <p className="mb-0 font-size-sm text-silver">${intlFormatSignificantDecimals(Number(pair?.volume_24h), 3)}</p>
            </div>
          </div>
          <div className="pool-sub-container p-2 mt-1">
            <div className="d-flex justify-content-between">
              <p className="mb-0 font-size-sm text-silver">Fees (24h)</p>
              <p className="mb-0 font-size-sm text-silver">${intlFormatSignificantDecimals(Number(pair?.fees_24h), 3)}</p>
            </div>
          </div>
          <Row className="mt-2 g-2">
            <Col xs={6}>
              <Button
                className="btn-green3 text-capitalize"
                variant="outlined"
                size="small"
                color="success"
                fullWidth
                onClick={() => setOpen(!open)}
                startIcon={
                  open ? (
                    <KeyboardArrowUp sx={{ marginTop: '-2px' }} />
                  ) : (
                    <KeyboardArrowDown sx={{ marginTop: '-2px' }} />
                  )
                }
              >
                {open ? <span className="m-l-n-xs">Collapse</span> : <span className="m-l-n-xs">Expand</span>}
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                className="btn-green3 text-capitalize"
                variant="outlined"
                size="small"
                color="success"
                fullWidth
                startIcon={<Add sx={{ marginTop: '-3px' }} />}
              >
                <span className="m-l-n-xs">Add</span>
              </Button>
            </Col>
          </Row>
          {open && (
            <div className="mt-3" style={{ borderTop: '1px solid grey' }}>
              <div className="pool-sub-container p-2 mt-3">
                <div className="d-flex justify-content-between">
                  <p className="mb-0 font-size-sm text-silver">Volume (Total)</p>
                  <p className="mb-0 font-size-sm text-silver">
                    $127,546,675.23
                  </p>
                </div>
              </div>
              <div className="pool-sub-container p-2 mt-1">
                <div className="d-flex justify-content-between">
                  <p className="mb-0 font-size-sm text-silver">Fees (Total)</p>
                  <p className="mb-0 font-size-sm text-silver">
                    $12,234,432.1
                  </p>
                </div>
              </div>
              <div className="pool-sub-container p-2 mt-1">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-0 font-size-sm text-silver">Your Fee (Total)</p>
                    <p className="mb-0 mt-1 font-size-xs text-white font-bold">$4,052,123.1</p>
                  </div>
                  <div style={{ borderRight: '1px dashed silver' }}></div>
                  <div className="text-right">
                    <p className="mb-0 font-size-sm text-silver">Your Fee (24h)</p>
                    <p className="mb-0 mt-1 font-size-xs text-white font-bold">
                      $152,123.1
                    </p>
                  </div>
                </div>
              </div>

              <div className="pool-sub-container p-2 mt-1">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-white font-size-sm font-bold mb-0">Pool Share</p>
                  <p className="text-white font-size-sm font-bold mb-0 text-right">{intlFormatSignificantDecimals(getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply), 3)}%</p>
                </div>
                <div className="d-flex justify-content-between align-items-baseline">
                  <p className="small text-silver font-size-xs mb-0">{token1Details?.token_id ?? defaultTokenValues.name}</p>
                  <div className="d-flex justfy-content-end">
                    <p className="font-size-xs mb-0">
                      {intlNumberFormat(
                        getAmountFromPercentageBigNumber(
                          getPercentageBigNumber(userLpTokenBalance || 0, lpTokenSupply),
                          Number(pair?.token1_reserve)
                        ), 3, 3)
                      }
                    </p>
                    <img
                      src={token1Details?.logo_url ?? defaultTokenValues.image_url}
                      alt={pair.token1}
                      className='ms-2'
                      style={{ width: 20, height: 20 }}
                    />
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
                    <img
                      src={token2Details?.logo_url ?? defaultTokenValues.image_url}
                      alt={pair.token2}
                      className='ms-2'
                      style={{ width: 20, height: 20 }}
                    />
                  </div>
                </div>
              </div>
              <div className="pool-sub-container p-2 mt-1">
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
              <div className="pool-sub-container p-2 mt-1">
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <Button
                    className="font-size-xs btn-outline-warning text-uppercase font-bold"
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    Withdraw
                  </Button>
                  <Button
                    component={Link}
                    to={`/swap?token1=${token1Details.token_id}&token2=${token2Details.token_id}`}
                    className="font-size-xs btn-outline-success text-uppercase font-bold"
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    SWAP
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Fragment >
    );
  }
}