const express = require('express');
const router = express.Router();
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');

// /products is already added in base path
router.post('/',createProduct)
      .get('/',fetchAllProducts)
      .get('/:id',fetchProductById)
      .patch('/:id',updateProduct)

module.exports = router;