import { AUTH_SESSION, LEAVE_SESSION } from "../constants"

const defaultState = {
  user: null,
  email: null,
  admin: false,
  auth: null,
  date_expire: null,
}

const UserSession = (state = defaultState, action) => {
  const { payload, type } = action
  switch (type) {
    case AUTH_SESSION:
      return {
        user: payload.user,
        email: payload.email,
        admin: payload.admin,
        auth: true,
        date_expire: payload.date_expire,
      }
    case LEAVE_SESSION:
      return {
        user: null,
        email: null,
        admin: false,
        auth: false,
        date_expire: null,
      }
    default:
      return state
  }
}

export default UserSession
