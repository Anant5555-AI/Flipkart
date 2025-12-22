import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  products: [],
  selectedProduct: null,
  categories: [],
  selectedCategory: 'All',
  searchTerm: '',

  // Pagination State
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  limit: 10,
  loading: false,
  productLoading: false,
  categoriesLoading: false,
  error: null,
};

// Fetch ALL products once (Frontend handles pagination)
// Fetch products with Server-Side Pagination & Filtering
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState().products;

      // Use passed params or fallback to current state
      const page = params.page || state.currentPage || 1;
      const limit = params.limit || state.limit || 10;
      const category = params.category !== undefined ? params.category : state.selectedCategory;
      const search = params.search !== undefined ? params.search : state.searchTerm;

      let queryString = `?page=${page}&limit=${limit}`;

      if (category && category !== 'All') {
        queryString += `&category=${encodeURIComponent(category)}`;
      }

      if (search) {
        queryString += `&search=${encodeURIComponent(search)}`;
      }

      const response = await API.get(`/products${queryString}`);
      return response.data; // Return full response { data, total, pagination }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch single product details
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${productId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch distinct categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products/categories');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset to page 1
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to page 1
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.currentPage = 1;
    },
    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns: { success, count, total, pagination: { page, limit, totalPages }, data: [...] }
        state.products = action.payload.data;
        state.totalProducts = action.payload.total;
        state.totalPages = action.payload.pagination.totalPages;
        state.currentPage = action.payload.pagination.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch one product
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload;
      })

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSelectedCategory,
  setSearchTerm,
  setPage,
  setLimit,
  clearError
} = productSlice.actions;

export default productSlice.reducer;
