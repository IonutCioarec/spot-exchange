import { Fragment } from "react/jsx-runtime";
import 'assets/scss/pools.scss';
import useMobile from 'utils/responsive';
import { Pair, Token, TokenValue } from "types/backendTypes";
import { useState } from "react";
import { denominatedAmountToAmount } from 'utils/formatters';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Button } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { formatSignificantDecimals } from "utils/formatters";

interface PoolProps {
  pair: any;
  index: number,
  token1Details: TokenValue;
  token2Details: TokenValue;
}

export const Pool = ({ pair, index, token1Details, token2Details }: PoolProps) => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const token1DummyImg = 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png';
  const token2DummyImg = 'https://tools.multiversx.com/assets-cdn/devnet/tokens/MEX-a659d0/icon.png';

  const token1LiqPrice = token1Details?.price ? pair.liquidity_token1 * token1Details?.price : 0;
  const token2LiqPrice = token2Details?.price ? pair.liquidity_token2 * token2Details?.price : 0;
  const tokensLiquidityPrice = token1LiqPrice && token2LiqPrice ? token1LiqPrice + token2LiqPrice : 0;

  const token1Img = (token1Details?.logo_url && token1Details?.logo_url !== 'N/A') ? token1Details?.logo_url : token1DummyImg;
  const token2Img = (token2Details?.logo_url && token2Details?.logo_url !== 'N/A') ? token2Details?.logo_url : token2DummyImg;

  console.log(JSON.stringify(token1Details, null, 2));
  return (
    <Fragment>
      <div className="pool text-white">
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
            ${denominatedAmountToAmount(tokensLiquidityPrice, 18, 3)}
          </Col>
          <Col lg={2} className="text-right">
            <p className="mb-0 font-size-xxs text-silver">Volume(24h)</p>
            $24.7k
          </Col>
          <Col lg={3} className="text-right">
            <Button
              className="custom-success-btn text-uppercase"
              variant="outlined"
              size="small"
              color="success"
              onClick={() => setOpen(!open)}
            >
              {open ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              className="ms-2 custom-success-btn text-uppercase"
              variant="outlined"
              size="small"
              color="success"
            >
              Add
            </Button>
          </Col>
        </Row>
        {open && (
          <div className="mt-4" style={{ borderTop: '1px solid grey' }}>
            <p className="mt-1">Extra detalii... urmeaza</p>
          </div>
        )}
      </div>
    </Fragment>
  );
}