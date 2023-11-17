import React from "react";

export default function PopupWithForm({name, title, isOpen, onClose, buttonTitle, onSubmit, children}) {
  return (
    <div
      className={`popup popup_type_${name} ${
        isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container">
        <h2 className="popup__title">{title}</h2>
        <form
          className={`popup__form popup__form_type_${name}`}
          name={name}
          onSubmit={onSubmit}
          noValidate
        >
          {children}
          <button className="popup__button" type="submit">
            {buttonTitle}
          </button>
        </form>
        <button
          onClick={onClose}
          className="popup__close"
          type="button"
          aria-label="Закрыть окно"
        ></button>
      </div>
    </div>
  );
}