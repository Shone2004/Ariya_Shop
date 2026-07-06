'use strict';

const express = require('express');
const router  = express.Router();
const { getCustomers } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// GET /api/users — all customers with aggregated order stats (Private Admin Only)
router.get('/', protect, admin, getCustomers);

module.exports = router;
