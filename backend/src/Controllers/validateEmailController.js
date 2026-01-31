import dns from 'dns/promises';

// Common domain typos -> correct domain (for friendly suggestion)
const COMMON_TYPOS = {
  'gmal.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'hotmal.com': 'hotmail.com',
};

function getDomain(email) {
  const trimmed = (email || '').trim().toLowerCase();
  const at = trimmed.lastIndexOf('@');
  if (at === -1) return null;
  return trimmed.slice(at + 1) || null;
}

/**
 * Validate that the email domain has MX records (can receive email).
 * Returns { valid: boolean, suggestion?: string }.
 */
export async function validateEmailDomain(req, res) {
  try {
    const { email } = req.body ?? {};
    const domain = getDomain(email);

    if (!domain) {
      return res.status(400).json({ valid: false, error: 'Invalid email format' });
    }

    // Check common typos first (no DNS needed, instant feedback)
    const suggestion = COMMON_TYPOS[domain];
    if (suggestion) {
      return res.status(200).json({ valid: false, suggestion });
    }

    // Check if domain has MX records
    const mx = await dns.resolveMx(domain).catch(() => []);
    const hasMx = Array.isArray(mx) && mx.length > 0;

    if (!hasMx) {
      return res.status(200).json({ valid: false, error: 'This email domain does not exist or cannot receive email.' });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    // DNS errors (NXDOMAIN, etc.) mean domain is invalid
    const code = error?.code || '';
    if (code === 'ENOTFOUND' || code === 'ENODATA' || code === 'NXDOMAIN') {
      return res.status(200).json({ valid: false, error: 'This email domain does not exist.' });
    }
    console.error('validateEmailDomain error:', error?.message ?? error);
    return res.status(500).json({ valid: false, error: 'Could not validate email. Please try again.' });
  }
}
