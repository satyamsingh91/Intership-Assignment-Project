import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    console.log("🔁 Google OAuth Callback Triggered");

    const user = req.user as { id: string; email: string };

    // Check if user is available
    if (!user) {
      console.log("❌ No user returned from Google");
      return res.redirect("http://localhost:5173/login");
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    console.log("✅ Google User:", user);
    console.log("🔐 Generated Token:", token);

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/welcome?token=${token}`);
  }
);

export default router;
