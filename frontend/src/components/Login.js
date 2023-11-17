import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../utils/auth.js";

export default function Login({ handleLogin }) {
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
      .authorize(formValue.email, formValue.password)
      .then((token) => {
        if (token) {
          setFormValue({
            email: "",
            password: "",
          });
          handleLogin();
          navigate("/", { replace: true });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <form
        className="login__form"
        name="sign-in-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          name="email"
          className="login__input"
          type="email"
          placeholder="Email"
          minLength="2"
          onChange={handleChange}
          value={formValue.email}
          required
        />
        <input
          name="password"
          className="login__input"
          type="password"
          placeholder="Пароль"
          minLength="4"
          onChange={handleChange}
          value={formValue.password}
          required
        />
        <button className="login__button" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}
