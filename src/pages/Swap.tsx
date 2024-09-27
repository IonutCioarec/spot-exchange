import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPairTokensById, selectLpTokensById } from 'storeManager/slices/tokensSlice';
import { selectUserTokens } from 'storeManager/slices/userTokensSlice';
import FilterLoader from 'components/Pools/FilterLoader';
import { denominatedAmountToIntlFormattedAmount, denominatedAmountToAmount, amountToDenominatedAmount, formatSignificantDecimals, intlNumberFormat, formatNumberWithCommas, parseFormattedNumber } from 'utils/formatters';
import { useGetAccountInfo } from 'hooks';
import { useBackendAPI } from 'hooks/useBackendAPI';
import 'assets/scss/swap.scss';
import { Container, Row, Col } from 'react-bootstrap';
import BigNumber from 'bignumber.js';
import { SwapPrice } from 'types/backendTypes';
import { KeyboardArrowDown } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WalletIcon from '@mui/icons-material/Wallet';
import SouthIcon from '@mui/icons-material/South';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faWallet, faCircleInfo, faGear } from '@fortawesome/free-solid-svg-icons';
import InfoIcon from '@mui/icons-material/Info';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import TokenSelector from 'components/Swap/TokenSelector';
import { useIntl } from 'react-intl';

const defaultTokenValues = {
  image_url: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png',
  name: 'TOKEN',
  price: 0,
  decimals: 18
}

const Swap = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState<boolean>(false);
  const pairTokens = useSelector(selectPairTokensById);
  const userTokens = useSelector(selectUserTokens);
  const { getSwapPrice } = useBackendAPI();

  // useEffect(() => {
  //   const interval = window.setInterval(() => {
  //     getPrice();
  //   }, 3000);

  //   return () => window.clearInterval(interval);
  // }, []);

  // the modal to select the token to swap (token1)
  const [token1, setToken1] = useState<string>('WEGLD-a28c59');
  const [token2, setToken2] = useState<string>('MEX-a659d0');
  const [token1Amount, setToken1Amount] = useState<string>('');
  const [token2Amount, setToken2Amount] = useState<string>('');
  const [swapPrice, setSwapPrice] = useState<number | 0>(0);
  const intl = useIntl();

  const getPrice = async (fromToken: string, toToken: string, amount: string) => {
    const amountScaled = amountToDenominatedAmount(amount, pairTokens[fromToken].decimals, 20);
    const priceResponse = await getSwapPrice(fromToken, toToken, amountScaled);

    const price = priceResponse?.final_output?.formatted || '0';
    return price;
  };

  const handleToken1AmountChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const rawValue = value.replace(/,/g, '');

    if (isNaN(Number(rawValue))) {
      setToken1Amount('');
      setToken2Amount('');
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken1Amount(formattedValue);

    if (value === '' || !token1 || !token2) {
      setToken2Amount('');
      return;
    }

    const price = await getPrice(token1, token2, parseFormattedNumber(rawValue).toString());
    setToken2Amount(intlNumberFormat(parseFloat(price), 0, 4));
  };

  const handleToken2AmountChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const rawValue = value.replace(/,/g, '');

    if (isNaN(Number(rawValue))) {
      setToken1Amount('');
      setToken2Amount('');
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken2Amount(formattedValue);

    if (value === '' || !token1 || !token2) {
      setToken1Amount('');
      return;
    }

    const price = await getPrice(token2, token1, parseFormattedNumber(rawValue).toString());
    setToken1Amount(intlNumberFormat(parseFloat(price), 0, 4));
  };

  const resetAmounts = () => {
    setToken1Amount('');
    setToken2Amount('');
  };

  return (
    <Container>
      <Row className='mt-5'>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <p className='h4 mt-5 text-white'>Swap Details</p>
          <div className='swap-container text-white' style={{ maxWidth: '100%' }}>
            <div className='d-flex justify-content-between align-items-center gap-4 swap-token-container'>
              <div className='input-container b-r-sm'>
                <TextField
                  id="first-token"
                  placeholder='0.00'
                  type="text"
                  value={token1Amount}
                  onChange={handleToken1AmountChange}
                  size="medium"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'white',
                      border: 'none',
                      fontSize: '25px',
                      caretColor: 'white',
                      paddingLeft: '10px',
                    },
                  }}
                  className='mb-0'
                />
              </div>
              <TokenSelector
                tokenType="token1"
                selectedToken={token1}
                setSelectedToken={setToken1}
                excludedToken={token2}
                pairTokens={pairTokens}
                userTokens={userTokens}
                resetAmounts={resetAmounts}
              />
            </div>
            <div className='d-flex justify-content-between align-items-center px-1 mt-1'>
              <div className='d-flex justify-content-start align-items-center ms-2'>
                <div className='me-1 text-[#0b8832]'><FontAwesomeIcon icon={faMoneyBill} style={{ marginTop: '5px' }} /></div>
                <p className='text-silver font-size-sm mb-0'>$123</p>
              </div>
              <div className='d-flex justify-content-end align-items-center mr-5'>
                <div className='me-1 text-[#0b8832]'><FontAwesomeIcon icon={faWallet} /></div>
                <p className='text-silver font-size-sm mb-0'>8,975.4</p>
              </div>
            </div>
          </div>

          <div className='swap-delimitator'>
            <div className='swap-delimitator-icon mt-0'><SouthIcon className='mb-2' style={{ fontSize: '30px' }} /></div>
          </div>

          <div className='swap-container mt-1 text-white'>
            <div className='d-flex justify-content-between align-items-center gap-4 swap-token-container mt-2'>
              <div className='input-container b-r-sm'>
                <TextField
                  id="second-token"
                  placeholder='0.00'
                  type="text"
                  value={token2Amount}
                  onChange={handleToken2AmountChange}
                  size="medium"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'white',
                      border: 'none',
                      fontSize: '25px',
                      caretColor: 'white',
                      paddingLeft: '10px',
                    },
                  }}
                  className='mb-0'
                />
              </div>
              <TokenSelector
                tokenType="token2"
                selectedToken={token2}
                setSelectedToken={setToken2}
                excludedToken={token1}
                pairTokens={pairTokens}
                userTokens={userTokens}
                resetAmounts={resetAmounts}
              />
            </div>
            <div className='d-flex justify-content-between align-items-center px-1 mt-1'>
              <div className='d-flex justify-content-start align-items-center ms-2'>
                <div className='me-1 text-[#0b8832]'><FontAwesomeIcon icon={faMoneyBill} style={{ marginTop: '5px' }} /></div>
                <p className='text-silver font-size-sm mb-0'>123</p>
              </div>
              <div className='d-flex justify-content-end align-items-center mr-5'>
                <div className='me-1 text-[#0b8832]'><FontAwesomeIcon icon={faWallet} /></div>
                <p className='text-silver font-size-sm mb-0'>8,975.4</p>
              </div>
            </div>
          </div>
          <div className='p-3 mt-1 b-r-sm' style={{ border: '1px solid #0b4932' }}>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='text-silver font-size-sm mb-0'>Swap rate</p>
              <p className='font-size-sm text-white mb-0'>1 MEX ≃ 0.003 WEGLD</p>
            </div>
            <div className='d-flex justify-content-between align-items-center mt-1'>
              <p className='text-silver font-size-sm mb-0'>Price Impact</p>
              <p className='font-size-sm text-white mb-0'>0.02%</p>
            </div>
            <div className='d-flex justify-content-between align-items-center mt-1'>
              <p className='text-silver font-size-sm mb-0'>Slippage
                <span className='slippage-info ms-2'><FontAwesomeIcon icon={faCircleInfo} className='mt-1' /></span>
              </p>
              <p className='font-size-sm text-white mb-0'>1.00%
                <span className='slippage-info ms-2'><FontAwesomeIcon icon={faGear} className='mt-1' /></span>
              </p>
            </div>
            <div className='d-flex justify-content-between align-items-center mt-1'>
              <p className='text-silver font-size-sm mb-0'>Minimum Received</p>
              <p className='font-size-sm text-white mb-0'>8,975.4</p>
            </div>
          </div>
          <div className='mt-1 mb-5'>
            <Button className='btn-green3' fullWidth>
              Swap Tokens
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Swap;