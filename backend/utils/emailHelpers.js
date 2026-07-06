'use strict';

/**
 * emailHelpers.js
 * ---------------
 * Pure utility functions used by email templates.
 * No side-effects, no dependencies on other services.
 */

/**
 * Format a number as Indian Rupee currency.
 * @param {number} amount
 * @returns {string}  e.g. "₹2,499.00"
 */
const formatMoney = (amount) => {
  const n = Number(amount) || 0;
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Format a date value as "3 Jul 2026".
 * @param {string|Date} date
 * @returns {string}
 */
const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Shorten a MongoDB ObjectId to the last 8 characters for display.
 * @param {string|object} id
 * @returns {string}
 */
const shortId = (id) => {
  if (!id) return '000000';
  const str = String(id);
  return str.slice(-8).toUpperCase();
};

/**
 * Resolve a product image URL for use inside emails.
 * Relative URLs (e.g. /diamond_ring.png) are converted to absolute.
 * Falls back to a safe placeholder if the image is missing.
 * @param {string} image
 * @param {string} [baseUrl]  Storefront base URL (defaults to localhost)
 * @returns {string}  Absolute URL safe for email clients
 */
const resolveImage = (image, baseUrl = 'https://ariya-shop.vercel') => {
  if (!image) {
    // Neutral SVG placeholder — works without external requests
    return 'https://placehold.co/72x72/f5f1ec/c9a54b?text=Item';
  }
  if (/^https?:\/\//i.test(image)) {
    return image; // Already absolute
  }
  // Relative path — prefix with storefront URL
  return `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
};

/**
 * Escapes characters that have security significance in HTML text context.
 * @param {string} str
 * @returns {string} Escaped HTML string
 */
const escapeHTML = (str) => {
  if (!str) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

module.exports = { formatMoney, formatDate, shortId, resolveImage, escapeHTML };
