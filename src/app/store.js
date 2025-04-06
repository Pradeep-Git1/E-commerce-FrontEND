// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import cartReducer from './features/cart/cartSlice';
import companyReducer from './features/company/companySlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    company: companyReducer,
  },
});
