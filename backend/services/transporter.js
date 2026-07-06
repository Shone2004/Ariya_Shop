'use strict';

const nodemailer = require('nodemailer');

let transporter = null;

/**
 * Build and verify the shared Brevo SMTP transporter.
 * Called once at server startup. Does NOT throw — a failed
 * SMTP connection will be logged but will not crash the server.
 */
const initTransporter = async () => {
  const { BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, BREVO_SMTP_PASS } = process.env;

  if (!BREVO_SMTP_HOST || !BREVO_SMTP_USER || !BREVO_SMTP_PASS) {
    console.warn('[Email] ⚠  SMTP credentials missing — email notifications disabled.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: Number(BREVO_SMTP_PORT) || 587,
    secure: false,           // STARTTLS on port 587
    auth: {
      user: BREVO_SMTP_USER,
      pass: BREVO_SMTP_PASS,
    },
    tls: { rejectUnauthorized: process.env.NODE_ENV !== 'production' },
  });

  try {
    await transporter.verify();
    console.log('[Email] ✅  SMTP Connected — Brevo ready');
  } catch (err) {
    console.error('[Email] ❌  SMTP Connection Failed:', err.message);
    transporter = null; // disable gracefully
  }

  return transporter;
};

/**
 * Returns the shared transporter (may be null if SMTP is unavailable).
 */
const getTransporter = () => transporter;

module.exports = { initTransporter, getTransporter };
