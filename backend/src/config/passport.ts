import dotenv from "dotenv";
dotenv.config(); // ✅ Ensure this is at the top and called first

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        email: profile.emails?.[0].value,
        name: profile.displayName,
      };
      return done(null, user);
    }
  )
);
