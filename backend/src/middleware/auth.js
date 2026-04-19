const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.warn('⚠️ No token provided for authenticated endpoint:', req.method, req.path);
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luccica_secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      console.warn('⚠️ Non-admin user attempting admin access:', req.user.email, req.method, req.path);
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

module.exports = { authMiddleware, adminMiddleware };
