const express = require('express');
const router = express.Router();
const { fetchCategories, createCategory } = require('../controller/Category');

// /products is already added in base path
router.get('/',fetchCategories).post('/',createCategory)

module.exports = router;