import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({ isOpen, onAddPlace, onClose }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleNameChange = (evt) => {
    setName(evt.target.value);
  };

  const handleLink = (evt) => {
    setLink(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onAddPlace({
      name,
      link,
    });
  };

  useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  return (
    <PopupWithForm
      name="card"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      buttonTitle="Создать"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Название"
        className="popup__input popup__input_type_card-name"
        id="picture-name"
        name="name"
        minLength="2"
        maxLength="30"
        value={name}
        onChange={handleNameChange}
        required
      />
      <span className="popup__input-error picture-name-error"></span>
      <input
        type="url"
        placeholder="Ссылка на картинку"
        className="popup__input popup__input_type_image-url"
        id="link"
        name="link"
        value={link}
        onChange={handleLink}
        required
      />
      <span className="popup__input-error link-error"></span>
    </PopupWithForm>
  );
}
