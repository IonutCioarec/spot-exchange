import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { TextField, Avatar, Button, SelectChangeEvent } from '@mui/material';
import { denominatedAmountToIntlFormattedAmount, formatSignificantDecimals, getFormattedUserPoolLiquidity, getFormattedUserPoolShare, intlNumberFormat } from 'utils/formatters';
import { Search } from '@mui/icons-material';
import SimpleLoader from 'components/SimpleLoader';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import ReduceZerosFormat from "components/ReduceZerosFormat";
import MovingIcon from '@mui/icons-material/Moving';
import { CreatedToken, CreatedTokens } from 'types/mvxTypes';
import { Select, MenuItem } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Table from "react-bootstrap/Table";
import { Pair, PairsState, Token } from 'types/backendTypes';
import { getUserPoolLiquidity, getUserPoolShare } from 'utils/calculs';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useGetAccountInfo } from 'hooks';
import { selectPairsLimit, selectPairsPage, selectPairsSortBy, selectPairsSortDirection, selectPairsStatus, selectPairsTotal, selectPairsTotalPages, setLPTokenSearch, setMyDeposits, setPage, setSortBy, setSortDirection, setTokenSearch } from 'storeManager/slices/pairsSlice';
import { selectNonZeroBalanceLpTokenIds } from 'storeManager/slices/userTokensSlice';
import { debounce } from 'lodash';
import { debounceSearchTime } from 'config';
import defaultLogo from 'assets/img/default_token_image.png';

const defaultTokenValues = {
  image_url: defaultLogo,
  name: 'TOKEN',
  price: 0,
  decimals: 18
}

const ITEMS_PER_PAGE = 10;

interface PoolsListProps {
  pairs: PairsState;
  allTokens: Record<string, Token>;
}

const PoolsList: React.FC<PoolsListProps> = ({ pairs, allTokens}) => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = address ? true : false;
  const [loading, setLoading] = useState<boolean>(false);
  const [localSearchInput, setLocalSearchInput] = useState<string>('');
  const loadingTime = 700;
  const isMobile = useMobile();
  const isTablet = useTablet();

  const dispatch = useDispatch();
  const currentPage = useSelector(selectPairsPage);
  const totalPages = useSelector(selectPairsTotalPages);
  const totalPairs = useSelector(selectPairsTotal);
  const lpSearchInput = useSelector(selectNonZeroBalanceLpTokenIds);
  const sortBy = useSelector(selectPairsSortBy);
  const sortDirection = useSelector(selectPairsSortDirection);

  // Reset the viewMode to 'all' when the component is first mounted
  useEffect(() => {
    setLPTokenSearch(['']);
    setMyDeposits(false);
  }, [dispatch]);

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


  const tableRef = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!tableRef.current) return;
    isDown = true;
    const event = "touches" in e ? e.touches[0] : e;
    startX = event.pageX - tableRef.current.offsetLeft;
    scrollLeft = tableRef.current.scrollLeft;
  };

  const handleEnd = () => {
    isDown = false;
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDown || !tableRef.current) return;
    const event = "touches" in e ? e.touches[0] : e;
    const x = event.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX);
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className='b-r-sm'>
      <div className={`${isMobile ? '' : 'd-flex'} justify-content-between align-items-center`}>
        <p className='h3 mt-1 mb-0 text-white'>Pools ({totalPairs})</p>
        <div className='d-flex justify-content-end align-items-center'>
          <span className={`${isMobile ? 'font-size-sm' : 'font-size-md'} font-regular text-white m-r-n-xs`} style={{ textWrap: 'nowrap' }}>Sort-by: </span>
          <Select
            value={`${sortBy}_${sortDirection}`}
            onChange={handleSortByChange}
            size="small"
            className={`${isMobile ? '' : 'ms-2'}`}
            renderValue={() => (
              <div className={`${isMobile ? 'font-size-sm' : 'font-size-md'} font-regular`} style={{ marginTop: '2px', color: '#3fac5a' }}>
                {getSelectedLabel()}
              </div>
            )}
            sx={{
              color: '#3fac5a',
              fontSize: isMobile ? '14px' : '16px',
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
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={localSearchInput}
            autoComplete="off"
            onChange={handleSearchChange}
            className="token-search-container mb-2"
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
                marginTop: '3px',
                fontFamily: 'Red Rose'
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
      {!loading ? (
        Object.values(pairs).length > 0 ? (
          <div
            ref={tableRef}
            className="portfolio-list-table-div"
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseMove={handleMove}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            onTouchMove={handleMove}
          >
            <Table
              className='portfolio-list-table'
            >
              <tbody>
                {Object.values(pairs).map((pair: Pair , index: number) => (
                  <tr
                    key={`pair-${pair.lp_token_id}-${index}`}
                  >
                    {/* Sticky First Column */}
                    <td>
                      <div className="d-flex align-items-center" style={{ minWidth: isMobile ? '60px' : 'auto' }}>
                        <img
                          src={allTokens[pair.token1]?.logo_url && allTokens[pair.token1]?.logo_url !== 'N/A' ? allTokens[pair.token1].logo_url : defaultTokenValues.image_url}
                          alt={pair.token1}
                          className='d-inline'
                          style={{ width: 35, height: 35, border: '2px solid rgba(63, 172, 90, 0.3)', borderRadius: '20px' }}
                        />
                        <motion.img
                          src={allTokens[pair.token2]?.logo_url && allTokens[pair.token2]?.logo_url !== 'N/A' ? allTokens[pair.token1].logo_url : defaultTokenValues.image_url}
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
                      </div>
                    </td>

                    {/* Scrollable Columns */}
                    <td>
                      <div className="m-l-n-xs">
                        <p className={`font-size-xs mb-0 text-silver`}>
                          Pool
                        </p>
                        <p className="font-size-sm mb-0" style={{whiteSpace: 'nowrap'}}>{allTokens[pair?.token1]?.ticker} / {allTokens[pair?.token2]?.ticker}</p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 ${sortBy === 'liquidity' ? 'text-intense-green font-bold' : 'text-silver'}`} style={{ textWrap: 'nowrap' }}>
                          Liquidity
                          {sortBy === 'liquidity' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                          {sortBy === 'liquidity' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                        </p>
                        <p className="font-size-sm mb-0">
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
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 ${sortBy === 'volume24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                          Volume 24h
                          {sortBy === 'volume24h' && sortDirection === 'desc' && <TrendingDownIcon className="ms-1 font-size-md" />}
                          {sortBy === 'volume24h' && sortDirection === 'asc' && <TrendingUpIcon className="ms-1 font-size-md" />}
                        </p>
                        <p className="font-size-sm mb-0">
                          $
                          <CountUp
                            start={0}
                            end={Number(pair?.volume_24h)}
                            duration={1.5}
                            separator=","
                            decimals={3}
                            decimal="."
                            delay={0.1}
                          />
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 text-silver`}>
                          Volume 30D
                        </p>
                        <p className="font-size-sm mb-0">
                          $
                          <CountUp
                            start={0}
                            end={Number(pair?.volume_30d)}
                            duration={1.5}
                            separator=","
                            decimals={3}
                            decimal="."
                            delay={0.1}
                          />
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 ${sortBy === 'fees24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                          Fees 24h
                          {sortBy === 'fees24h' && sortDirection === 'desc' && <TrendingDownIcon className="ms-1 font-size-md" />}
                          {sortBy === 'fees24h' && sortDirection === 'asc' && <TrendingUpIcon className="ms-1 font-size-md" />}
                        </p>
                        <p className="font-size-sm mb-0">
                          $
                          <CountUp
                            start={0}
                            end={Number(pair?.fees_24h)}
                            duration={1.5}
                            separator=","
                            decimals={3}
                            decimal="."
                            delay={0.1}
                          />
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 text-silver`}>
                          Fees 30D
                        </p>
                        <p className="font-size-sm mb-0">
                          $
                          <CountUp
                            start={0}
                            end={Number(pair?.fees_30d)}
                            duration={1.5}
                            separator=","
                            decimals={3}
                            decimal="."
                            delay={0.1}
                          />
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className='p-3 mb-3 text-white d-flex justify-content-center align-items-center cursor-pointer token-list-item' style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}>
            <p className='text-silver text-center mt-2 h6'>No pool found</p>
          </div>
        )
      ) : (
        <SimpleLoader />
      )}
      {/* Pagination Controls */}
      <div className="pagination-controls m-t-n-sm">
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

    </div>
  );
};

export default PoolsList;