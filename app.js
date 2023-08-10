/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const httpConstants = require('./utils/constants');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

console.log(httpConstants);

app.use((req, res, next) => {
  req.user = {
    _id: '64d36363c19485df664ba91c',
  };

  next();
});

app.use(bodyParser.json());

app.use(userRoutes);
app.use(cardRoutes);
app.use('*', (req, res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Некорректный путь' });
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
