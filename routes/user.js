import { Router } from "express";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import {createTokenForUser} from '../services/authentication.js'
import passport from "../services/googleAuth.js";
import { config } from "dotenv";
config();

const router = Router();

router.post('/login',async (req,res) => {
    console.log(req.body);
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        let hashedPass = user.password;
        const result = await bcrypt.compare(password,hashedPass);
        console.log(result);
        if(!result) {
            return res.send("Invalid Email or Password");
        }
        // console.log(userDetails);
        // return res.status(200).json({ success: true, redirectUrl: "/sagar" });
        const token = createTokenForUser(user);
        res.cookie('user',token).redirect(`/`);

    } catch (e) {
        console.log(e);
        return res.status(400).send('Internal Server error!');
    }
})

router.get('/login',(req,res) => {
    res.render('login');
})

router.get('/signup',(req,res) => {
    res.render('signup');
})

router.post('/signup',async (req,res) => {
    console.log(req.body)
    const {name,email,password} = req.body;
    let salt  = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    console.log(name,email,password,hashPassword);
    try {
        const user = await User.create({name,email,password:hashPassword});
        console.log(user);
        res.cookie('user',createTokenForUser(user)).redirect('/');
    } catch(e) {
        console.log("Error while doing signup!");
    }
})


router.get("/auth/google",
    passport.authenticate("google",{scope: ["profile","email"],session:false})
)

router.get("/auth/google/callback",
    passport.authenticate("google",{session:false,failureRedirect:"user/login"}),
    (req,res) => {
        res.cookie("user",req.user, {httpOnly:true}).redirect("/");
    }
)
export const userRouter = router;