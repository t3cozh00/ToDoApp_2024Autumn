import { Router } from "express";
import { auth } from "../helpers/auth.js";
import {
  deleteTask,
  getTasks,
  postTask,
} from "../controllers/TaskController.js";

const router = Router();

router.get("/", auth, getTasks);

router.post("/create", auth, postTask);

router.delete("/delete/:id", auth, deleteTask);

export default router;
