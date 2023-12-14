import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import NavStateReducer from "../reducers/NavStateReducer"
import OrderReducer from '../reducers/OrderReducer';
import SearchReducer from '../reducers/SearchReducer';



const persistConfig = {
  key: 'root',
  storage,
};

const middleware = getDefaultMiddleware({
  serializableCheck: false
})

const persistedNavStateReducer = persistReducer(persistConfig, NavStateReducer);
const persistedOrderReducer = persistReducer(persistConfig, OrderReducer);
const persistedSearchReducer = persistReducer(persistConfig, SearchReducer);

const store = configureStore({
  reducer: {
    navState: persistedNavStateReducer,
    searchValue: persistedSearchReducer,
    orders: persistedOrderReducer,
  },
  middleware
});

const persistedStore = persistStore(store);

export { store, persistedStore };
