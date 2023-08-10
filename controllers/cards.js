const Card = require('../models/card');
const httpConstants = require('../utils/constants');

const getCards = (_req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    // eslint-disable-next-line no-unused-vars
    .catch((_err) => res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка id: ${req.params.cardId} не найдена` }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
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
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${req.params.cardId}, ${req.user._id}` });
      } else if (err.name === 'CastError') {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка id: ${req.params.cardId} не найдена` });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: `Некорректные данные: ${req.params.cardId}, ${req.user._id}` });
      } else if (err.name === 'CastError') {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка id: ${req.params.cardId} не найдена` });
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
