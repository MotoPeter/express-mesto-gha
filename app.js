/* eslint-disable import/order */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const helmet = require('helmet');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/notfound-error');
require('dotenv').config();
const { errors } = require('celebrate');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());

app.use(bodyParser.json());

app.use(router);
app.use('*', (req, res, next) => next(new NotFoundError('Некорректный путь')));

// подключаемся к серверу mongo
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to mestodb');
  });

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
