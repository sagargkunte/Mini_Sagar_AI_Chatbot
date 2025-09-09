export function checkForAuthentication(cookieName) {
    return (req,res,next) => {
        const tokenValue = req.cookie[cookieName];
        if(!tokenValue) next();

        try {
            const userPayload = validateToke(tokenValue);

        } catch(e) {
            console.log(e);
        }
        next();
    }
}