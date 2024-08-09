import express from "express";
import routerV1 from "./v1";

const router = express.Router();

router.get("/", (req, res) => {
    return res.status(200).send({
        uptime: process.uptime(),
        message: "Yash's API health check :: GOOD",
        timestamp: Date.now(),
    });
});

router.use("/api/v1", routerV1);

export default router;
