const express = require('express');
const router = express.Router();
const { createProduct, fetchAllProducts, fetchProductById } = require('../controller/Product');

// /products is already added in base path
router.post('/',createProduct)
      .get('/',fetchAllProducts)
      .get('/:id',fetchProductById)

module.exports = router;