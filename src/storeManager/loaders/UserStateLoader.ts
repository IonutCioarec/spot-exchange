import { useMvxAPI } from 'hooks/useMvxAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserTokens } from 'storeManager/slices/userTokensSlice';
import { userStateLoaderRefreshTime } from 'config';
import { useGetPendingTransactions } from 'hooks';
import { selectTokenIds } from 'storeManager/slices/tokensSlice';
import { useGetAccountInfo } from 'hooks';

export const UserStateLoader = () => {
  const { getUserTokensBalance } = useMvxAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();
  const tokenIds = useSelector(selectTokenIds);
  const { address } = useGetAccountInfo();

  const loadState = async () => {
    if (tokenIds.length && address) {
      const userTokens = await getUserTokensBalance(address, tokenIds);
      dispatch(setUserTokens(userTokens));
    }
  };

  // Load initial state
  useEffect(() => {
    loadState().catch((err) => {
      console.error('Error loading user state:', err);
    });
  }, [dispatch, tokenIds, hasPendingTransactions]);

  // Refresh data at interval
  useEffect(() => {
    const interval = window.setInterval(() => {
      loadState().catch((err) => {
        console.error('Error refreshing user state:', err);
      });
    }, userStateLoaderRefreshTime);

    return () => window.clearInterval(interval);
  }, [dispatch, tokenIds, hasPendingTransactions]);

  return null;
};