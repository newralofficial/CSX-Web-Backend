/* eslint-disable @typescript-eslint/ban-types */
class customAPIError extends Error {
    [x: string]: any;
    status: { code: number; success: boolean};
    isOperational: Boolean;
    path: any;
    value: any;

    constructor( message: string, statusCode: number = 500) {
        super(message);
        this.status = { code: statusCode, success:false};
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const createCustomError = (message: string,  statusCode: number = 500) => {
    return new customAPIError(message, statusCode);
};

export { customAPIError, createCustomError };
