import { Fragment } from "react/jsx-runtime";
import 'assets/scss/pools.scss';
import useMobile from 'utils/responsive';
import { Pair, TokenValue } from "types/backendTypes";
import { useState } from "react";
import { denominatedAmountToIntlFormattedAmount, denominatedAmountToAmount } from 'utils/formatters';
import { KeyboardArrowUp, KeyboardArrowDown, Add } from '@mui/icons-material';
import { Button } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { formatSignificantDecimals } from "utils/formatters";
import PoolLiquidityBar from "./PoolLiquidityBar";

interface PoolProps {
  pair: Pair;
  index: number,
  token1Details: TokenValue;
  token2Details: TokenValue;
}

export const Pool = ({ pair, index, token1Details, token2Details }: PoolProps) => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const token1DummyImg = 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png';
  const token2DummyImg = 'https://tools.multiversx.com/assets-cdn/devnet/tokens/MEX-a659d0/icon.png';

  const token1LiqPrice = token1Details?.price ? parseFloat(pair.liquidity_token1) * token1Details?.price : 0;
  const token2LiqPrice = token2Details?.price ? parseFloat(pair.liquidity_token2) * token2Details?.price : 0;
  const tokensLiquidityPrice = token1LiqPrice && token2LiqPrice ? token1LiqPrice + token2LiqPrice : 0;

  const token1Img = (token1Details?.logo_url && token1Details?.logo_url !== 'N/A') ? token1Details?.logo_url : token1DummyImg;
  const token2Img = (token2Details?.logo_url && token2Details?.logo_url !== 'N/A') ? token2Details?.logo_url : token2DummyImg;

  const token1Decimals = token1Details?.decimals ? token1Details?.decimals : 18;
  const token2Decimals = token2Details?.decimals ? token2Details?.decimals : 18;

  return (
    <Fragment>
      <div className={`pool text-white ${open ? 'mb-5' : ''}`}>
        <Row className="align-items-center d-flex">
          <Col lg={1} className="text-center">
            {index + 1}
          </Col>
          <Col lg={1}>
            <img src={token1Img} alt={pair.token1} className='d-inline' style={{ width: 30, height: 30 }} />
            <img src={token2Img} alt={pair.token2} className='d-inline' style={{ width: 30, height: 30 }} />
          </Col>
          <Col lg={3}>
            <div className="d-inline-grid mb-0">
              <p className="mb-0">{token1Details?.ticker ? token1Details?.ticker : 'TOKEN1'}</p>
              <p className="mt-0 mb-0 font-size-xxs text-silver">~ ${token1Details?.price ? formatSignificantDecimals(token1Details?.price) : '0'}</p>
            </div>
            <div className="d-inline-grid mx-2 mb-0">
              <span>/</span>
            </div>
            <div className="d-inline-grid">
              <p className="mb-0">{token2Details?.ticker ? token2Details?.ticker : 'TOKEN2'}</p>
              <p className="mt-0 mb-0 font-size-xxs text-silver">~ ${token2Details?.price ? formatSignificantDecimals(token2Details?.price) : '0'}</p>
            </div>
          </Col>
          <Col lg={2}>
            <p className="mb-0 font-size-xxs text-silver">Liquidity</p>
            ${denominatedAmountToIntlFormattedAmount(tokensLiquidityPrice, 18, 3)}
          </Col>
          <Col lg={2} className="text-right">
            <p className="mb-0 font-size-xxs text-silver">Volume (24h)</p>
            $24,000.700
          </Col>
          <Col lg={3} className="text-right">
            <Button
              className="custom-effect btn-success"
              variant="outlined"
              size="small"
              color="success"
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
            <Button
              className="ms-2 custom-effect btn-success"
              variant="outlined"
              size="small"
              color="success"
              startIcon={<Add sx={{ marginTop: '-3px' }} />}
            >
              <span className="m-l-n-xs">Add</span>
            </Button>
          </Col>
        </Row>
        {open && (
          <div className="mt-4" style={{ borderTop: '1px solid grey' }}>
            <Row className="mt-3 g-2">
              <Col lg={8}>
                <div className="pool-sub-container px-4 py-3 ">
                  <p className="text-center text-silver">Pool Assets</p>

                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <p className="font-size-xs text-silver mb-1">{token1Details?.token_id ? token1Details?.token_id : 'Token1'}</p>
                      <div className="d-flex justfy-content-start">
                        <p className="h5">{denominatedAmountToIntlFormattedAmount(pair.liquidity_token1, token1Decimals, 3)}</p>
                        <img src={token1Img} alt={pair?.token1} className='ms-2' style={{ width: 25, height: 25 }} />
                        <p className="h5 ms-1 mb-0">{token1Details?.ticker}</p>
                      </div>
                      <p className="mt-0 font-size-xs text-silver">${denominatedAmountToIntlFormattedAmount(token1LiqPrice, 18, 3)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-size-xs text-silver mb-1">{token2Details?.token_id ? token2Details?.token_id : 'Token2'}</p>
                      <div className="d-flex justfy-content-end">
                        <p className="h5">{denominatedAmountToIntlFormattedAmount(pair.liquidity_token2, token2Decimals, 3)}</p>
                        <img src={token2Img} alt={pair?.token2} className='ms-2' style={{ width: 25, height: 25 }} />
                        <p className="h5 ms-1 mb-0">{token2Details?.ticker}</p>
                      </div>
                      <p className="mt-0 font-size-xs text-silver">${denominatedAmountToIntlFormattedAmount(token2LiqPrice, 18, 3)}</p>
                    </div>
                  </div>
                  <PoolLiquidityBar
                    token1Amount={Number(denominatedAmountToAmount(pair.liquidity_token1, token1Decimals, 3))}
                    token2Amount={Number(denominatedAmountToAmount(pair.liquidity_token2, token2Decimals, 3))}
                  />
                </div>
                <Row className="g-2">
                  <Col lg={3} className="mt-3">
                    <div className="pool-sub-container px-4 py-3 text-center">
                      <p className="text-silver">Fees (24h)</p>
                      <p className="h3 mt-3 mb-0">$1234.8</p>
                    </div>
                  </Col>
                  <Col lg={3} className="mt-3">
                    <div className="pool-sub-container px-4 py-3 text-center">
                      <p className="text-silver">Holders</p>
                      <p className="h3 mt-3 mb-0">21</p>
                    </div>
                  </Col>
                  <Col lg={6} className="mt-3">
                    <div className="pool-sub-container px-4 py-3 text-center">
                      <p className="text-silver">LP Token</p>
                      <p className="h3 mt-3 mb-0">{pair.lp_token_id}</p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg={4}>
                <div className="pool-sub-container px-4 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-white font-size-lg font-bold mb-0">Incoming Fee</p>
                      <p className="small text-silver mb-0 mt-1">Trading fee percentage</p>
                    </div>
                    <p className="text-[#01b574] font-size-xxl font-bold mb-0">0.04%</p>
                  </div>
                </div>
                <div className="pool-sub-container px-4 py-3 mt-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-white font-size-lg font-bold mb-0">Your Liquidity</p>
                      <p className="small text-silver mb-0 mt-1">Total value</p>
                    </div>
                    <p className="text-[#01b574] font-size-xxl font-bold mb-0">$67,66.456</p>
                  </div>
                </div>
                <div className="poolSubContainer px-4 py-3 mt-2">
                  <p className="text-white font-size-lg font-bold mb-0">Actions</p>
                  <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
                    <Button
                      className="custom-effect btn-outline-warning text-uppercase font-bold"
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      Withdraw
                    </Button>
                    <Button
                      className="custom-effect btn-outline-success text-uppercase font-bold"
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      SWAP
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </Fragment>
  );
}