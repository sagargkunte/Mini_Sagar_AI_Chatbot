import { validateToken } from "../services/authentication.js";

export function checkForAuthentication(cookieName) {
    return (req,res,next) => {
        const publicRoute = ["/user/login","/user/signup"];
        if(publicRoute.includes(req.path)) {
            return next();
        }
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