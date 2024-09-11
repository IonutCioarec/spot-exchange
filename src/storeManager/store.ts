import { configureStore } from '@reduxjs/toolkit';
import poolsReducer from './slices/poolsSlice';

// Create the Redux store
const store = configureStore({
  reducer: {
    pools: poolsReducer,
  },
});

// Export the store and AppDispatch for use in components
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export { store };
export default store;