import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ----------------- SIGNUP ------------------
export const signup = async (req: Request, res: Response) => {
  try {
    console.log("🔥 SIGNUP route reached");
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return res.status(500).json({ msg: "Signup failed" });
  }
};

// ----------------- LOGIN ------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ msg: "User not found or password missing" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ msg: "Login failed" });
  }
};

