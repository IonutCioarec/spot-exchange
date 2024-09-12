import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pair, PoolsState, Token } from 'types/backendTypes';
import { setPools } from 'storeManager/slices/poolsSlice';
import { stateLoaderRefreshTime } from 'config';
import { useGetPendingTransactions } from 'hooks';

export const StateLoader = () => {
  const { getTokens, getPairs } = useBackendAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();

  const loadState = async (): Promise<PoolsState> => {
    const tokens: Token[] = await getTokens();
    const pairs: Pair[] = await getPairs();

    return {
      tokens,
      pairs
    };
  };

  // load pool
  useEffect(() => {
    loadState()
      .then((state) => {
        dispatch(setPools(state));
      })
      .catch((err) => {
        console.log(
          'Something went wrong when loading pools: ',
          err
        );
      });
  }, [dispatch, hasPendingTransactions]);

  // check for changes every 3 seconds
  useEffect(() => {
    const interval = window.setInterval(() => {
      loadState()
        .then((state) => {
          dispatch(setPools(state));
        })
        .catch((err) => {
          console.log(
            'Something went wrong when loading pools: ',
            err
          );
        });
    }, stateLoaderRefreshTime);
    return () => window.clearInterval(interval);
  }, [dispatch, hasPendingTransactions]);

  return null;
}