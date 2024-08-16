import express from "express";
const router = express.Router();

import { verifyJWT } from "../../middlewares/auth.middleware";
import { createOrUpdateComment,toggleLikeBlog } from "../../controllers/comment.controller";


// router.route("/create").post(verifyJWT,createComment);

export default router;
