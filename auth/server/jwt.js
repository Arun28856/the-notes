import jwt from 'jsonwebtoken';

const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (userId) => {
    return jwt.sign(  
        { userId } ,
        process.env.JWT_SECRET,
        { expiresIn: "15m" } //Short-lived token
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(  
        { userId } ,
        process.env.JWT_SECRET,
        { expiresIn: "7d" } //Long-lived token
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
};