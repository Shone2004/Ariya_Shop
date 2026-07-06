'use strict';

const baseTemplate = require('./baseTemplate');
const { formatMoney, formatDate, shortId, resolveImage, escapeHTML } = require('../../utils/emailHelpers');

/**
 * adminOrderTemplate(order)
 * -------------------------
 * Generates the admin new-order notification email.
 *
 * @param {object} order  Mongoose order document (plain object or Mongoose doc)
 * @returns {string}      Full HTML email string
 */
const adminOrderTemplate = (order) => {
  const orderId = shortId(order._id);
  const orderDate = formatDate(order.createdAt);
  const paymentMethod = escapeHTML(String(order.paymentMethod || 'Razorpay').toUpperCase());
  const paymentStatus = order.isPaid ? 'PAID ✅' : 'PENDING ⏳';
  const paymentStatusColor = order.isPaid ? '#2e7d32' : '#c62828';

  const customer = order.customerSnapshot || order.user || {};
  const addr = order.shippingAddress || {};

  const customerRows = [
    ['Name',    escapeHTML(customer.name || '—')],
    ['Email',   escapeHTML(customer.email || '—')],
    ['Phone',   escapeHTML(addr.phone || '—')],
    ['Address', [escapeHTML(addr.address), escapeHTML(addr.city), escapeHTML(addr.postalCode), escapeHTML(addr.country)].filter(Boolean).join(', ')],
  ];

  const productRows = (order.orderItems || [])
    .map((item) => {
      const imgSrc = resolveImage(item.image);
      return `
      <tr style="border-bottom:1px solid #f0ebe3;">
        <td style="padding:10px 16px;vertical-align:middle;">
          <img src="${imgSrc}" alt="${escapeHTML(item.name)}" width="56" height="56"
            style="width:56px;height:56px;object-fit:cover;border-radius:6px;border:1px solid #e8e1d5;display:block;"/>
        </td>
        <td style="padding:10px 16px;vertical-align:middle;">
          <p style="margin:0;font-size:13px;font-weight:600;color:#2e241c;">${escapeHTML(item.name)}</p>
          <p style="margin:4px 0 0;font-size:11px;color:#8c7a68;">Unit: ${formatMoney(item.price)}</p>
        </td>
        <td style="padding:10px 16px;text-align:center;vertical-align:middle;">
          <span style="background:#f0ebe3;border-radius:20px;padding:3px 10px;font-size:12px;font-weight:600;color:#2e241c;">×${item.quantity}</span>
        </td>
        <td style="padding:10px 16px;text-align:right;vertical-align:middle;white-space:nowrap;">
          <span style="font-size:13px;font-weight:700;color:#b88a44;">${formatMoney((item.price || 0) * (item.quantity || 1))}</span>
        </td>
      </tr>`;
    })
    .join('');

  const shippingPrice = order.shippingPrice > 0 ? formatMoney(order.shippingPrice) : 'Free';
  const taxPrice      = order.taxPrice > 0 ? formatMoney(order.taxPrice) : '₹0.00';

  const adminDashUrl = 'http://localhost:5174/orders';
  const orderUrl     = `http://localhost:5174/orders`;

  const content = `
  <!-- Alert banner -->
  <tr>
    <td style="padding:28px 40px 16px;background:#faf8f4;text-align:center;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:linear-gradient(135deg,#2e241c,#4a3728);border-radius:8px;">
        <tr>
          <td style="padding:20px 24px;text-align:center;">
            <p style="margin:0 0 6px;font-size:22px;">🛍</p>
            <h1 style="margin:0 0 4px;font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:700;color:#c9a54b;">
              New Order Received
            </h1>
            <p style="margin:0;font-size:13px;color:#d4b896;">Order <strong style="color:#c9a54b;">#${orderId}</strong> · ${orderDate}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Customer details -->
  <tr>
    <td style="padding:0 40px 20px;background:#faf8f4;">
      <h2 style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:700;">Customer Details</h2>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:#fff;border:1px solid #e8e1d5;border-radius:8px;overflow:hidden;">
        ${customerRows.map(([label, value], i) => `
        <tr style="${i < customerRows.length - 1 ? 'border-bottom:1px solid #f5f1ec;' : ''}">
          <td style="padding:10px 20px;font-size:11px;font-weight:700;color:#b88a44;letter-spacing:1px;text-transform:uppercase;width:100px;white-space:nowrap;">${label}</td>
          <td style="padding:10px 20px;font-size:13px;color:#2e241c;">${value}</td>
        </tr>`).join('')}
      </table>
    </td>
  </tr>

  <!-- Products -->
  <tr>
    <td style="padding:0 40px 20px;background:#faf8f4;">
      <h2 style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:700;">Ordered Items</h2>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:#fff;border:1px solid #e8e1d5;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f5f1ec;">
            <th style="padding:8px 16px;font-size:10px;letter-spacing:1px;color:#8c7a68;text-transform:uppercase;font-weight:600;text-align:left;">Image</th>
            <th style="padding:8px 16px;font-size:10px;letter-spacing:1px;color:#8c7a68;text-transform:uppercase;font-weight:600;text-align:left;">Product</th>
            <th style="padding:8px 16px;font-size:10px;letter-spacing:1px;color:#8c7a68;text-transform:uppercase;font-weight:600;text-align:center;">Qty</th>
            <th style="padding:8px 16px;font-size:10px;letter-spacing:1px;color:#8c7a68;text-transform:uppercase;font-weight:600;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>
    </td>
  </tr>

  <!-- Payment + Order Summary side by side -->
  <tr>
    <td style="padding:0 40px 28px;background:#faf8f4;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="12" width="100%">
        <tr>
          <!-- Payment Info -->
          <td class="stack-column" valign="top" width="50%" style="padding-right:8px;">
            <h2 style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:700;">Payment</h2>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
              style="background:#fff;border:1px solid #e8e1d5;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:14px 16px;">
                  <p style="margin:0 0 8px;font-size:12px;color:#6b5c4d;">Method</p>
                  <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#2e241c;font-family:'Playfair Display',Georgia,serif;">${paymentMethod}</p>
                  <p style="margin:0 0 6px;font-size:12px;color:#6b5c4d;">Status</p>
                  <p style="margin:0;font-size:14px;font-weight:700;color:${paymentStatusColor};">${paymentStatus}</p>
                </td>
              </tr>
            </table>
          </td>
          <!-- Order Summary -->
          <td class="stack-column" valign="top" width="50%" style="padding-left:8px;">
            <h2 style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:700;">Order Summary</h2>
            <table role="presentation" border="0" cellpadding="6" cellspacing="0" width="100%"
              style="background:#fff;border:1px solid #e8e1d5;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="font-size:12px;color:#6b5c4d;padding:12px 16px 4px;">Items</td>
                <td align="right" style="font-size:12px;color:#2e241c;font-weight:500;padding:12px 16px 4px;">${formatMoney(order.itemsPrice || 0)}</td>
              </tr>
              <tr>
                <td style="font-size:12px;color:#6b5c4d;padding:4px 16px;">Shipping</td>
                <td align="right" style="font-size:12px;color:#2e241c;font-weight:500;padding:4px 16px;">${shippingPrice}</td>
              </tr>
              <tr>
                <td style="font-size:12px;color:#6b5c4d;padding:4px 16px 10px;">Tax</td>
                <td align="right" style="font-size:12px;color:#2e241c;font-weight:500;padding:4px 16px 10px;">${taxPrice}</td>
              </tr>
              <tr style="border-top:2px solid #c9a54b;">
                <td style="font-size:14px;font-weight:700;color:#2e241c;padding:10px 16px 12px;font-family:'Playfair Display',Georgia,serif;">Total</td>
                <td align="right" style="font-size:14px;font-weight:700;color:#b88a44;padding:10px 16px 12px;font-family:'Playfair Display',Georgia,serif;">${formatMoney(order.totalPrice || 0)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Action Buttons -->
  <tr>
    <td style="padding:0 40px 40px;background:#faf8f4;text-align:center;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
        <tr>
          <td style="padding-right:12px;">
            <a href="${orderUrl}" target="_blank"
              style="display:inline-block;background:linear-gradient(135deg,#c9a54b,#b88a44);color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1px;padding:12px 28px;border-radius:4px;text-transform:uppercase;">
              View Order
            </a>
          </td>
          <td>
            <a href="${adminDashUrl}" target="_blank"
              style="display:inline-block;background:#2e241c;color:#c9a54b;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1px;padding:12px 28px;border-radius:4px;text-transform:uppercase;border:1px solid #c9a54b;">
              Open Dashboard
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;

  return baseTemplate(content, {
    preheader: `New order #${orderId} received from ${customer.name || 'a customer'} — ${formatMoney(order.totalPrice || 0)}`,
  });
};

module.exports = adminOrderTemplate;
