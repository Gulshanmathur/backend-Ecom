const express = require('express');
const { createOrder, fetchOrdersByUser, updateOrder, deleteOrder } = require('../controller/Order');
const router = express.Router();

router.post('/',createOrder)
      .get('/',fetchOrdersByUser)
      .delete('/:id',deleteOrder)
      .patch('/:id',updateOrder)

module.exports = router;