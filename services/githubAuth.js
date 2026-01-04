import { Strategy as GithubStrategy } from "passport-github2";
import passport from "passport";
import { createTokenForUser } from "../services/authentication.js";
import { User } from "../models/user.js";
import { config } from "dotenv";
config();

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        }
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
        });

        const token = createTokenForUser(newUser);

        return done(null, token);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export const githubPassport =  passport;
