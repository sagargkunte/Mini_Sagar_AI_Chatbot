import { validateToken } from "../services/authentication.js";

export function checkForAuthentication(cookieName) {
    return (req,res,next) => {
        const publicRoute =  ["/user/login","/user/signup","/user/auth/google","/user/auth/google/callback"]
        if(publicRoute.includes(req.path)) {
            return next();
        }
        const cookie = req.cookies[cookieName];
        console.log("The cookie is ",cookie);
        if(!(cookie)) {
            console.log("Did not found cookie!");
            return res.redirect('/user/login');
        }
        // console.log('Hey you hitted a middleware');
        try {
            const payload = validateToken(cookie);
            req.user = payload;
            return next();
        } catch(e) {
            console.log("This is in middleware and this is excuted when error occurs")
            return res.redirect(`${process.env.CLIENT_URL}`)
        }
    }
}