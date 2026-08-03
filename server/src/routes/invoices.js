const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const { success, error, paginated } = require('../utils/response');

const PAYMENT_METHODS = [
  { id: 'card', name: 'Visa / Mastercard', description: 'Pay securely with your credit or debit card' },
  { id: 'mtn_momo', name: 'MTN Mobile Money', description: 'Pay instantly using MTN MoMo' },
  { id: 'airtel_money', name: 'Airtel Money', description: 'Pay instantly using Airtel Money' },
  { id: 'bank_transfer', name: 'Bank Transfer', description: 'Transfer directly to our bank account' },
  { id: 'cash', name: 'Cash at Office', description: 'Pay in person at our office' },
];

const PAYMENT_METHOD_ENUM = {
  card: 'card',
  mtn_momo: 'mobile_money',
  airtel_money: 'mobile_money',
  bank_transfer: 'bank_transfer',
  cash: 'cash',
};

const controller = new BaseController(Invoice, {
  searchFields: ["invoiceNumber"],
  allowedFields: ['*'],
  auditAction: 'invoice',
  populate: ['customer', 'project'],
});

// Public — resolve an invoice by its number for the payment page
router.get('/pay/:invoiceNumber', async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber }).populate('customer');
    if (!invoice) return error(res, 'Invoice not found', 404);
    return success(res, {
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      projectName: invoice.projectName || invoice.title,
      description: invoice.description,
      total: invoice.totalAmount || invoice.total,
      balance: invoice.balance,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      status: invoice.status,
      paymentMethods: PAYMENT_METHODS,
    });
  } catch (err) { next(err); }
});

// Public — record a payment attempt against an invoice (link from emailed invoice)
router.post('/pay/:invoiceNumber', async (req, res, next) => {
  try {
    const { method, transactionId, phone } = req.body;
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) return error(res, 'Invoice not found', 404);

    const methodInfo = PAYMENT_METHODS.find((m) => m.id === method);
    if (!methodInfo) return error(res, 'Invalid payment method', 400);

    const amount = Number(req.body.amount) || invoice.totalAmount || invoice.total;
    if (amount <= 0) return error(res, 'Invalid amount', 400);

    const payment = await Payment.create({
      paymentNumber: `PAY-${Date.now()}`,
      invoice: invoice._id,
      customer: invoice.customer || null,
      amount,
      paymentMethod: PAYMENT_METHOD_ENUM[method] || 'other',
      transactionId: sanitizeRef(transactionId),
      paymentDate: new Date(),
      notes: `${methodInfo.name}${phone ? ` (phone: ${sanitizeRef(phone)})` : ''}`,
      status: 'pending',
    });

    return success(res, {
      id: payment._id,
      paymentNumber: payment.paymentNumber,
      amount: payment.amount,
      method: methodInfo.name,
      status: payment.status,
      message: 'Payment recorded. Our team will verify it and confirm your invoice shortly.',
    }, 'Payment submitted', 201);
  } catch (err) { next(err); }
});

function sanitizeRef(value) {
  if (!value) return undefined;
  return String(value).replace(/[<>&"'`]/g, '').slice(0, 200);
}

router.get('/', authenticate, async (req, res, next) => {
  try {
    if (req.user.role === 'Customer' || !req.user.role) {
      const customerRecord = await Customer.findOne({ user: req.user.id });
      if (!customerRecord) return paginated(res, [], 0, 1, 20, 'No invoices found');
      req.query.customer = customerRecord._id.toString();
    }
    return controller.list(req, res, next);
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
