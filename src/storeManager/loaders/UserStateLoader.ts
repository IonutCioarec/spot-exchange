import { useMvxAPI } from 'hooks/useMvxAPI';
import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserTokens, setUserLpTokens } from 'storeManager/slices/userTokensSlice';
import { setPendingPairs } from 'storeManager/slices/userPendingPairsSlice';
import { userStateLoaderRefreshTime } from 'config';
import { useGetPendingTransactions } from 'hooks';
import { selectTokenIds } from 'storeManager/slices/tokensSlice';
import { useGetAccountInfo } from 'hooks';

export const UserStateLoader = () => {
  const { getUserTokensBalance } = useMvxAPI();
  const { getUserPendingPairs } = useBackendAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();
  const tokenIds = useSelector(selectTokenIds);
  const { address } = useGetAccountInfo();

  const loadState = async () => {
    if (tokenIds.length && address) {
      const userTokens = await getUserTokensBalance(address, tokenIds);
      dispatch(setUserTokens(userTokens.pairTokens));
      dispatch(setUserLpTokens(userTokens.lpTokens));
    }
  };

  const loadUserPendingPairs = async () => {
    if (address) {
      const pendingPairs = await getUserPendingPairs(address);
      dispatch(setPendingPairs(pendingPairs));
    }
  }

  // Load initial state
  useEffect(() => {
    loadState().catch((err) => {
      console.error('Error loading user state:', err);
    });    
  }, [dispatch, tokenIds, hasPendingTransactions, address]);

  useEffect(() => {
    loadUserPendingPairs().catch((err) => {
      console.error('Error loading user pending pairs:', err);
    });    
  }, [dispatch, hasPendingTransactions, address]);

  // Refresh data at interval
  useEffect(() => {
    const interval = window.setInterval(() => {
      loadState().catch((err) => {
        console.error('Error refreshing user state:', err);
      });
    }, userStateLoaderRefreshTime);

    return () => window.clearInterval(interval);
  }, [dispatch, tokenIds, hasPendingTransactions]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadUserPendingPairs().catch((err) => {
        console.error('Error refreshing user pending pairs:', err);
      });
    }, userStateLoaderRefreshTime);

    return () => window.clearInterval(interval);
  }, [dispatch, hasPendingTransactions]);

  return null;
};