import { NextFunction, Request, Response } from "express";
import httpContext from "express-http-context";
import { v4 as uuidv4 } from "uuid";
import logger from "../util/logger";

const generateRequestId = async (req: Request, res: Response, next: NextFunction) => {
    httpContext.set("requestId", uuidv4());
    return next();
};

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    const headers = JSON.stringify({}, null, 2);
    // const headers = JSON.stringify(req.headers, null, 2);
    logger.info(
        `${req.protocol.toUpperCase()}-${req.httpVersion} ${req.method} ${req.url}, ` +
            `headers: ${headers}, ` +
            `query: ${JSON.stringify(req.query, null, 2)}, ` +
            `params: ${JSON.stringify(req.params, null, 2)}, ` +
            `body: ${JSON.stringify(req.body, null, 2)}`
    );
    return next();
};

const logResponse = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        logger.info("Request completed.");
    });
    return next();
};

export { generateRequestId, logRequest, logResponse };
