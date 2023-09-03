/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
const BadRequest = require('../errors/badrequest-error');
const forbidenError = require('../errors/forbiden-error');
const NotFoundError = require('../errors/notfound-error');
const Card = require('../models/card');
const { httpConstants } = require('../utils/constants');

const getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((next));
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError(`Карточка id: ${req.params.cardId} не найдена`))
    .then((card) => {
      if (card.owner.toString() !== owner) {
        // eslint-disable-next-line new-cap
        throw new forbidenError('У вас нет прав на удаление карточки');
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequest(`Некорректные данные: ${req.params.cardId}`));
      } else {
        return next(err);
      }
    });
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(`Некорректные данные: ${name}, ${link}`));
      } else {
        return next(err);
      }
    });
};

const delLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'notValidId') {
        return next(new NotFoundError(`Карточка id: ${req.params.cardId} не найдена`));
      } else if (err.kind === 'ObjectId') {
        return next(new BadRequest(`Некорректные данные: ${req.params.cardId}`));
      } else {
        return next(err);
      }
    });
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'notValidId') {
        return next(new NotFoundError(`Карточка id: ${req.params.cardId} не найдена`));
      } else if (err.kind === 'ObjectId') {
        return next(new BadRequest(`Некорректные данные: ${req.params.cardId}`));
      } else {
        return next(err);
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
