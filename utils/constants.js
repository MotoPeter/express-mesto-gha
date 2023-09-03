const httpConstants = require('http2').constants;

const allowedCors = [
  'https://mesto.motopeter.nomoredomainsicu.ru',
  'https://api.mesto.motopeter.nomoredomainsicu.ru',
  'http://mesto.motopeter.nomoredomainsicu.ru',
  'http://api.mesto.motopeter.nomoredomainsicu.ru',
  'https://localhost:3000',
  'http://localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  httpConstants,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
