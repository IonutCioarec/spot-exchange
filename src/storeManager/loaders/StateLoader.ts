import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPairs } from 'storeManager/slices/pairsSlice';
import { selectSearchInput, setAllTokens, setPairTokens, setLpTokens } from 'storeManager/slices/tokensSlice';
import { stateLoaderRefreshTime } from 'config';
import { useGetPendingTransactions } from 'hooks';

export const StateLoader = () => {
  const { getTokens, getPairs } = useBackendAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();
  const searchInput = useSelector(selectSearchInput);
  const page = useSelector((state: any) => state.tokens.pairTokens.page);

  const loadAllTokens = async () => {
    const { allTokens } = await getTokens(1, 500);
    dispatch(setAllTokens(allTokens));
  };

  const loadPairTokens = async (currentPage: number, currentLimit: number, searchByName: string) => {
    const { pairTokens } = await getTokens(
      currentPage,
      currentLimit,
      searchByName,
      false
    );
    dispatch(setPairTokens(pairTokens));
  };

  const loadLpTokens = async () => {
    const { lpTokens } = await getTokens(1, 500, '', true);
    dispatch(setLpTokens(lpTokens));
  };

  useEffect(() => {
    loadPairTokens(page, 10, searchInput);
  }, [dispatch, page, searchInput]);

  const loadPairs = async () => {
    const pairs = await getPairs();
    dispatch(setPairs(pairs));
  };

  // Load initial state
  useEffect(() => {
    loadAllTokens();
    loadLpTokens();
    loadPairs();
  }, [dispatch, hasPendingTransactions]);

  // Refresh data at interval
  useEffect(() => {
    const interval = window.setInterval(() => {
      loadAllTokens();
      loadLpTokens();
    }, stateLoaderRefreshTime);

    return () => window.clearInterval(interval);
  }, [dispatch, hasPendingTransactions]);

  return null;
};