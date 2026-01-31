import nodemailer from 'nodemailer';

const service = process.env.MAILER_SERVICE; // e.g. 'gmail'
const host = process.env.MAILER_HOST;
const port = process.env.MAILER_PORT ? Number(process.env.MAILER_PORT) : 587;
const user = process.env.MAILER_USER;
const pass = process.env.MAILER_PASS;
const from = process.env.MAILER_FROM || user || 'noreply@the-notes.app';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!user || !pass) {
    console.warn('Mailer: MAILER_USER/MAILER_PASS not set. OTP emails will not be sent.');
    return null;
  }
  transporter = nodemailer.createTransport(
    service
      ? { service, auth: { user, pass } }
      : { host: host || 'localhost', port, secure: port === 465, auth: { user, pass } }
  );
  return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
  const transport = getTransporter();
  if (!transport) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Mailer] Would send:', { to, subject, text: text?.slice(0, 50) });
      return { accepted: [to] };
    }
    throw new Error('Email is not configured');
  }
  return transport.sendMail({
    from,
    to,
    subject,
    text: text || html?.replace(/<[^>]+>/g, ''),
    html: html || text,
  });
}

export default { sendEmail, getTransporter };
