import { validateToken } from "../services/authentication.js";

export function checkForAuthentication(cookieName) {
    return (req,res,next) => {
        if(!(req.cookies[cookieName])) {
            return res.redirect('/user/login');
        }
        // console.log('Hey you hitted a middleware');
        const cookie = req.cookies[cookieName];
        const payload = validateToken(cookie);
        console.log(payload);
        next();
    }
}