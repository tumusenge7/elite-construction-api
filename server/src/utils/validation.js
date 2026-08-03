const dns = require('dns').promises;

// ─── Common domain typo corrections ───────────────────────────────────────────
const DOMAIN_TYPOS = {
  'gmail.con': 'gmail.com', 'gmail.cpm': 'gmail.com', 'gmail.cm': 'gmail.com',
  'gmail.co': 'gmail.com', 'gmai.com': 'gmail.com', 'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'yahoo.con': 'yahoo.com', 'yahoo.cpm': 'yahoo.com', 'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmail.con': 'hotmail.com', 'hotmail.cpm': 'hotmail.com',
  'outlook.con': 'outlook.com', 'outloook.com': 'outlook.com',
};

// ─── Disposable/throwaway email domains ───────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwam.com',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.net', 'guerrillamail.org', 'spam4.me', 'trashmail.com',
  'trashmail.me', 'trashmail.net', 'dispostable.com', 'maildrop.cc',
  'fakeinbox.com', 'mailnull.com', 'spamgourmet.com', 'mytemp.email',
  'temp-mail.org', 'discard.email', 'spamherelots.com',
]);

// ─── Email syntax validation ───────────────────────────────────────────────────
function validateEmailSyntax(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required.' };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 254) {
    return { valid: false, error: 'Email address is too long.' };
  }

  // RFC 5322 simplified — covers 99.9% of real emails
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format. Please use a valid address like name@domain.com.' };
  }

  const [localPart, domain] = trimmed.split('@');

  if (localPart.length > 64) {
    return { valid: false, error: 'The part before @ is too long.' };
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { valid: false, error: 'Email cannot start or end with a dot before @.' };
  }

  if (localPart.includes('..')) {
    return { valid: false, error: 'Email cannot contain consecutive dots.' };
  }

  // Check for typo suggestion
  const suggestion = DOMAIN_TYPOS[domain];
  if (suggestion) {
    return {
      valid: false,
      error: `Did you mean ${localPart}@${suggestion}?`,
      suggestion: `${localPart}@${suggestion}`,
    };
  }

  // Check disposable
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, error: 'Disposable or temporary email addresses are not allowed.' };
  }

  return { valid: true, email: trimmed };
}

// ─── MX record check ──────────────────────────────────────────────────────────
async function checkEmailDomain(email) {
  const syntaxResult = validateEmailSyntax(email);
  if (!syntaxResult.valid) return syntaxResult;

  const domain = syntaxResult.email.split('@')[1];

  try {
    // Check MX records first
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, error: `The domain "${domain}" is not configured to receive emails.` };
    }
    return { valid: true, email: syntaxResult.email, domain, mxRecords };
  } catch (err) {
    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
      // No MX — try A record fallback (some small domains use A records)
      try {
        await dns.resolve(domain, 'A');
        return { valid: true, email: syntaxResult.email, domain, warning: 'Domain exists but has no dedicated mail server.' };
      } catch {
        return { valid: false, error: `The domain "${domain}" does not exist. Please check your email address.` };
      }
    }
    // DNS timeout or network error — don't block the user
    return { valid: true, email: syntaxResult.email, domain, warning: 'Could not verify domain (DNS timeout). Proceeding anyway.' };
  }
}

// ─── Gmail-specific validation ────────────────────────────────────────────────
function validateGmail(email) {
  const syntaxResult = validateEmailSyntax(email);
  if (!syntaxResult.valid) return syntaxResult;

  const [localPart, domain] = syntaxResult.email.split('@');
  const gmailDomains = ['gmail.com', 'googlemail.com'];

  if (!gmailDomains.includes(domain)) {
    return { valid: true, isGmail: false, email: syntaxResult.email };
  }

  // Gmail ignores dots — normalize
  const normalizedLocal = localPart.replace(/\./g, '').split('+')[0];

  if (normalizedLocal.length < 6) {
    return { valid: false, error: 'Gmail usernames must be at least 6 characters long.' };
  }

  if (normalizedLocal.length > 30) {
    return { valid: false, error: 'Gmail usernames cannot exceed 30 characters.' };
  }

  if (!/^[a-z0-9]/.test(normalizedLocal)) {
    return { valid: false, error: 'Gmail addresses must start with a letter or number.' };
  }

  if (!/^[a-z0-9.]+$/.test(localPart.split('+')[0])) {
    return { valid: false, error: 'Gmail addresses can only contain letters, numbers, and dots.' };
  }

  const canonicalEmail = `${normalizedLocal}@gmail.com`;

  return {
    valid: true,
    isGmail: true,
    email: syntaxResult.email,
    canonicalEmail,
    hasAlias: localPart.includes('+'),
    aliasTag: localPart.includes('+') ? localPart.split('+')[1] : null,
  };
}

// ─── Phone number validation ──────────────────────────────────────────────────
const PHONE_PATTERNS = {
  RW: { pattern: /^\+250[0-9]{9}$/, label: 'Rwanda (+250)', example: '+250 7XX XXX XXX', mobile: /^\+250[7][0-9]{8}$/ },
  US: { pattern: /^\+1[2-9][0-9]{9}$/, label: 'USA/Canada (+1)', example: '+1 XXX XXX XXXX', mobile: /^\+1[2-9][0-9]{9}$/ },
  GB: { pattern: /^\+44[1-9][0-9]{9,10}$/, label: 'UK (+44)', example: '+44 XXXX XXXXXX', mobile: /^\+447[0-9]{9}$/ },
  KE: { pattern: /^\+254[0-9]{9}$/, label: 'Kenya (+254)', example: '+254 7XX XXX XXX', mobile: /^\+2547[0-9]{8}$/ },
  UG: { pattern: /^\+256[0-9]{9}$/, label: 'Uganda (+256)', example: '+256 7XX XXX XXX', mobile: /^\+2567[0-9]{8}$/ },
  TZ: { pattern: /^\+255[0-9]{9}$/, label: 'Tanzania (+255)', example: '+255 7XX XXX XXX', mobile: /^\+2557[0-9]{8}$/ },
  ZA: { pattern: /^\+27[0-9]{9}$/, label: 'South Africa (+27)', example: '+27 XX XXX XXXX', mobile: /^\+276[0-9]{8}$/ },
  NG: { pattern: /^\+234[0-9]{10}$/, label: 'Nigeria (+234)', example: '+234 XXX XXX XXXX', mobile: /^\+2347[0-9]{9}$/ },
  IN: { pattern: /^\+91[6-9][0-9]{9}$/, label: 'India (+91)', example: '+91 XXXXX XXXXX', mobile: /^\+91[6-9][0-9]{9}$/ },
  FR: { pattern: /^\+33[1-9][0-9]{8}$/, label: 'France (+33)', example: '+33 X XX XX XX XX', mobile: /^\+336[0-9]{8}$/ },
  DE: { pattern: /^\+49[1-9][0-9]{9,11}$/, label: 'Germany (+49)', example: '+49 XXX XXXXXXX', mobile: /^\+491[5-7][0-9]{9,10}$/ },
};

// Country code prefix map
const PREFIX_MAP = {
  '+250': 'RW', '+1': 'US', '+44': 'GB', '+254': 'KE',
  '+256': 'UG', '+255': 'TZ', '+27': 'ZA', '+234': 'NG',
  '+91': 'IN', '+33': 'FR', '+49': 'DE',
};

function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required.' };
  }

  // Normalize: remove spaces, dashes, parentheses
  const normalized = phone.trim().replace(/[\s\-().]/g, '');

  if (!normalized.startsWith('+')) {
    return {
      valid: false,
      error: 'Phone number must include a country code (e.g. +250 for Rwanda, +1 for USA).',
    };
  }

  if (!/^\+[0-9]+$/.test(normalized)) {
    return { valid: false, error: 'Phone number can only contain digits and a leading + sign.' };
  }

  if (normalized.length < 8 || normalized.length > 16) {
    return { valid: false, error: 'Phone number length is invalid. Must be 7–15 digits after the country code.' };
  }

  // Detect country
  let detectedCountry = null;
  for (const [prefix, code] of Object.entries(PREFIX_MAP)) {
    if (normalized.startsWith(prefix)) {
      detectedCountry = code;
      break;
    }
  }

  if (detectedCountry && PHONE_PATTERNS[detectedCountry]) {
    const { pattern, label, mobile } = PHONE_PATTERNS[detectedCountry];
    if (!pattern.test(normalized)) {
      return {
        valid: false,
        error: `Invalid ${label} phone number format. Example: ${PHONE_PATTERNS[detectedCountry].example}`,
      };
    }
    return {
      valid: true,
      phone: normalized,
      country: detectedCountry,
      countryLabel: label,
      isMobile: mobile.test(normalized),
      type: mobile.test(normalized) ? 'mobile' : 'landline',
    };
  }

  // Unknown country code — basic length check only
  return {
    valid: true,
    phone: normalized,
    country: 'unknown',
    warning: 'Country code not recognized. Basic format accepted.',
  };
}

// ─── Sanitize input ───────────────────────────────────────────────────────────
function sanitizeInput(value) {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/[<>]/g, '')           // strip HTML tags
    .replace(/javascript:/gi, '')   // strip JS injection
    .replace(/on\w+=/gi, '')        // strip event handlers
    .slice(0, 1000);                // max length guard
}

module.exports = { validateEmailSyntax, checkEmailDomain, validateGmail, validatePhone, sanitizeInput };
