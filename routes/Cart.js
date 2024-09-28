const express = require('express');
const router = express.Router();
const { addToCart, fetchCartByUser, deleteFromCart, updateCart } = require('../controller/Cart');

router.post('/',addToCart)
      .get('/:id',fetchCartByUser)
      .delete('/:id',deleteFromCart)
      .patch('/:id',updateCart) 

module.exports = router;