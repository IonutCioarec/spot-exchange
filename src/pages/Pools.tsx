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

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-switchBase': {
    transitionDuration: '300ms',
    '&.Mui-checked': {
      color: '#0c462f',
      '& + .MuiSwitch-track': {
        backgroundColor: '#0c462f',
        border: '1px solid green'
      },
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: '#bdbdbd',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
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
    const isChecked = event.target.checked;
    const newViewMode = isChecked ? 'assets' : 'all';
    setViewModeState(newViewMode);
    dispatch(setViewMode(newViewMode));

    await new Promise((resolve) => setTimeout(resolve, loadingTime));
    setLoading(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setSearchInput(event.target.value);
    setTimeout(() => {
      setLoading(false);
    }, loadingTime);
  };

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.3)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Pools</h2>
              <p className='text-white mb-0'>It is a long established fact that a reader will be distracted by the readable content of a page</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className='mb-1'>
        <Col xs={12} lg={12}>
          <div className='mt-5 mb-5'>
            {/* <div className='mb-3 mt-2 d-flex justify-content-end' style={{ borderBottom: '3px solid #0c462f' }}>
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
                    },
                  }}
                />
              }
              <Button
                className="custom-effect btn-green3 text-uppercase mb-2 text-capitalize"
                variant="outlined"
                size="small"
                sx={{ minWidth: '120px' }}
              >
                New Pool
              </Button>
              <TextField
                id="outlined-search"
                label="Quick Search"
                type="search"
                size="small"
                variant="outlined"
                className="ms-2 mb-2"
                value={searchInput}
                onChange={handleSearchChange}
                InputProps={{
                  style: {
                    backgroundColor: '#0c462f',
                    color: 'white',
                  },
                  startAdornment: (
                    <Search style={{ color: 'white', marginRight: '8px' }} />
                  ),
                }}
                InputLabelProps={{
                  style: {
                    color: 'white',
                    fontSize: '13px',
                    marginTop: '3px'
                  },
                }}
              />
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
                    },
                  }}
                />
              </div>
            } */}
            {pairsStatus === 'loading' && <FilterLoader />}
            {(isEmpty(pairs) && pairsStatus !== 'loading' && !loading) && (
              <div style={{ minHeight: '30vh' }}>
                <div className='flex flex-col p-6 items-center justify-center gap-2 rounded-xl bg-[#083121] w-full'>
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
                    index={index}
                    token1Details={pairtokens[pair.token1]}
                    token2Details={pairtokens[pair.token2]}
                    userToken1Balance={Number(userTokens[pair.token1]?.balance ?? 0)}
                    userToken2Balance={Number(userTokens[pair.token2]?.balance ?? 0)}
                    // userLpTokenBalance={Number(denominatedAmountToAmount(userTokens[pair.lp_token_id]?.balance, lptokens[pair.lp_token_id].decimals, 20) || 0)}
                    userLpTokenBalance={Number(0.6)}
                    lpTokenSupply={(Number(denominatedAmountToAmount(lptokens[pair.lp_token_id]?.supply || 0, lptokens[pair.lp_token_id]?.decimals || 18, 20)) ?? 0)}
                  />
                ))}
              </Fragment>
            )}

            {/* Add light spots */}
            <LightSpot size={350} x="40%" y="40%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
            {/* <LightSpot size={300} x="10%" y="70%" color="rgba(63, 172, 90, 0.6)" /> */}
            {/* <LightSpot size={250} x="85%" y="30%" color="rgba(63, 172, 90, 0.3)" /> */}
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Pools;