import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { getUserById,updateUserDetails, uploadImage } from "../../controllers/user.controller";
import { uploadFile } from "../../util/s3Client.util";

const router = express.Router();

router.route("/me").get(verifyJWT,getUserById);
router.route("/update-user").patch(verifyJWT,updateUserDetails);
router.post('/uploadImage', uploadFile('uploadPicture'),verifyJWT,uploadImage);


export default router;
