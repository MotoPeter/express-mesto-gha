/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { celebrate } = require('celebrate');

router.post('/signin', celebrate.login, login);
router.post('/signup', celebrate.createUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
