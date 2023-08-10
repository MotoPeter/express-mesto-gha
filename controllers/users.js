const User = require('../models/user');
const httpConstants = require('../utils/constants');

const getUsers = (_req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: `Пользователь id: ${req.user._id} не найден` });
      } else {
        return res.send(user);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: `Некорректные данные: ${req.params.id}` });
      } else {
        res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: `Некорректные данные: ${{ name, about, avatar }}` });
      } else {
        res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Некорректные данные' });
      } else if (err.name === 'CastError') {
        res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: `Пользователь id: ${req.user._id} не найден` });
      } else {
        res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: `Некорректные данные: ${{ avatar }}` });
      } else if (err.name === 'CastError') {
        res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: `Пользователь id: ${req.user._id} не найден` });
      } else {
        res
          .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
