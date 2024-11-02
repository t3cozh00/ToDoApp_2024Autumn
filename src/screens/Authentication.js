import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import { useUser } from "../context/useUser.js";
import { generateUniqueIdentifier } from "../utils/userUrl.js";
import { MdOutlineMailOutline, MdLockOutline } from "react-icons/md";

export const AuthenticationMode = Object.freeze({
  Login: "Login",
  Register: "Register",
});

export default function Authentication({ authenticationMode }) {
  const { user, setUser, signIn, signUp } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (authenticationMode === AuthenticationMode.Register) {
        await signUp();
        navigate("/signin");
      } else {
        await signIn();
        const uniqueIdentifier = generateUniqueIdentifier(user.email);
        navigate(`/${uniqueIdentifier}`);
      }
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data.error
          : error;
      alert(message);
    }
  };
  return (
    <div>
      <div id="container-auth">
        <h1>
          {authenticationMode === AuthenticationMode.Login
            ? "Welcome! Please Sign in!"
            : "Sign up to create your account!"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={user.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <MdOutlineMailOutline className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={user.password || ""}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <MdLockOutline className="icon" />
          </div>
          <div>
            <button>
              {authenticationMode === AuthenticationMode.Login
                ? "Sign in"
                : "Submit"}
            </button>
          </div>
          <div>
            <Link
              to={
                authenticationMode === AuthenticationMode.Login
                  ? "/signup"
                  : "/signin"
              }
              className="sign-link"
            >
              {authenticationMode === AuthenticationMode.Login
                ? "No account? Sign up"
                : "Already signed up? Sign in"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
