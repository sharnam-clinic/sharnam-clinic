const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token.', 403);
  }
};

module.exports = authMiddleware;
