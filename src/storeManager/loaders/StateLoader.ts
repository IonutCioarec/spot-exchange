import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPairs } from 'storeManager/slices/pairsSlice';
import { setTokens } from 'storeManager/slices/tokensSlice';
import { stateLoaderRefreshTime } from 'config';
import { useGetPendingTransactions } from 'hooks';

export const StateLoader = () => {
  const { getTokens, getPairs } = useBackendAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();

  const loadState = async () => {
    const tokens = await getTokens();
    const pairs = await getPairs();

    dispatch(setTokens(tokens));
    dispatch(setPairs(pairs));
  };

  // Load initial state
  useEffect(() => {
    loadState().catch((err) => {
      console.error('Error loading state:', err);
    });
  }, [dispatch, hasPendingTransactions]);

  // Refresh data at interval
  useEffect(() => {
    const interval = window.setInterval(() => {
      loadState().catch((err) => {
        console.error('Error refreshing state:', err);
      });
    }, stateLoaderRefreshTime);

    return () => window.clearInterval(interval);
  }, [dispatch, hasPendingTransactions]);

  return null;
};