import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import cookieSession from "cookie-session";
import "./config/passport";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key1", "key2"],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 👇 ADD THESE ROUTES
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import noteRoutes from "./routes/note.routes";

app.use("/auth", authRoutes);            // Google login
app.use("/api/users", userRoutes);       // Signup & Login
app.use("/api/notes", noteRoutes);       // Notes

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));
