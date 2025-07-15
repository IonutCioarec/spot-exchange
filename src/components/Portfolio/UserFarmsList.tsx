import { useState, useMemo, useRef } from 'react';
import { TextField, Avatar, Button } from '@mui/material';
import { denominatedAmountToIntlFormattedAmount, formatSignificantDecimals, getFormattedUserPoolLiquidity, getFormattedUserPoolShare, intlNumberFormat } from 'utils/formatters';
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
import Table from "react-bootstrap/Table";
import { Farm, FarmsState, Pair, PairsState, UserFarmsState } from 'types/backendTypes';
import { getUserPoolLiquidity, getUserPoolShare } from 'utils/calculs';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import defaultLogo from 'assets/img/no_logo.png';

const defaultTokenValues = {
  image_url: defaultLogo,
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
          return Number(b?.total_staked) - Number(a?.total_staked);
        case 'lowestStaked':
          return Number(a?.total_staked) - Number(b?.total_staked);
        case 'highestRewards':
          return Number(b?.total_rewards) - Number(a?.total_rewards);
        case 'lowestRewards':
          return Number(a?.total_rewards) - Number(b?.total_rewards);
        case 'highestFeesAPR':
          return Number(b?.fees_apr) - Number(a?.fees_apr);
        case 'lowestFeesAPR':
          return Number(a?.fees_apr) - Number(b?.fees_apr);
        case 'highestBoostedAPR':
          return Number(b?.boosted_apr) - Number(a?.boosted_apr);
        case 'lowestBoostedAPR':
          return Number(a?.boosted_apr) - Number(b?.boosted_apr);
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
      {!loading ? (
        paginatedFarms.length > 0 && Object.values(allTokens).length > 0 ? (
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
                {paginatedFarms.map((farm: Farm) => (
                  <tr
                    key={farm.lp_token_id}
                  >
                    {/* Sticky First Column */}
                    <td>
                      <div className="d-flex align-items-center" style={{ minWidth: isMobile ? '60px' : 'inherit' }}>
                        <img
                          src={allTokens[farm.token1]?.logo_url && allTokens[farm.token1]?.logo_url !== 'N/A' ? allTokens[farm.token1]?.logo_url : defaultTokenValues.image_url}
                          alt={farm.token1}
                          className='d-inline'
                          style={{ width: 35, height: 35, border: '2px solid rgba(63, 172, 90, 0.3)', borderRadius: '20px' }}
                        />
                        <motion.img
                          src={allTokens[farm.token2]?.logo_url && allTokens[farm.token2]?.logo_url !== 'N/A' ? allTokens[farm.token2]?.logo_url : defaultTokenValues.image_url}
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
                    </td>

                    {/* Scrollable Columns */}
                    <td width={10}>
                      <div className="" style={{ minWidth: isMobile ? '100px' : '10%' }}>
                        <p className={`font-size-xs mb-0 ${sortOption === 'alphabetically' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                          Farm {sortOption === 'alphabetically' && <TrendingUpIcon className="ms-1 font-size-md" />}
                        </p>
                        <p className="font-size-sm mb-0">{allTokens[farm?.token1]?.ticker ?? (defaultTokenValues.name + '1')}{allTokens[farm?.token2]?.ticker ?? (defaultTokenValues.name + '2')}</p>
                      </div>
                    </td>

                    <td align="right">
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
                    </td>

                    <td align="right">
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
                    </td>

                    <td align="right">
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
                            end={Number(farm?.total_staked)}
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
                            end={Number(farm?.total_rewards)}
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
                      <div className="text-right" style={{ minWidth: isMobile ? '150px' : '12%' }}>
                        <p className={`font-size-xs mb-0 ${sortOption === 'highestFeesAPR' || sortOption === 'lowestFeesAPR' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                          Fees APR
                          {sortOption === 'highestFeesAPR' && <TrendingDownIcon className="ms-1 font-size-md" />}
                          {sortOption === 'lowestFeesAPR' && <TrendingUpIcon className="ms-1 font-size-md" />}
                        </p>
                        <p className="font-size-sm mb-0">
                          {intlNumberFormat(Number(farm?.fees_apr))}%
                        </p>
                      </div>
                    </td>

                    <td align="right">
                      <div className="text-right" style={{ minWidth: isMobile ? '150px' : '12%' }}>
                        <p className={`font-size-xs mb-0 ${sortOption === 'highestBoostedAPR' || sortOption === 'lowestBoostedAPR' ? 'text-intense-green font-bold' : 'text-silver'}`}>
                          Boosted APR
                          {sortOption === 'highestBoostedAPR' && <TrendingDownIcon className="ms-1 font-size-md" />}
                          {sortOption === 'lowestBoostedAPR' && <TrendingUpIcon className="ms-1 font-size-md" />}
                        </p>
                        <p className="font-size-sm mb-0">
                          {intlNumberFormat(Number(farm?.boosted_apr))}%
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
            <p className='text-silver text-center mt-2 h6'>No farm found</p>
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

export default UserFarmsList;