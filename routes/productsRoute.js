const express = require("express");
const { Router } = express;

// import controllers
const {
  products_get,
  products_post,
} = require("../controllers/productsController");

const productsRouter = Router();

// endpoints
// all products
productsRouter.get("/products", products_get);

// seed Products
productsRouter.post("/products/seed", products_post);

module.exports = { productsRouter };
