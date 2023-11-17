import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import edit from "../img/edit.svg";
import Card from "./Card";

export default function Main({ cards, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLike, openConfirmPopup }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content container">
      <div className="profile">
        <div className="profile__avatar-container" onClick={onEditAvatar}>
          <img
            className="profile__avatar"
            src={currentUser.avatar}
            alt="Аватар"
          />
          <div className="profile__avatar-overlay">
            <img
              className="profile__avatar-edit"
              src={edit}
              alt="Редактировать"
            />
          </div>
        </div>
        <div className="profile__info">
          <div className="profile__edit" onClick={onEditProfile}>
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              className="profile__edit-button"
              type="button"
              aria-label="Редактировать профиль"
            ></button>
          </div>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="Добавить карточку"
          onClick={onAddPlace}
        ></button>
      </div>
      <section className="elements" aria-label="Карточки">
        <ul className="elements__list">
          {cards.map((card) => (
            <Card
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              openConfirmPopup={openConfirmPopup}
              key={card._id}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
