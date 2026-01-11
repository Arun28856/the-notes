const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../utils/otp');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: 'Please verify your email first' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

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

        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            message: 'Email verified successfully',
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });

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

// Google OAuth routes
router.get('/google', (req, res, next) => {
    const passport = require('passport');
    require('../config/passport');
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    const passport = require('passport');
    require('../config/passport');
    passport.authenticate('google', {
        failureRedirect: '/api/auth/google/failure',
        session: false
    }, (err, user) => {
        if (err || !user) {
            return res.redirect('http://localhost:8080/?error=auth_failed');
        }
        
        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.redirect(`http://localhost:8080/?token=${token}&name=${encodeURIComponent(user.name)}`);
    })(req, res, next);
});

router.get('/google/failure', (req, res) => {
    res.status(401).json({ error: 'Google authentication failed' });
});

module.exports = router;