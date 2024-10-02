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
import { faMoneyBill, faWallet, faCircleInfo, faGear, faRotate, faArrowRight, faArrowCircleRight, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import InfoIcon from '@mui/icons-material/Info';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, InputAdornment } from '@mui/material';
import TokenSelector from 'components/Swap/TokenSelector';

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

  // the modal to select the token to swap (token1)
  const [token1, setToken1] = useState<string>('WEGLD-a28c59');
  const [token2, setToken2] = useState<string>('MEX-a659d0');
  const [token1Amount, setToken1Amount] = useState<string>('');
  const [token2Amount, setToken2Amount] = useState<string>('');
  const [token1AmountPrice, setToken1AmountPrice] = useState<string>('0.000');
  const [token2AmountPrice, setToken2AmountPrice] = useState<string>('0.000');
  const [reversedExchangeRate, setReversedExchangeRate] = useState<boolean>(false);
  const [steps, setSteps] = useState([{}]);
  const [slippage, setSlippage] = useState('1.00');
  const [swapPrice, setSwapPrice] = useState<number | 0>(0);
  const [showSlippageModal, setShowSlippageModal] = useState<boolean>(false);

  const handleShowSlippageModal = () => setShowSlippageModal(!showSlippageModal);

  const getPrice = async (fromToken: string, toToken: string, amount: string) => {
    const amountScaled = amountToDenominatedAmount(amount, pairTokens[fromToken]?.decimals ?? 18, 20);
    const priceResponse = await getSwapPrice(fromToken, toToken, amountScaled);

    console.log(JSON.stringify(priceResponse, null, 2));

    const price = priceResponse?.final_output?.formatted || '0';
    return {
      swapPrice: price,
      steps: priceResponse?.steps
    };
  };

  const handleToken1AmountChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const rawValue = value.replace(/,/g, '');

    if (isNaN(Number(rawValue)) || !rawValue) {
      setToken1Amount('');
      setToken2Amount('');
      setToken1AmountPrice('0.000');
      setToken2AmountPrice('0.000');
      setSteps([{}]);
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken1Amount(formattedValue);

    if (value === '' || !token1 || !token2) {
      setToken2Amount('');
      return;
    }

    const price = (await getPrice(token1, token2, parseFormattedNumber(rawValue).toString()));
    setToken2Amount(intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(price.swapPrice), 3)), 0, 20));

    const totalToken1UsdPrice = new BigNumber(pairTokens[token1]?.price ?? 0).multipliedBy(new BigNumber(rawValue));
    const totalToken2UsdPrice = new BigNumber(pairTokens[token2]?.price ?? 0).multipliedBy(new BigNumber(price.swapPrice));
    setToken1AmountPrice(intlNumberFormat(Number(totalToken1UsdPrice), 3, 3));
    setToken2AmountPrice(intlNumberFormat(Number(totalToken2UsdPrice), 3, 3));
    setSteps(price?.steps);
  };

  const handleToken2AmountChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const rawValue = value.replace(/,/g, '');

    if (isNaN(Number(rawValue)) || !rawValue) {
      setToken1Amount('');
      setToken2Amount('');
      setToken1AmountPrice('0.000');
      setToken2AmountPrice('0.000');
      setSteps([{}]);
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken2Amount(formattedValue);

    if (value === '' || !token1 || !token2) {
      setToken1Amount('');
      return;
    }
    const price = (await getPrice(token2, token1, parseFormattedNumber(rawValue).toString())).swapPrice;
    setToken1Amount(intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(price), 3)), 0, 20));

    const totalToken2UsdPrice = new BigNumber(pairTokens[token2]?.price ?? 0).multipliedBy(new BigNumber(rawValue));
    const totalToken1UsdPrice = new BigNumber(pairTokens[token1]?.price ?? 0).multipliedBy(new BigNumber(price));
    setToken1AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(totalToken1UsdPrice), 3)), 0, 20));
    setToken2AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(totalToken2UsdPrice), 3)), 0, 20));

    const steps = (await getPrice(token1, token2, parseFormattedNumber(rawValue).toString())).steps;
    setSteps(steps);
  };

  const handleSlippageAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (isNaN(Number(value)) || !value) {
      setSlippage('');
      return;
    }
    if (Number(value) > 50) {
      setSlippage('50')
      return;
    }
    setSlippage(value);
  };

  // Add the default swap rate: 1 token -> x token2
  const [defaultExchangePrice, setDefaultExchangePrice] = useState<string>('');
  useEffect(() => {
    const fetchDefaultPrice = async () => {
      const price = await getPrice(token1, token2, '1');
      setDefaultExchangePrice(intlNumberFormat(Number(formatSignificantDecimals(Number(price.swapPrice), 3)), 0, 20));
    };
    fetchDefaultPrice();
  }, [token1, token2]);

  const handleReversedExchangeRate = async () => {
    const price = reversedExchangeRate
      ? await getPrice(token1, token2, '1')
      : await getPrice(token2, token1, '1');

    setDefaultExchangePrice(intlNumberFormat(Number(formatSignificantDecimals(Number(price.swapPrice), 3)), 0, 20));
  };

  const resetAmounts = () => {
    setToken1Amount('');
    setToken2Amount('');
    setToken1AmountPrice('0.000');
    setToken2AmountPrice('0.000');
    setDefaultExchangePrice('0.000');
    setSteps([{}]);
    handleReversedExchangeRate();
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
                  placeholder='0.000'
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
                <p className='text-silver font-size-sm mb-0'>${token1AmountPrice}</p>
              </div>
              <div className='d-flex justify-content-end align-items-center mr-5'>
                <div className='me-1 text-[#0b8832]'><FontAwesomeIcon icon={faWallet} /></div>
                <p className='text-silver font-size-sm mb-0'>{intlNumberFormat(Number(formatSignificantDecimals(Number(userTokens[token1]?.balance ?? 0), 3)), 3, 20)}</p>
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
                  placeholder='0.000'
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
                <p className='text-silver font-size-sm mb-0'>${token2AmountPrice}</p>
              </div>
              <div className='d-flex justify-content-end align-items-center mr-5'>
                <div className='me-1 text-[#0b8832]'><FontAwesomeIcon icon={faWallet} /></div>
                <p className='text-silver font-size-sm mb-0'>{intlNumberFormat(Number(formatSignificantDecimals(Number(userTokens[token2]?.balance ?? 0), 3)), 3, 20)}</p>
              </div>
            </div>
          </div>
          <div className='p-3 mt-1 b-r-sm' style={{ border: '1px solid #0b4932' }}>
            <div className='d-flex justify-content-between align-items-center'>
              <p className='text-silver font-size-sm mb-0'>Swap rate</p>
              <p className='font-size-sm text-white mb-0'>
                <span className='me-1'>1</span>
                {pairTokens[reversedExchangeRate ? token2 : token1]?.ticker ?? ''} ≃ {defaultExchangePrice} {pairTokens[reversedExchangeRate ? token1 : token2]?.ticker ?? ''}
                <span className='slippage-info ms-2' onClick={() => { setReversedExchangeRate(!reversedExchangeRate); handleReversedExchangeRate(); }}><FontAwesomeIcon icon={faRotate} className='mt-1 full-animated-icon text-[#0b8832]' /></span>
              </p>
            </div>
            <div className='d-flex justify-content-between align-items-center mt-1'>
              <p className='text-silver font-size-sm mb-0'>Slippage
                <span className='slippage-info ms-2'><FontAwesomeIcon icon={faCircleInfo} className='mt-1' /></span>
              </p>
              <p className='font-size-sm text-white mb-0 cursor-pointer' onClick={handleShowSlippageModal}>{intlNumberFormat(Number(slippage))}%
                <span className='slippage-info ms-2'><FontAwesomeIcon icon={faGear} className='mt-1 full-animated-icon text-[#0b8832]' /></span>
              </p>
            </div>
            {showSlippageModal &&
              <div className='d-flex justify-content-between align-items-center mt-1 swap-token-container b-r-xs py-2 px-3'>
                <div className='text-white text-center input-container  bg-[#041810] p-2 b-r-sm' style={{ minWidth: '20%' }} onClick={() => { setSlippage('1'); setShowSlippageModal(false) }}>1.00%</div>
                <div className='text-white text-center input-container bg-[#041810] p-2 b-r-sm' style={{ minWidth: '20%' }} onClick={() => { setSlippage('5'); setShowSlippageModal(false) }}>5.00%</div>
                <div className='text-white text-center input-container bg-[#041810] p-2 b-r-sm' style={{ minWidth: '20%' }} onClick={() => { setSlippage('10'); setShowSlippageModal(false) }}>10.00%</div>
                <div className='d-flex align-items-center text-white text-center input-container bg-[#041810] p-2 b-r-sm' style={{ maxWidth: '30%' }}>
                  <span className='text-silver'>Custom:</span>
                  <TextField
                    id="custom-slippage"
                    placeholder='Custom'
                    type="text"
                    value={slippage}
                    onChange={handleSlippageAmount}
                    onBlur={() => setShowSlippageModal(false)}
                    size="small"
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      style: {
                        color: 'white',
                        border: 'none',
                        fontSize: '14px',
                        caretColor: 'white',
                        paddingLeft: '10px',
                        marginTop: '3px',
                        marginBottom: '-3px'
                      },
                      endAdornment: (
                        <InputAdornment position="end" sx={{ marginTop: '-5px' }}>
                          <span className='text-white'>%</span>
                        </InputAdornment>
                      ),
                    }}
                    className='mb-0'
                    sx={{
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                        display: "none",
                      },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    }}
                  />
                </div>
              </div>
            }
            {steps.some(step => Object.keys(step).length > 0) ? (
              <Fragment>
                <p className='text-silver font-size-sm mb-0 mt-1'>Price Impact</p>
                {steps.map((step: any, index: number) => (
                  <div className='d-flex justify-content-between align-items-center' key={`step-${index}`}>
                    <p className='text-silver font-size-sm mb-0 ms-2'>
                      <FontAwesomeIcon icon={faCaretRight} className='me-1' />
                      <span className='text-[#0b8832] font-bold'>
                        {pairTokens[step?.token_in]?.ticker ?? 'TOKEN'} {'/'} {pairTokens[step?.token_out]?.ticker ?? 'TOKEN'}
                      </span>
                    </p>
                    <p className='font-size-sm text-white mb-0'>
                      {formatSignificantDecimals(Number(step?.price_impact?.formatted || 0), 2)}%
                    </p>
                  </div>
                ))}
              </Fragment>
            ) : (
              ''
            )}

            {parseFormattedNumber(token2Amount) > 0 && (
              <div className='d-flex justify-content-between align-items-center mt-1'>
                <p className='text-silver font-size-sm mb-0'>Minimum Received</p>
                <p className='font-size-sm text-white mb-0'>
                  {intlNumberFormat(parseFormattedNumber(token2Amount) - (parseFormattedNumber(token2Amount) * (Number(slippage) / 100)), 0, 3)}
                </p>
              </div>
            )}
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