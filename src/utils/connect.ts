import mongoose, { ConnectOptions } from "mongoose"
import log from "./logger"
import config from 'config'
const connectDb =async () => {
    try{
        const dbUri = config.get<string>('dbUri')
        await mongoose.connect(dbUri,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        } as ConnectOptions)
        log.info("Connect success.")

    }catch(err:any){
        console.log(err.message)
    }
}

export default connectDb;