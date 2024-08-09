/* eslint-disable @typescript-eslint/ban-types */
class successApiResponse {
    constructor(message:string, statusCode: number = 200) {
        this.success;
        this.status = { code: statusCode, message: message };
        this.data = {};
        this.error = {};
    }
    success : unknown| {};
    data: unknown | {};
    error: unknown | {};
    status: unknown | {};
}

const sendSuccessApiResponse = (message:string, data: Record<string, any>, statusCode: number = 200) => {
    const newApiResponse = new successApiResponse(message, statusCode);
    newApiResponse.success = true;
    newApiResponse.data = data;
    return newApiResponse;
};

export { sendSuccessApiResponse, successApiResponse };
