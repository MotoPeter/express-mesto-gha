const cardRouter = require('express').Router();
const celebrate = require('../middlewares/celebrate');
const {
  getCards,
  deleteCard,
  createCard,
  putLike,
  delLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', celebrate.getCard, deleteCard);

cardRouter.post('/', celebrate.createCard, createCard);

cardRouter.put('/:cardId/likes', celebrate.getCard, putLike);

cardRouter.delete('/:cardId/likes', celebrate.getCard, delLike);

module.exports = cardRouter;
