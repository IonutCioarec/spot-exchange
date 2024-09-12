import { Fragment } from "react/jsx-runtime";
import 'assets/scss/pools.scss';
import useMobile from 'utils/responsive';
import { Pair } from "types/backendTypes";
import { useState } from "react";
import { denominatedAmountToAmount } from 'utils/formatters';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Button } from "@mui/material";

export const Pool = (pair: any) => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const token1_img = 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png';
  const token2_img = 'https://tools.multiversx.com/assets-cdn/devnet/tokens/MEX-a659d0/icon.png';

  return (
    <Fragment>
      <div className="pool text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <img src={token1_img} alt={pair.token1} className='d-inline' style={{ width: 30, height: 30, marginRight: 5 }} />
            <img src={token2_img} alt={pair.token2} className='d-inline' style={{ width: 30, height: 30, marginRight: 5 }} />
            <span> WEGLD / MEX</span>
          </div>
          <div>
            {denominatedAmountToAmount(parseFloat(pair.pair.liquidity_token1) + parseFloat(pair.pair.liquidity_token2), 18, 3)}
          </div>
          <div>
            <Button
              className="custom-btn"
              variant="outlined"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Button>
          </div>
        </div>
        {open && (
          <div className="mt-4" style={{ borderTop: '1px solid grey' }}>
            <p className="mt-1">Extra detalii... urmeaza</p>
          </div>
        )}
      </div>
    </Fragment>
  );
}