const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    googleId: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { 
        code: String, 
        expiresAt: Date 
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    lastLogin: Date,
    refreshTokens: [{ 
        type: String,
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);