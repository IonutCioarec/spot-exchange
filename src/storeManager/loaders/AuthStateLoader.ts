import { useBackendAPI } from 'hooks/useBackendAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthData } from 'storeManager/slices/authSlice';
import { stateLoaderRefreshTime } from 'config';
import { useGetAccountInfo, useGetLoginInfo, useGetPendingTransactions } from 'hooks';

export const AuthStateLoader = () => {
  const { tokenLogin } = useGetLoginInfo();
  const { address } = useGetAccountInfo();
  const { verifyAuth } = useBackendAPI();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const dispatch = useDispatch();

  const loadAuthData = async () => {
    if (tokenLogin?.nativeAuthToken && address) {
      const newAuthData = await verifyAuth(tokenLogin?.nativeAuthToken || '');
      dispatch(setAuthData(newAuthData));
    }
  }

  // Load state
  useEffect(() => {
    loadAuthData();
  }, [dispatch, address, tokenLogin?.nativeAuthToken, hasPendingTransactions]);

  return null;
};