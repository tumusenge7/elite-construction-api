const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { smtp } = config;
  if (!smtp.host || !smtp.user || !smtp.password || smtp.user === 'your-email@gmail.com') {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.password },
  });
  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const transport = getTransporter();
  if (!transport) {
    console.warn(`[email] SMTP not configured - skipping email to ${to} (subject: "${subject}")`);
    return { skipped: true };
  }
  try {
    const info = await transport.sendMail({
      from: `"Elite Construction" <${config.smtp.from || 'noreply@eliteconstruction.com'}>`,
      to,
      subject,
      html,
      text: text || 'Please view this email in an HTML-capable client.',
    });
    console.log(`[email] sent to ${to}: ${info.messageId}`);
    return { skipped: false, messageId: info.messageId };
  } catch (err) {
    console.error('[email] failed to send:', err.message);
    return { skipped: false, error: err.message };
  }
}

module.exports = { sendMail };
