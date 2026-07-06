'use strict';

/**
 * baseTemplate(content, options)
 * ---------------------
 * Wraps any inner HTML block in the full Ariya Shop branded email shell.
 *
 * @param {string} content       Inner HTML body content
 * @param {object} [options]     Optional overrides
 * @param {string} [options.preheader]  Short preview text shown in email clients
 * @returns {string} Complete HTML email string
 */
const baseTemplate = (content, options = {}) => {
  const preheader = options.preheader || 'Ariya Shop – Luxury Jewellery';
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Ariya Shop</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; display: block; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; background-color: #f5f1ec; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; margin: auto !important; }
      .stack-column, .stack-column-center { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
      .product-img { width: 60px !important; height: 60px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f5f1ec;font-family:'Inter',Arial,sans-serif;">

  <!-- Preheader text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${preheader}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f1ec;">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <!-- Email Container -->
        <table class="email-container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#2e241c 0%,#4a3728 100%);padding:36px 40px 28px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Logo wordmark -->
                    <div style="display:inline-block;border:1.5px solid #c9a54b;border-radius:4px;padding:6px 22px;">
                      <span style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:700;color:#c9a54b;letter-spacing:3px;text-transform:uppercase;">ARIYA</span>
                      <span style="font-family:'Playfair Display',Georgia,serif;font-size:10px;font-weight:400;color:#c9a54b;letter-spacing:5px;text-transform:uppercase;display:block;margin-top:-4px;">SHOP</span>
                    </div>
                    <p style="margin:10px 0 0;color:#c9a54b;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:300;">Luxury Jewellery</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr><td style="background:#c9a54b;height:3px;line-height:3px;font-size:3px;">&nbsp;</td></tr>

          <!-- Main content injected here -->
          ${content}

          <!-- Footer -->
          <tr>
            <td style="background-color:#2e241c;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 12px;font-size:11px;color:#c9a54b;letter-spacing:2px;text-transform:uppercase;font-weight:500;">Follow Us</p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="https://instagram.com/ariyashop" target="_blank" style="color:#c9a54b;text-decoration:none;font-size:12px;font-weight:500;">Instagram</a>
                  </td>
                  <td style="color:#c9a54b;font-size:12px;">·</td>
                  <td style="padding:0 8px;">
                    <a href="https://facebook.com/ariyashop" target="_blank" style="color:#c9a54b;text-decoration:none;font-size:12px;font-weight:500;">Facebook</a>
                  </td>
                  <td style="color:#c9a54b;font-size:12px;">·</td>
                  <td style="padding:0 8px;">
                    <a href="https://twitter.com/ariyashop" target="_blank" style="color:#c9a54b;text-decoration:none;font-size:12px;font-weight:500;">Twitter</a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 4px;font-size:11px;color:#8a7560;">Questions? <a href="mailto:support@ariyashop.com" style="color:#c9a54b;text-decoration:none;">support@ariyashop.com</a></p>
              <p style="margin:0;font-size:10px;color:#5c4d3c;letter-spacing:0.5px;">© ${year} Ariya Shop. All rights reserved.</p>
            </td>
          </tr>

        </table><!-- /email-container -->

      </td>
    </tr>
  </table><!-- /outer wrapper -->

</body>
</html>`;
};

module.exports = baseTemplate;
