import express from 'express'
import { forgetPasswordHandler, getCurrentUserHandler, regiseterUserHandler, resetPasswordHandler, verifyUserHandler } from '../controllers/user.controller';
import requireUser from '../middlewares/requireUser';
import validateResource from '../middlewares/validateResource';
import { CreateUserSchema, ForgetPasswordSchema, ResetPasswordSchema, VerifyUserSchema } from '../schema/user.schema';

const router = express.Router();

router.post("/api/users",validateResource(CreateUserSchema),regiseterUserHandler)

router.post("/api/users/verify/:id/:verificationcode",validateResource(VerifyUserSchema),verifyUserHandler)

router.post("/api/users/forgotpassword",validateResource(ForgetPasswordSchema),forgetPasswordHandler)

router.post("/api/users/resetPassword/:id/:passwordResetCode",validateResource(ResetPasswordSchema),resetPasswordHandler)

router.get("/api/users/me",requireUser,getCurrentUserHandler)

export default router;