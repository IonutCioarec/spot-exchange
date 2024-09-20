import { Fragment, useState } from 'react';
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

const Pools = () => {
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();
  const pairs = useSelector((state) => selectFilteredPairs(state, address));
  const pairtokens = useSelector(selectPairTokensById);
  const lptokens = useSelector(selectLpTokensById);
  const pairsStatus = useSelector(selectPairsStatus);
  const userTokens = useSelector(selectUserTokens);

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewModeState] = useState('all');
  console.log(JSON.stringify(pairs, null, 2));

  const handleAssetsPairsToggle = async () => {
    setLoading(true);
    const newViewMode = viewMode === 'assets' ? 'all' : 'assets';
    setViewModeState(newViewMode);
    dispatch(setViewMode(newViewMode));

    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  };

  const handleCreatedPairsToggle = async () => {+
    setLoading(true);
    const newViewMode = viewMode === 'created' ? 'all' : 'created';
    setViewModeState(newViewMode);
    dispatch(setViewMode(newViewMode));

    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  };


  return (
    <Container>
      <Row className='mb-5'>
        <Col xs={12} lg={12}>
          <div className='mt-5 mb-5'>
            <div className='mb-3 mt-2 d-flex justify-content-end' style={{ borderBottom: '3px solid #01b574' }}>
              <Button
                className="custom-effect btn-dark2 text-uppercase font-bold mb-2 text-capitalize"
                variant="outlined"
                size="small"
                sx={{ minWidth: '120px' }}
                onClick={handleCreatedPairsToggle}
              >
                {viewMode === 'created' ? 'All Pools' : 'Your Pools'}
              </Button>
              <Button
                className="custom-effect btn-dark2 text-uppercase text-capitalize mb-2 ms-2"
                variant="outlined"
                size="small"
                sx={{ minWidth: '120px' }}
                onClick={handleAssetsPairsToggle}
              >
                {viewMode === 'assets' ? 'All Assets' : 'Your Assets'}
              </Button>
              <TextField
                id="outlined-search"
                label="Quick Search"
                type="search"
                size="small"
                variant="outlined"
                className="ms-2 mb-2"
                InputProps={{
                  style: {
                    backgroundColor: '#17181d',
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
            {pairsStatus === 'loading' && <FilterLoader />}
            {(isEmpty(pairs) && pairsStatus !== 'loading' && !loading) && (
              <div style={{ minHeight: '30vh' }}>
                <div className='flex flex-col p-6 items-center justify-center gap-2 rounded-xl bg-[#17181d] w-full'>
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
                    lpTokenSupply={(Number(denominatedAmountToAmount(lptokens[pair.lp_token_id].supply, lptokens[pair.lp_token_id].decimals, 20)) ?? 0)}
                  />
                ))}
              </Fragment>
            )}

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Pools;