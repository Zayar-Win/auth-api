import jwt from "jsonwebtoken"
import config from "config"

export const signJwt = (payload:Object,key : "accessTokenPrivateKey" | "refreshTokenPrivateKey",options?:jwt.SignOptions | undefined) => {
    const privateKey = Buffer.from(config.get<string>(key),"base64").toString("ascii")
    return jwt.sign(payload,privateKey,{
        ...(options && options),
        algorithm : "RS256"
    })
}

export const verifyJwt = <T>(token : string,key : "accessTokenPublicKey" | "refreshTokenPublicKey"):T | null => {
    
    const publickey = Buffer.from(config.get<string>(key),"base64").toString("ascii")

    try{
        const decoded = jwt.verify(token,publickey) as T;
        return decoded; 
    }catch(err:any) {
        return null;
    }

}