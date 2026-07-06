'use strict';

const { getTransporter } = require('./transporter');
const customerOrderTemplate = require('./templates/customerOrderTemplate');
const adminOrderTemplate    = require('./templates/adminOrderTemplate');
const orderCancelledTemplate = require('./templates/orderCancelledTemplate');
const { shortId }           = require('../utils/emailHelpers');

const SENDER  = process.env.BREVO_SENDER_EMAIL || 'noreply@ariyashop.com';
const ADMIN   = process.env.ADMIN_EMAIL        || process.env.BREVO_SENDER_EMAIL;

/* ─────────────────────────────────────────────────────────────────
 * Internal send helper
 * ───────────────────────────────────────────────────────────────── */
const _send = async ({ to, subject, html, attachments = [] }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(`[Email] ⚠  Transporter not ready — skipping email to ${to}`);
    return { skipped: true };
  }

  const info = await transporter.sendMail({
    from: `"Ariya Shop" <${SENDER}>`,
    to,
    subject,
    html,
    attachments, // Future-ready: invoices / PDFs passed in here
  });

  return info;
};

/* ─────────────────────────────────────────────────────────────────
 * sendOrderConfirmation — customer email
 * ───────────────────────────────────────────────────────────────── */
const sendOrderConfirmation = async (order) => {
  const orderId       = shortId(order._id);
  const customerEmail = order.customerSnapshot?.email || order.user?.email || order.customerEmail;

  if (!customerEmail) {
    console.warn(`[Email] No customer email for order #${orderId} — skipping customer email`);
    return;
  }

  try {
    const html = customerOrderTemplate(order);
    const info = await _send({
      to:      customerEmail,
      subject: ` Your Ariya Shop Order has been Confirmed (#${orderId})`,
      html,
    });
    console.log(`[Email] ✅  Customer Email Sent → ${customerEmail} (order #${orderId})`);
    return info;
  } catch (err) {
    console.error(`[Email] ❌  Customer Email Failed (order #${orderId}):`, err.message);
    // Do NOT rethrow — email failure must never stop checkout
  }
};

/* ─────────────────────────────────────────────────────────────────
 * sendAdminOrderNotification — admin email
 * ───────────────────────────────────────────────────────────────── */
const sendAdminOrderNotification = async (order) => {
  const orderId = shortId(order._id);

  if (!ADMIN) {
    console.warn(`[Email] ADMIN_EMAIL not set — skipping admin notification for order #${orderId}`);
    return;
  }

  try {
    const html = adminOrderTemplate(order);
    const info = await _send({
      to:      ADMIN,
      subject: `🛍 New Order Received (#${orderId})`,
      html,
    });
    console.log(`[Email] ✅  Admin Email Sent → ${ADMIN} (order #${orderId})`);
    return info;
  } catch (err) {
    console.error(`[Email] ❌  Admin Email Failed (order #${orderId}):`, err.message);
    // Do NOT rethrow
  }
};

/* ─────────────────────────────────────────────────────────────────
 * sendOrderEmails — send BOTH emails concurrently
 * Safe to await from controllers — never throws.
 * ───────────────────────────────────────────────────────────────── */
const sendOrderEmails = async (order) => {
  if (!order) return;
  try {
    await Promise.allSettled([
      sendOrderConfirmation(order),
      sendAdminOrderNotification(order),
    ]);
  } catch (err) {
    // allSettled already swallows individual errors; this is a safety net
    console.error('[Email] Unexpected error in sendOrderEmails:', err.message);
  }
};

/* ─────────────────────────────────────────────────────────────────
 * sendOrderCancelledEmail — customer cancellation email
 * ───────────────────────────────────────────────────────────────── */
const sendOrderCancelledEmail = async (order, cancelReason) => {
  const orderId       = shortId(order._id);
  const customerEmail = order.customerSnapshot?.email || order.user?.email || order.customerEmail;

  if (!customerEmail) {
    console.warn(`[Email] No customer email for order #${orderId} — skipping cancellation email`);
    return;
  }

  try {
    const html = orderCancelledTemplate(order, cancelReason);
    const info = await _send({
      to:      customerEmail,
      subject: `Your Ariya Shop Order Has Been Cancelled`,
      html,
    });
    console.log(`[Email] ✅  Customer Cancellation Email Sent → ${customerEmail} (order #${orderId})`);
    return info;
  } catch (err) {
    console.error(`[Email] ❌  Customer Cancellation Email Failed (order #${orderId}):`, err.message);
    // Do NOT rethrow — email failure must never break updates
  }
};

module.exports = {
  sendOrderConfirmation,
  sendAdminOrderNotification,
  sendOrderEmails,
  sendOrderCancelledEmail,
};
