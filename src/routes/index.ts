import express, { Response } from "express"
import userRoutes from './user.route'
import authRoutes from "./auth.route"
const router = express.Router()

router.get("/healthcheck",(_,res:Response) => {
    res.send("App is running well")
})

router.use(userRoutes)
router.use(authRoutes)

export default router;