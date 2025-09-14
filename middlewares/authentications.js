import { validateToken } from "../services/authentication.js";

export function checkForAuthentication(cookieName) {
    return (req,res,next) => {
        if(!(req.cookies[cookieName])) {
            return res.render('login');
        }
        // console.log('Hey you hitted a middleware');
        next();
    }
}