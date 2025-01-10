import { Fragment, useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectPairs,
  selectPairsStatus,
  selectPairsSearchInput,
  selectPairsLpSearchInput,
  selectPairsPage,
  selectPairsTotalPages,
  selectPairsMyDeposits,
  selectPairsSortBy,
  selectPairsSortDirection,
  setPage,
  setTokenSearch,
  setLPTokenSearch,
  setMyDeposits,
  setSortBy,
  setSortDirection
} from 'storeManager/slices/pairsSlice';
import { selectPairTokensById, selectLpTokensById, selectAllTokensById } from 'storeManager/slices/tokensSlice';
import { selectUserTokens, selectNonZeroBalanceLpTokenIds } from 'storeManager/slices/userTokensSlice';
import Loader from 'components/Loader';
import FilterLoader from 'components/Pools/FilterLoader';
import { Container, Row, Col } from 'react-bootstrap';
import { Pair } from 'types/backendTypes';
import 'assets/css/pools.css';
import { Pool } from 'components/Pools/Pool';
import { denominatedAmountToAmount } from 'utils/formatters';
import { Button, OutlinedInput, SelectChangeEvent } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { isEmpty } from '@multiversx/sdk-core/out';
import TextField from '@mui/material/TextField';
import { Search } from '@mui/icons-material';
import { useGetAccountInfo } from 'hooks';
import { Switch, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import LightSpot from 'components/LightSpot';
import StaticLightSpot from 'components/StaticLightSpot';
import LightTrapezoid from 'components/LightTrapezoid';
import { color } from 'framer-motion';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { debounceSearchTime } from 'config';
import { Link } from 'react-router-dom';

const Pools = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = address ? true : false;
  const [loading, setLoading] = useState<boolean>(false);
  // const [viewMode, setViewModeState] = useState<'all' | 'assets' | 'created'>('all');
  const [localSearchInput, setLocalSearchInput] = useState<string>('');
  const loadingTime = 700;
  const isMobile = useMobile();
  const isTablet = useTablet();

  const CustomSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-switchBase': {
      transitionDuration: '300ms',
      '&.Mui-checked': {
        color: '#3FAC5A',
        '& + .MuiSwitch-track': {
          backgroundColor: 'transparent',
          border: '1px solid #3FAC5A',
        },
        '& + .MuiSwitch-thumb': {
          backgroundColor: '#3FAC5A',
        },
      },
      '&.Mui-disabled': {
        color: 'silver',
        '& + .MuiSwitch-track': {
          backgroundColor: 'transparent',
          border: '1px solid silver',
        },
        '& + .MuiSwitch-thumb': {
          backgroundColor: 'silver',
        },
      },
    },
    '& .MuiSwitch-track': {
      borderRadius: 10,
      backgroundColor: 'transparent',
      border: '1px solid #3FAC5A',
      height: isMobile ? 12 : 16,
      width: isMobile ? 32 : 34,
      margin: 'auto',
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: isMobile ? 8 : 10,
      height: isMobile ? 8 : 10,
      margin: isMobile ? 6 : 5,
    },
  }));

  const dispatch = useDispatch();
  const pairs = useSelector(selectPairs);
  const allTokens = useSelector(selectAllTokensById);
  const lptokens = useSelector(selectLpTokensById);
  const pairsStatus = useSelector(selectPairsStatus);
  const userTokens = useSelector(selectUserTokens);

  const currentPage = useSelector(selectPairsPage);
  const totalPages = useSelector(selectPairsTotalPages);
  const apiSearchInput = useSelector(selectPairsSearchInput);
  const lpSearchInput = useSelector(selectNonZeroBalanceLpTokenIds);
  const myDeposits = useSelector(selectPairsMyDeposits);
  const [myDepositsLocal, setMyDepositsLocal] = useState<boolean>(false);
  const sortBy = useSelector(selectPairsSortBy);
  const sortDirection = useSelector(selectPairsSortDirection);

  // Reset the viewMode to 'all' when the component is first mounted
  useEffect(() => {
    setLPTokenSearch(['']);
    setMyDeposits(false);
  }, [dispatch]);

  const handleAssetsPairsToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    dispatch(setPage(1));
    const isChecked = event.target.checked;

    if (isChecked) {
      dispatch(setLPTokenSearch(lpSearchInput));
      dispatch(setMyDeposits(true));
      setMyDepositsLocal(true);
    } else {
      dispatch(setLPTokenSearch([]));
      dispatch(setMyDeposits(false));
      setMyDepositsLocal(false);
    }

    await new Promise((resolve) => setTimeout(resolve, loadingTime));
    setLoading(false);
  };

  const handleAssetsPairsToggleDisabled = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setMyDepositsLocal(false);
  };

  // Debounced function for search input
  const debouncedDispatch = useCallback(
    debounce((value: string) => {
      setLoading(true);
      dispatch(setTokenSearch(value));
      dispatch(setPage(1));
      setTimeout(() => setLoading(false), debounceSearchTime);
    }, debounceSearchTime),
    [dispatch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchInput(value);
    debouncedDispatch(value);
  };

  useEffect(() => {
    return () => {
      debouncedDispatch.cancel();
    };
  }, [debouncedDispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;

    switch (selectedValue) {
      case 'liquidity_desc':
        dispatch(setSortBy('liquidity'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'liquidity_asc':
        dispatch(setSortBy('liquidity'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'volume24h_desc':
        dispatch(setSortBy('volume24h'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'volume24h_asc':
        dispatch(setSortBy('volume24h'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'fees24h_desc':
        dispatch(setSortBy('fees24h'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'fees24h_asc':
        dispatch(setSortBy('fees24h'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      default:
        dispatch(setSortBy('liquidity'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
    }
  };

  // Helper function to get display label based on selected value
  const getSelectedLabel = () => {
    if (sortBy === 'liquidity' && sortDirection === 'desc') return 'Highest Liquidity';
    if (sortBy === 'liquidity' && sortDirection === 'asc') return 'Lowest Liquidity';
    if (sortBy === 'volume24h' && sortDirection === 'desc') return 'Highest Volume 24h';
    if (sortBy === 'volume24h' && sortDirection === 'asc') return 'Lowest Volume 24h';
    if (sortBy === 'fees24h' && sortDirection === 'desc') return 'Highest Fees 24h';
    if (sortBy === 'fees24h' && sortDirection === 'asc') return 'Lowest Fees 24h';
    return 'Highest Liquidity'; // Default
  };

  return (
    <div className='pools-page-height'>
      <Row>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Pools</h2>
              <p className='text-white text-justified mb-0'>It is a long established fact that a reader will be distracted by the readable content of a page</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className='mb-5 mt-2'>
        <Col xs={12} lg={12}>
          <div className=''>
            <div className='mt-2 d-flex justify-content-between align-items-center'>
              {!isMobile &&
                <div className='d-flex justify-content-between align-items-center'>
                  <FormControlLabel
                    control={
                      <CustomSwitch
                        checked={myDepositsLocal}
                        onChange={isLoggedIn ? handleAssetsPairsToggle : handleAssetsPairsToggleDisabled}
                      />
                    }
                    label="My Deposits"
                    labelPlacement="end"
                    sx={{
                      color: isLoggedIn ? 'white' : 'silver',
                      fontSize: '14px',
                      '& .MuiTypography-root': {
                        fontSize: '16px',
                        fontFamily: 'Red Rose',
                        color: !isLoggedIn ? 'silver' : 'white'
                      },
                    }}
                  />
                  <span className='font-size-md font-regular text-white m-r-n-xs'>Sort-by: </span>
                  <Select
                    id="sort-by"
                    value={`${sortBy}_${sortDirection}`}
                    onChange={handleSortByChange}
                    input={<OutlinedInput />}
                    size='small'
                    renderValue={() => (
                      <div className='font-size-md font-regular' style={{ marginTop: '2px', color: '#3fac5a' }}>
                        {getSelectedLabel()}
                      </div>
                    )}
                    sx={{
                      color: 'white',
                      fontSize: '12px',
                      fontFamily: 'Red Rose',
                      padding: 0,
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#3fac5a',
                        marginLeft: '-50px !important'
                      },
                      backgroundColor: 'transparent',
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: 'rgba(32, 32, 32, 1)',
                          color: 'white',
                          fontFamily: 'Red Rose',
                          borderRadius: '15px',
                        },
                      },
                    }}
                  >
                    <MenuItem value="liquidity_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'liquidity' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Liquidity</MenuItem>
                    <MenuItem value="liquidity_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'liquidity' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Liquidity</MenuItem>
                    <MenuItem value="volume24h_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'volume24h' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Volume 24h</MenuItem>
                    <MenuItem value="volume24h_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'volume24h' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Volume 24h</MenuItem>
                    <MenuItem value="fees24h_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'fees24h' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Fees 24h</MenuItem>
                    <MenuItem value="fees24h_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'fees24h' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Fees 24h</MenuItem>
                  </Select>
                </div>
              }
              <div className='d-flex justify-content-end'>
                <Button
                  component={Link}
                  to="/create-pool"
                  className="btn-intense-default btn-intense-success2 hover-btn text-white"
                  sx={{ minWidth: isMobile ? '170px' : '120px', height: '30px' }}
                >
                  New Pool
                </Button>
                <TextField
                  id="outlined-search"
                  type="search"
                  size="small"
                  className="ms-2 mb-2"
                  value={localSearchInput}
                  autoComplete="off"
                  onChange={handleSearchChange}
                  InputProps={{
                    style: {
                      backgroundColor: 'rgba(63, 63, 63, 0.4)',
                      color: 'white',
                      borderRadius: '20px'
                    },
                    startAdornment: (
                      <Search style={{ color: 'white', marginRight: '8px', fontSize: '16px' }} />
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      color: 'white',
                      marginTop: '3px'
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      height: '0.95em',
                      fontSize: '0.95em',
                    },
                    '& .MuiOutlinedInput-root': {
                      height: 'auto',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3FAC5A',
                      },
                      '&:hover fieldset': {
                        borderColor: '#3FAC5A',
                      },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    }
                  }}
                />
              </div>
            </div>
            {isMobile &&
              <div className='text-right font-size-sm d-flex align-items-center justify-content-end'>                
                <FormControlLabel
                  control={
                    <CustomSwitch
                      checked={myDepositsLocal}
                      onChange={isLoggedIn ? handleAssetsPairsToggle : handleAssetsPairsToggleDisabled}
                    />
                  }
                  label="My Deposits"
                  labelPlacement="end"
                  sx={{
                    color: isLoggedIn ? 'white' : 'silver',
                    fontSize: '13px',
                    '& .MuiTypography-root': {
                      fontSize: '13px',
                      fontFamily: 'Red Rose',
                      color: !isLoggedIn ? 'silver' : 'white'
                    },
                  }}
                />
                <span className='font-regular text-white m-r-n-sm' style={{ fontSize: '13px' }}>Sort-by: </span>
                <Select
                  id="sort-by"
                  value={`${sortBy}_${sortDirection}`}
                  onChange={handleSortByChange}
                  input={<OutlinedInput />}
                  size='small'
                  renderValue={() => (
                    <div className='font-regular m-r-n-xs' style={{ marginTop: '-1px', color: '#3fac5a', fontSize: '13px' }}>
                      {getSelectedLabel()}
                    </div>
                  )}
                  sx={{
                    color: 'white',
                    fontSize: '13px',
                    fontFamily: 'Red Rose',
                    padding: 0,
                    '.MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#3fac5a',
                      marginLeft: '-50px !important'
                    },
                    backgroundColor: 'transparent',
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: 'rgba(32, 32, 32, 1)',
                        color: 'white',
                        fontFamily: 'Red Rose',
                        borderRadius: '15px',
                        // boxShadow: '10px 0 7px rgba(63, 142, 90, 0.1), -10px 0 7px rgba(63, 142, 90, 0.1) !important'
                      },
                    },
                  }}
                >
                  <MenuItem value="liquidity_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'liquidity' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Liquidity</MenuItem>
                  <MenuItem value="liquidity_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'liquidity' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Liquidity</MenuItem>
                  <MenuItem value="volume24h_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'volume24h' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Volume 24h</MenuItem>
                  <MenuItem value="volume24h_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'volume24h' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Volume 24h</MenuItem>
                  <MenuItem value="fees24h_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'fees24h' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Fees 24h</MenuItem>
                  <MenuItem value="fees24h_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'fees24h' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Fees 24h</MenuItem>
                </Select>
              </div>
            }
            {pairsStatus === 'loading' && <FilterLoader />}
            {(isEmpty(pairs) && pairsStatus !== 'loading' && !loading) && (
              <div>
                <div className='flex flex-col p-3 items-center justify-center gap-2 rounded-lg pool'>
                  <div className='flex flex-col items-center'>
                    <p className='text-white mb-0 font-bold'>No Results Found</p>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <FilterLoader />
            ) : (
              <Fragment>
                {pairs.map((pair: Pair, index: number) => (
                  <Pool
                    key={`pairs-${index}`}
                    pair={pair}
                    index={index + (currentPage - 1) * 15}
                    token1Details={allTokens[pair.token1]}
                    token2Details={allTokens[pair.token2]}
                    userToken1Balance={Number(userTokens[pair.token1]?.balance ?? 0)}
                    userToken2Balance={Number(userTokens[pair.token2]?.balance ?? 0)}
                    // userLpTokenBalance={Number(denominatedAmountToAmount(userTokens[pair.lp_token_id]?.balance, lptokens[pair.lp_token_id].decimals, 20) || 0)}
                    userLpTokenBalance={Number(0.6)}
                    lpTokenId={pair.lp_token_id}
                    lpTokenSupply={(Number(denominatedAmountToAmount(lptokens[pair.lp_token_id]?.supply || 0, lptokens[pair.lp_token_id]?.decimals || 18, 20)) ?? 0)}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                  />
                ))}
                <div className="pagination-controls">
                  <Button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className='pagination-button'
                  >
                    <KeyboardDoubleArrowLeft className={`${currentPage === 1 ? 'disabled-arrow' : 'active-arrow'}`} />
                  </Button>

                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='pagination-button'
                  >
                    <ChevronLeft className={`${currentPage === 1 ? 'disabled-arrow' : 'active-arrow'}`} />
                  </Button>

                  <span>
                    Page {currentPage} {totalPages > 0 ? `of ${totalPages}` : 'of 1'}
                  </span>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='pagination-button'
                  >
                    <ChevronRight className={`${currentPage === totalPages ? 'disabled-arrow' : 'active-arrow'}`} />
                  </Button>

                  <Button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className='pagination-button'
                  >
                    <KeyboardDoubleArrowRight className={`${currentPage === totalPages ? 'disabled-arrow' : 'active-arrow'}`} />
                  </Button>
                </div>
              </Fragment>
            )}

            {/* Add light spots */}
            <LightSpot size={isMobile ? 220 : 350} x={isMobile ? '25%' : '40%'} y="40%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
            {/* <LightSpot size={300} x="10%" y="70%" color="rgba(63, 172, 90, 0.6)" /> */}
            {/* <LightSpot size={250} x="85%" y="30%" color="rgba(63, 172, 90, 0.3)" /> */}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Pools;