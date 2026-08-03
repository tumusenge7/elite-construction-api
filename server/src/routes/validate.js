const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { checkEmailDomain, validateGmail, validatePhone, sanitizeInput } = require('../utils/validation');
const { success, error } = require('../utils/response');

// Strict rate limit for validation endpoints — prevent enumeration abuse
const validationLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 20,                   // 20 checks per minute per IP
  message: { success: false, message: 'Too many validation requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/validate/email
router.post('/email', validationLimiter, async (req, res, next) => {
  try {
    const email = sanitizeInput(req.body.email || '');

    if (!email) {
      return error(res, 'Email is required.', 400);
    }

    // Run Gmail-specific check first (it includes syntax check)
    const gmailResult = validateGmail(email);

    if (!gmailResult.valid) {
      return res.json({ success: false, valid: false, message: gmailResult.error, suggestion: gmailResult.suggestion || null });
    }

    // Run MX / domain check
    const domainResult = await checkEmailDomain(email);

    if (!domainResult.valid) {
      return res.json({ success: false, valid: false, message: domainResult.error, suggestion: domainResult.suggestion || null });
    }

    return res.json({
      success: true,
      valid: true,
      message: 'Email address looks valid.',
      data: {
        email: domainResult.email,
        isGmail: gmailResult.isGmail || false,
        canonicalEmail: gmailResult.canonicalEmail || null,
        hasAlias: gmailResult.hasAlias || false,
        domain: domainResult.domain,
        warning: domainResult.warning || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/validate/phone
router.post('/phone', validationLimiter, (req, res) => {
  const phone = sanitizeInput(req.body.phone || '');

  if (!phone) {
    return error(res, 'Phone number is required.', 400);
  }

  const result = validatePhone(phone);

  if (!result.valid) {
    return res.json({ success: false, valid: false, message: result.error });
  }

  return res.json({
    success: true,
    valid: true,
    message: 'Phone number is valid.',
    data: {
      phone: result.phone,
      country: result.country,
      countryLabel: result.countryLabel || null,
      type: result.type || 'unknown',
      isMobile: result.isMobile ?? null,
      warning: result.warning || null,
    },
  });
});

module.exports = router;
