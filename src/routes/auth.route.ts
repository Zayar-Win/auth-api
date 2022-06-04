import express from "express"
import { createSessionHandler, refreshAccessTokenHandler } from "../controllers/auth.controller";
import validateResource from "../middlewares/validateResource";
import { sessionScheam } from "../schema/session.schema";

const router  = express.Router()


router.post("/api/sessions",validateResource(sessionScheam),createSessionHandler)

router.post("/api/sessions/refresh",refreshAccessTokenHandler)

export default router;
