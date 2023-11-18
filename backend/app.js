require('dotenv/config');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFound = require('./utils/NotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:/27017/mestodb' } = process.env;
app.use(
  cors({
    origin: ['https://barkhatos.nomoredomainsicu.ru', 'http://127.0.0.1:3000'],
    credentials: true,
    maxAge: 30,
  }),
);

app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB', error));

app.use(requestLogger);

app.get('/crash-test', () => {
  console.log('crash-test');
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().min(2),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().min(2),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30), // Поле необязательно, так как его нет при авторизации
    about: Joi.string().min(2).max(30), // Поле необязательно, так как его нет при авторизации
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,8})([/\w .-]*)*\/?$/), // Поле необязательно, так как его нет при авторизации
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  const error = new NotFound('Страница не найдена');
  next(error);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  console.log(err);
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App server listen ${PORT}`);
});
