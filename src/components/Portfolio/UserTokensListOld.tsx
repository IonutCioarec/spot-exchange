import { useState, useMemo, useRef } from 'react';
import { TextField, List, Avatar, Button } from '@mui/material';
import { denominatedAmountToIntlFormattedAmount, formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { Search } from '@mui/icons-material';
import SimpleLoader from 'components/SimpleLoader';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import { useSelector } from 'react-redux';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import ReduceZerosFormat from "components/ReduceZerosFormat";
import MovingIcon from '@mui/icons-material/Moving';
import { CreatedToken, CreatedTokens } from 'types/mvxTypes';
import { Select, MenuItem } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const getPriceChangePercentage = (currentPrice: number, previousPrice: number) => {
  if (previousPrice === 0) return 0;
  const percentageChange = ((currentPrice - previousPrice) / Math.abs(previousPrice)) * 100;
  return percentageChange;
};

const getPriceChangePercentageComponent = (currentPrice: number, previousPrice: number) => {
  if (previousPrice === 0) return <span> - </span>;

  const percentageChange = ((currentPrice - previousPrice) / Math.abs(previousPrice)) * 100;
  const isPositive = percentageChange >= 0;
  const color = isPositive ? '#3FAC5A' : '#bd0d0d';
  const rotation = isPositive ? 'rotate(-45deg)' : 'rotate(-225deg)';

  return (
    <span style={{ color }}>
      {percentageChange ? (
        <>
          <MovingIcon style={{ transform: rotation, fontSize: '20px' }} />
          {Math.abs(percentageChange).toFixed(3)}%
        </>
      ) : (
        <span style={{ color: 'white' }}>-</span>
      )}

    </span>
  );
};

const ITEMS_PER_PAGE = 10;

const UserTokensListOld: React.FC<CreatedTokens> = ({ tokens }) => {
  const allTokens = useSelector(selectAllTokensById);
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  const [searchInput, setSearchInput] = useState('');
  const [sortOption, setSortOption] = useState('highestValue');
  const [currentPage, setCurrentPage] = useState(1);

  // Convert tokens object to an array
  const tokenArray = useMemo(() => Object.values(tokens), [tokens]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    setCurrentPage(1);
  };

  // Handle sorting selection change
  const handleSortChange = (event: any) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
  };

  // Filter and sort tokens
  const processedTokens = useMemo(() => {
    let filtered = tokenArray.filter(token =>
      token.token_id.toLowerCase().includes(searchInput.toLowerCase()) ||
      token.ticker.toLowerCase().includes(searchInput.toLowerCase())
    );

    return filtered.sort((a: CreatedToken, b: CreatedToken) => {
      const priceA = parseFloat(allTokens[a.token_id]?.price_usd) || 0;
      const priceB = parseFloat(allTokens[b.token_id]?.price_usd) || 0;
      const priceAChange24H = getPriceChangePercentage(parseFloat(allTokens[a.token_id]?.price_usd), parseFloat(allTokens[a.token_id]?.price_change_24h));
      const priceBChange24H = getPriceChangePercentage(parseFloat(allTokens[b.token_id]?.price_usd), parseFloat(allTokens[b.token_id]?.price_change_24h));
      const priceAChange7D = getPriceChangePercentage(parseFloat(allTokens[a.token_id]?.price_usd), parseFloat(allTokens[a.token_id]?.price_change_7d));
      const priceBChange7D = getPriceChangePercentage(parseFloat(allTokens[b.token_id]?.price_usd), parseFloat(allTokens[b.token_id]?.price_change_7d));
      const priceAChange30D = getPriceChangePercentage(parseFloat(allTokens[a.token_id]?.price_usd), parseFloat(allTokens[a.token_id]?.price_change_30d));
      const priceBChange30D = getPriceChangePercentage(parseFloat(allTokens[b.token_id]?.price_usd), parseFloat(allTokens[b.token_id]?.price_change_30d));
      const valueA = parseFloat(allTokens[a.token_id]?.price_usd || '0') * parseFloat(denominatedAmountToIntlFormattedAmount(a.balance || 0, a.decimals || 18, 2));
      const valueB = parseFloat(allTokens[b.token_id]?.price_usd || '0') * parseFloat(denominatedAmountToIntlFormattedAmount(b.balance || 0, a.decimals || 18, 2));

      switch (sortOption) {
        case 'highestPrice':
          return priceB - priceA;
        case 'lowestPrice':
          return priceA - priceB;
        case 'highestBalance':
          return (parseFloat(b.balance) || 0) - (parseFloat(a.balance) || 0);
        case 'lowestBalance':
          return (parseFloat(a.balance) || 0) - (parseFloat(b.balance) || 0);
        case 'alphabetically':
          return a.token_id.localeCompare(b.token_id);
        case 'highestPrice24h':
          return priceBChange24H - priceAChange24H;
        case 'lowestPrice24h':
          return priceAChange24H - priceBChange24H;
        case 'highestPrice7D':
          return priceBChange7D - priceAChange7D;
        case 'lowestPrice7D':
          return priceAChange7D - priceBChange7D;
        case 'highestPrice30D':
          return priceBChange30D - priceAChange30D;
        case 'lowestPrice30D':
          return priceAChange30D - priceBChange30D;
        case 'highestValue':
          return valueB - valueA;
        case 'lowestValue':
          return valueA - valueB;
        default:
          return 0;
      }
    });
  }, [tokenArray, searchInput, sortOption, allTokens]);

  // Pagination Logic
  const totalPages = Math.ceil(processedTokens.length / ITEMS_PER_PAGE);
  const paginatedTokens = processedTokens.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to sync scroll for all elements
  const scrollContainerRef = useRef<HTMLDivElement[]>([]);
  const syncScroll = (index: number) => (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft } = event.currentTarget;

    scrollContainerRef.current.forEach((el, i) => {
      if (el && i !== index) {
        el.scrollLeft = scrollLeft;
      }
    });
  };

  return (
    <div className='b-r-sm'>
      <div className={`${isMobile ? '' : 'd-flex'} justify-content-between align-items-center`}>
        <p className='h3 mt-1 mb-0 text-white'>Your Tokens ({processedTokens.length})</p>
        <div className='d-flex justify-content-end align-items-center'>
          <span className={`${isMobile ? 'font-size-sm' : 'font-size-md'} font-regular text-white m-r-n-xs`} style={{ textWrap: 'nowrap' }}>Sort-by: </span>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            size="small"
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
            <MenuItem value="alphabetically" className={`font-rose select-menu-item font-size-sm ${sortOption === 'alphabetically' ? 'active' : ''}`}>Alphabetically</MenuItem>
            <MenuItem value="highestValue" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestValue' ? 'active' : ''}`}>Highest Value</MenuItem>
            <MenuItem value="lowestValue" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestValue' ? 'active' : ''}`}>Lowest Value</MenuItem>
            <MenuItem value="highestBalance" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestBalance' ? 'active' : ''}`}>Highest Balance</MenuItem>
            <MenuItem value="lowestBalance" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestBalance' ? 'active' : ''}`}>Lowest Balance</MenuItem>
            <MenuItem value="highestPrice" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestPrice' ? 'active' : ''}`}>Highest Price</MenuItem>
            <MenuItem value="lowestPrice" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestPrice' ? 'active' : ''}`}>Lowest Price</MenuItem>
            <MenuItem value="highestPrice24h" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestPrice24h' ? 'active' : ''}`}>Highest Price Change 24h</MenuItem>
            <MenuItem value="lowestPrice24h" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestPrice24h' ? 'active' : ''}`}>Lowest Price Change 24h</MenuItem>
            <MenuItem value="highestPrice7D" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestPrice7D' ? 'active' : ''}`}>Highest Price Change 7D</MenuItem>
            <MenuItem value="lowestPrice7D" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestPrice7D' ? 'active' : ''}`}>Lowest Price Change 7D</MenuItem>
            <MenuItem value="highestPrice30D" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestPrice30D' ? 'active' : ''}`}>Highest Price Change 30D</MenuItem>
            <MenuItem value="lowestPrice30D" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestPrice30D' ? 'active' : ''}`}>Lowest Price Change 30D</MenuItem>
          </Select>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={searchInput}
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
      <List>
        {!loading ? (
          paginatedTokens.length > 0 ? (
            paginatedTokens.map((token: CreatedToken, index: number) => (
              <div
                key={`list-item-${token.token_id}`}
                className="mb-1 text-white d-flex align-items-center cursor-pointer token-list-item"
                style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}
              >
                {/* Fixed Token Column */}
                <div className="d-flex align-items-center py-2 px-3" style={{ minWidth: isMobile ? '30px' : '5%' }}>
                  <Avatar className="" src={token.logo} sx={{ height: '35px', width: '35px', marginTop: '-2px' }} />                  
                </div>

                {/* Scrollable Section for Other Columns */}
                <div
                  ref={(el) => (scrollContainerRef.current[index] = el!)}
                  onScroll={syncScroll(index)}
                  className="d-flex overflow-auto py-2 pe-3 ps-0"
                  style={{ flex: 1, gap: '10px', paddingLeft: '10px', willChange: 'scroll-position' }}
                >
                  <div className="d-flex align-items-center" style={{ minWidth: isMobile ? '90px' : '11%' }}>
                    <div className="">
                      <p className={`font-size-xs mb-0 ${sortOption === 'alphabetically' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                        Token {sortOption === 'alphabetically' && <TrendingUpIcon className="ms-1 font-size-md" />}
                      </p>
                      <p className="font-size-sm mb-0">{token.ticker}</p>
                    </div>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestValue' || sortOption === 'lowestValue' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Value {sortOption === 'highestValue' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestValue' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      ${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(allTokens[token.token_id]?.price_usd || '0') * parseFloat(denominatedAmountToIntlFormattedAmount(token.balance || 0, token.decimals || 18, 2) || '0'), 3)), 0, 20)}
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestBalance' || sortOption === 'lowestBalance' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Balance {sortOption === 'highestBalance' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestBalance' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">{denominatedAmountToIntlFormattedAmount(token.balance || 0, token.decimals || 18, 2)}</p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestPrice' || sortOption === 'lowestPrice' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Price {sortOption === 'highestPrice' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestPrice' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      $<ReduceZerosFormat numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(allTokens[token.token_id]?.price_usd || '0'), 3)), 0, 20)} />
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '14%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestPrice24h' || sortOption === 'lowestPrice24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Price 24h
                      {sortOption === 'highestPrice24h' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestPrice24h' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">{getPriceChangePercentageComponent(parseFloat(allTokens[token.token_id]?.price_usd), parseFloat(allTokens[token.token_id]?.price_change_24h))}</p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '11%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestPrice7D' || sortOption === 'lowestPrice7D' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Price 7D
                      {sortOption === 'highestPrice7D' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestPrice7D' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">{getPriceChangePercentageComponent(parseFloat(allTokens[token.token_id]?.price_usd), parseFloat(allTokens[token.token_id]?.price_change_7d))}</p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '11%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestPrice30D' || sortOption === 'lowestPrice30D' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Price 30D
                      {sortOption === 'highestPrice30D' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestPrice30D' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">{getPriceChangePercentageComponent(parseFloat(allTokens[token.token_id]?.price_usd), parseFloat(allTokens[token.token_id]?.price_change_30d))}</p>
                  </div>
                </div>
              </div>

            ))
          ) : (
            <div className='p-3 text-white d-flex justify-content-center align-items-center cursor-pointer token-list-item' style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}>
              <p className='text-silver text-center mt-2 h6'>No token found</p>
            </div>
          )
        ) : (
          <SimpleLoader />
        )}
      </List>
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

export default UserTokensListOld;