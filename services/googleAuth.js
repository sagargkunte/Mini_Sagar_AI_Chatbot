import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from 'jsonwebtoken'
import { User } from "../models/user";


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALL_BACK_URL
},
async (accessToken,refreshToken,profile,done) => {
        try {
            const user = await User.find({email: profile[emails[0].value]});
            if(!user) {
                user = await User.create({
                    name:profile.displayName,
                    email: profile.emails[0].value,
                })
            }

            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email
            },{expiresIn: "1d"});

            return done(null,token);
        } catch(e) {
            return done(err,null);
        }
    }
))

export default passport;