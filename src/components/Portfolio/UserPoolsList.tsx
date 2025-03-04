import { useState, useMemo, useRef } from 'react';
import { Button, List, TextField } from '@mui/material';
import { getFormattedUserPoolLiquidity, getFormattedUserPoolShare } from 'utils/formatters';
import { Search } from '@mui/icons-material';
import SimpleLoader from 'components/SimpleLoader';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import { useSelector } from 'react-redux';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import { Pair, PairsState } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { Select, MenuItem } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { getUserPoolLiquidity, getUserPoolShare } from 'utils/calculs';

const defaultTokenValues = {
  image_url: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png',
  name: 'TOKEN',
  price: 0,
  decimals: 18
}

const ITEMS_PER_PAGE = 10;

interface UserPoolsListProps {
  pairs: PairsState;
  userLpTokenBalance: Record<string, { balance: string }>;
  userFees24h: Record<string, { balance: number }>;
}

const UserPoolsList: React.FC<UserPoolsListProps> = ({ pairs, userLpTokenBalance, userFees24h }) => {
  const allTokens = useSelector(selectAllTokensById);
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  const [searchInput, setSearchInput] = useState('');
  const [sortOption, setSortOption] = useState('highestYourLiquidity');
  const [currentPage, setCurrentPage] = useState(1);

  // Convert pools object to an array
  const pairsArray = useMemo(() => pairs?.pairs || [], [pairs]);

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

  // Filter and sort pools
  const processedPools = useMemo(() => {
    let filtered = pairsArray.filter((pair: Pair) =>
      (pair?.token1 && pair.token1.toLowerCase().includes(searchInput.toLowerCase())) ||
      (pair?.token2 && pair.token2.toLowerCase().includes(searchInput.toLowerCase()))
    );
    return filtered.sort((a: Pair, b: Pair) => {
      const yourLiquidityA = getUserPoolLiquidity(userLpTokenBalance[a.lp_token_id]?.balance, allTokens[a.lp_token_id]?.supply, allTokens[a.lp_token_id]?.decimals, a?.tvl);
      const yourLiquidityB = getUserPoolLiquidity(userLpTokenBalance[b.lp_token_id]?.balance, allTokens[b.lp_token_id]?.supply, allTokens[b.lp_token_id]?.decimals, b?.tvl);
      const poolShareA = getUserPoolShare(userLpTokenBalance[a.lp_token_id]?.balance, allTokens[a.lp_token_id]?.supply, allTokens[a.lp_token_id]?.decimals);
      const poolShareB = getUserPoolShare(userLpTokenBalance[b.lp_token_id]?.balance, allTokens[b.lp_token_id]?.supply, allTokens[b.lp_token_id]?.decimals);
      const feesA24h = userFees24h[a.lp_token_id]?.balance || 0;
      const feesB24h = userFees24h[b.lp_token_id]?.balance || 0;

      switch (sortOption) {
        case 'highestYourLiquidity':
          return yourLiquidityB - yourLiquidityA;
        case 'lowestYourLiquidity':
          return yourLiquidityA - yourLiquidityB;
        case 'highestYourFees24h':
          return feesB24h - feesA24h;
        case 'lowestYourFees24h':
          return feesA24h - feesB24h;
        case 'highestPoolShare':
          return poolShareB - poolShareA;
        case 'lowestPoolShare':
          return poolShareA - poolShareB;
        case 'highestLiquidity':
          return Number(b?.tvl) - Number(a?.tvl);
        case 'lowestLiquidity':
          return Number(a?.tvl) - Number(b?.tvl);
        case 'highestFees24h':
          return Number(b?.fees_24h) - Number(a?.fees_24h);
        case 'lowestFees24h':
          return Number(a?.fees_24h) - Number(b?.fees_24h);
        case 'highestVolume24h':
          return Number(b?.volume_24h) - Number(a?.volume_24h);
        case 'lowestVolume24h':
          return Number(a?.volume_24h) - Number(b?.volume_24h);
        case 'alphabetically':
          return a.lp_token_id.localeCompare(b.lp_token_id);
        default:
          return 0;
      }
    });
  }, [pairsArray, searchInput, sortOption, allTokens]);

  // Pagination Logic
  const totalPages = Math.ceil(pairsArray.length / ITEMS_PER_PAGE);
  const paginatedPairs = pairsArray.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
        <p className='h3 mt-1 mb-0 text-white'>Your Pools ({processedPools.length})</p>
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
            <MenuItem value="highestYourLiquidity" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestYourLiquidity' ? 'active' : ''}`}>Your Highest Liquidity</MenuItem>
            <MenuItem value="lowestYourLiquidity" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestYourLiquidity' ? 'active' : ''}`}>Your Lowest Liquidity</MenuItem>
            <MenuItem value="highestYourFees24h" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestYourFees24h' ? 'active' : ''}`}>Your Highest Fees 24h</MenuItem>
            <MenuItem value="lowestYourFees24h" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestYourFees24h' ? 'active' : ''}`}> Your Lowest Fees 24h</MenuItem>
            <MenuItem value="highestPoolShare" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestPoolShare' ? 'active' : ''}`}>Highest Pool Share</MenuItem>
            <MenuItem value="lowestPoolShare" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestPoolShare' ? 'active' : ''}`}>Lowest Pool Share</MenuItem>
            <MenuItem value="highestLiquidity" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestLiquidity' ? 'active' : ''}`}>Highest Liquidity</MenuItem>
            <MenuItem value="lowestLiquidity" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestLiquidity' ? 'active' : ''}`}>Lowest Liquidity</MenuItem>
            <MenuItem value="highestFees24h" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestFees24h' ? 'active' : ''}`}>Highest Fees 24h</MenuItem>
            <MenuItem value="lowestFees24h" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestFees24h' ? 'active' : ''}`}>Lowest Fees 24h</MenuItem>
            <MenuItem value="highestVolume24h" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestVolume24h' ? 'active' : ''}`}>Highest Volume 24h</MenuItem>
            <MenuItem value="lowestVolume24h" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestVolume24h' ? 'active' : ''}`}>Lowest Volume 24h</MenuItem>
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
          processedPools.length > 0 ? (
            processedPools.map((pair: Pair, index: number) => (
              <div
                key={`list-item-${pair.lp_token_id}`}
                className="p-3 mb-2 text-white d-flex align-items-center cursor-pointer token-list-item"
                style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}
              >
                {/* Fixed Token Column */}
                <div className="d-flex align-items-center" style={{ minWidth: isMobile ? '80px' : '5%' }}>
                  <img
                    src={allTokens[pair.token1]?.logo_url ?? defaultTokenValues.image_url}
                    alt={pair.token1}
                    className='d-inline'
                    style={{ width: 35, height: 35, border: '2px solid rgba(63, 172, 90, 0.3)', borderRadius: '20px' }}
                  />
                  <motion.img
                    src={allTokens[pair.token2]?.logo_url ?? defaultTokenValues.image_url}
                    alt={pair.token2}
                    className="d-inline m-l-n-xxl me-3"
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

                {/* Scrollable Section for Other Columns */}
                <div
                  ref={(el) => (scrollContainerRef.current[index] = el!)}
                  onScroll={syncScroll(index)}
                  className="d-flex overflow-auto"
                  style={{ flex: 1, gap: '10px', paddingLeft: '10px' }}
                >
                  <div className="ms-1" style={{ minWidth: isMobile ? '100px' : '10%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'alphabetically' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Pool {sortOption === 'alphabetically' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">{allTokens[pair?.token1]?.ticker} / {allTokens[pair?.token2]?.ticker}</p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '12%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestPoolShare' || sortOption === 'lowestPoolShare' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Pool Share
                      {sortOption === 'highestPoolShare' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestPoolShare' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      {getFormattedUserPoolShare(userLpTokenBalance[pair.lp_token_id]?.balance, allTokens[pair.lp_token_id]?.supply, allTokens[pair.lp_token_id]?.decimals)}%
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '18%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestYourLiquidity' || sortOption === 'lowestYourLiquidity' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Your Liquidity
                      {sortOption === 'highestYourLiquidity' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestYourLiquidity' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      ${getFormattedUserPoolLiquidity(userLpTokenBalance[pair.lp_token_id]?.balance, allTokens[pair.lp_token_id]?.supply, allTokens[pair.lp_token_id]?.decimals, pair?.tvl)}
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestYourFees24h' || sortOption === 'lowestYourFees24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Your Fees (24h)
                      {sortOption === 'highestYourFees24h' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestYourFees24h' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      $
                      <CountUp
                        start={0}
                        end={userFees24h[pair.lp_token_id]?.balance || 0}
                        duration={1.5}
                        separator=","
                        decimals={3}
                        decimal="."
                        delay={0.1}
                      />
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '18%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestLiquidity' || sortOption === 'lowestLiquidity' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Liquidity
                      {sortOption === 'highestLiquidity' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestLiquidity' && <TrendingUpIcon className="ms-1 font-size-md" />}
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

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestFees24h' || sortOption === 'lowestFees24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Fees (24h)
                      {sortOption === 'highestFees24h' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestFees24h' && <TrendingUpIcon className="ms-1 font-size-md" />}
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

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestVolume24h' || sortOption === 'lowestVolume24h' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Volume (24h)
                      {sortOption === 'highestVolume24h' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestVolume24h' && <TrendingUpIcon className="ms-1 font-size-md" />}
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
                </div>
              </div>

            ))
          ) : (
            <div className='p-3 text-white d-flex justify-content-center align-items-center cursor-pointer token-list-item' style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}>
              <p className='text-silver text-center mt-2 h6'>No pool found</p>
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

export default UserPoolsList;