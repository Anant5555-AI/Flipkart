const Product = require('../models/Product');


exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      limit = 100,
      page = 1,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== "All") {
      query.category = { $regex: category, $options: "i" };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    // ⭐ Transform DummyJSON-style DB data → Your frontend format
    const transformedProducts = products.map((p) => {
      return {
        _id: p._id,
        id: p._id, // Add id field for frontend compatibility
        title: p.title,
        description: p.description,
        category: p.category,
        price: p.price,

        // ⭐ discountPercentage → discount
        discount: p.discountPercentage || p.discount || 0,

        // ⭐ originalPrice missing? set equal to price
        originalPrice: p.originalPrice || p.price,

        // ⭐ thumbnail → image
        image:
          p.thumbnail ||
          p.image ||
          (p.images?.length ? p.images[0] : null),

        // full images list
        images: p.images || [],

        brand: p.brand || "Unknown",

        stock: p.stock ?? p.quantity ?? 0,
        inStock: (p.stock || 0) > 0,

        // ⭐ rating: number → { rate, count }
        rating: {
          rate:
            typeof p.rating === "number"
              ? p.rating
              : p.rating?.rate || 0,
          count: p.reviews?.length || p.rating?.count || 100,
        },

        // retain other fields from database
        ...p._doc,
      };
    });

    res.status(200).json({
      success: true,
      count: transformedProducts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
      data: transformedProducts,
    });
  } catch (error) {
    next(error);
  }
};


exports.getProductById = async (req, res, next) => {
  try {
    // Debug: Log the requested ID
    console.log('Looking for product with ID:', req.params.id);

    // Try to find by ObjectId first, if that fails try by numeric id field
    let product;
    
    // Check if the ID looks like a MongoDB ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('ID looks like ObjectId, using findById');
      product = await Product.findById(req.params.id);
    } else {
      console.log('ID looks like numeric, using findOne by id field');
      // Try to find by numeric id (convert to number) or other id field
      const numericId = parseInt(req.params.id);
      product = await Product.findOne({ id: numericId }) || 
                 await Product.findOne({ id: req.params.id }) ||
                 await Product.findOne({ _id: req.params.id });
    }

    if (!product) {
      console.log('Product not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log('Found product:', { _id: product._id, id: product.id, title: product.title });

    // ⭐ Apply the same transformation as getAllProducts
    const transformedProduct = {
      _id: product._id,
      id: product.id, // Add id field for frontend compatibility
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,

      // ⭐ discountPercentage → discount
      discount: product.discountPercentage || product.discount || 0,

      // ⭐ originalPrice missing? set equal to price
      originalPrice: product.originalPrice || product.price,

      // ⭐ thumbnail → image
      image:
        product.thumbnail ||
        product.image ||
        (product.images?.length ? product.images[0] : null),

      // full images list
      images: product.images || [],

      brand: product.brand || "Unknown",

      stock: product.stock ?? product.quantity ?? 0,
      inStock: (product.stock || 0) > 0,

      // ⭐ rating: number → { rate, count }
      rating: {
        rate:
          typeof product.rating === "number"
            ? product.rating
            : product.rating?.rate || 0,
        count: product.reviews?.length || product.rating?.count || 100,
      },

      // retain other fields from database
      ...product._doc,
    };

    res.status(200).json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    next(error);
  }
};


exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");

    const formattedCategories = ["All", ...categories];

    res.status(200).json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    next(error);
  }
};


exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const query = {
      category: { $regex: category, $options: "i" },
    };
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
