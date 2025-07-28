import { Fragment, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import { selectUserTokens } from 'storeManager/slices/userTokensSlice';
import { amountToDenominatedAmount, formatSignificantDecimals, intlNumberFormat, formatNumberWithCommas, parseFormattedNumber } from 'utils/formatters';
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import { useBackendAPI } from 'hooks/useBackendAPI';
import 'assets/scss/swap.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { SwapRouteV2 } from 'types/backendTypes';
import TextField from '@mui/material/TextField';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faCircleInfo, faGear, faCaretRight, } from '@fortawesome/free-solid-svg-icons';
import { Button, InputAdornment } from '@mui/material';
import TokenSelector from 'components/Swap/TokenSelector';
import CustomTooltip from 'components/CustomTooltip';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';
import { useMobile } from 'utils/responsive';
import { Link, useLocation } from 'react-router-dom';
import SimpleLoader from 'components/SimpleLoader';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';
import LightSpot from 'components/LightSpot';
import { debounce } from 'lodash';
import { debounceSearchTime } from 'config';
import ScrollToTopButton from 'components/ScrollToTopButton';
import defaultLogo from 'assets/img/default_token_image.png';
import { useSwapTokensV2 } from 'hooks/transactions/useSwapTokensV2';
import toast from 'react-hot-toast';

const defaultTokenValues = {
  image_url: defaultLogo,
  name: 'TOKEN',
  price: 0,
  decimals: 18
}


const Swap = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = useGetIsLoggedIn();
  const [loading, setLoading] = useState<boolean>(false);
  const allTokens = useSelector(selectAllTokensById);

  const userTokens = useSelector(selectUserTokens);
  const isMobile = useMobile();
  const { getSwapRoutesV2 } = useBackendAPI();

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
  const [routes, setRoutes] = useState<SwapRouteV2[]>([]);
  const [slippage, setSlippage] = useState('1.00');
  const [showSlippageModal, setShowSlippageModal] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState('0');
  const [activeContainer1, setActiveContainer1] = useState<boolean>(false);
  const [activeContainer2, setActiveContainer2] = useState<boolean>(false);
  const [swapTx, setSwapTx] = useState<string>('');
  const [minReceived, setMinReceived] = useState<string>('0.000');

  const handleShowSlippageModal = () => setShowSlippageModal(!showSlippageModal);

  const getRoutes = async (fromToken: string, toToken: string, amount: string, slippage: number = 0.01) => {
    const amountScaled = amountToDenominatedAmount(amount, allTokens[fromToken]?.decimals ?? 18, 20);
    if (parseFloat(amountScaled) === 0) {
      return { swapPrice: '0', routes: [], exchangeRate: '0', swapTx: '', amountOutMin: '0.000', amountInUsd: '0.000', amountOutUsd: '0.000' };
    }

    const priceResponse = await getSwapRoutesV2(fromToken, toToken, amount, slippage);
    if (!priceResponse) {
      return { swapPrice: '0', routes: [], exchangeRate: '0', swapTx: '', amountOutMin: '0.000', amountInUsd: '0.000', amountOutUsd: '0.000' };
    }

    const price = priceResponse?.amount_out || '0';
    const routes = priceResponse?.route || [];
    const rate = priceResponse ? priceResponse?.exchange_rate : '0';

    return {
      swapPrice: price,
      routes: routes,
      exchangeRate: rate,
      swapTx: priceResponse?.tx_data,
      amountOutMin: priceResponse.amount_out_min,
      amountInUsd: priceResponse.amount_in_usd,
      amountOutUsd: priceResponse.amount_out_usd
    };
  };

  const handleToken1AmountChange = (input: any) => {
    let value: string;
    if (typeof input === 'string') {
      value = input;
    } else {
      value = input.target.value;
    }
    const rawValue = value.replace(/,/g, '');

    if (rawValue === '' || isNaN(Number(rawValue)) || !rawValue) {
      debouncedToken1Calculation.cancel();
      setToken1Amount('');
      setToken2Amount('');
      setToken1AmountPrice('0.000');
      setToken2AmountPrice('0.000');
      setRoutes([]);
      setExchangeRate('0');
      setActiveContainer1(false);
      setActiveContainer2(false);
      return;
    }

    if (parseFloat(rawValue) === 0 && !rawValue.includes('.')) {
      debouncedToken1Calculation.cancel();
      setToken1Amount('0');
      setToken2Amount('0');
      setToken1AmountPrice('0.000');
      setToken2AmountPrice('0.000');
      setRoutes([]);
      setExchangeRate('0');
      setActiveContainer1(false);
      setActiveContainer2(false);
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken1Amount(formattedValue);

    if (!token1 || !token2) return;

    debouncedToken1Calculation(rawValue);
    setActiveContainer1(true);
    setActiveContainer2(false);
  };

  const handleToken2AmountChange = (input: any) => {
    let value: string;
    if (typeof input === 'string') {
      value = input;
    } else {
      value = input.target.value;
    }
    const rawValue = value.replace(/,/g, '');

    if (rawValue === '' || isNaN(Number(rawValue)) || !rawValue) {
      debouncedToken2Calculation.cancel();
      setToken1Amount('');
      setToken2Amount('');
      setToken1AmountPrice('0.000');
      setToken2AmountPrice('0.000');
      setRoutes([]);
      setExchangeRate('0');
      setActiveContainer1(false);
      setActiveContainer2(false);
      return;
    }

    if (parseFloat(rawValue) === 0 && !rawValue.includes('.')) {
      debouncedToken2Calculation.cancel();
      setToken1Amount('0');
      setToken2Amount('0');
      setToken1AmountPrice('0.000');
      setToken2AmountPrice('0.000');
      setRoutes([]);
      setExchangeRate('0');
      setActiveContainer1(false);
      setActiveContainer2(false);
      return;
    }

    const formattedValue = formatNumberWithCommas(rawValue);
    setToken2Amount(formattedValue);

    if (!token1 || !token2) return;

    debouncedToken2Calculation(rawValue);
    setActiveContainer2(true);
    setActiveContainer1(false);
  };

  // Define the debounced functions
  const debouncedToken1Calculation = useCallback(
    debounce(async (rawValue: string) => {
      if (!token1 || !token2) return;

      const price = await getRoutes(token1, token2, parseFormattedNumber(rawValue).toString(), parseFloat(slippage) / 100);
      setSwapTx(price.swapTx);
      setToken2Amount(intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(price.swapPrice), 3)), 0, 20));

      setToken1AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(price.amountInUsd), 3)), 0, 20));
      setToken2AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(price.amountOutUsd), 3)), 0, 20));
      setExchangeRate(price.exchangeRate);
      setMinReceived(intlNumberFormat(Number(formatSignificantDecimals(Number(price.amountOutMin || '0.000'), 3)), 0, 20));

      if (price?.routes) {
        setRoutes(price.routes);
      }
    }, debounceSearchTime),
    [token1, token2, allTokens, slippage]
  );

  const debouncedToken2Calculation = useCallback(
    debounce(async (rawValue: string) => {
      if (!token1 || !token2) return;

      const price = await getRoutes(token2, token1, parseFormattedNumber(rawValue).toString(), parseFloat(slippage) / 100);
      setToken1Amount(intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(price.swapPrice), 3)), 0, 20));

      setToken1AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(price.amountInUsd), 3)), 0, 20));
      setToken2AmountPrice(intlNumberFormat(Number(formatSignificantDecimals(Number(price.amountOutUsd), 3)), 0, 20));

      const price2 = await getRoutes(token1, token2, parseFormattedNumber(rawValue).toString(), parseFloat(slippage) / 100);
      if (price2.routes) {
        setRoutes(price2.routes);
      }
      setExchangeRate(price2.exchangeRate);
      setSwapTx(price2.swapTx);
      setMinReceived(intlNumberFormat(Number(formatSignificantDecimals(Number(price2.amountOutMin || '0.000'), 3)), 0, 20));
    }, debounceSearchTime),
    [token1, token2, allTokens, slippage]
  );

  const handleSlippageAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (isNaN(Number(value)) || !value) {
      setSlippage('');
      return;
    }
    if (Number(value) > 50) {
      setSlippage('50');
    }
    setSlippage(value);
  };

  useEffect(() => {
    if (!token1 || !token2) return;
    if (!token1Amount || isNaN(parseFormattedNumber(token1Amount))) return;
    if (!token2Amount || isNaN(parseFormattedNumber(token2Amount))) return;

    if (activeContainer1) {
      debouncedToken1Calculation(parseFormattedNumber(token1Amount).toString());
    }
    if (activeContainer2) {
      debouncedToken2Calculation(parseFormattedNumber(token2Amount).toString());
    }
  }, [slippage]);

  const handleSwapTokens = async () => {
    const tempToken = token1;
    setToken1(token2);
    setToken2(tempToken);
    resetAmounts();
    setActiveContainer1(false);
    setActiveContainer2(false);
  };

  const handleMaxAmount = async () => {
    const newAmount = intlNumberFormat(Number(formatSignificantDecimals(Number(userTokens[token1]?.balance ?? 0), 3)), 3, 20);
    handleToken1AmountChange(newAmount);
  };

  // refresh button
  const [refreshingAmount, setRefreshingAmount] = useState<boolean>(false);
  const handleRefreshingAmount = async () => {
    setRefreshingAmount(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    handleToken1AmountChange(token1Amount);

    setRefreshingAmount(false);
  };

  const resetAmounts = () => {
    setToken1Amount('');
    setToken2Amount('');
    setToken1AmountPrice('0.000');
    setToken2AmountPrice('0.000');
    setRoutes([]);
    setExchangeRate('0');
    setActiveContainer1(false);
    setActiveContainer2(false);
    setSwapTx('');
  };

  // Update token1 and token2 if query params change
  useEffect(() => {
    const token1FromQuery = getQueryParam('token1');
    const token2FromQuery = getQueryParam('token2');

    setToken1(token1FromQuery || defaultSwapToken1);
    setToken2(token2FromQuery || defaultSwapToken2);
  }, [location.search]);

  // transaction hooks
  const swapTokensRouter = useSwapTokensV2(swapTx);

  const swapTokensRouterHook = () => {
    const token1Raw = token1Amount.replace(/,/g, '');
    const token2Raw = token2Amount.replace(/,/g, '');
    if (Number(token1Raw) <= 0 || !Number(token1Raw) || Number(token2Raw) <= 0 || !Number(token2Raw)) {
      toast.error('Invalid token amount', { duration: 3000 });
      return;
    }
    swapTokensRouter();
  };

  // Check if user has enough token1 in wallet for swapping
  const [hasEnoughToken1, setHasEnoughToken1] = useState<boolean>(true);
  useEffect(() => {
    const checkAmounts = () => {
      const token1Raw = token1Amount.replace(/,/g, '');
      if (Number(token1Raw) > Number(userTokens[token1]?.balance)) {
        setHasEnoughToken1(false);
      } else {
        setHasEnoughToken1(true);
      }
    };

    checkAmounts();
  }, [token1Amount]);

  return (
    <Container className='swap-page-height font-rose'>
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ minHeight: '60px' }}>
            <div className={`p-3 mb-2  ${isMobile ? 'mt-2' : 'mt-4'}`}>
              <h2 className='text-white text-center'>Swap</h2>
            </div>
          </div>
        </Col>
      </Row>
      {Number(exchangeRate) > 0 && isMobile && (
        <ScrollToTopButton targetRefId='topSection' />
      )}
      <Row className={`${isMobile ? 'mt-2' : 'mt-2'}`}>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className={`swap-container text-white mt-1 ${activeContainer1 ? 'selected-side' : ''}`}>
            <p className='mb-0 ml-1 small'>From</p>
            <div className='d-flex justify-content-between mt-2 align-items-center gap-2 '>
              <div className='input-container b-r-sm swap-token-container'>
                <TextField
                  id="first-token"
                  placeholder='0.000'
                  type="text"
                  value={token1Amount}
                  autoComplete="off"
                  onChange={handleToken1AmountChange}
                  size="medium"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'white',
                      border: 'none',
                      fontSize: isMobile ? '17px' : '25px',
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

          <div className={`swap-container ${isMobile ? '' : 'mt-1'} text-white ${activeContainer2 ? 'selected-side' : ''}`}>
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
            <div className='d-flex justify-content-between align-items-center gap-2 mt-2'>
              <div className='input-container swap-token-container b-r-sm'>
                <TextField
                  id="second-token"
                  placeholder='0.000'
                  type="text"
                  value={token2Amount}
                  autoComplete="off"
                  onChange={handleToken2AmountChange}
                  size="medium"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'white',
                      border: 'none',
                      fontSize: isMobile ? '17px' : '25px',
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

      <Row className='d-flex align-items-start mt-2 mb-5'>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <div className='p-3 mt-1 b-r-sm' style={{ border: '1px solid silver' }}>
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
                <div className={`font-size-sm text-white text-center input-container  ${Number(slippage) == 1 ? 'bg-[#3FAC5A]' : 'bg-[#3f3f3f66]'} p-1 b-r-sm`} style={{ minWidth: isMobile ? '23%' : '20%' }} onClick={() => { setSlippage('1'); }}>1.00%</div>
                <div className={`font-size-sm text-white text-center input-container ${Number(slippage) == 5 ? 'bg-[#3FAC5A]' : 'bg-[#3f3f3f66]'} p-1 b-r-sm`} style={{ minWidth: isMobile ? '23%' : '20%' }} onClick={() => { setSlippage('5'); }}>5.00%</div>
                {!isMobile &&
                  <div className={`font-size-sm text-white text-center input-container ${Number(slippage) == 10 ? 'bg-[#3FAC5A]' : 'bg-[#3f3f3f66]'} p-1 b-r-sm`} style={{ minWidth: '20%' }} onClick={() => { setSlippage('10'); }}>10.00%</div>
                }
                <div className={`d-flex align-items-center text-white text-center input-container ${Number(slippage) > 10.00 ? 'bg-[#3FAC5A]' : 'bg-[#3f3f3f66]'} p-1 b-r-sm`} style={{ maxWidth: isMobile ? '45%' : '30%' }}>
                  <span className='font-size-sm text-white'>Custom:</span>
                  <TextField
                    id="custom-slippage"
                    placeholder='Custom'
                    type="text"
                    value={slippage}
                    autoComplete="off"
                    onChange={handleSlippageAmount}
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
            {routes.some(route => Object.keys(route).length > 0) ? (
              <Fragment>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='d-flex justify-content-start'>
                    <div>
                      {routes.map((route: any, index: number) => (
                        <p className='text-silver font-size-sm mb-0 mt-1' key={`route-${index}`}>
                          Price Impact
                          <span className='text-white font-bold font-size-xs ms-2'>
                            {allTokens[route?.token_in]?.ticker ?? 'TOKEN'} {'/'} {allTokens[route?.token_out]?.ticker ?? 'TOKEN'}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    {routes.map((route: SwapRouteV2, index: number) => (
                      <div className='d-flex justify-content-end align-items-center' key={`route2-${index}`}>
                        <p className='font-size-sm text-white mb-0'>
                          {formatSignificantDecimals(Number(route?.price_impact || 0) * 100, 2)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='d-flex justify-content-between align-items-center mt-1 mb-1'>
                  <p className='text-silver font-size-sm mb-0'>Route</p>
                  <div className='d-flex justify-content-end align-items-center text-white '>
                    {routes.map((route: SwapRouteV2, index: number) => (
                      <Fragment key={`route-${index}`}>
                        <CustomTooltip key={`t-route-${index}`} title={`${allTokens[route?.token_in]?.ticker} > ${allTokens[route?.token_out]?.ticker}`}>
                          <div className='bg-[#32323299] d-flex justify-content-end align-items-center text-white p-1 b-r-sm'>
                            <img
                              src={allTokens[route?.token_in]?.logo_url && allTokens[route?.token_in]?.logo_url !== 'N/A' ? allTokens[route?.token_in]?.logo_url : defaultTokenValues.image_url}
                              alt={allTokens[route?.token_in]?.ticker}
                              style={{ width: 20, height: 20, border: '1px solid #202020' }}
                              className='b-r-sm'
                            />
                            <span className='mx-1' style={{ marginTop: '2px' }}><FontAwesomeIcon icon={faCaretRight} size='xs' /></span>
                            <img
                              src={allTokens[route?.token_out]?.logo_url && allTokens[route?.token_out]?.logo_url !== 'N/A' ? allTokens[route?.token_out]?.logo_url : defaultTokenValues.image_url}
                              alt={allTokens[route?.token_out]?.ticker}
                              style={{ width: 20, height: 20, border: '1px solid #202020' }}
                              className='b-r-sm'
                            />
                          </div>
                        </CustomTooltip>
                        {index < routes.length - 1 && <p className='mx-2 mb-0 font-size-sm' style={{ marginTop: '-3px' }}>|</p>}
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
          {isLoggedIn ? (
            (hasEnoughToken1 || Number(token1Amount) == 0) ? (
              <Button
                className="font-size-md btn-intense-default btn-intense-success2 hover-btn text-white mt-3 mb-5 fullWidth"
                onClick={swapTokensRouterHook}
              >
                SWAP
              </Button>
            ) : (
              <Button
                className="font-size-md btn-intense-default btn-intense-danger hover-btn text-white mt-3 mb-5 fullWidth"
              >
                Insufficient funds
              </Button>
            )
          ) : (
            <Button
              className="font-size-md btn-intense-default btn-intense-success2 hover-btn text-white mt-3 mb-5 fullWidth"
              component={Link}
              to="/unlock"
            >
              Connect Wallet
            </Button>
          )}
        </Col>

      </Row>

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </Container>
  );
}

export default Swap;