import { useEffect, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import Footer from "./Footer";
import api from "../utils/Api";
import ConfirmPopup from "./ConfirmPopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";
import { Route, Routes, useNavigate } from "react-router-dom";
import ok from "../img/ok.svg";
import error from "../img/error.svg";
import * as auth from "../utils/auth.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSuccessRegistration, setIsSuccessRegistration] = useState(false);
  const [mobileIsOpen, setMobileIsOpen] = useState(false);
  const [cardDelete, setCardDelete] = useState({});

  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt");

  const handleLogin = (userEmail) => {
    setUserEmail(userEmail);
    setLoggedIn(true);
  };

  const handleTokenCheck = () => {
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((data) => {
          setLoggedIn(true);
          navigate("/", { replace: true });
          setUserEmail(data.email);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    handleTokenCheck();
  }, [jwt]);

  const tooltipContent = {
    success: {
      image: ok,
      text: "Вы успешно зарегистрировались!",
      name: "Успешное действие",
    },
    error: {
      image: error,
      text: "Что-то пошло не так! Попробуйте ещё раз.",
      name: "Ошибка",
    },
  };

  const openInfoTooltip = (status) => {
    setIsInfoTooltipOpen(true);
    setIsSuccessRegistration(status);
  };

  useEffect(() => {
    if (loggedIn) {
      api
        .getAllInfoApi()
        .then(([cards, userInfo]) => {
          setCards(cards);
          setCurrentUser(userInfo);
        })
        .catch((err) => console.log(err));
    } else {
      return;
    }
  }, [loggedIn]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
  };

  const handleBurgerClick = () => {
    setMobileIsOpen(!mobileIsOpen);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard({});
    setCardDelete({})
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((id) => id === currentUser._id);

    api
      .changeLikeApi(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c)),
        );
      })
      .catch((err) => console.log(err));
  };

  const openConfirmPopup = (card) => {
    setIsConfirmPopupOpen(true);
    setCardDelete(card);
  };

  const handleCardDelete = (card) => {
    api
      .removeCardApi(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateUser = (userInfo) => {
    api
      .changeUserInfoApi(userInfo)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateAvatar = (userInfo) => {
    api
      .changeUserAvatarApi(userInfo)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleAddPlaceSubmit = (newPlace) => {
    api
      .addCardApi(newPlace)
      .then((newPlace) => {
        setCards([newPlace, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const signOut = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserEmail("");
    setMobileIsOpen(false);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          userEmail={userEmail}
          signOut={signOut}
          mobileIsOpen={mobileIsOpen}
          handleBurgerClick={handleBurgerClick}
        />
        <Routes>
          <Route
            path="/sign-up"
            element={<Register openInfoTooltip={openInfoTooltip} />}
          />
          <Route
            path="/sign-in"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                cards={cards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onClose={closeAllPopups}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                openConfirmPopup={openConfirmPopup}
                loggedIn={loggedIn}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <InfoTooltip
          name="info-tooltip"
          isOpen={isInfoTooltipOpen}
          tooltipContent={
            isSuccessRegistration
              ? tooltipContent.success
              : tooltipContent.error
          }
          onClose={closeAllPopups}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onUpdateUser={handleUpdateUser}
          onClose={closeAllPopups}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleUpdateAvatar}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          onClose={closeAllPopups}
        />
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          cardDelete={cardDelete}
          onCardDelete={handleCardDelete}
        ></ConfirmPopup>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
