const { z } = require('zod');
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');
const { success, paginated, error } = require('../utils/response');
const { logAudit } = require('../utils/audit');
const { notifyAdmins } = require('../utils/notifications');
const config = require('../config');

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

async function sendAdminEmail(data) {
  if (!config.smtp.host || !config.smtp.user) return;
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: { user: config.smtp.user, pass: config.smtp.password },
    });
    await transporter.sendMail({
      from: config.smtp.from,
      to: config.smtp.user,
      subject: `New Contact Message: ${data.subject || 'No Subject'} — from ${data.name}`,
      html: `
        <h2>New Contact Message</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${data.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${data.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${data.phone || '-'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${data.subject || '-'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Message</td><td style="padding:8px">${data.message.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="margin-top:16px;color:#666">View all messages in the <a href="${config.clientUrl}/admin">Admin Panel</a></p>
      `,
    });
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }
}

exports.submit = async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);
    const msg = await ContactMessage.create({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });
    sendAdminEmail(data); // fire-and-forget

    notifyAdmins({
      type: 'info',
      title: 'New contact message',
      message: `${data.name} (${data.email}) sent: ${data.subject || 'no subject'}`,
      data: { contact_message_id: msg._id },
    });

    return success(res, null, 'Message received. We will contact you soon.', 201);
  } catch (err) {
    if (err instanceof z.ZodError) return error(res, 'Validation error', 400, err.errors);
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    let { page = 1, limit = 20, is_read } = req.query;
    page = parseInt(page);
    limit = Math.min(parseInt(limit) || 20, 100);
    const skip = (page - 1) * limit;

    const query = {};
    if (is_read !== undefined) query.isRead = is_read === '1' || is_read === 'true';

    const [data, total] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments(query),
    ]);

    return paginated(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true });
    await logAudit(req.user?.id, 'contact_mark_read', 'ContactMessage', req.params.id, 'Contact message marked as read', req);
    return success(res, null, 'Marked as read');
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    return success(res, null, 'Message deleted');
  } catch (err) {
    next(err);
  }
};
