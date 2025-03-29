import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import cartUiReducer from './slices/cartUiSlice';
import userReducer from './slices/userSlice'
import anonymousUserReducer from './slices/anonymousUserSlice'

export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        cartUi: cartUiReducer,
        user: userReducer,
        anonymousUser: anonymousUserReducer,
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;