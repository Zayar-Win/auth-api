import log from "../utils/logger"
import {Request,Response} from 'express'
import { CreateSessionInput } from "../schema/session.schema"
import { findUserByEmail, findUserById } from "../services/user.service";
import { findSessionById, singAccessToken, singRefreshToken } from "../services/auth.service";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt";
export const createSessionHandler = async(req:Request<{},{},CreateSessionInput>,res:Response) => {
    try{
        const message = "Eamil or Password is invalid";
        const {email,password} = req.body;
        const user = await findUserByEmail(email);
        if(!user) {
            return res.status(400).send(message)
        }

        if(!user.verify){
            return res.status(400).send("You should your account First.")
        }


        const isValid = user.validatePassword(password);

        if(!isValid) {
            return res.status(400).send("Email or Password is Invalid.")
        }

        //create accessToken
        const accessToken = singAccessToken(user)

        //create refreshToken
        const refreshToken = await singRefreshToken({userId : user._id})


        //return tokens
        return res.status(200).send({
            accessToken,
            refreshToken
        })

    }catch(err:any) {
        log.error(err.message)
        return res.status(500).send(err.message)
    } 
}

export const refreshAccessTokenHandler = async (req:Request,res:Response) => {
    try{
        const message = "Can't refresh access Token";
        const refreshToken = get(req,"headers.x-refresh");

        const decoded = await verifyJwt<{session:string}>(refreshToken,'refreshTokenPublicKey');

        if(!decoded){
            return res.status(400).send(message)
        }

        const session = await findSessionById(decoded.session)

        if(!session || !session.valid){
            return res.status(400).send(message)
        }

        const user =await findUserById(String(session.user));//ref object id type to string;

        if(!user){
            return res.status(400).send(message)
        }

        const accessToken = singAccessToken(user);

        return res.status(200).send({accessToken});

    }catch(err:any){
        log.error(err.message)
        return res.status(500).send(err.message)
    }
}