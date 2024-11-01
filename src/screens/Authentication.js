import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import { useUser } from "../context/useUser.js";
import { generateUniqueIdentifier } from "../utils/userUrl.js";

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
    <div id="container">
      <h3>
        {authenticationMode === AuthenticationMode.Login
          ? "Sign in"
          : "Sign up"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={user.password || ""}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>
        <div>
          <button>
            {authenticationMode === AuthenticationMode.Login
              ? "Login"
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
          >
            {authenticationMode === AuthenticationMode.Login
              ? "No account? Sign up"
              : "Already signed up? Sign in"}
          </Link>
        </div>
      </form>
    </div>
  );
}
