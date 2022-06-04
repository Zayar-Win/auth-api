import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

const desteralizeUser = (req:Request,res:Response,next:NextFunction) => {
    const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/,"");

    const decoded = verifyJwt(accessToken,"accessTokenPublicKey");

    if(!decoded){
        return next();
    }

    res.locals.user = decoded;
    return next();
}

export default desteralizeUser;