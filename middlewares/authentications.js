import { validateToken } from "../services/authentication";

export function checkForAuthentication(cookieName) {
    return (req,res,next) => {
        const tokenValue = req.cookie[cookieName];
        if(!tokenValue) next();

        try {
            const userPayload = validateToken(tokenValue);

        } catch(e) {
            console.log(e);
        }
        next();
    }
}