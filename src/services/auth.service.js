const bcrypt = require('bcryptjs');
const { User } = require('../models/postgres');
const { generateToken, generateRefreshToken } = require('./jwt.service');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const register = async ({ email, password, fullName }) => {
  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    passwordHash,
    fullName,
  });

  // Generate tokens
  const accessToken = generateToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user || !user.passwordHash) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Generate tokens
  const accessToken = generateToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  const { verifyRefreshToken } = require('./jwt.service');

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findByPk(decoded.userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const accessToken = generateToken({ userId: user.id, email: user.email });

  return { accessToken };
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  hashPassword,
  comparePassword,
};
