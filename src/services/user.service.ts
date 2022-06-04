import userModel, { User } from "../models/user.model";

export const createUser =async (input : Partial<User>) => {
    return await userModel.create(input);
}

export const findUserById = async(id : string) => {
    return await userModel.findById(id)
}

export const findUserByEmail = async (email :string) => {
    return await userModel.findOne({email});
}