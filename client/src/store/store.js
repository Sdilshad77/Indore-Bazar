import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import productReducer from "./slices/productSlice.js";
import cartReducer from "./slices/cartSlice.js";
import shopReducer from "./slices/shopSlice.js";
import orderReducer from "./slices/orderSlice.js";
import chatReducer from "./slices/chatSlice.js";
import adminReducer from "./slices/adminSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    shops: shopReducer,
    orders: orderReducer,
    chat: chatReducer,
    admin: adminReducer,
  },
});