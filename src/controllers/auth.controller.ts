import { User } from "../models/user/user.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "../util/apiError";
import { ResponseStatusCode } from "../constants/constants";
import { ApiResponse } from "../util/apiResponse";

dotenv.config();

export const isValidatedPassword = async function (
    usersendPassword: string,
    password: string
  ) {
    return await bcrypt.compare(usersendPassword, password);
  };
  

export const signup: RequestHandler = bigPromise(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            name,
            email,
            password,
            gender,
            termsCondations,
        }: {
            name: string;
            email: string;
            password: string;
            gender: string;
            termsCondations: boolean;
        } = req.body;

        if (!name || !email || !password) {
          throw new ApiError( ResponseStatusCode.BAD_REQUEST, "Name, Email and Password fields are required");      
        }


        const existingUser = await User.findOne({ email, status: 'active' });

        if (existingUser) {
          return res
          .status(400)
          .json(new ApiResponse(ResponseStatusCode.BAD_REQUEST, { message: "User already exist" }));
        }


        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, password:hashedPassword, gender, termsCondations });

        res.json(new ApiResponse(ResponseStatusCode.SUCCESS, user, "User Registered Successfully!"));
       
      } catch (error) {
        console.log(error);
        throw new ApiError(ResponseStatusCode.INTERNAL_SERVER_ERROR, error?.message || "Failure in User registration");
      }
});

export const refreshToken: RequestHandler = bigPromise(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        const message = "Unauthenticaded No Bearer";
        return next(createCustomError(message, 401));
    }

    let data: any;
    const token = authHeader.split(" ")[1];
    try {
        const payload: string | jwt.JwtPayload | any = jwt.verify(token, process.env.JWT_SECRET);
        console.log(payload);

        data = await getNewToken(payload);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            const payload: any = jwt.decode(token, { complete: true }).payload;
            data = await getNewToken(payload);

            if (!data) {
                const message = "Authentication failed invalid JWT";
                return next(createCustomError(message, 401));
            }
        } else {
            const message = "Authentication failed invalid JWT";
            return next(createCustomError(message, 401));
        }
    }

    res.status(200).json(sendSuccessApiResponse("Refresh Token Generated", data, 200));
});

const getNewToken = async (payload: any) => {
    const isUser = payload?.id ? true : false;
    console.log(isUser);

    let data: any;
    if (isUser) {
        const user: any = await User.findOne({ isActive: true, _id: payload.userId });
        if (user) {
            data = { token: user.generateJWT() };
        }
    }
    return data;
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(
        ResponseStatusCode.BAD_REQUEST, "Email and password are required");
    }

    const user = await User.findOne({ email }).select(
      "-createdAt -updatedAt -__v"
    );

    if (!user) {
      throw new ApiError(
        ResponseStatusCode.UNAUTHORIZED,  "Invalid email or password");
    }

    const isValidPassword = await isValidatedPassword(
      password,
      user.password.toString()
    );
    if (!isValidPassword) {
      throw new ApiError(
        ResponseStatusCode.UNAUTHORIZED, "Invalid email or password" );
    }

    const userDetails = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const payload = {
      userId: user?._id,
      email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.json(
      new ApiResponse(
        ResponseStatusCode.SUCCESS,{ token, userDetails },`${user.name} Logged In Successfully!`)
    );
  } catch (error) {
    next(
      new ApiError( ResponseStatusCode.INTERNAL_SERVER_ERROR, error.message || "Failure in User login"
      )
    );
  }
};

export const logout = bigPromise(async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return res.json(
      new ApiResponse(ResponseStatusCode.SUCCESS, "Logged Out Successfully")
    );
  } catch (error) {
    return res.json(
      new ApiResponse(
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        "Error in LogOut"
      )
    );
  }
});
