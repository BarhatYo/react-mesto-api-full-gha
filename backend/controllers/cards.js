const Card = require('../models/card');
const BadRequest = require('../utils/BadRequest');
const NotFound = require('../utils/NotFound');
const Forbidden = require('../utils/Forbidden');

const getCards = (req, res, next) => {
  Card.find({})
    .sort({ createdAt: -1 })
    .then((cards) => {
      const formattedCards = cards.map((card) => ({
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        createdAt: card.createdAt,
        owner: card.owner,
      }));
      res.send(formattedCards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send(
      {
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        createdAt: card.createdAt,
        owner: card.owner,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные в метод добавления карточки'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail(new NotFound('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Вы не являетесь владельцем карточки');
      }
      return Card.deleteOne({ _id: cardId })
        .then(() => res.send({ message: 'Пост удалён' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан невалидный ID'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFound('Карточка не найдена'))
    .then((card) => res.send(
      {
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        createdAt: card.createdAt,
        owner: card.owner,
      },
    ))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан невалидный ID'));
      }
      return next(err);
    });
};

const unlikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFound('Карточка не найдена'))
    .then((card) => res.send(
      {
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        createdAt: card.createdAt,
        owner: card.owner,
      },
    ))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан невалидный ID'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
