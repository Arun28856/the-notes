import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'auth-jwt-secret-key-2026-secure-token');
        
        // Add user info to request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export default authenticate;
