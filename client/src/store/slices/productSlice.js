import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const API_BASE_URL = 'https://dummyjson.com';

// Async thunk to fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ( _ , { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      // Transform the data to match our app's structure
      return data.products.map(product => ({
        id: product.id,
        title: product.title,
        price: Math.round(product.price * 83), 
        // Convert USD to INR (approximate)
        originalPrice: Math.round(product.price * 83 * 1.2),
         // Add original price for discount effect
        image: product.thumbnail,
        images: product.images || [product.thumbnail],
        category: product.category,
        description: product.description,
        rating: {
          rate: product.rating || 4.0,
          count: Math.floor(Math.random() * 500) + 50 
          // Random review count
        },
        discount: product.discountPercentage || 
        Math.floor(Math.random() * 30) + 10,
        brand: product.brand || 'Generic',
        stock: product.stock || Math.floor(Math.random() * 100) + 10,
        inStock: true
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch single product
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const product = await response.json();
      
      // Transform the data to match our app's structure
      return {
        id: product.id,
        title: product.title,
        price: Math.round(product.price * 83), // Convert USD to INR
        originalPrice: Math.round(product.price * 83 * 1.2),
        image: product.thumbnail,
        images: product.images || [product.thumbnail],
        category: product.category,
        description: product.description,
        rating: {
          rate: product.rating || 4.0,
          count: Math.floor(Math.random() * 500) + 50
        },
        discount: product.discountPercentage || Math.floor(Math.random() * 30) + 10,
        brand: product.brand || 'Generic',
        stock: product.stock || Math.floor(Math.random() * 100) + 10,
        inStock: true
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      
      // DummyJSON returns objects with {slug, name, url}
      // Extractg  the names and add 'All' at the beginning
      const categoryNames = data.map(category => category.name);
      return ['All', ...categoryNames];
    } catch (error) {
      return rejectWithValue(error.message);
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

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredProducts = state.products.filter(product => {
        const matchesCategory = action.payload === 'All' || 
          product.category.toLowerCase() === action.payload.toLowerCase();
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