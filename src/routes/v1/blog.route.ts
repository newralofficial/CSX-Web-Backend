import express from "express";
const router = express.Router();

import { verifyJWT } from "../../middlewares/auth.middleware";
import { createBlog, fetchBlogById, updateBlog } from "../../controllers/blog.controller";


router.route("/create").post(verifyJWT,createBlog);
router.route("/:id").patch(verifyJWT,updateBlog);
router.route("/:id").get(verifyJWT,fetchBlogById);

export default router;
