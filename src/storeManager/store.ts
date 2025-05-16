import { configureStore } from '@reduxjs/toolkit';
import pairsReducer from './slices/pairsSlice';
import tokensReducer from './slices/tokensSlice';
import userTokensReducer from './slices/userTokensSlice';
import authReducer from './slices/authSlice';

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    pairs: pairsReducer,
    tokens: tokensReducer,
    userTokens: userTokensReducer
  },
});

// Export the store and AppDispatch for use in components
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export { store };
export default store;