import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPairTokensById, selectLpTokensById, selectAllTokensById } from 'storeManager/slices/tokensSlice';
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
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faWallet, faCircleInfo, faGear, faRotate, faArrowRight, faArrowCircleRight, faCaretRight, faRightLong, faAnglesRight, faRetweet, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import InfoIcon from '@mui/icons-material/Info';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, InputAdornment } from '@mui/material';
import TokenSelector from 'components/Swap/TokenSelector';
import CustomTooltip from 'components/CustomTooltip';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';
import { useMobile } from 'utils/responsive';
import { useLocation } from 'react-router-dom';
import SimpleLoader from 'components/SimpleLoader';
import { AwesomeButton } from 'react-awesome-button';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';
import LightSpot from 'components/LightSpot';

const defaultTokenValues = {
  image_url: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png',
  name: 'TOKEN',
  price: 0,
  decimals: 18
}

const Swap = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState<boolean>(false);
  const allTokens = useSelector(selectAllTokensById);

  const userTokens = useSelector(selectUserTokens);
  const isMobile = useMobile();
  const { getSwapPrice } = useBackendAPI();

  // parse query parameters if they exist
  const location = useLocation();
  const getQueryParam = (param: string) => {
    const params = new URLSearchParams(location.search);
    const value = params.get(param);

    if (value) {
      const [firstPart, secondPart] = value.split('-');
      return firstPart.toUpperCase() + '-' + secondPart;
    }

    return null;
  };

  // Set token1 and token2 from query parameters or use defaults
  const [token1, setToken1] = useState<string>(getQueryParam('token1') || defaultSwapToken1);
  const [token2, setToken2] = useState<string>(getQueryParam('token2') || defaultSwapToken2);
  const [token1Amount, setToken1Amount] = useState<string>('');
  const [token2Amount, setToken2Amount] = useState<string>('');
  const [token1AmountPrice, setToken1AmountPrice] = useState<string>('0.000');
  const [token2AmountPrice, setToken2AmountPrice] = useState<string>('0.000');
  const [steps, setSteps] = useState([{}]);
  const [slippage, setSlippage] = useState('1.00');
  const [swapPrice, setSwapPrice] = useState<number | 0>(0);
  const [showSlippageModal, setShowSlippageModal] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState('0');

  const handleShowSlippageModal = () => setShowSlippageModal(!showSlippageModal);

  const getPrice = async (fromToken: string, toToken: string, amount: string) => {
    const amountScaled = amountToDenominatedAmount(amount, allTokens[fromToken]?.decimals ?? 18, 20);
    const priceResponse = await getSwapPrice(fromToken, toToken, amountScaled);

    if (!priceResponse) {
      return { swapPrice: '0', steps: [], exchangeRate: '0' };
    }

    const price = priceResponse?.final_output?.raw || '0';
    const steps = priceResponse?.steps || [];
    const rate = priceResponse ? priceResponse?.cumulative_exchange_rate?.formatted : '0';

    return {
      swapPrice: price,
      steps: steps,
      exchangeRate: rate
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
      setExchangeRate('0');
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken1Amount(formattedValue);

    if (value === '' || !token1 || !token2) {
      setToken2Amount('');
      return;
    }

    if (!token1 || !token2) return;
    const price = (await getPrice(token1, token2, parseFormattedNumber(rawValue).toString()));
    setToken2Amount(intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(price.swapPrice), 3)), 0, 20));

    const totalToken1UsdPrice = new BigNumber(allTokens[token1]?.price_usd ?? 0).multipliedBy(new BigNumber(rawValue));
    const totalToken2UsdPrice = new BigNumber(allTokens[token2]?.price_usd ?? 0).multipliedBy(new BigNumber(price.swapPrice));
    setToken1AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(totalToken1UsdPrice), 3)), 0, 20));
    setToken2AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(totalToken2UsdPrice), 3)), 0, 20));
    setExchangeRate(price.exchangeRate);

    if (price?.steps) {
      setSteps(price.steps);
    }
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
      setExchangeRate('0');
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken2Amount(formattedValue);

    if (value === '' || !token1 || !token2) {
      setToken1Amount('');
      return;
    }

    if (!token1 || !token2) return;
    const price = (await getPrice(token2, token1, parseFormattedNumber(rawValue).toString()));
    setToken1Amount(intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(price.swapPrice), 3)), 0, 20));
    const totalToken2UsdPrice = new BigNumber(allTokens[token2]?.price_usd ?? 0).multipliedBy(new BigNumber(rawValue));
    const totalToken1UsdPrice = new BigNumber(allTokens[token1]?.price_usd ?? 0).multipliedBy(new BigNumber(price.swapPrice));
    setToken1AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(totalToken1UsdPrice), 3)), 0, 20));
    setToken2AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(totalToken2UsdPrice), 3)), 0, 20));

    const price2 = (await getPrice(token1, token2, parseFormattedNumber(rawValue).toString()));
    if (price2.steps) {
      setSteps(price2.steps);
    }
    setExchangeRate(price2.exchangeRate);
  };

  const handleSlippageAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (isNaN(Number(value)) || !value) {
      setSlippage('');
      return;
    }
    if (Number(value) > 50) {
      setSlippage('50');
      return;
    }
    setSlippage(value);
  };

  const token1AmountChange = async (amount: string) => {
    const rawValue = amount.replace(/,/g, '');

    if (isNaN(Number(rawValue)) || !rawValue) {
      setToken1Amount('');
      setToken2Amount('');
      setToken1AmountPrice('0.000');
      setToken2AmountPrice('0.000');
      setExchangeRate('0');
      setSteps([{}]);
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken1Amount(formattedValue);

    if (amount === '' || !token1 || !token2) {
      setToken2Amount('');
      return;
    }

    const price = (await getPrice(token1, token2, parseFormattedNumber(rawValue).toString()));
    setToken2Amount(intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(price.swapPrice), 3)), 0, 20));

    const totalToken1UsdPrice = new BigNumber(allTokens[token1]?.price_usd ?? 0).multipliedBy(new BigNumber(rawValue));
    const totalToken2UsdPrice = new BigNumber(allTokens[token2]?.price_usd ?? 0).multipliedBy(new BigNumber(price.swapPrice));
    setToken1AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(totalToken1UsdPrice), 3)), 0, 20));
    setToken2AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(totalToken2UsdPrice), 3)), 0, 20));

    if (price?.steps) {
      setSteps(price.steps);
    }
  };

  const handleSwapTokens = async () => {
    const tempToken = token1;
    setToken1(token2);
    setToken2(tempToken);
    resetAmounts();
  };

  const handleMaxAmount = async () => {
    const newAmount = intlNumberFormat(Number(formatSignificantDecimals(Number(userTokens[token1]?.balance ?? 0), 3)), 3, 20);
    token1AmountChange(newAmount)
  };

  // update minReceived when token2Amount, token1Amount, or slippage change
  const [minReceived, setMinReceived] = useState<string>('0.000');
  useEffect(() => {
    const calculateMinReceived = () => {
      if (token2Amount && slippage) {
        const minValue = parseFormattedNumber(token2Amount) - (parseFormattedNumber(token2Amount) * (Number(slippage) / 100));
        setMinReceived(intlNumberFormat(Number(formatSignificantDecimals(minValue, 3)), 0, 20));
      }
    };

    calculateMinReceived();
  }, [token2Amount, token1Amount, slippage]);

  // refresh button
  const [refreshingAmount, setRefreshingAmount] = useState<boolean>(false);
  const handleRefreshingAmount = async () => {
    setRefreshingAmount(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    token1AmountChange(token1Amount);

    setRefreshingAmount(false);
  };

  const resetAmounts = () => {
    setToken1Amount('');
    setToken2Amount('');
    setToken1AmountPrice('0.000');
    setToken2AmountPrice('0.000');
    setSteps([{}]);
    setExchangeRate('0');
  };

  // Update token1 and token2 if query params change
  useEffect(() => {
    const token1FromQuery = getQueryParam('token1');
    const token2FromQuery = getQueryParam('token2');

    setToken1(token1FromQuery || defaultSwapToken1);
    setToken2(token2FromQuery || defaultSwapToken2);
  }, [location.search]);

  return (
    <Container className='swap-page-height font-rose'>
      <Row>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Swap</h2>
              <p className='text-white mb-0'>Multiversx's fastest exchange with a huge catalog of tokens</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className={`${isMobile ? 'mt-4' : 'mt-5'}`}>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className='swap-container text-white mt-1'>
            <p className='mb-0 ml-1 small'>From</p>
            <div className='d-flex justify-content-between mt-2 align-items-center gap-2 swap-token-container'>
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
                      fontSize: isMobile ? '20px' : '25px',
                      caretColor: 'white',
                      paddingLeft: '10px',
                      fontFamily: 'Red Rose'
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
                userTokens={userTokens}
                allTokens={allTokens}
                resetAmounts={resetAmounts}
              />
            </div>
            <div className={`d-flex justify-content-between align-items-center mt-2 ${isMobile ? 'mb-4' : ''}`} style={{ minHeight: '26px' }}>
              <div className='d-flex justify-content-start align-items-center ms-1'>
                <p className='text-silver font-size-sm mb-0'>${token1AmountPrice}</p>
              </div>
              <div className='d-flex justify-content-end align-items-center mr-2'>
                <p className='p-1 slippage-info me-2 cursor-pointer font-size-sm hover:text-[#3FAC5A]' onClick={handleMaxAmount} style={{ marginBottom: '-5px', marginTop: '-5px' }}>Max</p>
                <div className='me-1 text-[#3FAC5A]'><FontAwesomeIcon icon={faWallet} /></div>
                <p className='text-silver font-size-sm mb-0'>{intlNumberFormat(Number(formatSignificantDecimals(Number(userTokens[token1]?.balance ?? 0), 3)), 3, 20)}</p>
              </div>
            </div>
          </div>

          <div className='swap-delimitator d-flex align-items-center justify-content-center'>
            <div className='swap-delimitator-icon mt-0 d-flex align-items-center justify-content-center' style={{ width: '50px', height: '50px' }}>
              <AutorenewIcon className='full-blinking-icon default-icon' style={{ fontSize: '30px' }} onClick={handleSwapTokens} />
              <AutorenewIcon className='full-animated-icon hover-icon' style={{ fontSize: '30px' }} onClick={handleSwapTokens} />
            </div>
          </div>

          <div className={`swap-container ${isMobile ? '' : 'mt-1'} text-white`}>
            {refreshingAmount &&
              <SimpleLoader />
            }
            <div className='d-flex justify-content-between align-items-center'>
              <p className='mb-0 ml-1 small'>To</p>
              {!refreshingAmount &&
                <p className='font-size-md text-white mb-0 cursor-pointer' onClick={handleRefreshingAmount}>
                  <span className='slippage-info me-1'><WifiProtectedSetupIcon fontSize='small' className='full-animated-icon me-1 hover:text-[#3FAC5A]' /></span>
                </p>
              }
            </div>
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
                      fontSize: isMobile ? '20px' : '25px',
                      caretColor: 'white',
                      paddingLeft: '10px',
                      fontFamily: 'Red Rose'
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
                userTokens={userTokens}
                allTokens={allTokens}
                resetAmounts={resetAmounts}
              />
            </div>
            <div className='d-flex justify-content-between align-items-center mt-2' style={{ minHeight: '26px' }}>
              <div className='d-flex justify-content-start align-items-center ms-1'>
                <p className='text-silver font-size-sm mb-0'>${token2AmountPrice}</p>
              </div>
              <div className='d-flex justify-content-end align-items-center mr-2'>
                <div className='me-1 text-[#3FAC5A]'><FontAwesomeIcon className='' icon={faWallet} /></div>
                <p className='text-silver font-size-sm mb-0'>{intlNumberFormat(Number(formatSignificantDecimals(Number(userTokens[token2]?.balance ?? 0), 3)), 3, 20)}</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row className='d-flex align-items-start mt-2'>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className='p-3 mt-1 b-r-sm' style={{ border: '1px solid #3FAC5A' }}>
            {Number(exchangeRate) > 0 &&
              <div className='d-flex justify-content-between align-items-center'>
                <p className='text-silver font-size-sm mb-0'>{!isMobile ? 'Swap ' : ''}Rate</p>
                <p className='font-size-sm text-white mb-0'>
                  <span className='me-1'>1</span>
                  {allTokens[token1]?.ticker ?? ''} ≃ {intlNumberFormat(Number(formatSignificantDecimals(Number(exchangeRate), 3)), 3, 20)} {allTokens[token2]?.ticker ?? ''}
                </p>
              </div>
            }
            <div className='d-flex justify-content-between align-items-center mt-1'>
              <p className='text-silver font-size-sm mb-0'>Slippage
                <span className='slippage-info ms-2 text-[#3FAC5A]'>
                  <CustomTooltip key="unstake" title={`You agree to receive up to ${slippage}% less than the expected amount.`}>
                    <FontAwesomeIcon icon={faCircleInfo} className="mt-1" />
                  </CustomTooltip>
                </span>
              </p>
              <p className='font-size-sm text-white mb-0 cursor-pointer' onClick={handleShowSlippageModal}>{intlNumberFormat(Number(slippage))}%
                <span className='slippage-info ms-2'><FontAwesomeIcon icon={faGear} className='mt-1 full-animated-icon text-[#3FAC5A]' /></span>
              </p>
            </div>
            {showSlippageModal &&
              <div className={`d-flex justify-content-between align-items-center mt-1 swap-token-container b-r-xs py-2 px-3 ${isMobile ? 'font-size-xs' : ''}`}>
                <div className='font-size-sm text-white text-center input-container  bg-[#3FAC5A] p-1 b-r-sm' style={{ minWidth: isMobile ? '23%' : '20%' }} onClick={() => { setSlippage('1'); setShowSlippageModal(false) }}>1.00%</div>
                <div className='font-size-sm text-white text-center input-container bg-[#3FAC5A] p-1 b-r-sm' style={{ minWidth: isMobile ? '23%' : '20%' }} onClick={() => { setSlippage('5'); setShowSlippageModal(false) }}>5.00%</div>
                {!isMobile &&
                  <div className='font-size-sm text-white text-center input-container bg-[#3FAC5A] p-1 b-r-sm' style={{ minWidth: '20%' }} onClick={() => { setSlippage('10'); setShowSlippageModal(false) }}>10.00%</div>
                }
                <div className='d-flex align-items-center text-white text-center input-container bg-[#3FAC5A] p-1 b-r-sm' style={{ maxWidth: isMobile ? '45%' : '30%' }}>
                  <span className='font-size-sm text-white'>Custom:</span>
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
                        marginTop: isMobile ? '-5px' : '1px',
                        marginBottom: isMobile ? '-11px' : '-5px',
                        fontFamily: 'Red Rose'
                      },
                      endAdornment: (
                        <InputAdornment position="end" sx={{ marginTop: '-5px' }}>
                          <span className={`text-white ${isMobile ? 'font-size-xs' : ''}`}>%</span>
                        </InputAdornment>
                      ),
                    }}
                    className='mb-0 font-size-sm'
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
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='d-flex justify-content-start'>
                    <p className='text-silver font-size-sm mb-0 mt-1'>Price Impact</p>
                    <div>
                      {steps.map((step: any, index: number) => (
                        <p className='text-silver font-size-sm m-b-n-xs ms-2 mt-1' key={`step-${index}`}>
                          <FontAwesomeIcon icon={faCaretRight} className='me-1 text-[#3FAC5A]' />
                          <span className='text-[#3FAC5A] font-bold font-size-xs'>
                            {allTokens[step?.token_in]?.ticker ?? 'TOKEN'} {'/'} {allTokens[step?.token_out]?.ticker ?? 'TOKEN'}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    {steps.map((step: any, index: number) => (
                      <div className='d-flex justify-content-between align-items-center' key={`step2-${index}`}>

                        <p className='font-size-sm text-white mb-0'>
                          {formatSignificantDecimals(Number(step?.price_impact?.formatted || 0), 2)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='text-silver font-size-sm mb-0'>Route</p>
                  <div className='d-flex justify-content-end align-items-center text-white '>
                    {steps.map((step: any, index: number) => (
                      <Fragment key={`route-${index}`}>
                        <CustomTooltip key={`t-route-${index}`} title={`${allTokens[step?.token_in]?.ticker} > ${allTokens[step?.token_out]?.ticker}`}>
                          <div className='bg-[#32323299] d-flex justify-content-end align-items-center text-white p-1 b-r-sm'>
                            <img
                              src={allTokens[step?.token_in]?.logo_url ?? defaultTokenValues.image_url}
                              alt={allTokens[step?.token_in]?.ticker}
                              style={{ width: 20, height: 20, border: '1px solid #202020' }}
                              className='b-r-sm'
                            />
                            <span className='mx-1'><FontAwesomeIcon icon={faCaretRight} size='xs' /></span>
                            <img
                              src={allTokens[step?.token_out]?.logo_url ?? defaultTokenValues.image_url}
                              alt={allTokens[step?.token_out]?.ticker}
                              style={{ width: 20, height: 20, border: '1px solid #202020' }}
                              className='b-r-sm'
                            />
                          </div>
                        </CustomTooltip>
                        {index < steps.length - 1 && <p className='mx-2 mb-0 font-size-sm' style={{ marginTop: '-3px' }}>|</p>}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            ) : (
              ''
            )}

            {parseFormattedNumber(token2Amount) > 0 && (
              <div className='d-flex justify-content-between align-items-center'>
                <p className='text-silver font-size-sm mb-0'>Minimum Received</p>
                <p className='font-size-sm text-white mb-0'>
                  {minReceived}
                </p>
              </div>
            )}
          </div>
          <Button
            className="btn-intense-green hover-btn fullWidth mt-3 font-size-sm mb-5"
          >
            SWAP
          </Button>
        </Col>

      </Row>

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </Container>
  );
}

export default Swap;