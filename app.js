/* eslint-disable import/order */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const helmet = require('helmet');
const errorHandler = require('./middlewares/error-handler');
require('dotenv').config();
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());

app.use(bodyParser.json());

app.use(cookieParser());

app.use(requestLogger);

app.use(cors);

app.use(router);

// подключаемся к серверу mongo
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to mestodb');
  });

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
