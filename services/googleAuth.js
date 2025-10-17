import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {createTokenForUser} from "../services/authentication.js"
// import jwt from 'jsonwebtoken'
import { User } from "../models/user.js";
import { config } from "dotenv";
config();


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALL_BACK_URL
},
async (accessToken,refreshToken,profile,done) => {
    // console.log(profile["emails"].value);
        try {
            let google_email = profile.emails[0].value;
            let user = await User.findOne({email: google_email});
            if(!user) {
                user = await User.create({
                    name:profile.displayName,
                    email: google_email,
                })
            }

            // const token = jwt.sign({
            //     id: user._id,
            //     name: user.name,
            //     email: user.email
            // },{expiresIn: "1d"});

            const token = createTokenForUser(user);

            return done(null,token);
        } catch(e) {
            return done(e,null);
        }
    }
))

export default passport;