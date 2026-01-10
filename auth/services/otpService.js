import nodemailer from 'nodemailer';


const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your verification code',
        html: `
            <h2>Email Verification</h2>
            <p>Your verification code is: <strong>${otp}</strong></p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    generateOTP,
    sendOTPEmail
};