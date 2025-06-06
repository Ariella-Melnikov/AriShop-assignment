import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import cartUiReducer from './slices/cartUiSlice';
import userReducer from './slices/userSlice'
import anonymousUserReducer from './slices/anonymousUserSlice'

const rootReducer = combineReducers({
    cart: cartReducer,
    anonymousUser: anonymousUserReducer,
    user: userReducer,
    products: productReducer,
    cartUi: cartUiReducer,
  })
  
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'anonymousUser'], 
  }
  
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      })
  })
  
  export const persistor = persistStore(store)
  
  export type RootState = ReturnType<typeof store.getState>
  export type AppDispatch = typeof store.dispatch