const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { CREATED, SUCCESS } = require('../constants/statusCodes');

const BadRequest = require('../utils/BadRequest');
const Conflict = require('../utils/ConflictError');
const NotFound = require('../utils/NotFound');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      const formattedUsers = users.map((user) => ({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user.id,
      }));
      res.send(formattedUsers);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId).orFail(new NotFound('Нет пользователя с таким id'))
    .then((user) => {
      res.send(
        {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        },
      );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан невалидный ID'));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(
      {
        name: user.name,
        _id: user._id,
        avatar: user.avatar,
        about: user.about,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные в метод обновления профиля'));
      }
      return next(err);
    });
};

const getProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      }
      res.send(
        {
          name: user.name,
          _id: user._id,
          avatar: user.avatar,
          about: user.about,
          email: user.email,
        },
      );
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(
      {
        name: user.name,
        _id: user._id,
        avatar: user.avatar,
        about: user.about,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные в метод обновления аватара'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(toString(password), 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(CREATED).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('Пользователь с таким email уже зарегистрирован'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true, sameSite: true });
      // res.status(SUCCESS).send({ message: 'Авторизация успешна' });
      res.status(SUCCESS).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getProfile,
};
