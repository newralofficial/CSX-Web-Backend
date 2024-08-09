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

const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
};

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
            return next(createCustomError("Name, Email and Password fields are required", 400));
        }


        const existingUser = await User.findOne({ email, status: 'active' });

        if (existingUser) {
            return next(createCustomError("User Already exists", 400));
        }


        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, password:hashedPassword, gender, termsCondations });

        const response = sendSuccessApiResponse("User Registered Successfully!", user);
        return res.status(201).json(response);
       
      } catch (error) {
        console.log(error);
        next(createCustomError("An error occurred during signup", 500));
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

    // const isInfluencer = payload?.influencerId ? true : false;

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
        ResponseStatusCode.BAD_REQUEST,
        "Email and password are required"
      );
    }

    const user = await User.findOne({ email }).select(
      "-createdAt -updatedAt -__v"
    );

    if (!user) {
      throw new ApiError(
        ResponseStatusCode.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const isValidPassword = await isValidatedPassword(
      password,
      user.password.toString()
    );
    if (!isValidPassword) {
      throw new ApiError(
        ResponseStatusCode.UNAUTHORIZED,
        "Invalid email or password"
      );
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
        ResponseStatusCode.SUCCESS,
        { token, userDetails },
        `${user.name} Logged In Successfully!`
      )
    );
  } catch (error) {
    next(
      new ApiError(
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        error.message || "Failure in Admin login"
      )
    );
  }
};
// export const login: RequestHandler = bigPromise(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email, password }: { email: string; password: string } = req.body;

//         if (!(email && password)) {
//             return next(createCustomError("Email and Password fields are required", 400));
//         }

//         const userExists = await User.findOne({ email, status: 'active' }).select('+password');

//         if (userExists && await userExists.isValidatedPassword(password, userExists.password)) {
//             userExists.password = undefined;
//             const data = { token: userExists.getJwtToken(), userExists };
//             return res
//                 .cookie("token", data.token, options)
//                 .send(sendSuccessApiResponse("User LoggedIn Successfully!", data, 201));
//         } else {
//             return next(createCustomError("Incorrect Email or Password", 401));
//         }
//     } catch (error) {
//         console.log(error);
//         next(createCustomError("An error occurred during login", 500));
//     }
// });

export const logout = bigPromise(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    return res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});
