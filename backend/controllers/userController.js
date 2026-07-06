'use strict';

const User  = require('../models/User');
const Order = require('../models/Order');

/**
 * @route   GET /api/users
 * @desc    Get all customers with aggregated order statistics
 * @access  Private (Admin)
 */
const getCustomers = async (req, res) => {
  try {
    // 1. Fetch all non-admin users (safe fields only — no passwords)
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('_id name email role createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    if (!users.length) {
      return res.json([]);
    }

    // 2. Aggregate orders grouped by user email (single query — no N+1)
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: { $ifNull: ['$customerSnapshot.email', '$user.email'] } },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          lastOrderDate: { $max: '$createdAt' },
          // Capture latest shipping address
          lastShippingAddress: { $last: '$shippingAddress' },
          // Capture payment method preference (most recent)
          lastPaymentMethod: { $last: '$paymentMethod' },
          // Collect recent orders for drawer (last 5)
          recentOrders: {
            $push: {
              _id: '$_id',
              status: '$status',
              totalPrice: '$totalPrice',
              paymentMethod: '$paymentMethod',
              isPaid: '$isPaid',
              createdAt: '$createdAt',
              orderItems: '$orderItems',
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          orderCount: 1,
          totalSpent: 1,
          lastOrderDate: 1,
          lastShippingAddress: 1,
          lastPaymentMethod: 1,
          // Slice to last 5 orders
          recentOrders: { $slice: ['$recentOrders', -5] },
        },
      },
    ]);

    // 3. Build a lookup map: email → stats
    const statsMap = {};
    orderStats.forEach(stat => {
      statsMap[stat._id] = stat;
    });

    // 4. Merge users with their stats
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const customers = users.map(user => {
      const email = (user.email || '').toLowerCase();
      const stats = statsMap[email] || {};

      const orderCount = stats.orderCount || 0;
      const totalSpent = stats.totalSpent || 0;
      const avgOrder   = orderCount > 0 ? totalSpent / orderCount : 0;
      const lastOrderDate = stats.lastOrderDate || null;

      // Status: Active if ≥1 order, else Registered
      const status = orderCount > 0 ? 'Active' : 'Registered';

      // Sort recent orders newest first
      const recentOrders = (stats.recentOrders || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(o => ({
          _id: o._id,
          status: o.status,
          totalPrice: o.totalPrice,
          paymentMethod: o.paymentMethod,
          isPaid: o.isPaid,
          createdAt: o.createdAt,
          orderItems: (o.orderItems || []).map(item => ({
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          })),
        }));

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Aggregated order data
        orders: orderCount,
        spent: totalSpent,
        avgOrder: Math.round(avgOrder),
        lastOrder: lastOrderDate,
        lastShippingAddress: stats.lastShippingAddress || null,
        lastPaymentMethod: stats.lastPaymentMethod || null,
        recentOrders,
        status,
      };
    });

    // 5. Summary stats for the dashboard header cards
    const totalCustomers  = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    const newThisMonth    = customers.filter(c => new Date(c.createdAt) >= thisMonthStart).length;
    const totalRevenue    = customers.reduce((sum, c) => sum + c.spent, 0);

    res.json({
      customers,
      summary: { totalCustomers, activeCustomers, newThisMonth, totalRevenue },
    });
  } catch (error) {
    console.error('[Users] Error fetching customers:', error);
    res.status(500).json({ message: 'Server error while fetching customers' });
  }
};

module.exports = { getCustomers };
