import "./Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Row from "../components/Row";
import { useUser } from "../context/useUser";
import { generateUniqueIdentifier } from "../utils/userUrl.js";
import axios from "axios";
const url = "http://localhost:3001";

function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [uniqueIdentifier, setUniqueIdentifier] = useState("");

  useEffect(() => {
    //console.log("User token:", user.token); // eslint-disable-line

    if (user && user.email) {
      const storedIdentifier = localStorage.getItem("uniqueIdentifier");
      if (storedIdentifier) {
        setUniqueIdentifier(storedIdentifier);
      } else {
        const generatedIdentifier = generateUniqueIdentifier(user.email);
        setUniqueIdentifier(generatedIdentifier);
        localStorage.setItem("uniqueIdentifier", generatedIdentifier);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && user.token && uniqueIdentifier) {
      // fetch only if the identifier matches
      const headers = { headers: { Authorization: user.token } };
      axios
        .get(url, headers)
        .then((response) => {
          //console.log(response);
          if (response.data) {
            setTasks(response.data);
          }
        })
        .catch((error) => {
          //console.log(error);
          alert(error.response.data.error ? error.response.data.error : error);
        });
    }
  }, [user, uniqueIdentifier]);

  const addTask = () => {
    const headers = { headers: { Authorization: user.token } };

    axios
      .post(`${url}/create`, { description: task }, headers)
      .then((response) => {
        setTasks((prevTask) => [
          ...prevTask,
          { id: response.data.id, description: task },
        ]);
        setTask("");
        //return axios.get(url, headers);
      })
      .catch((error) => {
        alert(error.response.data.error ? error.response.data.error : error);
      });
  };

  const deleteTask = (id) => {
    const headers = { headers: { Authorization: user.token } };

    axios
      .delete(`${url}/delete/${id}`, headers)
      .then(() => {
        setTasks((prevTask) => prevTask.filter((item) => item.id !== id));
        //setTasks vs. setTask: setTasks should be used for updating the state of the tasks array. Using setTask instead mistakenly tries to set a single task rather than filtering the list, leading to the error.
      })
      .catch((error) => {
        alert(error.response.data.error ? error.response.data.error : error);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem("uniqueIdentifier");
    sessionStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div id="container">
      <div className="userPage">
        <div>Welcome, {user.email}</div>
        <div>
          <button className="userPageButton" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="taskWrapper">
        <div className="sectionTitle">Your Todos</div>
        <form>
          <input
            placeholder="Add new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask();
              }
            }}
          />
        </form>
        <div className="items">
          {tasks.map((item) => (
            <Row key={item.id} item={item} deleteTask={deleteTask} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
