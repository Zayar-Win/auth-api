import { Request,Response,NextFunction } from "express";
import { AnyZodObject } from "zod";
import log from "../utils/logger";

const validateResource = (schema : AnyZodObject) => (req:Request,res:Response,next:NextFunction) => {
    try{

        schema.parse({
            body:req.body,
            params:req.params,
            query:req.query
        })
        next();

    }catch(err:any){
        log.error(err.message);
        return res.status(401).send(err.message)
    }
}

export default validateResource;