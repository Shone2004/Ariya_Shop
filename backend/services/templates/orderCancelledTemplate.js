'use strict';

const baseTemplate = require('./baseTemplate');
const { shortId, escapeHTML } = require('../../utils/emailHelpers');

/**
 * orderCancelledTemplate(order, cancelReason)
 * --------------------------------------------
 * Generates the premium customer-facing order cancellation email.
 *
 * @param {object} order         Mongoose order document (plain object or Mongoose doc)
 * @param {string} cancelReason  Reason for cancellation (optional)
 * @returns {string}             Full HTML email string
 */
const orderCancelledTemplate = (order, cancelReason) => {
  const rawCustomerName = order.customerSnapshot?.name || order.user?.name || order.customer || 'Valued Customer';
  const customerName = escapeHTML(rawCustomerName);
  const orderId = shortId(order._id);
  const rawReasonText = cancelReason && String(cancelReason).trim() ? cancelReason : 'Your order has been cancelled due to operational constraints. We apologize for the inconvenience caused.';
  const reasonText = escapeHTML(rawReasonText);
  
  const content = `
  <!-- Hero greeting -->
  <tr>
    <td style="padding:40px 40px 24px;text-align:center;background-color:#faf8f4;">
      <p style="margin:0 0 10px;font-size:28px;">ℹ️</p>
      <h1 style="margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:700;color:#2e241c;">
        Order Cancelled
      </h1>
      <p style="margin:0;font-size:14px;color:#6b5c4d;line-height:1.6;">
        Order #${orderId}
      </p>
    </td>
  </tr>

  <!-- Message body -->
  <tr>
    <td style="padding:0 40px 28px;background-color:#ffffff;">
      <p style="margin:0 0 16px;font-size:14px;color:#2e241c;line-height:1.6;font-family:'Inter',Arial,sans-serif;">
        Dear ${customerName},
      </p>
      <p style="margin:0 0 20px;font-size:14px;color:#2e241c;line-height:1.6;font-family:'Inter',Arial,sans-serif;">
        We're sorry to inform you that your order (<strong>#${orderId}</strong>) has been cancelled by Ariya Shop.
      </p>
      
      <!-- Reason box -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:#faf8f4;border-radius:8px;border:1px solid #e8e1d5;margin-bottom:24px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:1.5px;color:#b88a44;text-transform:uppercase;font-weight:600;font-family:'Inter',Arial,sans-serif;">Reason for Cancellation</p>
            <p style="margin:0;font-size:14px;color:#2e241c;line-height:1.5;font-style:italic;font-family:'Playfair Display',Georgia,serif;">"${reasonText}"</p>
          </td>
        </tr>
      </table>

      ${order.isPaid ? `
      <p style="margin:0 0 16px;font-size:13px;color:#6b5c4d;line-height:1.6;font-family:'Inter',Arial,sans-serif;">
        💡 <strong>Refund Information:</strong> Since your order was paid online, any applicable refund will be processed according to our refund policy.
      </p>
      ` : ''}

      <p style="margin:0 0 20px;font-size:14px;color:#2e241c;line-height:1.6;font-family:'Inter',Arial,sans-serif;">
        If you have any questions, please contact our support team.
      </p>
      
      <p style="margin:0 0 4px;font-size:14px;color:#2e241c;line-height:1.6;font-family:'Inter',Arial,sans-serif;">
        Thank you for choosing Ariya Shop.
      </p>
      
      <p style="margin:0;font-size:14px;color:#2e241c;line-height:1.6;font-weight:600;font-family:'Playfair Display',Georgia,serif;">
        Regards,<br/>
        Ariya Shop Team
      </p>
    </td>
  </tr>

  <!-- CTA button -->
  <tr>
    <td style="padding:0 40px 40px;text-align:center;">
      <a href="https://ariya-shop.vercel" target="_blank"
        style="display:inline-block;background:linear-gradient(135deg,#c9a54b,#b88a44);color:#fff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:1px;padding:14px 40px;border-radius:4px;font-family:'Inter',Arial,sans-serif;text-transform:uppercase;">
        Back to Shop
      </a>
      <p style="margin:16px 0 0;font-size:12px;color:#8c7a68;font-family:'Inter',Arial,sans-serif;">
        Questions? <a href="mailto:gunjan@ariyashop.in" style="color:#b88a44;text-decoration:none;">gunjan@ariyashop.in</a>
      </p>
    </td>
  </tr>
  `;

  return baseTemplate(content, {
    preheader: `Your Ariya Shop order #${orderId} has been cancelled.`,
  });
};

module.exports = orderCancelledTemplate;
