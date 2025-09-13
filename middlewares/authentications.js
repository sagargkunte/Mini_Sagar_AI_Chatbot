import { validateToken } from "../services/authentication.js";

export function checkForAuthentication(cookieName) {
    return (req,res,next) => {
        // const tokenValue = req.cookies[cookieName];
        // if(!tokenValue) next();

        // try {
        //     const userPayload = validateToken(tokenValue);
        //     next();

        // } catch(e) {
        //     console.log(e);
        // }
        console.log('Hey you hitted a middleware');
        next();
    }
}