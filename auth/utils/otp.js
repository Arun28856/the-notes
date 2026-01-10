const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification - OTP',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Email Verification</h2>
                    <p>Your OTP for email verification is:</p>
                    <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully to:', email);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

module.exports = { generateOTP, sendOTPEmail };
