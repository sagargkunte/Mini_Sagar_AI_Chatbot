import { Router } from "express";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

const router = Router();

router.post('/login',async (req,res) => {
    console.log(req.body);
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        let hashedPass = user.password;
        const res = bcrypt.compare(password,hashedPass);
        if(!res) {
            res.send("Invalid Email or Password");
        }
        console.log(userDetails);
        return res.redirect('index');
    } catch (e) {
        console.log(e);
        res.status(400).send('Internal Server error!');
    }
})

router.get('/login',(req,res) => {
    res.render('login');
})

router.get('/signup',(req,res) => {
    res.render('signup');
})

router.post('/signup',async (req,res) => {
    const {fullName,email,password} = req.body;
    let salt  = bcrypt.genSalt(10);
    const hashPassword = bcrypt.hash(password,salt);
    await User.create({fullName,email,salt,hashPassword});
    res.cookie('user',JSON.stringify({email,fullName})).redirect('index');
})
export const userRouter = router;