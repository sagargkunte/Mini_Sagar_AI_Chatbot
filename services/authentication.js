import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email
    }

    const token = jwt.sign(payload,secret);
    return token;
}


export function validateToken(token) {
    if(!token) {
        throw new Error('Invalid user');
    }

    const payload = jwt.verify(token,secret);
    return payload;
}