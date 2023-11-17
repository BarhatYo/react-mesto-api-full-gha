import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function ConfirmPopup({ isOpen, onClose, onCardDelete, cardDelete }) {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onCardDelete(cardDelete);
    onClose();
  };

  return (
    <PopupWithForm
      name="delete"
      title="Вы уверены?"
      isOpen={isOpen}
      onClose={onClose}
      buttonTitle="Да"
      onSubmit={handleSubmit}
    ></PopupWithForm>
  );
}
