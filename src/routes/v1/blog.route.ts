import express from "express";
const router = express.Router();

import { verifyJWT } from "../../middlewares/auth.middleware";
import { createBlog, fetchBlogById, updateBlog, fetchBlogs } from "../../controllers/blog.controller";
import { createComment, toggleLikeBlog } from "../../controllers/comment.controller";


router.route("/create").post(verifyJWT,createBlog);
router.route("/all").get(fetchBlogs);
router.route("/:blogId").patch(verifyJWT,updateBlog);
router.route("/:blogId").get(fetchBlogById);
router.route("/like/:blogId").patch(verifyJWT,toggleLikeBlog);
router.route("/comment").post(verifyJWT,createComment);
export default router;
