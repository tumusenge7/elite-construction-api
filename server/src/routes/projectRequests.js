const router = require('express').Router();
const { z } = require('zod');
const { authenticate, authorize } = require('../middleware/auth');
const ProjectRequest = require('../models/ProjectRequest');
const Customer = require('../models/Customer');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const config = require('../config');
const { success, paginated, error } = require('../utils/response');
const { notifyAdmins } = require('../utils/notifications');
const { sanitizeInput } = require('../utils/validation');
const { sendMail } = require('../utils/email');

const requestSchema = z.object({
  title: z.string().min(3, 'Project title is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  projectType: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().min(10, 'Please provide more detail about your project'),
});

function parseBudgetToAmount(budget) {
  if (!budget || budget === 'Not sure') return 0;
  const numbers = (budget.match(/[\d,]+(?:\.\d+)?/g) || [])
    .map((s) => parseFloat(s.replace(/,/g, '')))
    .filter((n) => !isNaN(n));
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Math.round(sum / numbers.length);
}

async function generateInvoice({ user, customer, request, budget }) {
  const amount = parseBudgetToAmount(budget);
  const invoice = await Invoice.create({
    invoiceNumber: `INV-${Date.now()}`,
    clientName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Client',
    projectName: request.title,
    title: `Project Request: ${request.title}`,
    description: request.description,
    totalAmount: amount,
    subtotal: amount,
    total: amount,
    balance: amount,
    customer: customer?._id || null,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'sent',
    currency: budget && budget.includes('$') ? 'USD' : 'RWF',
    createdBy: user?._id,
  });
  return invoice;
}

async function sendInvoiceEmail({ user, invoice, request }) {
  const clientUrl = config.clientUrl;
  const payLink = `${clientUrl}/pay/${invoice.invoiceNumber}`;
  const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A';
  const amount = `${invoice.currency} ${(invoice.totalAmount || 0).toLocaleString()}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:#1a3a5c;color:#fff;padding:24px 28px;">
        <h2 style="margin:0;font-size:20px;">Elite Construction</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:.85;">Invoice ${invoice.invoiceNumber}</p>
      </div>
      <div style="padding:28px;">
        <p>Hi ${user ? user.firstName || 'there' : 'there'},</p>
        <p>Thank you for your project request: <strong>${request.title}</strong>.</p>
        <p>We have generated an invoice for your project. Please review the details below and proceed with payment to get started.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6b7280;">Project</td><td style="padding:8px 0;font-weight:600;">${request.title}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Service Type</td><td style="padding:8px 0;font-weight:600;">${request.serviceType}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Location</td><td style="padding:8px 0;font-weight:600;">${request.location}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Invoice Number</td><td style="padding:8px 0;font-weight:600;">${invoice.invoiceNumber}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Amount Due</td><td style="padding:8px 0;font-weight:700;color:#1a3a5c;">${amount}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Due Date</td><td style="padding:8px 0;font-weight:600;">${dueDate}</td></tr>
        </table>
        <a href="${payLink}" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">Pay Now</a>
        <p style="margin-top:16px;font-size:13px;color:#6b7280;">You can pay using <strong>Visa/Mastercard</strong>, <strong>MTN Mobile Money</strong>, <strong>Airtel Money</strong>, or <strong>Bank Transfer</strong>.</p>
        <p style="font-size:13px;color:#6b7280;">If the button doesn't work, copy this link into your browser:<br/><a href="${payLink}" style="color:#3b82f6;">${payLink}</a></p>
      </div>
    </div>
  `;

  return sendMail({
    to: user?.email,
    subject: `Your Invoice ${invoice.invoiceNumber} - Elite Construction`,
    html,
  });
}

// POST /api/project-requests — authenticated client submits a request
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = requestSchema.parse(req.body);

    // Sanitize free-text fields
    data.title = sanitizeInput(data.title);
    data.description = sanitizeInput(data.description);
    data.location = sanitizeInput(data.location);

    const [user, customerRecord] = await Promise.all([
      User.findById(req.user.id).select('firstName lastName email'),
      Customer.findOne({ user: req.user.id }),
    ]);

    const request = await ProjectRequest.create({
      user: req.user.id,
      customer: customerRecord?._id || null,
      ...data,
    });

    // Auto-generate an invoice and email it to the client with a payment link
    let invoice = null;
    try {
      invoice = await generateInvoice({ user, customer: customerRecord, request, budget: data.budget });
      await ProjectRequest.updateOne({ _id: request._id }, { invoice: invoice._id });
      await sendInvoiceEmail({ user, invoice, request });
    } catch (err) {
      console.error('[project-request] invoice/email generation failed:', err.message);
    }

    notifyAdmins({
      type: 'info',
      title: 'New project request',
      message: `${user?.email || req.user.email} submitted a project request: "${data.title}"`,
      data: { project_request_id: request._id, invoice_id: invoice?._id },
    });

    return success(res, {
      request,
      invoice: invoice ? { id: invoice._id, invoiceNumber: invoice.invoiceNumber, total: invoice.total, status: invoice.status } : null,
    }, 'Project request submitted successfully.', 201);
  } catch (err) {
    if (err instanceof z.ZodError) return error(res, err.errors[0].message, 400);
    next(err);
  }
});

// GET /api/project-requests — client sees only their own; admin sees all
router.get('/', authenticate, async (req, res, next) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = Math.min(parseInt(limit) || 20, 100);
    const skip = (page - 1) * limit;

    const isAdmin = req.user.role === 'Super Admin' || req.user.role === 'Admin' || req.user.role === 'Project Manager';
    const query = isAdmin ? {} : { user: req.user.id };

    const [data, total] = await Promise.all([
      ProjectRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'firstName lastName email'),
      ProjectRequest.countDocuments(query),
    ]);

    return paginated(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
});

// PUT /api/project-requests/:id/status — admin updates status
router.put('/:id/status', authenticate, authorize('Super Admin', 'Admin', 'Project Manager'), async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const doc = await ProjectRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    if (!doc) return error(res, 'Request not found', 404);
    return success(res, doc, 'Status updated');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
