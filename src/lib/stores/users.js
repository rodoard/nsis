import defaultUser from "./defaultUser"
import lz from "lz-string"
import sa from "serialize-anything"

function users() {
  let existing = window.localStorage.getItem('users')
  if (!existing) {
    return {
      [`${defaultUser.profile.username}`]: {
        ...defaultUser
      }
    }
  }
  const decompressed = sa.deserialize(lz.decompress(existing))
  console.log('parse ', decompressed, "<<< parsed???")
  return decompressed
}

function saveUser(user) {
  console.log('save user', {
    [`${user.profile.username}`]: user
  })
  window.localStorage.setItem("users", lz.compress(sa.serialize({
    [`${user.profile.username}`]: user
  })))
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

