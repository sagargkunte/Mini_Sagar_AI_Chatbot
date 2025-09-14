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

export const userRouter = router;