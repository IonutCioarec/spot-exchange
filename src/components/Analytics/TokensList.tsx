import { useEffect, useState, useCallback, useRef } from 'react';
import { TextField, List, Avatar, Button } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { Search } from '@mui/icons-material';
import SimpleLoader from 'components/SimpleLoader';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage, selectPairTokensById, selectSearchInput, selectTotalPages, setPage, setSearchInput, selectPairTokensNumber } from 'storeManager/slices/tokensSlice';
import { Token } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { debounce } from 'lodash';
import { debounceSearchTime } from 'config';
import ReduceZerosFormat from "components/ReduceZerosFormat";
import MovingIcon from '@mui/icons-material/Moving';

const getPriceChangePercentage = (currentPrice: number, previousPrice: number) => {
  if (previousPrice === 0) return <span> - </span>; // Avoid division by zero

  const percentageChange = ((currentPrice - previousPrice) / Math.abs(previousPrice)) * 100;
  const isPositive = percentageChange >= 0;
  const color = isPositive ? '#3FAC5A' : '#bd0d0d';
  const rotation = isPositive ? 'rotate(-45deg)' : 'rotate(-225deg)';

  return (
    <span style={{ color }}>
      <MovingIcon style={{ transform: rotation, fontSize: '20px' }} />
      {Math.abs(percentageChange).toFixed(3)}%
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

  const [isOpen, setIsOpen] = useState(false);
  const [localSearchInput, setLocalSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setLocalSearchInput('');
    dispatch(setSearchInput(''));
    dispatch(setPage(1));
  };

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

  const handleTokenSelect = (tokenId: string) => {
    handleClose();
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
      <div className='d-flex justify-content-between'>
        <p className='h4 mt-1 ms-2 mb-0 text-white'>Tokens ({pairTokensNumber})</p>
        <div className='d-flex justify-content-end'>
          <TextField
            fullWidth
            label="Quick Search"
            size="small"
            variant="outlined"
            value={localSearchInput}
            autoComplete="off"
            onChange={handleSearchChange}
            className="token-search-container mb-2"            
            InputProps={{
              startAdornment: <Search sx={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '8px', fontSize: '18px' }} />,
              style: { color: 'silver', fontFamily: 'Red Rose' },
            }}
            InputLabelProps={{
              style: { color: 'silver', fontFamily: 'Red Rose' },
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'silver',
                  borderRadius: '20px',
                },
                '&:hover fieldset': {
                  borderColor: 'silver',
                },
                fontFamily: 'Red Rose',
                fontSize: '12px',
              },
              '& .MuiInputLabel-root': {
                backgroundColor: '#141414',
                paddingRight: '5px'
              },
            }}
          />

        </div>
      </div>
      <List>
        {!loading ? (
          Object.values(pairTokens).length > 0 ? (
            Object.values(pairTokens).map((token: Token, index: number) => (
              <div
                key={`list-item-${token.token_id}`}
                className='mb-1 text-white d-flex justify-content-between align-items-center cursor-pointer token-list-item'
                style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}
              >
                {/* Fixed Token Column */}
                <div className="d-flex align-items-center py-2 px-3" style={{ minWidth: isMobile ? '150px' : '10%' }}>
                  <Avatar className='' src={token.logo_url} sx={{ height: '35px', width: '35px', marginTop: '-2px' }} />
                  <div className='ms-1'>
                    <p className='font-size-xs mb-0 text-silver'>Token</p>
                    <p className='font-size-sm mb-0'>{token.ticker}</p>
                  </div>
                </div>

                {/* Scrollable Section for Other Columns */}
                <div
                  ref={(el) => (scrollContainerRef.current[index] = el!)}
                  onScroll={syncScroll(index)}
                  className="d-flex overflow-auto py-2 px-3"
                  style={{ flex: 1, gap: '10px', paddingLeft: '10px' }}
                >
                  <div className='text-right' style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className='font-size-xs mb-0 text-silver'>Price</p>
                    <p className='font-size-sm mb-0'>
                      $<ReduceZerosFormat
                        numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.price_usd || '0'), 3)), 0, 20)}
                      />
                    </p>
                  </div>

                  <div className='text-right' style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className='font-size-xs mb-0 text-silver'>Price 24H</p>
                    <p className='font-size-sm mb-0'>
                      {getPriceChangePercentage(parseFloat(pairTokens[token.token_id]?.price_usd), parseFloat(pairTokens[token.token_id]?.price_change_24h))}
                    </p>
                  </div>

                  <div className='text-right' style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className='font-size-xs mb-0 text-silver'>Price 30D</p>
                    <p className='font-size-sm mb-0'>
                      {getPriceChangePercentage(parseFloat(pairTokens[token.token_id]?.price_usd), parseFloat(pairTokens[token.token_id]?.price_change_30d))}
                    </p>
                  </div>

                  <div className='text-right' style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className='font-size-xs mb-0 text-silver'>Volume 24H</p>
                    <p className='font-size-sm mb-0'>
                      $<ReduceZerosFormat
                        numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.volume_24h || '0'), 3)), 0, 20)}
                      />
                    </p>
                  </div>

                  <div className='text-right' style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className='font-size-xs mb-0 text-silver'>Volume 30D</p>
                    <p className='font-size-sm mb-0'>
                      $<ReduceZerosFormat
                        numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.volume_30d || '0'), 3)), 0, 20)}
                      />
                    </p>
                  </div>

                  <div className='text-right' style={{ minWidth: isMobile ? '150px' : '20%' }}>
                    <p className='font-size-xs mb-0 text-silver'>Liquidity</p>
                    <p className='font-size-sm mb-0'>
                      ${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.price_usd || '0') * parseFloat(pairTokens[token.token_id]?.supply || '0'), 3)), 0, 20)}
                    </p>
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