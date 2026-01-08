import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];

        if (userId && userRole) {
            req.user = { id: userId, role: userRole };
            return next();
        }

        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
    next();
};
