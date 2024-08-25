const express = require('express');
const router = express.Router();
const { fetchUserById, updateUser } = require('../controller/User');
 
// /products is already added in base path
router.get('/:id',fetchUserById)
      .patch('/:id',updateUser)

module.exports = router; 