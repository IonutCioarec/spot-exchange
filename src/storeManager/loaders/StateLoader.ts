import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pair, PoolsState, Token } from 'types/backendTypes';
import { setPool, setStatus, selectStatus } from 'storeManager/slices/poolsSlice';
import { stateLoaderRefreshTime } from 'config';
import { useGetPendingTransactions } from 'hooks';

export const StateLoader = () => {
  const { getTokens, getPairs } = useBackendAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);

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
        dispatch(setPool(state));
        dispatch(setStatus('succeeded'));
      })
      .catch((err) => {
        console.log(
          'Something went wrong when loading pool: ',
          err
        );
        dispatch(setStatus('failed'));
      });
  }, [status, dispatch, hasPendingTransactions]);

  // check for changes every 3 seconds
  useEffect(() => {
    const interval = window.setInterval(() => {
      loadState()
        .then((state) => {
          dispatch(setPool(state));
          dispatch(setStatus('succeeded'));
        })
        .catch((err) => {
          console.log(
            'Something went wrong when loading pool: ',
            err
          );
          dispatch(setStatus('failed'));
        });
    }, stateLoaderRefreshTime);
    return () => window.clearInterval(interval);
  }, [status, dispatch, hasPendingTransactions]);

  return null;
}