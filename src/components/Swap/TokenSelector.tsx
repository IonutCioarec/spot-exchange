import { forwardRef, Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, DialogTitle, Divider, IconButton, Button } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { KeyboardArrowDown, Search, ArrowDropDown } from '@mui/icons-material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import SimpleLoader from 'components/SimpleLoader';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage, selectPairTokens, selectPairTokensById, selectSearchInput, selectTotalPages, setPage, setSearchInput, selectPairTokensNumber } from 'storeManager/slices/tokensSlice';
import { Token, ExtraToken } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { debounce } from 'lodash';
import { debounceSearchTime } from 'config';
import ReduceZerosFormat from "components/ReduceZerosFormat";
import { getTokenLogo } from 'utils/formatters';
import defaultLogo from 'assets/img/no_logo.png';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TokenSelectorProps {
  tokenType: 'token1' | 'token2';
  selectedToken: string | '';
  setSelectedToken: (tokenId: string) => void;
  excludedToken: string | null;
  userTokens: Record<string, { balance: string }>;
  allTokens: Record<string, Token>;
  resetAmounts: () => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokenType,
  selectedToken,
  setSelectedToken,
  excludedToken,
  userTokens,
  allTokens,
  resetAmounts
}) => {
  const dispatch = useDispatch();
  const rawPairTokens = useSelector(selectPairTokensById);

  const pairTokens = useMemo(() => {
    const filtered: Record<string, Token> = {};

    for (const [tokenId, tokenData] of Object.entries(rawPairTokens)) {
      if (tokenId !== excludedToken) {
        filtered[tokenId] = tokenData;
      }
    }

    return filtered;
  }, [rawPairTokens, excludedToken]);

  const currentPage = useSelector(selectPage);
  const totalPages = useSelector(selectTotalPages);
  const pairTokensNumber = useSelector(selectPairTokensNumber);

  const [isOpen, setIsOpen] = useState(false);
  const [localSearchInput, setLocalSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  // Convert user tokens object to an array
  const userTokensArray = useMemo(() => {
    return Object.entries(userTokens)
      .filter(([tokenId]) => {
        const token = allTokens[tokenId];
        return token && token.is_lp_token === false;
      })
      .map(([tokenId, tokenData]) => ({
        ...tokenData,
        ...allTokens[tokenId]
      }));
  }, [userTokens, allTokens]);

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
    setSelectedToken(tokenId);
    resetAmounts();
    handleClose();
  };

  const processedUserTokens = useMemo(() => {
    let filtered = userTokensArray.filter(token =>
      (token.token_id.toLowerCase().includes(localSearchInput.toLowerCase()) ||
        token.ticker.toLowerCase().includes(localSearchInput.toLowerCase())) &&
        token.token_id !== excludedToken &&
        parseFloat(token.balance) >= 0.00001
    );

    return filtered.sort((a: ExtraToken, b: ExtraToken) => {
      const priceA = parseFloat(a?.price_usd) || 0;
      const priceB = parseFloat(b?.price_usd) || 0;
      const balanceA = parseFloat(a?.balance) || 0;
      const balanceB = parseFloat(b?.balance) || 0;

      const valueA = priceA * balanceA;
      const valueB = priceB * balanceB;

      return valueB - valueA;
    });
  }, [userTokensArray, localSearchInput, allTokens]);

  // User tokens pagination Logic
  const ITEMS_PER_PAGE = 5;
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const totalUserPages = Math.ceil(processedUserTokens.length / ITEMS_PER_PAGE);
  const paginatedUserTokens = processedUserTokens.slice((currentUserPage - 1) * ITEMS_PER_PAGE, currentUserPage * ITEMS_PER_PAGE);

  // Handle page change
  const handleUserPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalUserPages) {
      setCurrentUserPage(newPage);
    }
  };

  return (
    <>
      <div
        className='input-container2 font-rose b-r-sm d-flex justify-content-around align-items-center swap-token-container'
        style={{
          minWidth: isMobile || isTablet ? '150px' : '200px',
          minHeight: isMobile ? '39.44px' : '56.94px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
        onClick={handleOpen}
      >
        <img
          src={getTokenLogo(tokenType, allTokens, selectedToken)}
          alt={tokenType}
          style={{ height: isMobile ? 25 : 35, flexShrink: 0, position: 'relative' }}
          className='ms-2'
        />
        <div
          className='mx-2'
          style={{
            width: isMobile || isTablet ? '45vw' : 'auto',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}>
          <p className={`m-0 ${isMobile ? 'font-size-sm' : 'h5'}`}>{allTokens[selectedToken]?.ticker || allTokens[tokenType == 'token1' ? defaultSwapToken1 : defaultSwapToken2]?.ticker}</p>
          <p className='m-t-n-xs mb-0 font-size-xxs text-silver'>
            $<ReduceZerosFormat
              numberString={intlNumberFormat(Number(formatSignificantDecimals(Number(allTokens[selectedToken]?.price_usd) ?? 0, 3)), 0, 20) ||
                intlNumberFormat(Number(formatSignificantDecimals(Number(allTokens[tokenType == 'token1' ? defaultSwapToken1 : defaultSwapToken2]?.price_usd) || 0, 3)), 0, 20)
              }
            />
          </p>
        </div>
        <div className={` ${isMobile ? 'm-l-sm' : ''}`}>
          <KeyboardArrowDown sx={{ marginTop: '-2px' }} />
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        style={{ borderRadius: '10px' }}
        TransitionComponent={Transition}
        maxWidth='xs'
        fullWidth
        fullScreen={isMobile ? true : false}
        PaperProps={{
          style: { backgroundColor: 'rgba(20, 20, 20, 0.9)', borderRadius: '10px', minHeight: '100px' },
        }}
      >
        <DialogTitle id="scroll-dialog-title" style={{ borderBottom: '1px solid #303030' }}>
          <div className='d-flex justify-content-between font-rose align-items-center'>
            <p className='mx-auto text-white'>Select a token</p>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              className='text-right mb-3 text-white close-button'
              sx={{ borderRadius: '20px !important' }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <p className='mb-0 text-silver mx-3 font-rose font-size-sm'>Search tokens by name or ticker</p>
          <TextField
            fullWidth
            size='small'
            variant='outlined'
            value={localSearchInput}
            autoComplete="off"
            onChange={handleSearchChange}
            className='token-search-container mb-2'
            InputProps={{
              startAdornment: <Search sx={{ color: 'rgba(63, 172, 90, 0.7)', marginRight: '8px', fontSize: '18px' }} />,
              style: { color: 'silver', fontFamily: 'Red Rose' },
            }}
            InputLabelProps={{
              style: { color: 'silver', fontFamily: 'Red Rose' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(63, 172, 90, 0.4)',
                  borderRadius: '20px',
                  color: 'silver',
                  fontSize: '10px'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(63, 172, 90, 0.6)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'silver',
                },
                fontFamily: 'Red Rose',
                fontSize: '12px'
              },
            }}
          />
        </DialogTitle>
        <DialogContent>
          <p className='small mt-1 ms-2 mb-0 text-white'>Your Tokens ({paginatedUserTokens.length > 0 ? processedUserTokens.length : 0})</p>
          <List>
            {paginatedUserTokens.length > 0 ? (
              paginatedUserTokens.map((token: ExtraToken) => (
                <div key={`list-item-${token.token_id}`} className='py-1 px-2 mb-2 text-white d-flex justify-content-between align-items-center cursor-pointer token-list-item' onClick={() => handleTokenSelect(token.token_id)}>
                  <Avatar src={token.logo_url && token.logo_url !== 'N/A' ? token.logo_url : defaultLogo} sx={{ height: '30px', width: '30px', marginTop: '-2px' }} />
                  <div className='' style={{ width: '30%' }}>
                    <p className='font-size-xxs mb-0 text-silver'>Token</p>
                    <p className='font-size-xs mb-0'>{token.token_id}</p>
                  </div>
                  <div className='text-right' style={{ width: '35%' }}>
                    <p className='font-size-xxs mb-0 text-silver'>Price</p>
                    <p className='font-size-xs mb-0'>
                      $<ReduceZerosFormat
                        numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(token?.price_usd || '0'), 3)), 0, 20)}
                      />
                    </p>
                  </div>
                  <div className='text-right' style={{ width: '20%' }}>
                    <p className='font-size-xxs mb-0 text-silver'>Balance</p>
                    <p className='font-size-xs mb-0'>
                      <ReduceZerosFormat
                        numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(token?.balance || '0'), 3)), 0, 20)}
                      />
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-silver text-center h6'>No token found</p>
            )}
          </List>
          {/* User Tokens Pagination Controls */}
          {paginatedUserTokens.length > 0 && (
            <div className="pagination-controls m-t-n-sm">
              <Button
                onClick={() => handleUserPageChange(1)}
                disabled={currentUserPage === 1}
                className='pagination-button'
              >
                <KeyboardDoubleArrowLeft className={`${currentUserPage === 1 ? 'disabled-arrow' : 'active-arrow'}`} />
              </Button>

              <Button
                onClick={() => handleUserPageChange(currentUserPage - 1)}
                disabled={currentUserPage === 1}
                className='pagination-button'
              >
                <ChevronLeft className={`${currentUserPage === 1 ? 'disabled-arrow' : 'active-arrow'}`} />
              </Button>

              <span>
                Page {currentUserPage} {totalUserPages > 0 ? `of ${totalUserPages}` : 'of 1'}
              </span>

              <Button
                onClick={() => handleUserPageChange(currentUserPage + 1)}
                disabled={currentUserPage === totalUserPages}
                className='pagination-button'
              >
                <ChevronRight className={`${currentUserPage === totalUserPages ? 'disabled-arrow' : 'active-arrow'}`} />
              </Button>

              <Button
                onClick={() => handleUserPageChange(totalUserPages)}
                disabled={currentUserPage === totalUserPages}
                className='pagination-button'
              >
                <KeyboardDoubleArrowRight className={`${currentUserPage === totalUserPages ? 'disabled-arrow' : 'active-arrow'}`} />
              </Button>
            </div>
          )}

          <p className='small mt-1 ms-2 mb-0 text-white'>All Tokens ({Object.values(pairTokens).length > 0 ? pairTokensNumber : 0})</p>
          <List>
            {!loading ? (
              Object.values(pairTokens).length > 0 ? (
                Object.values(pairTokens).map((token: Token) => (
                  <div key={`list-item-${token.token_id}`} className='py-1 px-2 mb-2 text-white d-flex justify-content-between align-items-center cursor-pointer token-list-item' onClick={() => handleTokenSelect(token.token_id)}>
                    <Avatar src={token.logo_url && token.logo_url !== 'N/A' ? token.logo_url : defaultLogo} sx={{ height: '30px', width: '30px', marginTop: '-2px' }} />
                    <div className='' style={{ width: '30%' }}>
                      <p className='font-size-xxs mb-0 text-silver'>Token</p>
                      <p className='font-size-xs mb-0'>{token.token_id}</p>
                    </div>
                    <div className='text-right' style={{ width: '35%' }}>
                      <p className='font-size-xxs mb-0 text-silver'>Price</p>
                      <p className='font-size-xs mb-0'>
                        $<ReduceZerosFormat
                          numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.price_usd || '0'), 3)), 0, 20)}
                        />
                      </p>
                    </div>
                    <div className='text-right' style={{ width: '20%' }}>
                      <p className='font-size-xxs mb-0 text-silver'>Balance</p>
                      <p className='font-size-xs mb-0'>
                        <ReduceZerosFormat
                          numberString={intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(userTokens[token.token_id]?.balance || '0'), 3)), 0, 20)}
                        />
                      </p>
                    </div>

                  </div>
                ))
              ) : (
                <p className='text-silver text-center h6'>No token found</p>
              )
            ) : (
              <SimpleLoader />
            )}
          </List>
          {/* Pagination controls */}
          {Object.values(pairTokens).length > 0 && (
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TokenSelector;