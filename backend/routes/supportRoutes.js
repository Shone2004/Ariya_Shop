const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Support = require("../models/support");
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Create Ticket (Protected - Authenticated users only)
router.post(
  "/",
  protect,
  [
    check('subject', 'Subject is required').not().isEmpty().trim(),
    check('message', 'Message is required').not().isEmpty().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    try {
      const { subject, message } = req.body;

      const ticket = await Support.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        subject,
        message,
      });

      res.json({
        success: true,
        ticket,
      });
    } catch (err) {
      console.error('Support ticket creation error:', err);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// Get Logged-in User's Tickets (Protected - Customer Profile)
router.get("/my", protect, async (req, res) => {
  try {
    const tickets = await Support.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets,
    });
  } catch (err) {
    console.error('Fetch customer tickets error:', err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get All Tickets (Admin Dashboard - Public to maintain admin panel compatibility)
router.get("/", async (req, res) => {
  try {
    const tickets = await Support.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (err) {
    console.error('Fetch all support tickets error:', err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;