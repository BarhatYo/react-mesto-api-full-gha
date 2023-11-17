import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h2 className="not-found__title">Страница не найдена</h2>
      <Link to="/" className="not-found__link">Вернуться</Link>
    </div>
  );
}
