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
  User.findById(req.user._id)
    .orFail(new Error('notValidId'))
    // eslint-disable-next-line consistent-return
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'notValidId') {
        return next(new NotFoundError(`Пользователь id: ${req.user._id} не найден`));
      } if (err.kind === 'ObjectId') {
        return next(new BadRequest(`Некорректные данные: ${req.params.id}`));
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
  if (!email || !password) {
    return next(new BadRequest('Email и пароль не могут быть пустыми'));
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send({
      email, name, about, avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(`Пользователь с email '${email}' уже существует.`));
      } else {
        return next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные'));
      } else if (err.name === 'CastError') {
        return next(new NotFoundError(`Пользователь id: ${req.user._id} не найден`));
      } else {
        return next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(`Некорректные данные: ${{ avatar }}`));
      } else if (err.name === 'CastError') {
        return next(new NotFoundError(`Пользователь id: ${req.user._id} не найден`));
      } else {
        return next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequest('Email и пароль не могут быть пустыми'));
  }
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
    .catch((err) => next(new UnauthorizedError(err.message)));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
