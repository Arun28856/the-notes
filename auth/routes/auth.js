const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../utils/otp');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email});

    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        otp: {
            code: otp,
            expiresAt: new Date(otpExpiry)
        },
        isVerified: false
    });
    await newUser.save();

    // Send OTP email
    try {
        await sendOTPEmail(email, otp);
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // User is created but email failed - you might want to handle this differently
    }

    res.status(201).json({ 
        message: 'User registered successfully. Please verify your email with the OTP sent.',
        email 
    });

} catch (error) {
    res.status(500).json({ error: 'Server error' });
    console.error('Registration error:', error);
}
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User already verified' });
        }

        if (!user.otp || !user.otp.code) {
            return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
        }

        if (user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (user.otp.code !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Verify user
        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.error('OTP verification error:', error);
    }
});

// Resend OTP route
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        user.otp = {
            code: otp,
            expiresAt: new Date(otpExpiry)
        };
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'New OTP sent successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.error('Resend OTP error:', error);
    }
});
module.exports = router;