import { useEffect, useState, useCallback, useRef } from 'react';
import { TextField, List, Avatar, Button, SelectChangeEvent, Select, OutlinedInput, MenuItem } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { Search } from '@mui/icons-material';
import SimpleLoader from 'components/SimpleLoader';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage, selectPairTokensById, selectSearchInput, selectTotalPages, setPage, setSearchInput, selectPairTokensNumber, setTokensSortBy, setTokensSortDirection, selectTokensSortBy, selectTokensSortDirection } from 'storeManager/slices/tokensSlice';
import { Token } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { debounce } from 'lodash';
import { debounceSearchTime, network } from 'config';
import ReduceZerosFormat from "components/ReduceZerosFormat";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Table from "react-bootstrap/Table";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const getPriceChangePercentage = (currentPrice: number, previousPrice: number) => {
  if (previousPrice === 0) return <span> - </span>; // Avoid division by zero

  const percentageChange = ((currentPrice - previousPrice) / Math.abs(previousPrice)) * 100;
  const isPositive = percentageChange >= 0;
  const color = isPositive ? '#3FAC5A' : '#bd0d0d';
  const rotation = isPositive ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <span style={{ color, textWrap: 'nowrap' }}>
      {percentageChange ? (
        <>
          <PlayArrowIcon style={{ transform: rotation, fontSize: '20px' }} />
          <span className='text-white'>{Math.abs(percentageChange).toFixed(3)}%</span>
        </>
      ) : (
        <span style={{ color: 'white' }}>-</span>
      )}
    </span>
  );
};

const TokensList = () => {
  const dispatch = useDispatch();
  const pairTokens = useSelector(selectPairTokensById);
  const currentPage = useSelector(selectPage);
  const totalPages = useSelector(selectTotalPages);
  const pairTokensNumber = useSelector(selectPairTokensNumber);
  const apiSearchInput = useSelector(selectSearchInput);
  const sortBy = useSelector(selectTokensSortBy);
  const sortDirection = useSelector(selectTokensSortDirection);

  const [isOpen, setIsOpen] = useState(false);
  const [localSearchInput, setLocalSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  // Debounced function for updating Redux state
  const debouncedDispatch = useCallback(
    debounce((value: string) => {
      setLoading(true);
      dispatch(setSearchInput(value));
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

  // Cleanup debounced function on unmount
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
      case 'price_usd_desc':
        dispatch(setTokensSortBy('price_usd'));
        dispatch(setTokensSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'price_usd_asc':
        dispatch(setTokensSortBy('price_usd'));
        dispatch(setTokensSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'price_change24h_desc':
        dispatch(setTokensSortBy('price_change24h'));
        dispatch(setTokensSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'price_change24h_asc':
        dispatch(setTokensSortBy('price_change24h'));
        dispatch(setTokensSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'volume24h_desc':
        dispatch(setTokensSortBy('volume24h'));
        dispatch(setTokensSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'volume24h_asc':
        dispatch(setTokensSortBy('volume24h'));
        dispatch(setTokensSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'volume30d_desc':
        dispatch(setTokensSortBy('volume30d'));
        dispatch(setTokensSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'volume30d_asc':
        dispatch(setTokensSortBy('volume30d'));
        dispatch(setTokensSortDirection('asc'));
        dispatch(setPage(1));
        break;
      default:
        dispatch(setTokensSortBy('price_usd'));
        dispatch(setTokensSortDirection('desc'));
        dispatch(setPage(1));
        break;
    }
  };

  // Helper function to get display label based on selected value
  const getSelectedLabel = () => {
    if (sortBy === 'price_usd' && sortDirection === 'desc') return 'Highest Price';
    if (sortBy === 'price_usd' && sortDirection === 'asc') return 'Lowest Price';
    if (sortBy === 'price_change24h' && sortDirection === 'desc') return 'Highest Price Change 24h';
    if (sortBy === 'price_change24h' && sortDirection === 'asc') return 'Lowest Price Change 24h';
    if (sortBy === 'volume24h' && sortDirection === 'desc') return 'Highest Volume 24h';
    if (sortBy === 'volume24h' && sortDirection === 'asc') return 'Lowest Volume 24h';
    if (sortBy === 'volume30d' && sortDirection === 'desc') return 'Highest Volume 30D';
    if (sortBy === 'volume30d' && sortDirection === 'asc') return 'Lowest Volume 30D';
    return 'Highest Price'; // Default
  };

  // Function to sync scroll for all elements
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
        <p className='h3 mt-1 mb-0 text-white'>Tokens ({pairTokensNumber})</p>
        <div className='d-flex justify-content-end align-items-center'>
          <span className={`${isMobile ? 'font-size-sm' : 'font-size-md'} font-regular text-white m-r-n-xs`} style={{ textWrap: 'nowrap' }}>Sort-by: </span>
          <Select
            id="sort-by"
            value={`${sortBy}_${sortDirection}`}
            onChange={handleSortByChange}
            input={<OutlinedInput />}
            size='small'
            renderValue={() => (
              <div className={`${isMobile ? 'font-size-sm' : 'font-size-md'} font-regular`} style={{ marginTop: '2px', color: '#3fac5a' }}>
                {getSelectedLabel()}
              </div>
            )}
            className={`${isMobile ? '' : 'ms-2'}`}
            sx={{
              color: '#3fac5a',
              fontSize: '14px',
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
            <MenuItem value="price_usd_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'price_usd' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Price</MenuItem>
            <MenuItem value="price_usd_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'price_usd' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Price</MenuItem>
            <MenuItem value="price_change24h_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'price_change24h' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Price Change 24h</MenuItem>
            <MenuItem value="price_change24h_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'price_change24h' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Price Change 24h</MenuItem>
            <MenuItem value="volume24h_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'volume24h' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Volume 24h</MenuItem>
            <MenuItem value="volume24h_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'volume24h' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Volume 24h</MenuItem>
            <MenuItem value="volume30d_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'volume30d' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Volume 30D</MenuItem>
            <MenuItem value="volume30d_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'volume30d' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Volume 30D</MenuItem>
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
        Object.values(pairTokens).length > 0 ? (
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
                {Object.values(pairTokens).map((token: Token) => (
                  <tr
                    key={token.token_id}
                  >
                    {/* Sticky First Column */}
                    <td width={5}>
                      <Avatar src={token.logo_url} sx={{ height: '35px', width: '35px' }} />
                    </td>

                    {/* Scrollable Columns */}
                    <td>
                      <div className='m-l-n-xs'>
                        <p className={`font-size-xs mb-0 text-silver`}>
                          Token
                        </p>
                        <p className="font-size-sm mb-0">
                          {token.ticker}
                          <span
                            onClick={() => window.open(`${network.explorerAddress}/tokens/${token.token_id}`, '_blank', 'noopener,noreferrer')}
                            className="cursor-pointer text-silver"
                          >
                            <ArrowOutwardIcon className="ms-1" style={{ fontSize: '16px', marginTop: '-1px' }} />
                          </span>
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 ${sortBy === 'price_usd' ? 'text-intense-green font-bold' : 'text-silver'}`} style={{ textWrap: 'nowrap' }}>
                          Price
                          {sortBy === 'price_usd' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                          {sortBy === 'price_usd' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                        </p>
                        <p className="font-size-sm mb-0">
                          $<ReduceZerosFormat
                            numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.price_usd || '0'), 3)), 0, 20)}
                          />
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 ${sortBy === 'price_change24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                          Price 24H
                          {sortBy === 'price_change24h' && sortDirection === 'desc' && (<TrendingDownIcon className="ms-1 font-size-md" />)}
                          {sortBy === 'price_change24h' && sortDirection === 'asc' && (<TrendingUpIcon className="ms-1 font-size-md" />)}
                        </p>
                        <p className="font-size-sm mb-0">
                          {getPriceChangePercentage(parseFloat(pairTokens[token.token_id]?.price_usd), parseFloat(pairTokens[token.token_id]?.price_change_24h))}
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 'text-silver`}>
                          Price 30D
                        </p>
                        <p className="font-size-sm mb-0">
                          {getPriceChangePercentage(parseFloat(pairTokens[token.token_id]?.price_usd), parseFloat(pairTokens[token.token_id]?.price_change_30d))}
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
                          $<ReduceZerosFormat
                            numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.volume_24h || '0'), 3)), 0, 20)}
                          />
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 ${sortBy === 'volume30d' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                          Volume 30D
                          {sortBy === 'volume30d' && sortDirection === 'desc' && <TrendingDownIcon className="ms-1 font-size-md" />}
                          {sortBy === 'volume30d' && sortDirection === 'asc' && <TrendingUpIcon className="ms-1 font-size-md" />}
                        </p>
                        <p className="font-size-sm mb-0">
                          $<ReduceZerosFormat
                            numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.volume_30d || '0'), 3)), 0, 20)}
                          />
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right">
                        <p className={`font-size-xs mb-0 text-silver`}>
                          Liquidity
                        </p>
                        <p className="font-size-sm mb-0">
                          ${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.price_usd || '0') * parseFloat(pairTokens[token.token_id]?.supply || '0'), 3)), 0, 20)}
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
            <p className='text-silver text-center mt-2 h6'>No token found</p>
          </div>
        )
      ) : (
        <SimpleLoader />
      )}
      {/* Pagination controls */}
      {Object.values(pairTokens).length > 0 && (
        <div className="pagination-controls m-t-n-xs">
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
      )}
    </div>
  );
};

export default TokensList;