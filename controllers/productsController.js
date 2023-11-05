const expressAsyncHandler = require("express-async-handler");

// import models
const Product = require("../models/productsModel");

// get all products
const products_get = expressAsyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({
      products,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const product_get = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).send({ product });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
});

const productsCategory_get = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Product.find().distinct("category");
    if (categories) {
      // console.log(categories);
      res.status(200).send(categories);
    }
  } catch (err) {
    res.status(400).send({ message: "server error" });
  }
});

// seed products
const products_post = expressAsyncHandler(async (req, res) => {
  const products = req.body;
  try {
    const newProducts = await Product.insertMany(products);
    res.status(201).send(newProducts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

const PAGE_CONTENT = 4;

const productsSearch_get = expressAsyncHandler(async (req, res) => {
  const { query } = req;
  const pageSize = query.pageSize || PAGE_CONTENT;
  const page = query.page || 1;
  const category = query.category || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const order = query.order || "";
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  const priceFilter =
    price && price !== "all"
      ? {
          // 1-50
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};
  const sortOrder =
    order === "featured"
      ? { featured: -1 }
      : order === "lowest"
      ? { price: 1 }
      : order === "highest"
      ? { price: -1 }
      : order === "toprated"
      ? { rating: -1 }
      : order === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

// export controllers
module.exports = {
  products_get,
  product_get,
  products_post,
  productsCategory_get,
  productsSearch_get,
};
