import { Router } from "express";

const router = Router();

router.post('/login',(req,res) => {
    const {email,pass} = req.body;
    return;
})

router.get('/login',(req,res) => {
    res.render('login')
})

export const userRouter = router;