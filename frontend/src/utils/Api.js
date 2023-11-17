class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  onResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getAllInfoApi() {
    return Promise.all([this.getAllCardsApi(), this.getCurrentUserApi()]);
  }

  getCurrentUserApi() {
    const token = `Bearer ${localStorage.getItem('jwt')}`;
    return fetch(`${this.baseUrl}/users/me`, {
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      }
    }).then(this.onResponse);
  }

  changeLikeApi(cardId, isLiked) {
    const token = `Bearer ${localStorage.getItem('jwt')}`;
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      }
    }).then(this.onResponse);
  }

  getAllCardsApi() {
    const token = `Bearer ${localStorage.getItem('jwt')}`;
    return fetch(`${this.baseUrl}/cards`, {
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      }
    }).then(this.onResponse);
  }

  addCardApi(card) {
    const token = `Bearer ${localStorage.getItem('jwt')}`;
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    }).then(this.onResponse);
  }

  removeCardApi(cardId) {
    const token = `Bearer ${localStorage.getItem('jwt')}`;
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      }
    }).then(this.onResponse);
  }

  changeUserInfoApi(userInfo) {
    const token = `Bearer ${localStorage.getItem('jwt')}`;
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    }).then(this.onResponse);
  }

  changeUserAvatarApi(avatarLink) {
    const token = `Bearer ${localStorage.getItem('jwt')}`;
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(avatarLink),
    }).then(this.onResponse);
  }
}

const api = new Api({
  // baseUrl: "http://127.0.0.1:3001",
  baseUrl: "https://api.barkhatos.nomoredomainsicu.ru",
});

export default api;
