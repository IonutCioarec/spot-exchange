import { forwardRef, Fragment, useEffect, useState } from 'react';
import { Dialog, DialogContent, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, DialogTitle, Divider, IconButton } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { KeyboardArrowDown, Search } from '@mui/icons-material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import SimpleLoader from 'components/SimpleLoader';
import { defaultSwapToken1, defaultSwapToken2 } from 'config';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import CloseIcon from '@mui/icons-material/Close';

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
  pairTokens: { [key: string]: any };
  userTokens: Record<string, { balance: string }>;
  resetAmounts: () => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokenType,
  selectedToken,
  setSelectedToken,
  excludedToken,
  pairTokens,
  userTokens,
  resetAmounts
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile();
  const isTablet = useTablet();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setSearchInput('');
  };

  const filteredTokens = Object.values(pairTokens).filter((token) => {
    const matchesSearch =
      token.token_id.toLowerCase().includes(searchInput.toLowerCase()) ||
      token.ticker.toLowerCase().includes(searchInput.toLowerCase());
    const isNotExcluded = token.token_id !== excludedToken;
    return matchesSearch && isNotExcluded;
  });

  const handleTokenSelect = (tokenId: string) => {
    setSelectedToken(tokenId);
    resetAmounts();
    setSearchInput('');
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
  }, [searchInput])

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
            ${intlNumberFormat(Number(formatSignificantDecimals(pairTokens[selectedToken]?.price ?? 0, 3)), 0, 20) ||
              intlNumberFormat(Number(formatSignificantDecimals((pairTokens[tokenType == 'token1' ? defaultSwapToken1 : defaultSwapToken2]?.price || 0, 3))), 0, 20)
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
            sx={{borderRadius: '20px !important'}}
          >
            <CloseIcon />
          </IconButton>
          <TextField
            fullWidth
            label='Search tokens by name or ticker'
            variant='outlined'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <Fragment key={`list-item-${token.token_id}`}>
                    <ListItem button onClick={() => handleTokenSelect(token.token_id)} className='token-list-item'>
                      <ListItemAvatar>
                        <Avatar src={token.logo_url} sx={{ border: '1px solid #303030' }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={token.token_id}
                        secondary={`$${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(pairTokens[token.token_id]?.price || '0'), 3)), 0, 20)}`}
                        primaryTypographyProps={{ style: { color: 'white' } }}
                        secondaryTypographyProps={{ style: { color: 'silver' } }}
                      />
                      <ListItemText
                        primary={`${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(userTokens[token.token_id]?.balance || '0'), 3)), 0, 20)}`}
                        secondary={`$${intlNumberFormat(parseFloat(formatSignificantDecimals(parseFloat(userTokens[token.token_id]?.balance || '0') * parseFloat(pairTokens[token.token_id]?.price || '0'), 3)), 0, 20)}`}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TokenSelector;