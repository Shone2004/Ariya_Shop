const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Contact = require("../models/Contact");
const { getTransporter } = require("../services/transporter");
const { escapeHTML } = require('../utils/emailHelpers');

router.post(
  "/",
  [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail().trim(),
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
      const { name, email, phone, subject, message } = req.body;

      // Save to database
      const contactMessage = await Contact.create({
        name,
        email,
        phone,
        subject,
        message,
      });

      // Send email notification if SMTP is configured
      const transporter = getTransporter();
      if (transporter) {
        const safeName = escapeHTML(name);
        const safeEmail = escapeHTML(email);
        const safePhone = escapeHTML(phone || 'N/A');
        const safeSubject = escapeHTML(subject || 'No Subject');
        const safeMessage = escapeHTML(message);

        const mailOptions = {
          from: '"Ariya Shop Contact" <no-reply@ariyashop.in>',
          to: "nandeshwargunjan3@gmail.com",
          subject: `New Contact Form Submission: ${safeSubject}`,
          text: `You have received a new message from the contact form.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nSubject: ${subject || "N/A"}\n\nMessage:\n${message}`,
          html: `<p>You have received a new message from the contact form.</p>
                 <ul>
                   <li><strong>Name:</strong> ${safeName}</li>
                   <li><strong>Email:</strong> ${safeEmail}</li>
                   <li><strong>Phone:</strong> ${safePhone}</li>
                   <li><strong>Subject:</strong> ${safeSubject}</li>
                 </ul>
                 <p><strong>Message:</strong></p>
                 <p>${safeMessage.replace(/\n/g, "<br>")}</p>`,
        };

        try {
          await transporter.sendMail(mailOptions);
        } catch (emailErr) {
          console.error("[Email] ❌ Failed to send contact form notification:", emailErr);
        }
      }

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: contactMessage,
      });
    } catch (err) {
      console.error("Contact Form Error:", err);
      res.status(500).json({
        success: false,
        message: "An error occurred while sending the message",
      });
    }
  }
);

module.exports = router;
