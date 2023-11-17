import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as auth from "../utils/auth.js";

export default function Register({openInfoTooltip}) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .register(formValue.email, formValue.password)
      .then(() => {
        setFormValue({
          email: "",
          password: "",
        });
        openInfoTooltip(true);
        navigate("/sign-in", { replace: true });
      })
      .catch(() => {
        openInfoTooltip(false);
      });
  };

  return (
    <div className="registration">
      <h2 className="registration__title">Регистрация</h2>
      <form
        className="registration__form"
        name="sign-up-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          name="email"
          className="registration__input"
          type="email"
          placeholder="Email"
          minLength="2"
          onChange={handleChange}
          value={formValue.email}
          required
        />
        <input
          name="password"
          className="registration__input"
          type="password"
          placeholder="Пароль"
          minLength="4"
          onChange={handleChange}
          value={formValue.password}
          required
        />
        <button className="registration__button" type="submit">
          Зарегистрироваться
        </button>
      </form>
      <p className="registration__login-note">
        Уже зарегистрированы?{" "}
        <Link
          to="/sign-in"
          className="registration__login-note registration__login-note_type_link"
        >
          Войти
        </Link>
      </p>
    </div>
  );
}
