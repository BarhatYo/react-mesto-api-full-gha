const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const Unauthorized = require('../utils/Unauthorized');

const handleAuthError = () => {
  throw new Unauthorized('Необходимо авторизоваться');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;

  return next();
};

module.exports = auth;
