import express from "express"
import config from 'config'
import connectDb from "./utils/connect"
import router from "./routes"
import dotenv from "dotenv"
import desteralizeUser from "./middlewares/desteralizeUser"
dotenv.config();



const app = express()
const port = config.get<string>('port')


app.use(express.json())

app.use(desteralizeUser)

app.use(router)

app.listen(port,() => {
    console.log(`App is running on http://localhost:${port}`)
    connectDb();
})