const { verifyToken } = require('../services/jwt.service');
const { User } = require('../models/postgres');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('No token provided');
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

module.exports = authenticate;
