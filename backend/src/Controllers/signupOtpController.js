import { validateEmailDomain } from './validateEmailController.js';
import { sendEmail } from '../config/mailer.js';
import admin from '../config/firebaseAdmin.js';

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const OTP_LENGTH = 6;

/** In-memory store: email -> { otp, expiresAt }. Use Redis in production for multi-instance. */
const otpStore = new Map();

function generateOtp() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

function getDomain(email) {
  const trimmed = (email || '').trim().toLowerCase();
  const at = trimmed.lastIndexOf('@');
  return at === -1 ? null : trimmed.slice(at + 1) || null;
}

const COMMON_TYPOS = {
  'gmal.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'hotmal.com': 'hotmail.com',
};

async function isEmailDomainValid(email) {
  const domain = getDomain(email);
  if (!domain) return { valid: false };
  if (COMMON_TYPOS[domain]) return { valid: false, suggestion: COMMON_TYPOS[domain] };
  try {
    const dns = await import('dns/promises');
    const mx = await dns.resolveMx(domain).catch(() => []);
    return { valid: Array.isArray(mx) && mx.length > 0 };
  } catch {
    return { valid: false };
  }
}

/**
 * POST /api/auth/send-signup-otp
 * Body: { email }
 * Validates email, generates 6-digit OTP, stores it, sends email.
 */
export async function sendSignupOtp(req, res) {
  try {
    const { email } = req.body ?? {};
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const domainCheck = await isEmailDomainValid(trimmed);
    if (!domainCheck.valid) {
      if (domainCheck.suggestion) {
        return res.status(400).json({ message: `This domain doesn't exist. Did you mean ${domainCheck.suggestion}?` });
      }
      return res.status(400).json({ message: 'This email domain does not exist or cannot receive email.' });
    }

    // Check if user already exists in Firebase
    try {
      const existing = await admin.auth().getUserByEmail(trimmed);
      if (existing) {
        return res.status(400).json({ message: 'This email is already registered. Please sign in instead.' });
      }
    } catch (e) {
      if (e?.code !== 'auth/user-not-found') {
        console.error('Firebase getUserByEmail:', e?.message);
        return res.status(500).json({ message: 'Could not check existing account.' });
      }
    }

    const otp = generateOtp();
    otpStore.set(trimmed, { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });

    await sendEmail({
      to: trimmed,
      subject: 'Your sign-up verification code – The Notes',
      text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes. If you didn't request this, you can ignore this email.\n\n— The Notes`,
      html: `
        <p>Your verification code is: <strong style="font-size:1.2em;letter-spacing:2px">${otp}</strong></p>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
        <p>— The Notes</p>
      `,
    });

    return res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('sendSignupOtp error:', error?.message ?? error);
    return res.status(500).json({ message: 'Failed to send verification code. Please try again.' });
  }
}

/**
 * POST /api/auth/verify-signup-otp
 * Body: { email, otp, password }
 * Verifies OTP, creates Firebase user with email/password, returns success.
 */
export async function verifySignupOtp(req, res) {
  try {
    const { email, otp, password } = req.body ?? {};
    const trimmed = (email || '').trim().toLowerCase();
    const code = (otp || '').trim().replace(/\s/g, '');
    if (!trimmed || !code || !password) {
      return res.status(400).json({ message: 'Email, verification code, and password are required' });
    }
    if (code.length !== OTP_LENGTH || !/^\d+$/.test(code)) {
      return res.status(400).json({ message: 'Please enter a valid 6-digit code' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const stored = otpStore.get(trimmed);
    if (!stored) {
      return res.status(400).json({ message: 'No verification code found for this email. Please request a new code.' });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(trimmed);
      return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
    }
    if (stored.otp !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    otpStore.delete(trimmed);

    await admin.auth().createUser({
      email: trimmed,
      password,
      emailVerified: true,
    });

    return res.status(201).json({ message: 'Account created successfully. You can now sign in.' });
  } catch (error) {
    if (error?.code === 'auth/email-already-exists') {
      return res.status(400).json({ message: 'This email is already registered. Please sign in instead.' });
    }
    console.error('verifySignupOtp error:', error?.message ?? error);
    return res.status(500).json({ message: 'Could not create account. Please try again.' });
  }
}
