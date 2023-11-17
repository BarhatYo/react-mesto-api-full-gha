import React, { useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({ isOpen, onUpdateAvatar, onClose }) {
  const avatarRef = useRef();

  useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  };

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      buttonTitle="Сохранить"
      onSubmit={handleSubmit}
    >
      <input
        type="url"
        ref={avatarRef}
        placeholder="Ссылка на изображение"
        className="popup__input popup__input_type_avatar-url"
        id="avatar-link"
        name="avatar"
        required
      />
      <span className="popup__input-error avatar-link-error"></span>
    </PopupWithForm>
  );
}
