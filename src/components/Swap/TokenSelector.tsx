import { useState } from 'react';
import { Dialog, DialogContent, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { KeyboardArrowDown, Search } from '@mui/icons-material';
import { Token, TokenValue } from 'types/backendTypes';

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

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

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

  return (
    <>
      <div
        className='input-container p-1 b-r-sm d-flex justify-content-between align-items-center'
        style={{ minWidth: '150px' }}
        onClick={handleOpen}
      >
        <img
          src={pairTokens[selectedToken]?.logo_url || pairTokens[tokenType == 'token1' ? 'WEGLD-a28c59' : 'MEX-a659d0']?.logo_url}
          alt={tokenType}
          style={{ width: 35, height: 35 }}
        />
        <div className='mx-2'>
          <p className='m-0 font-bold'>{pairTokens[selectedToken]?.ticker || pairTokens[tokenType == 'token1' ? 'WEGLD-a28c59' : 'MEX-a659d0']?.ticker}</p>
          <p className='mt-0 mb-0 font-size-xxs text-silver'>
            ${intlNumberFormat(Number(formatSignificantDecimals(pairTokens[selectedToken]?.price ?? 0, 3)), 0, 20) ||
              intlNumberFormat(Number(formatSignificantDecimals((pairTokens[tokenType == 'token1' ? 'WEGLD-a28c59' : 'MEX-a659d0']?.price || 0, 3))), 0, 20)
            }
          </p>
        </div>
        <div className='me-5'>
          <KeyboardArrowDown sx={{ marginTop: '-2px' }} />
        </div>
      </div>

      <Dialog open={isOpen} onClose={handleClose} style={{ borderRadius: '20px' }}>
        <DialogContent>
          <TextField
            fullWidth
            label='Search tokens by name or ticker'
            variant='outlined'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ marginRight: '8px' }} />,
            }}
          />
          <List>
            {filteredTokens.map((token) => (
              <ListItem
                key={token.token_id}
                button
                onClick={() => handleTokenSelect(token.token_id)}
              >
                <ListItemAvatar>
                  <Avatar src={token.logo_url} />
                </ListItemAvatar>
                <ListItemText
                  primary={token.ticker}
                  secondary={`${pairTokens[token.token_id]?.price || 0}`}
                />
                <ListItemText
                  primary={`${userTokens[token.token_id]?.balance || 0}`}
                  secondary={`${parseFloat(userTokens[token.token_id]?.balance || '0') * parseFloat(pairTokens[token.token_id]?.price) || '0'}`}
                  className='text-right'
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TokenSelector;