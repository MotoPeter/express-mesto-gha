/* eslint-disable no-else-return */
/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const httpConstants = require('../utils/constants');
const NotFoundError = require('../errors/notfound-error');
const BadRequest = require('../errors/badrequest-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((next));
};

const getUser = (req, res, next) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError(`Пользователь id: ${userId} не найден`))
    // eslint-disable-next-line consistent-return
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequest(`Некорректные данные: ${userId}`));
      // eslint-disable-next-line no-else-return
      } else {
        return next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send({
      email, name, about, avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные'));
      } else if (err.code === 11000) {
        return next(new ConflictError(`Пользователь с email '${email}' уже существует.`));
      } else {
        return next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          `Пользователь id: ${req.user._id} не найден`,
        );
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
        return next(new BadRequest('Некорректные данные'));
      } else {
        return next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          `Пользователь id: ${req.user._id} не найден`,
        );
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
        return next(new BadRequest(`Некорректные данные: ${{ avatar }}`));
      } else {
        return next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернём токен
      res.cookie('token', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
