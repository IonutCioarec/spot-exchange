import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from 'types/backendTypes';

const initialState: AuthState = {
  isAuthenticated: false,
  address: '',
  origin: '',
  issued: 0,
  expires: 0,
  signature: '',
  blockHash: '',
  ttl: 0,
  status: 'loading'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<AuthState>) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.address = action.payload.address;
      state.origin = action.payload.origin;
      state.issued = action.payload.issued;
      state.expires = action.payload.expires;
      state.signature = action.payload.signature;
      state.blockHash = action.payload.blockHash;
      state.ttl = action.payload.ttl;
      state.status = action.payload.status;
    },
    setAuthStatus: (state, action: PayloadAction<'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setAuthData, setAuthStatus } = authSlice.actions;

// Selectors
export const selectAuthData = (state: any) => state.auth;
export const selectAuthStatus = (state: any) => state.auth.status;

export default authSlice.reducer;