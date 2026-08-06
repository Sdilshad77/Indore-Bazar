import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";

export const getShops = createAsyncThunk(
  "shops/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/shops");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load shops");
    }
  }
);

export const getShopById = createAsyncThunk(
  "shops/getOne",
  async (sid, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/shops/${sid}`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Shop not found");
    }
  }
);

export const getShopCoupons = createAsyncThunk(
  "shops/getCoupons",
  async (sid, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/coupons/${sid}`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load coupons");
    }
  }
);

export const applyCoupon = createAsyncThunk(
  "shops/applyCoupon",
  async ({ couponCode, shopId }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/coupons/apply", { couponCode, shopId });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Invalid coupon");
    }
  }
);

export const getMyShop = createAsyncThunk(
  "shops/getMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/shop-owner/");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "No shop found");
    }
  }
);

export const createShop = createAsyncThunk(
  "shops/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/shop-owner/create-shop", formData);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create shop");
    }
  }
);

export const updateShop = createAsyncThunk(
  "shops/update",
  async ({ sid, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/api/shop-owner/shop/${sid}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update shop");
    }
  }
);

const shopSlice = createSlice({
  name: "shops",
  initialState: {
    shops: [],
    shop: null,
    myShop: null,
    coupons: [],
    appliedCoupon: null,
    isLoading: false,
    error: null,
    couponError: null,
  },
  reducers: {
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.couponError = null;
    },
    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
      state.couponError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShops.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = action.payload;
      })
      .addCase(getShops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getShopById.fulfilled, (state, action) => {
        state.shop = action.payload;
      })
      .addCase(getShopCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload;
      })
      .addCase(getShopCoupons.rejected, (state, action) => {
        state.coupons = [];
        state.error = action.payload;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload;
        state.couponError = null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.appliedCoupon = null;
        state.couponError = action.payload;
      })
      .addCase(getMyShop.fulfilled, (state, action) => {
        state.myShop = action.payload;
      })
      .addCase(getMyShop.rejected, (state, action) => {
        state.myShop = null;
        state.error = action.payload;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.myShop = action.payload.shop;
        state.error = null;
      })
      .addCase(createShop.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.myShop = action.payload;
      });
  },
});

export const { clearAppliedCoupon, setAppliedCoupon } = shopSlice.actions;
export default shopSlice.reducer;