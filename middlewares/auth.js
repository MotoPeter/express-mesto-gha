/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/newline-after-import */
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { JWT_SECRET = 'SECRET_KEY' } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      JWT_SECRET,
    );
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запрос
  return next(); // пропускаем запрос дальше
};
