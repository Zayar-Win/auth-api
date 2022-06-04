import {object,string,TypeOf} from "zod"


export const CreateUserSchema = object({
    body:object({
        firstName : string({
            required_error:"FirstName is required."
        }),
        lastName : string({
            required_error:"LastName is required."
        }),
        password : string({
            required_error:"Password is required."
        }).min(6,"Password should have at least 6 characters."),
        passwordConfirmation : string({
            required_error:"PasswordConfirmation is required."
        }),
        email : string({
            required_error:"Email is required."
        }).email("Not a valid email"),
    }).refine(data => data.password === data.passwordConfirmation,{
        message:"Password does't match.",
        path:["passwordConfirmation"]
    })
})

export const VerifyUserSchema = object({
    params : object({
        id:string({
            required_error:"Id is required."
        }),
        verificationcode: string({
            required_error:"Verificationcode is required."
        })
    })
})

export const ForgetPasswordSchema = object({
    body:object({
        email : string({
            required_error:"Email is required."
        }).email("Email is not valid.")
    })
})

export const ResetPasswordSchema = object({
    params:object({
        id:string({
            required_error:"Id is required",
        }),
        passwordResetCode:string({
            required_error:"PasswordResetCode is required."
        })
    }),
    body:object({
        password : string({
            required_error:"Password is required."
        }).min(6,"Password should have at least 6 characters."),
        passwordConfirmation : string({
            required_error:"PasswordConfirmation is required."
        }),
    }).refine(data => data.password === data.passwordConfirmation,{
        message:"Password do not match",
        path:["passwordConfirmation"]
    })
})

export type CreateUserInput = TypeOf<typeof CreateUserSchema>['body'];

export type VerifyUserInput = TypeOf<typeof VerifyUserSchema>['params']

export type ForgetPasswordInput = TypeOf<typeof ForgetPasswordSchema>['body'];

export type ResetPasswordInput = TypeOf<typeof ResetPasswordSchema>