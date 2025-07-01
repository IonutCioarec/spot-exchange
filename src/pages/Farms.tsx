import { Container } from 'react-bootstrap';
import 'assets/scss/farms.scss';
import { Row, Col } from 'react-bootstrap';
import Farm from 'components/Farms/Farm';
import { debounceSearchTime, poolBaseTokens } from 'config';
import { intlFormatSignificantDecimals } from 'utils/formatters';
import LightSpot from 'components/LightSpot';
import { useMobile } from 'utils/responsive';
import { debounce } from 'lodash';
import { Button, FormControlLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, styled, Switch, TextField } from '@mui/material';
import { useGetAccountInfo } from 'hooks';
import { Search } from '@mui/icons-material';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ScrollToTopButton from 'components/ScrollToTopButton';
import { farmsDummy, userFarmsDummy } from 'utils/dummyData';
import { isEmpty } from '@multiversx/sdk-core/out';
import FilterLoader from 'components/Pools/FilterLoader';
import { Farm as FarmType } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { FarmItem } from 'components/Farms/FarmItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectFarmsById, selectFarmsSortBy, selectFarmsSortDirection, setPage, setSortBy, setSortDirection, setLPTokenSearch, selectFarmsPage, selectFarmsTotalPages } from 'storeManager/slices/farmsSlice';

const Farms = () => {
  const isMobile = useMobile();
  const { address } = useGetAccountInfo();
  const isLoggedIn = address ? true : false;
  const [localSearchInput, setLocalSearchInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const farms = useSelector(selectFarmsById);
  const sortBy = useSelector(selectFarmsSortBy);
  const sortDirection = useSelector(selectFarmsSortDirection);
  const currentPage = useSelector(selectFarmsPage);
  const totalPages = useSelector(selectFarmsTotalPages);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  // Debounced function for search input
  const debouncedDispatch = useRef(
    debounce((value: string) => {
      setLoading(true);
      dispatch(setLPTokenSearch(value));
      dispatch(setPage(1));
      setTimeout(() => setLoading(false), debounceSearchTime);
    }, debounceSearchTime)
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchInput(value);
    debouncedDispatch.current(value);
  };

  useEffect(() => {
    return () => {
      debouncedDispatch.current.cancel();
    };
  }, []);

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

  const handleSortByChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;

    switch (selectedValue) {
      case 'boosted_apr_desc':
        dispatch(setSortBy('boosted_apr'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'boosted_apr_asc':
        dispatch(setSortBy('boosted_apr'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'fees_apr_desc':
        dispatch(setSortBy('fees_apr'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'fees_apr_asc':
        dispatch(setSortBy('fees_apr'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'total_apr_desc':
        dispatch(setSortBy('total_apr'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'total_apr_asc':
        dispatch(setSortBy('total_apr'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'total_staked_desc':
        dispatch(setSortBy('total_staked'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'total_staked_asc':
        dispatch(setSortBy('total_staked'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'total_rewards_desc':
        dispatch(setSortBy('total_rewards'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'total_rewards_asc':
        dispatch(setSortBy('total_rewards'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      case 'staking_users_desc':
        dispatch(setSortBy('staking_users'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
      case 'staking_users_asc':
        dispatch(setSortBy('staking_users'));
        dispatch(setSortDirection('asc'));
        dispatch(setPage(1));
        break;
      default:
        dispatch(setSortBy('total_apr'));
        dispatch(setSortDirection('desc'));
        dispatch(setPage(1));
        break;
    }
  };

  // Helper function to get display label based on selected value
  const getSelectedLabel = () => {
    if (sortBy === 'boosted_apr' && sortDirection === 'desc') return 'Highest Boosted APR';
    if (sortBy === 'boosted_apr' && sortDirection === 'asc') return 'Lowest Boosted APR';
    if (sortBy === 'fees_apr' && sortDirection === 'desc') return 'Highest Fees APR';
    if (sortBy === 'fees_apr' && sortDirection === 'asc') return 'Lowest Fees APR';
    if (sortBy === 'total_apr' && sortDirection === 'desc') return 'Highest Total APR';
    if (sortBy === 'total_apr' && sortDirection === 'asc') return 'Lowest Total APR';
    if (sortBy === 'total_staked' && sortDirection === 'desc') return 'Highest Total Staked';
    if (sortBy === 'total_staked' && sortDirection === 'asc') return 'Lowest Total Staked';
    if (sortBy === 'total_rewards' && sortDirection === 'desc') return 'Highest Total Rewards';
    if (sortBy === 'total_rewards' && sortDirection === 'asc') return 'Lowest Total Rewards';
    if (sortBy === 'staking_users' && sortDirection === 'desc') return 'Most Staking Users';
    if (sortBy === 'staking_users' && sortDirection === 'asc') return 'Least Staking Users';
    return 'Highest Total APR'; // Default
  };

  useEffect(() => {
    setLocalSearchInput('');
    dispatch(setLPTokenSearch(''));
  }, []);

  return (
    <div className='farms-page-height'>
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ minHeight: '60px' }}>
            {/* <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '60px' }}> */}
            <div className={`p-3 mb-2 ${isMobile ? 'mt-2' : 'mt-4'}`}>
              <h2 className='text-white text-center'>Farms</h2>
            </div>
          </div>
        </Col>
      </Row>
      {isMobile && Object.values(farmsDummy).length && (
        <ScrollToTopButton targetRefId='topSection' />
      )}

      <Row className='mt-2 mb-2'>
        <Col xs={12}>
          {isMobile && (
            <div className='grid-end-center'>
              <TextField
                id="outlined-search"
                type="search"
                size="small"
                className=""
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
                  },
                  width: '100%'
                }}
              />
            </div>
          )}
          <div className='grid-between-center'>
            <div className={`mt-1 ${isMobile ? 'grid-between-center' : 'grid-start-center'}`}>
              <FormControlLabel
                control={
                  <CustomSwitch
                  />
                }
                className='no-wrap'
                label="My Farms"
                labelPlacement="end"
                sx={{
                  width: isMobile ? '50%' : 'auto',
                  color: isLoggedIn ? 'white' : 'silver',
                  fontSize: '14px',
                  '& .MuiTypography-root': {
                    fontSize: isMobile ? '14px' : '16px',
                    fontFamily: 'Red Rose',
                    color: !isLoggedIn ? 'silver' : 'white'
                  },
                }}
              />
              <div className={`grid-end-center ${isMobile ? 'ms-3' : ''}`}>
                <span className={`${isMobile ? 'font-size-sm' : 'font-size-md'} font-regular text-white m-r-n-xs no-wrap`}>Sort-by: </span>
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
                  <MenuItem value="boosted_apr_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'boosted_apr' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Boosted APR</MenuItem>
                  <MenuItem value="boosted_apr_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'boosted_apr' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Boosted APR</MenuItem>
                  <MenuItem value="fees_apr_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'fees_apr' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Fees APR</MenuItem>
                  <MenuItem value="fees_apr_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'fees_apr' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Fees APR</MenuItem>
                  <MenuItem value="total_apr_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'total_apr' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Total APR</MenuItem>
                  <MenuItem value="total_apr_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'total_apr' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Total APR</MenuItem>
                  <MenuItem value="total_staked_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'total_staked' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Total Staked</MenuItem>
                  <MenuItem value="total_staked_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'total_staked' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Total Staked</MenuItem>
                  <MenuItem value="total_rewards_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'total_rewards' && sortDirection === 'desc' ? 'active' : ''}`}>Highest Total Rewards</MenuItem>
                  <MenuItem value="total_rewards_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'total_rewards' && sortDirection === 'asc' ? 'active' : ''}`}>Lowest Total Rewards</MenuItem>
                  <MenuItem value="staking_users_desc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'staking_users' && sortDirection === 'desc' ? 'active' : ''}`}>Most Staking Users</MenuItem>
                  <MenuItem value="staking_users_asc" className={`font-rose select-menu-item font-size-sm ${sortBy === 'staking_users' && sortDirection === 'asc' ? 'active' : ''}`}>Least Staking Users</MenuItem>
                </Select>
              </div>
            </div>
            {!isMobile && (
              <div>
                <TextField
                  id="outlined-search"
                  type="search"
                  size="small"
                  className="mt-2"
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
            )}
          </div>
        </Col>
      </Row>
      {(isEmpty(farmsDummy)) && (
        <div>
          <div className='flex flex-col p-3 items-center justify-center gap-2 rounded-lg pool'>
            <div className='flex flex-col items-center'>
              <p className='text-white mb-0 font-bold'>No Farms Found</p>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <FilterLoader />
      ) : (
        <Fragment>
          {Object.values(farms).map((farm: FarmType, index: number) => (
            <FarmItem
              farm={farm}
              userFarm={userFarmsDummy[farm.lp_token_id]}
              index={index + (currentPage - 1) * 10}
              sortBy={sortBy}
              sortDirection={sortDirection}
              key={farm.lp_token_id}
            />
          ))}
          <div className="pagination-controls mb-5">
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

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </div>
  );
}

export default Farms;