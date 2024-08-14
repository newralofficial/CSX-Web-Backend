import { ApiError } from "../util/apiError";
import { ApiResponse } from "../util/apiResponse";
import { ResponseStatusCode } from "../constants/constants";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
export const uploadFile = (fieldName: string) => upload.single(fieldName);

export const createS3Client = () => {
  return new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
};

export const bucketName = process.env.AWS_S3_BUCKET_NAME!;

export const uploadfileToS3 = async (
  file: Express.Multer.File,
  pathName: string
): Promise<string> => {
  if (!file) {
    throw new ApiResponse(
      ResponseStatusCode.BAD_REQUEST,
      null,
      "No file uploaded"
    );
  }

  const filename = `${Date.now()}-${file.originalname}`;
  const contentType = file.mimetype;
  const fileContent = file.buffer;

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: `uploads/${pathName}/${filename}`,
    Body: fileContent,
    ContentType: contentType,
    ACL: "public-read",
  });

  const s3Client: S3Client = createS3Client();
  await s3Client.send(putCommand);

  return `https://${bucketName}.s3.${process.env
    .AWS_REGION!}.amazonaws.com/uploads/${pathName}/${filename}`;
};

// export const uploadPrescriptionReportToS3 = async (file: Express.Multer.File): Promise<string> => {
//   if (!file) {
//     throw new ApiResponse(ResponseStatusCode.BAD_REQUEST, null, 'No file uploaded');
//   }

//   const filename = `${Date.now()}-${file.originalname}`;
//   const contentType = file.mimetype;
//   const fileContent = file.buffer;

//   const putCommand = new PutObjectCommand({
//     Bucket: bucketName,
//     Key: `uploads/prescription-report/${filename}`,
//     Body: fileContent,
//     ContentType: contentType,
//     ACL: 'public-read',
//   });

//   const s3Client: S3Client = createS3Client();
//   await s3Client.send(putCommand);

//   return `https://${bucketName}.s3.${process.env.AWS_REGION!}.amazonaws.com/uploads/prescription-report/${filename}`;
// };
