const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    const result = await authService.register({ email, password, fullName });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  getMe,
};
