import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pair, PoolsState, Token } from 'types/backendTypes';
import { setPool, setStatus, selectStatus } from 'storeManager/slices/poolsSlice';

export const PoolsLoader = () => {
  const { getTokens, getPairs } = useBackendAPI();
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);

  const loadPool = async (): Promise<PoolsState> => {
    const tokens: Token[] = await getTokens();
    const pairs: Pair[] = await getPairs();

    return {
      tokens,
      pairs
    };
  };

  // load pool
  useEffect(() => {
    loadPool()
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
  }, [status, dispatch]);

  return null;
}