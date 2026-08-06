import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";

export const getProducts = createAsyncThunk(
  "products/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/products");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load products");
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getOne",
  async (pid, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/products/${pid}`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Product not found");
    }
  }
);

export const getReviews = createAsyncThunk(
  "products/getReviews",
  async (pid, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/products/${pid}/review`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load reviews");
    }
  }
);

export const getFeaturedReviews = createAsyncThunk(
  "products/getFeaturedReviews",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/reviews/featured");
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load reviews");
    }
  }
);

export const addReview = createAsyncThunk(
  "products/addReview",
  async ({ pid, rating, text }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/api/products/${pid}/review`, { rating, text });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to add review");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    reviews: [],
    featuredReviews: [],
    isLoading: false,
    isProductLoading: false,
    error: null,
  },
  reducers: {
    clearProduct: (state) => {
      state.product = null;
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.isProductLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isProductLoading = false;
        state.error = action.payload;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(getFeaturedReviews.fulfilled, (state, action) => {
        state.featuredReviews = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;