import React, { useState } from "react"

import axios from "axios"

import Navbar from "src/components/Navbar"
import Footer from "src/components/Footer"
import Snackbar from "src/components/Snackbar"

import "./User.css"
import { navigate } from "gatsby"

const writeTokenCookie = token => {
  // In hours.
  const expireTime = 2
  var date = new Date()
  date.setTime(+date + expireTime * 3600000)

  document.cookie =
    "token=" + token + ";expires=" + date.toGMTString() + ";path=/"
  console.log(token)
}

const PasswordChecker = ({ compare }) => {
  const [password, setPassword] = useState("")
  const [errorStyle, setErrorStyle] = useState({
    transition: "all 500ms ease",
    borderColor: "none",
  })

  return (
    <React.Fragment>
      Please check your password:
      <input
        id="pwcheck"
        type="password"
        style={errorStyle}
        onChange={e => setPassword(e.target.value)}
        onBlur={() =>
          compare !== password
            ? setErrorStyle({ ...errorStyle, borderColor: "red" })
            : setErrorStyle({
                ...errorStyle,
                borderColor: "var(--color-primary-light)",
              })
        }
      />
    </React.Fragment>
  )
}

const LoginForm = ({ setNotification }) => {
  const [loginBody, setLoginBody] = useState({
    email: "",
    password: "",
  })

  const loginUser = async credentials => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth`,
        credentials
      )
      const token = response.data
      writeTokenCookie(token)
      setNotification({
        pending: true,
        message: "Logged in succesfully. Please wait while you're redirected.",
      })
    } catch (err) {
      console.log(err.response)
      if (err.response.data.message) {
        setNotification({
          pending: true,
          message: `${err.response.data.message}`,
        })
      } else if (err.response.data)
        setNotification({
          pending: true,
          message: `${err.response.data}`,
        })
      else
        setNotification({
          pending: true,
          message: `An error has occurred.`,
        })
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login__header">Login</div>
      <div className="login__body">
        <form className="login-form">
          Your e-mail address:
          <input
            label="email"
            type="text"
            onChange={e =>
              setLoginBody({ ...loginBody, email: e.target.value })
            }
          />
          Your password:
          <input
            label="pw"
            type="password"
            onChange={e =>
              setLoginBody({ ...loginBody, password: e.target.value })
            }
          />
          <br />
          <PasswordChecker compare={loginBody.password} />
        </form>
        <button className="login__submit" onClick={() => loginUser(loginBody)}>
          Submit
        </button>
      </div>
    </div>
  )
}

const RegisterForm = ({ setNotification }) => {
  const [registerBody, setRegisterBody] = useState({
    name: "",
    email: "",
    password: "",
  })

  const registerUser = async credentials => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user`,
        credentials
      )
      setNotification({ pending: true, message: "Registered." })
    } catch (err) {
      if (err.response.data.message)
        setNotification({
          pending: true,
          message: `${err.response.data.message}`,
        })
      else setNotification({ pending: true, message: "An error has occurred." })
    }
  }

  return (
    <div className="register-wrapper">
      <div className="register__header">Register</div>
      <div className="register__body">
        <form className="register-form">
          Your username:
          <input
            label="username"
            type="text"
            onChange={e =>
              setRegisterBody({
                ...registerBody,
                name: e.target.value,
              })
            }
          />
          Your e-mail address:
          <input
            label="email"
            type="text"
            onChange={e =>
              setRegisterBody({
                ...registerBody,
                email: e.target.value,
              })
            }
          />
          Your password:
          <input
            label="pw"
            type="password"
            onChange={e =>
              setRegisterBody({
                ...registerBody,
                password: e.target.value,
              })
            }
          />
          <PasswordChecker compare={registerBody.password} />
        </form>
        <button
          className="register__submit"
          onClick={() => registerUser(registerBody)}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

const User = () => {
  const [notification, setNotification] = useState({
    pending: false,
    message: "",
  })

  const setPending = () => {
    setNotification({ ...notification, pending: false })
  }

  return (
    <>
      <Navbar />
      <div className="auth-container light-bg border box-shadow">
        <h2>User Page</h2>
        <div className="user-container">
          <LoginForm setNotification={setNotification} />
          <div className="sep" />
          <RegisterForm setNotification={setNotification} />
          <Snackbar
            setPending={setPending}
            top={"10px"}
            left={"50%"}
            transform={"translateX(-50%)"}
            displayTime={3000}
            mount={notification.pending}
          >
            {notification.message}
          </Snackbar>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default User
