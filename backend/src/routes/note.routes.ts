import express from "express";
import { createNote, getNotes, deleteNote, updateNote } from "../controllers/note.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getNotes);
router.post("/", authenticate, createNote);
router.delete("/:id", authenticate, deleteNote);
router.put("/:id", authenticate, updateNote);

export default router;
