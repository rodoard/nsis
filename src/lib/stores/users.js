import defaultUser from "./defaultUser"

function users() {
  return window.localStorage.getItem('users') || {
    [`${defaultUser.profile.username}`]: {
      ...defaultUser
    }
  }
}

function saveUser(user) {
  window.localStorage.setItem("users", {
    ...users(),
    [`${username}`]: user
  })
}

function getUser(username) {
  return users()[username]
}

function userExists(username) {
  return (getUser(username))?.profile.username === username
}

export {
  saveUser,
  getUser,
  userExists
}

