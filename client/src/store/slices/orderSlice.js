import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";

export const getMyOrders = createAsyncThunk(
  "orders/getMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/orders");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load orders");
    }
  }
);

export const getOrderById = createAsyncThunk(
  "orders/getOne",
  async (oid, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/orders/${oid}`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Order not found");
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/create",
  async ({ couponCode = "", paymentMethod = "cod" } = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/orders", {
        couponCode: couponCode || undefined,
        paymentMethod,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to place order");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (oid, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/api/orders/${oid}`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to cancel order");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    order: null,
    lastOrder: null,
    isLoading: false,
    isCreating: false,
    error: null,
  },
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.order = null;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.order = null;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.lastOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
        if (state.order?._id === action.payload._id) {
          state.order = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;