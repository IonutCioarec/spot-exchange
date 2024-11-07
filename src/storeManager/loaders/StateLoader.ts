import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPairs, selectPairsSearchInput, selectPairsLpSearchInput, selectPairsMyDeposits, selectPairsSortBy, selectPairsSortDirection } from 'storeManager/slices/pairsSlice';
import { selectSearchInput, setAllTokens, setPairTokens, setLpTokens } from 'storeManager/slices/tokensSlice';
import { stateLoaderRefreshTime, tokensItemsPerPage, poolsItemsPerPage } from 'config';
import { useGetPendingTransactions } from 'hooks';

export const StateLoader = () => {
  const { getTokens, getPairs } = useBackendAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();
  const tokensSearchInput = useSelector(selectSearchInput);
  const tokensPage = useSelector((state: any) => state.tokens.pairTokens.page);

  const pairsTokenSearch = useSelector(selectPairsSearchInput);
  const pairsLPTokenSearch = useSelector(selectPairsLpSearchInput);
  const pairsPage = useSelector((state: any) => state.pairs.page);
  const pairsMyDeposits = useSelector(selectPairsMyDeposits);
  const pairsSortBy = useSelector(selectPairsSortBy);
  const pairsSortDirection = useSelector(selectPairsSortDirection);

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

  const loadPairs = async (currentPage: number, currentLimit: number, sortBy: 'liquidity' | 'volume24h' | 'fees24h', sortDirection: 'asc' | 'desc', tokenSearch: string, my_deposits: boolean, lp_token_search?: string[]) => {
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
    loadPairTokens(tokensPage, tokensItemsPerPage, tokensSearchInput);
  }, [dispatch, tokensPage, tokensSearchInput]);

  useEffect(() => {
    // loadPairs(pairsPage, poolsItemsPerPage, pairsSortBy, pairsSortDirection, pairsTokenSearch, pairsMyDeposits, pairsLPTokenSearch);
  }, [dispatch, pairsPage, pairsTokenSearch, pairsMyDeposits, pairsLPTokenSearch, pairsSortBy, pairsSortDirection]);

  useEffect(() => {
    loadAllTokens();
    //loadLpTokens();
  }, [dispatch, hasPendingTransactions]);

  // Refresh data at interval
  useEffect(() => {
    const interval = window.setInterval(() => {
      //loadAllTokens();
      //loadLpTokens();
    }, stateLoaderRefreshTime);

    return () => window.clearInterval(interval);
  }, [dispatch, hasPendingTransactions]);

  return null;
};