import { Routes, Route, Link } from "react-router-dom";

export default function Header({ userEmail, signOut, mobileIsOpen, handleBurgerClick }) {

  return (
    <>
      {mobileIsOpen && (
        <div className="header-mobile">
          <p className="header-mobile__user-email">{userEmail}</p>
          <Link to="/sign-in" className="header-mobile__link" onClick={signOut}>
            Выход
          </Link>
        </div>
      )}
      <header className="header">
        <div className="header__logo"></div>
        <Routes>
          <Route
            path="/sign-in"
            element={
              <Link to="/sign-up" className="header__link">
                Регистрация
              </Link>
            }
          />
          <Route
            path="/sign-up"
            element={
              <Link to="/sign-in" className="header__link">
                Вход
              </Link>
            }
          />
          <Route
            path="/"
            element={
              <>
                <div className={`header-mobile__burger ${mobileIsOpen && "active"}`} onClick={handleBurgerClick}>
                  <span className={`header-mobile__burger-line ${mobileIsOpen && "active"}`}></span>
                </div>
                <div className="header__info">
                  <p className="header__user-email">{userEmail}</p>
                  <Link
                    to="/sign-in"
                    className="header__link header__link_type_sign-out"
                    onClick={signOut}
                  >
                    Выход
                  </Link>
                </div>
              </>
            }
          />
          <Route
            path="*"
            element={
              <Link to="/sign-in" className="header__link">
                Вход
              </Link>
            }
          />
        </Routes>
      </header>
    </>
  );
}
