/* eslint-disable consistent-return */
const Card = require('../models/card');
const httpConstants = require('../utils/constants');

const getCards = (_req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка id: ${req.params.cardId} не найдена` });
      } else {
        return res.send(card);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${req.params.cardId}` });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${name}, ${link}` });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const delLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка id: ${req.params.cardId} не найдена` });
      } else {
        return res.send(card);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${req.params.cardId}` });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка id: ${req.params.cardId} не найдена` });
      } else {
        return res.send(card);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${req.params.cardId}` });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  delLike,
  putLike,
};
