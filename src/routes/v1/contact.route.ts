import express from "express";
const router = express.Router();

import { verifyJWT } from "../../middlewares/auth.middleware";
import { createContact } from "../../controllers/contact.controller";


router.route("/send").post(verifyJWT,createContact);

export default router;
