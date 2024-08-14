import { Request, Response, NextFunction } from "express";
import { User } from "../models/user/user.model";
import { ApiError } from "../util/apiError";
import { ResponseStatusCode } from "../constants/constants";
import { ApiResponse } from "../util/apiResponse";
import bigPromise from "../middlewares/bigPromise";
import { uploadfileToS3 } from "../util/s3Client.util";

export const getUserById = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id ;

      if (!userId) {
        throw new ApiError(ResponseStatusCode.UNAUTHORIZED, "User not found");
      }

      const user = await User.findById(userId).select("-password -refreshToken -createdAt -updatedAt -__v");

      if (!user) {
        throw new ApiError(ResponseStatusCode.NOT_FOUND, "User does not exist");
      }

      res.json(
        new ApiResponse(
          ResponseStatusCode.SUCCESS,
          user,
          "User retrieved successfully"
        )
      );
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json(
          new ApiError(
            error.statusCode || ResponseStatusCode.INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
          )
        );
    }
  }
);

export const updateUserDetails = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        throw new ApiError(ResponseStatusCode.UNAUTHORIZED, "User not found");
      }

      const updatedData = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true,
      }).select("-password -refreshToken -createdAt -updatedAt -__v");

      if (!updatedUser) {
        throw new ApiError(ResponseStatusCode.NOT_FOUND, "User does not exist");
      }

      res.json(
        new ApiResponse(
          ResponseStatusCode.SUCCESS,
          updatedUser,
          "User updated successfully"
        )
      );
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json(
          new ApiError(
            error.statusCode || ResponseStatusCode.INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
          )
        );
    }
  }
);

export const uploadImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              ResponseStatusCode.BAD_REQUEST,
              null,
              "No file uploaded"
            )
          );
      }
      const { path } = req.query as { path: string };
      const accessUrl = await uploadfileToS3(req?.file, path);
  
      return res.json(
        new ApiResponse(
          ResponseStatusCode.SUCCESS,
          accessUrl,
          "Profile Pic Uploaded successfully"
        )
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new ApiError(
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        error.message || "Internal server error"
      );
    }
  };