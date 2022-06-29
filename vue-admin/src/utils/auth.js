const TokenKey = 'Admin-Token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  //console.log("settokne", token);
  localStorage.setItem('aaa', 123)
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
  // localStorage.setItem('fsdfsd',123)
}
