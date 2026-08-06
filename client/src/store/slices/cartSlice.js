import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";

export const getCart = createAsyncThunk(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/cart");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, qty = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/cart", { productId, qty });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, qty }, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/api/cart/update", { productId, qty });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/api/cart/${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to remove item");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/cart/clear");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    isLoading: false,
    error: null,
    coupon: null,
    discount: 0,
  },
  reducers: {
    applyCouponLocal: (state, action) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    resetCart: () => ({
      cart: null,
      isLoading: false,
      error: null,
      coupon: null,
      discount: 0,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { applyCouponLocal, removeCoupon, setDiscount, resetCart } =
  cartSlice.actions;
export default cartSlice.reducer;