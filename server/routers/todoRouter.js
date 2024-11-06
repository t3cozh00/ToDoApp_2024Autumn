import { Router } from "express";
import { pool } from "../helpers/db.js";
import { auth } from "../helpers/auth.js";
import {
  deleteTask,
  getTasks,
  postTask,
} from "../controllers/TaskController.js";

const router = Router();

router.get("/tasks", auth, getTasks);

router.post("/create", auth, postTask);

router.delete("/delete/:id", auth, deleteTask);

router.get("/taskstest", async (req, res) => {
  try {
    const result = await pool.query("select * from task");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
  //res.send("Welcome to the Todo API!");
});

export default router;
