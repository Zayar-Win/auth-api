import { DocumentType } from "@typegoose/typegoose"
import jwt from "jsonwebtoken"
import { privateFields, User } from "../models/user.model"
import config from "config"
import sessionModel from "../models/session.model";
import { signJwt } from "../utils/jwt";
import { omit } from "lodash";


export const createSession = async ({userId} : {userId : string}) => {
    return await sessionModel.create({user : userId})
}

export const singRefreshToken =async ({userId} : {userId :string}) => {
    const session = await createSession({userId});

    const refreshToken = signJwt({session:session._id},"refreshTokenPrivateKey",{
        expiresIn : "1y"
    })

    return refreshToken;
}


export const singAccessToken = (user : DocumentType<User>) => {
    const payload = omit(user.toJSON(),privateFields)
    const accessToken = signJwt(payload,"accessTokenPrivateKey",{
        expiresIn: "15m"
    })

    return accessToken;
}



export const findSessionById = async (session : string) => {
    return await sessionModel.findById(session);
}


