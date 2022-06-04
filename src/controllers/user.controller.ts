import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { CreateUserInput, ForgetPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById } from "../services/user.service";
import log from "../utils/logger"
import { sendMail } from "../utils/mailer";

export const regiseterUserHandler = async(req:Request<{},{},CreateUserInput>,res:Response) => {
    try{

        const body = req.body;

        const user = await createUser(body);

        await sendMail({
            from:'zayarwinzayarwin582@gmail.com',
            to:user.email,
            subject:"Please verify your account",
            text : `Your verification code is ${user.verificationCode} and Your Id is ${user._id}`
        });

        return res.status(201).send(user)
        
    }catch(err:any){
        log.error(err.message);
        if(err.code === 11000) {
            return res.status(409).send('Account already exits.')
        }
        return res.status(500).send(err.message)
    }
}


export const verifyUserHandler = async (req:Request<VerifyUserInput>,res:Response) => {
    try{
        
        // find the user
        const id = req.params.id;
        const verificationcode = req.params.verificationcode;
        const user = await findUserById(id)
        if(!user) {
            return res.status(400).send("User not found.")
        }

        // check the user is verify or not 

        if(user.verify){
            return res.send(400).send("User already verify.")
        }

        // check with the verifycationcode with user send verification code 
        if(user.verificationCode === verificationcode){
            user.verify = true;
            await user.save();
            return res.status(200).send("User verify success.")
        }

        return res.status(400).send("Your verificationcode is not valid.")


    }catch(err:any){
        log.error(err.message);
        return res.status(500).send(err.message)
    }
}

export const forgetPasswordHandler = async (req:Request<{},{},ForgetPasswordInput>,res:Response) => {
    try{

        const {email} = req.body;
        const message = "If a user with this email is registered you will received a password reset email."

        //find user with email

        const user = await findUserByEmail(email)

        if(!user){
            return res.send(message)
        }

        //check user is verify or not 

        if(!user.verify){
            return res.status(400).send("You need to verify first.")
        }

        //if user is verify create password reset code and send to this email

        const resetPasswordCode = nanoid();

        user.passwordResetCode = resetPasswordCode;

        await user.save();

        await sendMail({
            to:user.email,
            from:"zayarwinzayarwin582@gmail.com",
            subject:"Reset your password",
            text:`Your password reset code is ${resetPasswordCode} and Id is ${user._id}`
        })

        return res.send(message)


    }catch(err:any){

        log.error(err.message)
        return res.status(500).send(err.message)

    }
}

export const resetPasswordHandler = async (req:Request<ResetPasswordInput['params'],{},ResetPasswordInput['body']>,res:Response) => {
    try{

        //find a user by id
        const id = req.params.id;
        const passwordResetCode = req.params.passwordResetCode;
        const password = req.body.password

        const user = await findUserById(id);

        //check user exit or password reset code is not null or passwordreset code is equal to user.passwordResetCode

        if(!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode){
            return res.status(400).send("Can't Password reset.")
        }

        user.passwordResetCode = null;

        user.password = password;

        await user.save()

        return res.status(201).send("Password reset success.")

    }catch(err:any){

        log.error(err.message);
        return res.status(500).send(err.message)

    }

}

export const getCurrentUserHandler =async (req:Request,res:Response) => {
    return res.status(200).send(res.locals.user)
}