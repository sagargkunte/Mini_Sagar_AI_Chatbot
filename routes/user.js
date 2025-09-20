import { Router } from "express";
import { User } from "../models/user";

const router = Router();

router.post('/login',async (req,res) => {
    const {email,password} = req.body;
    const res = await User.findOne({email});
    if(!res) {
        res.send("Invalid Email or Password");
    }
    console.log(userDetails);
    return res.redirect('index');

})

router.get('/login',(req,res) => {
    res.render('login');
})

router.get('/signup',(req,res) => {
    res.render('signup');
})

router.post('/signup',(req,res) => {
    const userPayload = req.body;
    res.send('Successfully SignUp!');
})
export const userRouter = router;