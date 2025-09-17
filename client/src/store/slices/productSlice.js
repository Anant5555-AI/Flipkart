import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  categories: [],
  selectedCategory: 'All',
  searchTerm: '',
  loading: false,
  error: null,
  productsLoading: false,
  categoriesLoading: false,
  productLoading: false,
};

// Async thunk to fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products');
      
      // Transform the data to match our app's structure
      return response.data.data.map(product => ({
        id: product._id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || product.images[0],
        images: product.images || [product.image],
        category: product.category,
        description: product.description,
        rating: {
          rate: product.rating.rate || 4.0,
          count: product.rating.count || Math.floor(Math.random() * 500) + 50
        },
        discount: product.discount || Math.floor(Math.random() * 30) + 10,
        brand: product.brand,
        stock: product.stock || Math.floor(Math.random() * 100) + 10,
        inStock: product.inStock !== false
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch single product
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${productId}`);
      const product = response.data.data;
      
      // Transform the data to match our app's structure
      return {
        id: product._id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || `https://picsum.photos/seed/${product._id}/300/300.jpg`,
        images: product.images || [product.image || `https://picsum.photos/seed/${product._id}/300/300.jpg`],
        category: product.category,
        description: product.description,
        rating: {
          rate: product.rating.rate || 4.0,
          count: product.rating.count || Math.floor(Math.random() * 500) + 50
        },
        discount: product.discount || Math.floor(Math.random() * 30) + 10,
        brand: product.brand,
        stock: product.stock || Math.floor(Math.random() * 100) + 10,
        inStock: product.inStock !== false
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch categories
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

// Helper functions
//mapping the brand
const getBrandFromCategory = (category) => {
  const brandMap = {
    'electronics': 'TechBrand',
    'jewelery': 'Jewelry Co',
    "men's clothing": 'Fashion Hub',
    "women's clothing": 'Style Co'
  };
  return brandMap[category] || 'Brand';
};
//backend category transformned to user readable
const formatCategoryName = (category) => {
  const categoryMap = {
    'electronics': 'Electronics',
    'jewelery': 'Jewelry',
    "men's clothing": "Men's Fashion",
    "women's clothing": "Women's Fashion"
  };
  return categoryMap[category] || category;
};
//giving icon for filters and all
const getCategoryIcon = (category) => {
  const iconMap = {
    'electronics': '📱',
    'jewelery': '💎',
    "men's clothing": '👔',
    "women's clothing": '👗'
  };
  return iconMap[category] || '🛍️';
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredProducts = state.products.filter(product => {
        const matchesCategory = action.payload === 'All' || 
          product.category.toLowerCase() === action.payload.toLowerCase() ||
          formatCategoryName(product.category).toLowerCase() === action.payload.toLowerCase();
        const matchesSearch = product.title.toLowerCase()
        .includes(state.searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredProducts = state.products.filter(product => {
        const matchesSearch = product.title.toLowerCase()
        .includes(action.payload.toLowerCase());
        const matchesCategory = state.selectedCategory === 'All' || 
          product.category.toLowerCase().includes(state.selectedCategory.toLowerCase()) ||
          formatCategoryName(product.category) === state.selectedCategory;
        return matchesSearch && matchesCategory;
      });
    },
    filterProducts: (state) => {
      state.filteredProducts = state.products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesCategory = state.selectedCategory === 'All' || 
          product.category.toLowerCase() === state.selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
      });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchProducts or handelling async logic
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.error = action.payload;
      })
      // Handle fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload;
      })
      // Handle fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCategory,
  setSearchTerm,
  filterProducts,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;