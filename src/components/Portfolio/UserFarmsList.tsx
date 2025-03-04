import { useState, useMemo, useRef } from 'react';
import { Button, List, TextField } from '@mui/material';
import { intlNumberFormat } from 'utils/formatters';
import { Search } from '@mui/icons-material';
import SimpleLoader from 'components/SimpleLoader';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import { useSelector } from 'react-redux';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import { Farm, FarmsState, UserFarmsState } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { Select, MenuItem } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const defaultTokenValues = {
  image_url: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/WEGLD-a28c59/icon.png',
  name: 'TOKEN',
  price: 0,
  decimals: 18
}

const ITEMS_PER_PAGE = 10;

interface UserFarmsListProps {
  farms: FarmsState;
  userData: UserFarmsState;
}

const UserFarmsList: React.FC<UserFarmsListProps> = ({ farms, userData }) => {
  const allTokens = useSelector(selectAllTokensById);
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  const [searchInput, setSearchInput] = useState('');
  const [sortOption, setSortOption] = useState('highestYourStaked');
  const [currentPage, setCurrentPage] = useState(1);

  // Convert pools object to an array
  const farmsArray = useMemo(() => Object.values(farms) || [], [farms]);


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
  const processedFarms = useMemo(() => {
    let filtered = farmsArray.filter((farm: Farm) =>
      (farm?.token1 && farm.token1.toLowerCase().includes(searchInput.toLowerCase())) ||
      (farm?.token2 && farm.token2.toLowerCase().includes(searchInput.toLowerCase())) ||
      (farm?.lp_token_id && farm.lp_token_id.toLowerCase().includes(searchInput.toLowerCase()))
    );
    return filtered.sort((a: Farm, b: Farm) => {
      switch (sortOption) {
        case 'highestYourStaked':
          return Number(userData[b?.lp_token_id].staked) - Number(userData[a?.lp_token_id].staked);
        case 'lowestYourStaked':
          return Number(userData[a?.lp_token_id].staked) - Number(userData[b?.lp_token_id].staked);
        case 'highestYourRewards':
          return Number(userData[b?.lp_token_id].rewards) - Number(userData[a?.lp_token_id].rewards);
        case 'lowestYourRewards':
          return Number(userData[a?.lp_token_id].rewards) - Number(userData[b?.lp_token_id].rewards);
        case 'highestStaked':
          return Number(b?.totalStaked) - Number(a?.totalStaked);
        case 'lowestStaked':
          return Number(a?.totalStaked) - Number(b?.totalStaked);
        case 'highestRewards':
          return Number(b?.totalRewards) - Number(a?.totalRewards);
        case 'lowestRewards':
          return Number(a?.totalRewards) - Number(b?.totalRewards);
        case 'highestFeesAPR':
          return Number(b?.feesAPR) - Number(a?.feesAPR);
        case 'lowestFeesAPR':
          return Number(a?.feesAPR) - Number(b?.feesAPR);
        case 'highestBoostedAPR':
          return Number(b?.boostedAPR) - Number(a?.boostedAPR);
        case 'lowestBoostedAPR':
          return Number(a?.boostedAPR) - Number(b?.boostedAPR);
        case 'alphabetically':
          return a.lp_token_id.localeCompare(b.lp_token_id);
        default:
          return 0;
      }
    });
  }, [farmsArray, searchInput, sortOption, allTokens]);

  // Pagination Logic
  const totalPages = Math.ceil(farmsArray.length / ITEMS_PER_PAGE);
  const paginatedFarms = farmsArray.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
        <p className='h3 mt-1 mb-0 text-white'>Your Farms ({processedFarms.length})</p>
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
            <MenuItem value="highestYourStaked" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestYourStaked' ? 'active' : ''}`}>Your Highest Staked</MenuItem>
            <MenuItem value="lowestYourStaked" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestYourStaked' ? 'active' : ''}`}>Your Lowest Staked</MenuItem>
            <MenuItem value="highestYourRewards" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestYourRewards' ? 'active' : ''}`}>Your Highest Rewards</MenuItem>
            <MenuItem value="lowestYourRewards" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestYourRewards' ? 'active' : ''}`}> Your Lowest Rewards</MenuItem>
            <MenuItem value="highestStaked" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestStaked' ? 'active' : ''}`}>Highest Staked</MenuItem>
            <MenuItem value="lowestStaked" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestStaked' ? 'active' : ''}`}>Lowest Staked</MenuItem>
            <MenuItem value="highestRewards" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestRewards' ? 'active' : ''}`}>Highest Rewards</MenuItem>
            <MenuItem value="lowestRewards" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestRewards' ? 'active' : ''}`}>Lowest Rewards</MenuItem>
            <MenuItem value="highestFeesAPR" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestFeesAPR' ? 'active' : ''}`}>Highest Fees APR</MenuItem>
            <MenuItem value="lowestFeesAPR" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestFeesAPR' ? 'active' : ''}`}>Lowest Fees APR</MenuItem>
            <MenuItem value="highestBoostedAPR" className={`font-rose select-menu-item font-size-sm ${sortOption === 'highestBoostedAPR' ? 'active' : ''}`}>Highest Boosted APR</MenuItem>
            <MenuItem value="lowestBoostedAPR" className={`font-rose select-menu-item font-size-sm ${sortOption === 'lowestBoostedAPR' ? 'active' : ''}`}>Lowest Boosted APR</MenuItem>
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
          processedFarms.length > 0 ? (
            processedFarms.map((farm: Farm, index: number) => (
              <div
                key={`list-item-${farm.lp_token_id}`}
                className="mb-1 text-white d-flex align-items-center cursor-pointer token-list-item"
                style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}
              >
                {/* Fixed Token Column */}
                <div className="d-flex align-items-center py-2 px-3" style={{ minWidth: isMobile ? '80px' : '5%' }}>
                  <img
                    src={allTokens[farm.token1]?.logo_url ?? defaultTokenValues.image_url}
                    alt={farm.token1}
                    className='d-inline'
                    style={{ width: 35, height: 35, border: '2px solid rgba(63, 172, 90, 0.3)', borderRadius: '20px' }}
                  />
                  <motion.img
                    src={allTokens[farm.token2]?.logo_url ?? defaultTokenValues.image_url}
                    alt={farm.token2}
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

                {/* Scrollable Section for Other Columns */}
                <div
                  ref={(el) => (scrollContainerRef.current[index] = el!)}
                  onScroll={syncScroll(index)}
                  className="d-flex overflow-auto py-2 px-3"
                  style={{ flex: 1, gap: '10px', paddingLeft: '10px' }}
                >
                  <div className="" style={{ minWidth: isMobile ? '100px' : '10%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'alphabetically' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Farm {sortOption === 'alphabetically' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">{allTokens[farm?.token1]?.ticker}{allTokens[farm?.token2]?.ticker}</p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestYourStaked' || sortOption === 'lowestYourStaked' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Your Staked
                      {sortOption === 'highestYourStaked' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestYourStaked' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      $
                      <CountUp
                        start={0}
                        end={Number(userData[farm?.lp_token_id]?.staked) || 0}
                        duration={1.5}
                        separator=","
                        decimals={3}
                        decimal="."
                        delay={0.1}
                      />
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestYourRewards' || sortOption === 'lowestYourRewards' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Your Rewards
                      {sortOption === 'highestYourRewards' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestYourRewards' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      $
                      <CountUp
                        start={0}
                        end={Number(userData[farm?.lp_token_id]?.rewards) || 0}
                        duration={1.5}
                        separator=","
                        decimals={3}
                        decimal="."
                        delay={0.1}
                      />
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestStaked' || sortOption === 'lowestStaked' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Total Staked
                      {sortOption === 'highestStaked' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestStaked' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      $
                      <CountUp
                        start={0}
                        end={Number(farm?.totalStaked)}
                        duration={1.5}
                        separator=","
                        decimals={3}
                        decimal="."
                        delay={0.1}
                      />
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '15%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestRewards' || sortOption === 'lowestRewards' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Total Rewards
                      {sortOption === 'highestRewards' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestRewards' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      $
                      <CountUp
                        start={0}
                        end={Number(farm?.totalRewards)}
                        duration={1.5}
                        separator=","
                        decimals={3}
                        decimal="."
                        delay={0.1}
                      />
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '12%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestFeesAPR' || sortOption === 'lowestFeesAPR' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Fees APR
                      {sortOption === 'highestFeesAPR' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestFeesAPR' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      {intlNumberFormat(Number(farm?.feesAPR))}%
                    </p>
                  </div>

                  <div className="text-right" style={{ minWidth: isMobile ? '150px' : '12%' }}>
                    <p className={`font-size-xs mb-0 ${sortOption === 'highestBoostedAPR' || sortOption === 'lowestBoostedAPR' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                      Boosted APR
                      {sortOption === 'highestBoostedAPR' && <TrendingDownIcon className="ms-1 font-size-md" />}
                      {sortOption === 'lowestBoostedAPR' && <TrendingUpIcon className="ms-1 font-size-md" />}
                    </p>
                    <p className="font-size-sm mb-0">
                      {intlNumberFormat(Number(farm?.boostedAPR))}%
                    </p>
                  </div>
                </div>
              </div>

            ))
          ) : (
            <div className='p-3 text-white d-flex justify-content-center align-items-center cursor-pointer token-list-item' style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}>
              <p className='text-silver text-center mt-2 h6'>No farm found</p>
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

export default UserFarmsList;