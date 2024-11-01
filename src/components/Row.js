import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSquare } from "@fortawesome/free-solid-svg-icons";
import "../screens/Home.css";

export default function Row({ item, deleteTask }) {
  return (
    <div>
      <div className="item" key={item.id}>
        <div className="itemLeft">
          <div className="square">
            <FontAwesomeIcon icon={faSquare} />
          </div>

          <div className="itemText">{item.description}</div>
          <button className="delete-button" onClick={() => deleteTask(item.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
}
