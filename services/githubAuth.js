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
        let githubEmail = profile.emails?.[0]?.value;

        if (!githubEmail) {
          const gitRes = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
              Accept: "application/vnd.github+json",
            },
          });

          if (!gitRes.ok) {
            return done(new Error("Failed to fetch emails from GitHub"));
          }

          const emails = await gitRes.json();
          const primaryEmailObj = emails.find(
            (e) => e.primary && e.verified
          );

          if (!primaryEmailObj) {
            return done(new Error("No primary email found"));
          }

          githubEmail = primaryEmailObj.email;
        }

        let user = await User.findOne({ email: githubEmail });

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,
            email: githubEmail,
            login: "github",
            role: "user"
          });
        }


        const token = createTokenForUser(user);
        return done(null, token);

      } catch (error) {
        return done(error);
      }
    }
  )
);


export const githubPassport = passport;
