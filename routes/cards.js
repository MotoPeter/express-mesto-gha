const cardRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  putLike,
  delLike,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.post('/cards', createCard);

cardRouter.put('/cards/:cardId/likes', putLike);

cardRouter.delete('/cards/:cardId/likes', delLike);

module.exports = cardRouter;
