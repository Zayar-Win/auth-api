import nodemailer, { SendMailOptions } from 'nodemailer';
import log from './logger';
import config from "config"

// const createTestCreds =async () => {
//     const creds =await nodemailer.createTestAccount();
//     log.info(creds);
// }

// createTestCreds();


const smtp = config.get<{
    user:string,
    pass : string,
    host:string,
    port:number,
    secure:boolean
}>('smtp')

const transporter = nodemailer.createTransport({
    ...smtp,
    auth:{user:smtp.user,pass:smtp.pass}
})


export const sendMail =async (payload:SendMailOptions) => {

    transporter.sendMail(payload,(err,info) => {
        if(err){
            log.error(err,"Send mail error");
            return ;
        }
        log.info(`Preview url is ${nodemailer.getTestMessageUrl(info)}`)
    })

}