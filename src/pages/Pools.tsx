import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setViewMode, selectFilteredPairs, selectPairsStatus } from 'storeManager/slices/pairsSlice';
import { selectPairTokensById, selectLpTokensById } from 'storeManager/slices/tokensSlice';
import { selectUserTokens } from 'storeManager/slices/userTokensSlice';
import Loader from 'components/Loader';
import FilterLoader from 'components/Pools/FilterLoader';
import { Container, Row, Col } from 'react-bootstrap';
import { Pair } from 'types/backendTypes';
import 'assets/css/pools.css';
import { Pool } from 'components/Pools/Pool';
import { denominatedAmountToAmount } from 'utils/formatters';
import { Button } from '@mui/material';
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
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight,  KeyboardDoubleArrowLeft} from '@mui/icons-material';
import { poolsItemsPerPage } from 'config';

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
      color: theme.palette.action.disabled,
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.action.disabledBackground,
      },
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 10,
    backgroundColor: 'transparent',
    border: '1px solid #3FAC5A',
    height: 16,
    width: 34,
    margin: 'auto',
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 10,
    height: 10,
    margin: 5,
  },
}));

const Pools = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewModeState] = useState<'all' | 'assets' | 'created'>('all');
  const [searchInput, setSearchInput] = useState<string>('');
  const loadingTime = 300;
  const isMobile = useMobile();
  const isTablet = useTablet();
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const pairs = useSelector((state) => selectFilteredPairs(state, address, searchInput));
  const pairtokens = useSelector(selectPairTokensById);
  const lptokens = useSelector(selectLpTokensById);
  const pairsStatus = useSelector(selectPairsStatus);
  const userTokens = useSelector(selectUserTokens);

  // Reset the viewMode to 'all' when the component is first mounted
  useEffect(() => {
    setViewModeState('all');
    dispatch(setViewMode('all'));
  }, [dispatch]);

  const handleAssetsPairsToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setCurrentPage(1);
    const isChecked = event.target.checked;
    const newViewMode = isChecked ? 'assets' : 'all';
    setViewModeState(newViewMode);
    dispatch(setViewMode(newViewMode));

    await new Promise((resolve) => setTimeout(resolve, loadingTime));
    setLoading(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setCurrentPage(1);
    setSearchInput(event.target.value);
    setTimeout(() => {
      setLoading(false);
    }, loadingTime);
  };

  //Frontend pagination  
  const totalPages = Math.ceil(pairs.length / poolsItemsPerPage);
  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  const paginatedPairs = pairs.slice(
    (currentPage - 1) * poolsItemsPerPage,
    currentPage * poolsItemsPerPage
  );

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.3)', minHeight: '100px' }}>
            <div className='p-4'>
              <h2 className='text-white text-center'>Pools</h2>
              <p className='text-white mb-0'>It is a long established fact that a reader will be distracted by the readable content of a page</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className='mb-5 mt-2'>
        <Col xs={12} lg={12}>
          <div className=''>
            <div className='mt-2 d-flex justify-content-between align-items-center'>
              {!isMobile &&
                <FormControlLabel
                  control={
                    <CustomSwitch
                      checked={viewMode === 'assets'}
                      onChange={handleAssetsPairsToggle}
                    />
                  }
                  label="My Deposits"
                  labelPlacement="end"
                  sx={{
                    color: 'white',
                    fontSize: '14px',
                    '& .MuiTypography-root': {
                      fontSize: '14px',
                      fontFamily: 'Red Rose'
                    },
                  }}
                />
              }
              <div className='d-flex justify-content-end'>
                <Button
                  className="btn-intense-green hover-btn"
                  sx={{ minWidth: isMobile ? '170px' : '120px', height: '30px' }}
                >
                  New Pool
                </Button>
                <TextField
                  id="outlined-search"
                  type="search"
                  size="small"
                  className="ms-2 mb-2"
                  value={searchInput}
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
              <div className='text-right m-t-n-sm'>
                <FormControlLabel
                  control={
                    <CustomSwitch
                      checked={viewMode === 'assets'}
                      onChange={handleAssetsPairsToggle}
                      color='success'
                    />
                  }
                  label="My Deposits"
                  labelPlacement="end"
                  sx={{
                    color: 'white',
                    fontSize: '14px',
                    '& .MuiTypography-root': {
                      fontSize: '14px',
                      fontFamily: 'Red Rose'
                    },
                  }}
                />
              </div>
            }
            {pairsStatus === 'loading' && <FilterLoader />}
            {(isEmpty(pairs) && pairsStatus !== 'loading' && !loading) && (
              <div style={{ minHeight: '30vh' }}>
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
                {paginatedPairs.map((pair: Pair, index: number) => (
                  <Pool
                    key={`pairs-${index}`}
                    pair={pair}
                    index={index + (currentPage - 1) * 15}
                    token1Details={pairtokens[pair.token1]}
                    token2Details={pairtokens[pair.token2]}
                    userToken1Balance={Number(userTokens[pair.token1]?.balance ?? 0)}
                    userToken2Balance={Number(userTokens[pair.token2]?.balance ?? 0)}
                    // userLpTokenBalance={Number(denominatedAmountToAmount(userTokens[pair.lp_token_id]?.balance, lptokens[pair.lp_token_id].decimals, 20) || 0)}
                    userLpTokenBalance={Number(0.6)}
                    lpTokenSupply={(Number(denominatedAmountToAmount(lptokens[pair.lp_token_id]?.supply || 0, lptokens[pair.lp_token_id]?.decimals || 18, 20)) ?? 0)}
                  />
                ))}
                <div className="pagination-controls">
                  <Button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className='pagination-button'
                  >
                    <KeyboardDoubleArrowLeft className={`${currentPage === 1 ? 'disabled-arrow' : 'active-arrow'}`}/>
                  </Button>

                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className='pagination-button'
                  >
                    <ChevronLeft className={`${currentPage === 1 ? 'disabled-arrow' : 'active-arrow'}`}/>
                  </Button>

                  <span>
                    Page {currentPage} {totalPages > 0 ? `of ${totalPages}` : 'of 1'}
                  </span>

                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className='pagination-button'
                  >
                    <ChevronRight className={`${currentPage === totalPages ? 'disabled-arrow' : 'active-arrow'}`}/>
                  </Button>

                  <Button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                    className='pagination-button'
                  >
                    <KeyboardDoubleArrowRight className={`${currentPage === totalPages ? 'disabled-arrow' : 'active-arrow'}`}/>
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
    </Fragment>
  );
};

export default Pools;