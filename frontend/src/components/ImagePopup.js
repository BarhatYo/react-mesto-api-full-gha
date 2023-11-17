import React from "react";

export default function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup_type_picture ${card.name && "popup_opened"}`}>
      <div className="popup__picture-container">
        <figure className="popup__picture">
          <img
            className="popup__image"
            src={card.link}
            alt={card.name}
          />
          <figcaption className="popup__picture-caption">
            {card.name}
          </figcaption>
        </figure>
        <button
          className="popup__close popup__close_type_picture"
          type="button"
          aria-label="Закрыть окно"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}
