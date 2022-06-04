import {object,string,TypeOf} from "zod"

export const sessionScheam = object({
    body : object({
        email : string({
            required_error:"Email is required."
        }).email("Eamil or Password is invalid"),
        password : string({
            required_error:"Password is required."
        }).min(6,"Email or Password is invalid")
    })
})

export type CreateSessionInput = TypeOf<typeof sessionScheam>["body"]