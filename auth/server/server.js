const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('../config/db');
const User = require('../models/User');
const authRoutes = require('../routes/auth');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Auth server is running' });
});

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

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
});
