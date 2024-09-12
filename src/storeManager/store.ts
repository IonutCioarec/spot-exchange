import { configureStore } from '@reduxjs/toolkit';
import pairsReducer from './slices/pairsSlice';
import tokensReducer from './slices/tokensSlice';

// Create the Redux store
const store = configureStore({
  reducer: {
    pairs: pairsReducer,
    tokens: tokensReducer,
  },
});

// Export the store and AppDispatch for use in components
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export { store };
export default store;