import jwt from "jsonwebtoken";
import { Router } from "express";

const router = Router();

router.get('/',(req,res) => {
    const guestPayload = {
        role: "guest"
    }
    const token = jwt.sign(
        guestPayload,
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    )

    res.cookie("user",token);

    return res.redirect('/');
});


export const skipRouter = router;