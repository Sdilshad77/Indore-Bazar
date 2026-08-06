import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";

export const adminGetUsers = createAsyncThunk(
  "admin/users",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/admin/users");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load users");
    }
  }
);

export const adminUpdateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ uid, isActive }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/api/admin/users/${uid}`, { isActive });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update user");
    }
  }
);

export const adminGetOrders = createAsyncThunk(
  "admin/orders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/admin/orders");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load orders");
    }
  }
);

export const adminUpdateOrder = createAsyncThunk(
  "admin/updateOrder",
  async ({ oid, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/api/admin/orders/${oid}`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update order");
    }
  }
);

export const adminGetShops = createAsyncThunk(
  "admin/shops",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/admin/shops");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load shops");
    }
  }
);

export const adminUpdateShop = createAsyncThunk(
  "admin/updateShop",
  async ({ sid, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/api/admin/shops/${sid}`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update shop");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    orders: [],
    shops: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminGetUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminGetUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(adminGetUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(adminUpdateUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })
      .addCase(adminGetOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminGetOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(adminGetOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(adminUpdateOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      })
      .addCase(adminGetShops.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminGetShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = action.payload;
      })
      .addCase(adminGetShops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(adminUpdateShop.fulfilled, (state, action) => {
        state.shops = state.shops.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      });
  },
});

export default adminSlice.reducer;