import {DocumentType, getClassForDocument, getModelForClass, modelOptions, pre, prop, Severity} from "@typegoose/typegoose"
import { nanoid } from "nanoid";
import log from "../utils/logger";
import argon2 from 'argon2'

export const privateFields = [
    "password",
    "__v",
    "verificationCode",
    "passwordResetCode",
    "verified",
  ];

@pre<User>("save",async function (){
    try{

        if(!this.isModified('password')){
            return;
        }

        const hash = await argon2.hash(this.password);
        this.password = hash;

        return;

    }catch(err:any){
        log.error(err.message);
    }
})

@modelOptions({
    schemaOptions:{
        timestamps:true,
    },
    options:{
        allowMixed:Severity.ALLOW
    }
})
export class User{
    @prop({lowercase:true,required:true,unique:true})
    email : string;

    @prop({required:true})
    firstName : string;

    @prop({required:true})
    lastName : string;

    @prop({required:true})
    password:string;

    @prop({required:true,default:() => nanoid()})
    verificationCode : string;

    @prop()
    passwordResetCode: string | null;

    @prop({default:false})
    verify:boolean;

    async validatePassword(this : DocumentType<User>,candidatePassword : string){
        try{
            return await argon2.verify(this.password,candidatePassword)
        }catch(err:any){
            log.error(err.message)
            return false;
        }
    }
}


const userModel = getModelForClass(User)

export default userModel