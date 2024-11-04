import { forwardRef, Fragment, useEffect, useState } from 'react';
import { Dialog, DialogContent, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, DialogTitle, Divider, IconButton, Button } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { KeyboardArrowDown, Search } from '@mui/icons-material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import SimpleLoader from 'components/SimpleLoader';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage, selectPairTokens, selectPairTokensById, selectSearchInput, selectTotalPages, setPage, setSearchInput } from 'storeManager/slices/tokensSlice';
import { Token } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';

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
  resetAmounts: () => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokenType,
  selectedToken,
  setSelectedToken,
  excludedToken,
  userTokens,
  resetAmounts
}) => {
  const dispatch = useDispatch();
  const pairTokens = useSelector(selectPairTokensById);
  const currentPage = useSelector(selectPage);
  const totalPages = useSelector(selectTotalPages);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchInput(value);
    dispatch(setSearchInput(value));
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleTokenSelect = (tokenId: string) => {
    setSelectedToken(tokenId);
    resetAmounts();
    handleClose();
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => {
      setLoading(true);
      clearTimeout(delayDebounceFn);
    };
  }, [localSearchInput])

  return (
    <>
      <div
        className='input-container p-1 b-r-sm d-flex justify-content-between align-items-center'
        style={{ minWidth: (isMobile || isTablet) ? '120px' : '150px' }}
        onClick={handleOpen}
      >
        <img
          src={pairTokens[selectedToken]?.logo_url || pairTokens[tokenType == 'token1' ? defaultSwapToken1 : defaultSwapToken2]?.logo_url}
          alt={tokenType}
          style={{ width: 35, height: 35 }}
        />
        <div className='mx-2'>
          <p className='m-0 font-bold'>{pairTokens[selectedToken]?.ticker || pairTokens[tokenType == 'token1' ? defaultSwapToken1 : defaultSwapToken2]?.ticker}</p>
          <p className='mt-0 mb-0 font-size-xxs text-silver'>
            ${intlNumberFormat(Number(formatSignificantDecimals(Number(pairTokens[selectedToken]?.price_usd) ?? 0, 3)), 0, 20) ||
              intlNumberFormat(Number(formatSignificantDecimals(Number(pairTokens[tokenType == 'token1' ? defaultSwapToken1 : defaultSwapToken2]?.price_usd) || 0, 3)), 0, 20)
            }
          </p>
        </div>
        <div className={`me-5 ${isMobile ? 'm-l-n-sm' : ''}`}>
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
          style: { backgroundColor: '#062418', borderRadius: '10px', minHeight: '100px' },
        }}
      >
        <DialogTitle id="scroll-dialog-title">
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            className='float-right mb-3 text-white close-button'
            sx={{ borderRadius: '20px !important' }}
          >
            <CloseIcon />
          </IconButton>
          <TextField
            fullWidth
            label='Search tokens by name or ticker'
            variant='outlined'
            value={apiSearchInput}
            onChange={handleSearchChange}
            className='input-container'
            autoFocus
            InputProps={{
              startAdornment: <Search sx={{ color: 'silver', marginRight: '8px' }} />,
              style: { color: 'silver' },
            }}
            InputLabelProps={{
              style: { color: 'silver' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'silver',
                },
                '&:hover fieldset': {
                  borderColor: 'silver',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'silver',
                },
              },
            }}
          />
        </DialogTitle>
        <DialogContent>
          <List>
            {!loading ? (
              Object.values(pairTokens).length > 0 ? (
                Object.values(pairTokens).map((token: any) => (
                  <Fragment key={`list-item-${token.token_id}`}>
                    <ListItem button onClick={() => handleTokenSelect(token.token_id)} className='token-list-item'>
                      <ListItemAvatar>
                        <Avatar src={token.logo_url} sx={{ border: '1px solid #303030' }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={token.token_id}
                        secondary={`$${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.price_usd || '0'), 3)), 0, 20)}`}
                        primaryTypographyProps={{ style: { color: 'white' } }}
                        secondaryTypographyProps={{ style: { color: 'silver' } }}
                      />
                      <ListItemText
                        primary={`${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(userTokens[token.token_id]?.balance || '0'), 3)), 0, 20)}`}
                        secondary={`$${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(userTokens[token.token_id]?.balance || '0') * parseFloat(pairTokens[token.token_id]?.price_usd || '0'), 3)), 0, 20)}`}
                        className="text-right"
                        primaryTypographyProps={{ style: { color: 'white' } }}
                        secondaryTypographyProps={{ style: { color: 'silver' } }}
                      />
                    </ListItem>
                    <Divider variant="middle" sx={{ backgroundColor: 'silver' }} />
                  </Fragment>
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
            <div className="pagination-controls">
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