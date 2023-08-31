/* eslint-disable import/no-extraneous-dependencies */
const userRouter = require('express').Router();
const celebrate = require('../middlewares/celebrate');
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', celebrate.getUser, getUser);

userRouter.get('/:userId', celebrate.getUser, getUser);

userRouter.patch('/me', celebrate.updateUser, updateUser);

userRouter.patch('/me/avatar', celebrate.updateAvatar, updateAvatar);

module.exports = userRouter;
