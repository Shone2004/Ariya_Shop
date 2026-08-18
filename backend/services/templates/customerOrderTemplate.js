'use strict';

const baseTemplate = require('./baseTemplate');
const { formatMoney, formatDate, shortId, resolveImage, escapeHTML } = require('../../utils/emailHelpers');

/**
 * customerOrderTemplate(order)
 * ----------------------------
 * Generates the premium customer-facing order confirmation email.
 *
 * @param {object} order  Mongoose order document (plain object or Mongoose doc)
 * @returns {string}      Full HTML email string
 */
const customerOrderTemplate = (order) => {
  const rawCustomerName = order.customerSnapshot?.name || order.user?.name || order.customer || 'Valued Customer';
  const customerName = escapeHTML(rawCustomerName);
  const orderId = shortId(order._id);
  const orderDate = formatDate(order.createdAt);
  const paymentMethod = escapeHTML(String(order.paymentMethod || 'Razorpay').toUpperCase());
  const paymentStatus = order.isPaid ? 'Paid' : 'Pending';
  const paymentStatusColor = order.isPaid ? '#2e7d32' : '#c62828';

  const addr = order.shippingAddress || {};
  const shippingLines = [
    escapeHTML(addr.fullName),
    escapeHTML(addr.address),
    [escapeHTML(addr.city), escapeHTML(addr.postalCode)].filter(Boolean).join(' – '),
    escapeHTML(addr.country),
    addr.phone ? `📞 ${escapeHTML(addr.phone)}` : null,
  ].filter(Boolean);

  // Product rows
  const productRows = (order.orderItems || [])
    .map((item) => {
      const imgSrc = resolveImage(item.image);
      const itemTotal = formatMoney((item.price || 0) * (item.quantity || 1));
      return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;vertical-align:middle;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:16px;vertical-align:middle;">
                <img class="product-img" src="${imgSrc}" alt="${escapeHTML(item.name)}" width="72" height="72"
                  style="width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid #e8e1d5;"/>
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0 0 4px;font-family:'Playfair Display',Georgia,serif;font-size:14px;font-weight:600;color:#2e241c;">${escapeHTML(item.name)}</p>
                <p style="margin:0;font-size:12px;color:#8c7a68;">Qty: ${item.quantity} &nbsp;·&nbsp; ${formatMoney(item.price)} each</p>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:12px 20px 12px 0;border-bottom:1px solid #f0ebe3;text-align:right;vertical-align:middle;white-space:nowrap;">
          <span style="font-size:14px;font-weight:600;color:#2e241c;">${itemTotal}</span>
        </td>
      </tr>`;
    })
    .join('');

  const itemsPrice   = formatMoney(order.itemsPrice   || 0);
  const shippingPrice = order.shippingPrice > 0 ? formatMoney(order.shippingPrice) : '₹99';
  const taxPrice     = order.taxPrice > 0 ? formatMoney(order.taxPrice) : '₹0.00';
  const totalPrice   = formatMoney(order.totalPrice   || 0);

  const content = `
  <!-- Hero greeting -->
  <tr>
    <td style="padding:40px 40px 24px;text-align:center;background-color:#faf8f4;">
      <p style="margin:0 0 10px;font-size:28px;">✨</p>
      <h1 style="margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:700;color:#2e241c;">
        Thank You, ${customerName}!
      </h1>
      <p style="margin:0;font-size:14px;color:#6b5c4d;line-height:1.6;">
        Your order has been successfully placed and is being processed.<br/>
        We'll notify you once it ships.
      </p>
    </td>
  </tr>

  <!-- Order meta strip -->
  <tr>
    <td style="padding:0 40px 28px;background-color:#faf8f4;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:#fff;border-radius:8px;border:1px solid #e8e1d5;overflow:hidden;">
        <tr>
          <td style="padding:14px 20px;border-right:1px solid #e8e1d5;text-align:center;width:25%;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:600;">Order ID</p>
            <p style="margin:0;font-size:13px;font-weight:700;color:#2e241c;font-family:'Playfair Display',Georgia,serif;">#${orderId}</p>
          </td>
          <td style="padding:14px 20px;border-right:1px solid #e8e1d5;text-align:center;width:25%;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:600;">Date</p>
            <p style="margin:0;font-size:13px;font-weight:600;color:#2e241c;">${orderDate}</p>
          </td>
          <td style="padding:14px 20px;border-right:1px solid #e8e1d5;text-align:center;width:25%;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:600;">Payment</p>
            <p style="margin:0;font-size:13px;font-weight:600;color:#2e241c;">${paymentMethod}</p>
          </td>
          <td style="padding:14px 20px;text-align:center;width:25%;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:600;">Status</p>
            <p style="margin:0;font-size:13px;font-weight:700;color:${paymentStatusColor};">${paymentStatus}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Products header -->
  <tr>
    <td style="padding:4px 40px 0;">
      <h2 style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:700;color:#b88a44;letter-spacing:1.5px;text-transform:uppercase;">
        Items Ordered
      </h2>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="border:1px solid #e8e1d5;border-radius:8px;overflow:hidden;">
        ${productRows}
      </table>
    </td>
  </tr>

  <!-- Order totals -->
  <tr>
    <td style="padding:20px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:#faf8f4;border-radius:8px;border:1px solid #e8e1d5;overflow:hidden;padding:0;">
        <tr>
          <td style="padding:12px 20px 4px;">
            <table role="presentation" border="0" cellpadding="4" cellspacing="0" width="100%">
              <tr>
                <td style="font-size:13px;color:#6b5c4d;">Items Subtotal</td>
                <td align="right" style="font-size:13px;color:#2e241c;font-weight:500;">${itemsPrice}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#6b5c4d;">Shipping</td>
                <td align="right" style="font-size:13px;color:${order.shippingPrice > 0 ? '#2e241c' : '#2e7d32'};font-weight:500;">${shippingPrice}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#6b5c4d;padding-bottom:12px;">Tax</td>
                <td align="right" style="font-size:13px;color:#2e241c;font-weight:500;padding-bottom:12px;">${taxPrice}</td>
              </tr>
              <tr style="border-top:2px solid #c9a54b;">
                <td style="font-size:16px;font-weight:700;color:#2e241c;font-family:'Playfair Display',Georgia,serif;padding-top:12px;">Grand Total</td>
                <td align="right" style="font-size:16px;font-weight:700;color:#b88a44;font-family:'Playfair Display',Georgia,serif;padding-top:12px;">${totalPrice}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Shipping address -->
  <tr>
    <td style="padding:0 40px 28px;">
      <h2 style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:700;color:#b88a44;letter-spacing:1.5px;text-transform:uppercase;">
        Delivery Address
      </h2>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:#fff;border:1px solid #e8e1d5;border-radius:8px;padding:0;">
        <tr>
          <td style="padding:16px 20px;">
            ${shippingLines.map(l => `<p style="margin:0 0 4px;font-size:13px;color:#2e241c;line-height:1.6;">${l}</p>`).join('')}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Estimated delivery -->
  <tr>
    <td style="padding:0 40px 28px;text-align:center;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:linear-gradient(135deg,#fdf6e3,#fef9ed);border:1px dashed #c9a54b;border-radius:8px;">
        <tr>
          <td style="padding:18px 24px;text-align:center;">
            <p style="margin:0 0 4px;font-size:20px;">🚚</p>
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:600;">Estimated Delivery</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#2e241c;font-family:'Playfair Display',Georgia,serif;">5 – 7 Business Days</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA button -->
  <tr>
    <td style="padding:0 40px 40px;text-align:center;">
      <a href="https://ariya-shop.vercel" target="_blank"
        style="display:inline-block;background:linear-gradient(135deg,#c9a54b,#b88a44);color:#fff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:1px;padding:14px 40px;border-radius:4px;font-family:'Inter',Arial,sans-serif;text-transform:uppercase;">
        Continue Shopping
      </a>
      <p style="margin:16px 0 0;font-size:12px;color:#8c7a68;">
        Questions? <a href="mailto:support@ariyashop.com" style="color:#b88a44;text-decoration:none;">support@ariyashop.com</a>
      </p>
    </td>
  </tr>
  `;

  return baseTemplate(content, {
    preheader: `Your Ariya Shop order #${orderId} has been confirmed. Thank you for shopping with us!`,
  });
};

module.exports = customerOrderTemplate;
