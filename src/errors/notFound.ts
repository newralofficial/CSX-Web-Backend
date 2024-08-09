import { NextFunction, Request, Response } from "express";
import { createCustomError } from "./customAPIError";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    // const notFoundError = new customAPIError(`Cannot find ${req.originalUrl} at this server`, 404);
    const notFoundError = createCustomError(`Cannot find ${req.originalUrl} at this server`, 404);
    return next(notFoundError);
};

export default notFound;
