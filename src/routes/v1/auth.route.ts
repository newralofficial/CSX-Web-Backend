import express from "express";
const router = express.Router();

// import controllers
import { signup, logout,login ,refreshToken } from "../../controllers/auth.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";


router.route("/refresh-token").get(refreshToken);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT,logout);

export default router;
