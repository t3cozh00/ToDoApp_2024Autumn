import { useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export default function UserProvider({ children }) {
  const userFromSessionStorage = sessionStorage.getItem("user");
  const [user, setUser] = useState(
    userFromSessionStorage
      ? JSON.parse(userFromSessionStorage)
      : { email: "", password: "" }
  );

  const signUp = async () => {
    const json = JSON.stringify(user);
    const headers = { headers: { "Content-Type": "application/json" } };
    try {
      const response = await axios.post(`${url}/user/register`, json, headers);
      setUser(response.data);
      sessionStorage.setItem("user", JSON.stringify(response.data));
      const userId = response.data.id;

      await axios.post(
        `${url}/create`,
        { description: "Welcome to your Todo list!", userId },
        headers
      );
    } catch (error) {
      throw error;
    }
  };

  const signIn = async () => {
    const json = JSON.stringify(user);
    const headers = { headers: { "Content-Type": "application/json" } };
    try {
      //console.log("API URL:", url);
      const response = await axios.post(`${url}/user/login`, json, headers);
      const token = response.data.token;
      const userId = response.data.id;
      setUser({ ...response.data, token });
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...response.data, token, id: userId })
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, signUp, signIn }}>
      {children}
    </UserContext.Provider>
  );
}
