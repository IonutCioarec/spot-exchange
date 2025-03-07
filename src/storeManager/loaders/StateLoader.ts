import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPairs, selectPairsSearchInput, selectPairsLpSearchInput, selectPairsMyDeposits, selectPairsSortBy, selectPairsSortDirection, selectPairsLimit } from 'storeManager/slices/pairsSlice';
import { selectSearchInput, setAllTokens, setPairTokens, setLpTokens, selectTokensSortBy, selectTokensSortDirection } from 'storeManager/slices/tokensSlice';
import { stateLoaderRefreshTime, tokensItemsPerPage, poolsItemsPerPage } from 'config';
import { useGetPendingTransactions } from 'hooks';

export const StateLoader = () => {
  const { getTokens, getPairs } = useBackendAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();
  const tokensSearchInput = useSelector(selectSearchInput);
  const tokensPage = useSelector((state: any) => state.tokens.pairTokens.page);
  const tokensSortBy = useSelector(selectTokensSortBy);
  const tokensSortDirection = useSelector(selectTokensSortDirection);

  const pairsTokenSearch = useSelector(selectPairsSearchInput);
  const pairsLPTokenSearch = useSelector(selectPairsLpSearchInput);
  const pairsPage = useSelector((state: any) => state.pairs.page);
  const pairsMyDeposits = useSelector(selectPairsMyDeposits);
  const pairsSortBy = useSelector(selectPairsSortBy);
  const pairsSortDirection = useSelector(selectPairsSortDirection);
  const pairsItemsPerPage = useSelector(selectPairsLimit);

  const loadAllTokens = async () => {
    const { allTokens } = await getTokens(1, 1500);
    dispatch(setAllTokens(allTokens));
  };

  const loadPairTokens = async (currentPage: number, currentLimit: number, searchByName: string, only_lp_tokens = false, sortBy: 'volume24h' | 'volume7d' | 'volume30d' | 'price_usd' | 'price_change24h', sortDirection: 'asc' | 'desc') => {
    const { pairTokens } = await getTokens(
      currentPage,
      currentLimit,
      searchByName,
      only_lp_tokens,
      sortBy,
      sortDirection
    );
    dispatch(setPairTokens(pairTokens));
  };

  const loadLpTokens = async () => {
    const { lpTokens } = await getTokens(1, 500, '', true);
    dispatch(setLpTokens(lpTokens));
  };

  const loadPairs = async (currentPage: number, currentLimit: number = poolsItemsPerPage, sortBy: 'liquidity' | 'volume24h' | 'fees24h', sortDirection: 'asc' | 'desc', tokenSearch: string, my_deposits: boolean, lp_token_search?: string[]) => {
    const pairs = await getPairs(
      currentPage,
      currentLimit,
      sortBy,
      sortDirection,
      tokenSearch,
      my_deposits,
      lp_token_search
    );
    dispatch(setPairs(pairs));
  };

  // Load initial state
  useEffect(() => {
    loadPairTokens(tokensPage, tokensItemsPerPage, tokensSearchInput, false, tokensSortBy, tokensSortDirection);
  }, [dispatch, tokensPage, tokensSearchInput, tokensSortBy, tokensSortDirection]);

  useEffect(() => {
    loadPairs(pairsPage, pairsItemsPerPage, pairsSortBy, pairsSortDirection, pairsTokenSearch, pairsMyDeposits, pairsLPTokenSearch);
  }, [dispatch, pairsPage, pairsItemsPerPage, pairsTokenSearch, pairsMyDeposits, pairsLPTokenSearch, pairsSortBy, pairsSortDirection]);

  useEffect(() => {
    loadAllTokens();
    loadLpTokens();
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