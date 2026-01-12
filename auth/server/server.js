const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
require('../config/db');
const User = require('../models/User');
const authRoutes = require('../routes/auth');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3003', 'http://localhost:5173', 'http://localhost:8080'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
app.use('/api/auth', authRoutes);

// Test route to create a sample user
app.post('/test/create-user', async (req, res) => {
    try {
        const testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword123',
            isVerified: true
        });
        res.json({ message: 'Test user created', user: testUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
});
