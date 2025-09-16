import { Router } from "express";

const router = Router();

router.post('/login',(req,res) => {
    const userDetails = req.body;
    console.log(userDetails);
    return res.send('Successfully registered!');
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