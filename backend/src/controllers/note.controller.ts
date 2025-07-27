import { Request, Response } from "express";
import Note from "../models/Note";

export const createNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.create({
      content: req.body.content,
      userId: (req as any).userId,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create note" });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ userId: (req as any).userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch notes" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: (req as any).userId });
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete note" });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: (req as any).userId },
      { content: req.body.content },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};
