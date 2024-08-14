import express from "express";
import authRoute from "./auth.route";
import blogRoute from "./blog.route";
import userRoute from "./user.route"
const router = express.Router();

/**
 * Endpoint: /api/v1
 */

router.use("/auth", authRoute);
router.use("/blog", blogRoute);
router.use("/user",userRoute);

router.get("/", (req, res) => {
    return res.status(200).send({
        uptime: process.uptime(),
        message: "CSX's API health check :: GOOD",
        timestamp: Date.now(),
    });
});

export default router;
