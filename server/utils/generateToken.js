const { signToken } = require('../config/jwt');

const isProduction = process.env.NODE_ENV === 'production';

const generateToken = (res, userId) => {
  const token = signToken(userId);

  res.cookie('token', token, {
    httpOnly: true,
    // 'none' required for cross-origin cookies (Vercel frontend <-> Render backend)
    // 'lax' is fine for same-site local dev
    sameSite: isProduction ? 'none' : 'lax',
    // secure must be true when sameSite is 'none'
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateToken;
