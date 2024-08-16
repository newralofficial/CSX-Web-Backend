import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/comment/comment.model";
import { Blog } from "../models/blog/blog.model";
import { ApiError } from "../util/apiError";
import { ResponseStatusCode } from "../constants/constants";
import { ApiResponse } from "../util/apiResponse";
import bigPromise from "../middlewares/bigPromise";

export const createComment = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description, blogId } = req.body;
      const userId = req.user?._id;

      if (!description || !userId || !blogId) {
        throw new ApiError(
          ResponseStatusCode.BAD_REQUEST,
          "All fields (body, userId, blogId) are required"
        );
      }

      const comment = await Comment.create({ description, userId, blogId });
      await Blog.findByIdAndUpdate(blogId, {
        $push: { comments: comment._id },
      });

      res.json(
        new ApiResponse(
          ResponseStatusCode.SUCCESS,
          comment,
          "Comment created successfully!"
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

export const toggleLikeBlog = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const userId = req.user?._id;

      if (!blogId || !userId) {
        throw new ApiError(
          ResponseStatusCode.BAD_REQUEST,
          "Blog ID and User ID are required"
        );
      }
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new ApiError(ResponseStatusCode.NOT_FOUND, "Blog Not Found");
      }

      const hasLiked = blog.likedIds.includes(userId);
      console.log(hasLiked);

      if (hasLiked) {
        await Blog.findByIdAndUpdate(
          blogId,
          { $pull: { likedIds: userId } },
          { new: true }
        )
      }
      else {
        blog.likedIds.push(userId);
      }
      await blog.save();


      return res.json(
        new ApiResponse(
          ResponseStatusCode.SUCCESS,
          null,
          hasLiked ? 'Blog unliked successfully' : 'Blog liked successfully'
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
        )
    }
  }
);

// const blog = await Blog.findByIdAndUpdate(
//     blogId,
//     { $pull: { likedIds: userId } }, // $pull removes the userId from the array
//     { new: true }
// const blog = await Blog.findByIdAndUpdate(
//     blogId,
//     { $addToSet: { likedIds: userId } }, // $addToSet ensures no duplicate userId is added
//     { new: true }