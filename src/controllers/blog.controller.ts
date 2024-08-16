import { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { Blog } from "../models/blog/blog.model";
import { ApiError } from "../util/apiError";
import { ResponseStatusCode } from "../constants/constants";
import { ApiResponse } from "../util/apiResponse";
import bigPromise from '../middlewares/bigPromise';

export const createBlog: RequestHandler = bigPromise(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req.user?._id;
        if (!userId) {
            throw new ApiError(ResponseStatusCode.UNAUTHORIZED, "User not found");
        }
        const {
            template,
            title,
            date,
            heroImage,
            content,
            embeddedImage,
            tags,
        } = req.body;

        if (!template || !title || !heroImage || !content) {
            throw new ApiError( ResponseStatusCode.BAD_REQUEST, "All fields are required");      
        }

        const blog = await Blog.create({
            userId,
            template,
            title,
            date,
            heroImage,
            content,
            embeddedImage,
            tags,
        });

        res.json(
            new ApiResponse(
              ResponseStatusCode.SUCCESS,
              blog,
              "Blog created successfully!"
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
});


export const updateBlog: RequestHandler = bigPromise(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const updateData = req.body;


        const blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true }).select('-createdAt -updatedAt -__v');

        if (!blog) {
            throw new ApiError(ResponseStatusCode.NOT_FOUND, "Blog Not Found" ); 
        }
        return res.json(
            new ApiResponse(
              ResponseStatusCode.SUCCESS,
              blog,
              "Blog updated successfully!"
            )
          );
      
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json(
          new ApiError(
            error.statusCode || ResponseStatusCode.INTERNAL_SERVER_ERROR,
            error.message || "An error occurred while updating the blog"
          )
        );
    }
});

export const fetchBlogs: RequestHandler = bigPromise(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;

      const skip = (page - 1) * limit;
      const blog = await Blog.find().select('-embeddedImage -comments -likedIds -createdAt -updatedAt -__v')
      .populate({
        path: 'userId',
        select: 'name profilePicture',
      })
      .limit(limit)
      .skip(skip);

      if (!blog) {
          throw new ApiError(ResponseStatusCode.NOT_FOUND, "Blog Not Found" ); 
      }

      return res.json(
          new ApiResponse( ResponseStatusCode.SUCCESS, blog, "Blog fetched successfully!")
        );

  } catch (error) {
      res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || ResponseStatusCode.INTERNAL_SERVER_ERROR,
          error.message || "An error occurred while fetching the blog"
        )
      );
  }
});

export const fetchBlogById: RequestHandler = bigPromise(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogId } = req.params;
        let recentBlogs;
        const blog = await Blog.findById(blogId)
        .select('-createdAt -updatedAt -__v')
        .populate({
          path: 'comments', 
          select: 'description userId',
          populate: {
            path: 'userId',
            select: 'name profilePicture'
          }
        });
        
        if (blog.template === 'simple') {
          await blog.populate({
            path: 'userId',
            select: 'name profilePicture bio',
          });
        } else if (blog.template === 'advanced') {
          await blog.populate({
            path: 'userId',
            select: 'name profilePicture bio socials', 
          });

          recentBlogs = await Blog.find().select('title template heroImage')
          .sort({date: -1,})
          .limit(3);           
        }
      

        if (!blog) {
            throw new ApiError(ResponseStatusCode.NOT_FOUND, "Blog Not Found" ); 
        }

        return res.json(
            new ApiResponse( ResponseStatusCode.SUCCESS, {blog,recentBlogs}, "Blog fetched successfully!")
          );

    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json(
          new ApiError(
            error.statusCode || ResponseStatusCode.INTERNAL_SERVER_ERROR,
            error.message || "An error occurred while fetching the blog"
          )
        );
    }
});
