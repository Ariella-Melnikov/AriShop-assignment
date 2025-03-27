import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import cartUiReducer from './slices/cartUiSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        cartUi: cartUiReducer,
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;