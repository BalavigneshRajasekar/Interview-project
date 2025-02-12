const express = require('express');
const { getUsers } = require('../controllers/userControler').default;

const router = express.Router();

// Get all users
router.get('/users',getUsers)




module.exports=router