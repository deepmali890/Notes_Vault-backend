const jwt = require('jsonwebtoken');
const User = require('../model/auth.model');

const protect = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, token missing' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded id (make sure you used "userId" when signing the token)
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next(); // Go to next middleware or route handler

    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ message: 'Invalid token or unauthorized access' });
    }
};

module.exports = protect;
