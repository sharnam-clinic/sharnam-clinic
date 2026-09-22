const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

const generateAccessToken = (userId, userTypeId) => {
  return jwt.sign({ id: userId, userTypeId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (userId, userTypeId) => {
  return jwt.sign({ id: userId, userTypeId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        userType: true,
      },
    });

    if (!user) {
      return sendError(res, 'Invalid email or user not found', 401);
    }

    if (user.isStatus === 0) {
      return sendError(res, 'Your account has been deactivated. Please contact your administrator.', 403);
    }

    // Plain text password check (matching current behavior)
    // TODO: Migrate to bcrypt hashing
    if (user.password !== password) {
      return sendError(res, 'Invalid password. Please try again.', 401);
    }

    const roleName = user.userType?.user_type || 'Administrator';
    const userTypeIdNum = user.userTypeId ? Number(user.userTypeId) : 1;
    const accessToken = generateAccessToken(Number(user.id), userTypeIdNum);
    const refreshToken = generateRefreshToken(Number(user.id), userTypeIdNum);

    const userProfile = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userTypeId ? Number(user.userTypeId) : null,
      role: roleName.toLowerCase().replace(/\s+/g, '_'),
      userTypeName: roleName,
    };

    return sendSuccess(res, 'Login successful', {
      accessToken,
      refreshToken,
      user: userProfile,
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, error.message || 'Login failed');
  }
};

exports.logout = async (req, res) => {
  try {
    return sendSuccess(res, 'Logout successful');
  } catch (error) {
    return sendError(res, error.message || 'Logout failed');
  }
};
