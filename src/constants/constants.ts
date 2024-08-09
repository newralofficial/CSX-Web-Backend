// Environments
export const PROD_ENVIRONMENT = ["prod", "PROD"];
export const DEV_ENVIRONMENT = ["dev", "DEV"];

// Pagination default values.
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

export const enum ResponseStatusCode{
    SUCCESS= 200,
    BAD_REQUEST= 400,
    UNAUTHORIZED= 401,
    FORBIDDEN= 403,
    NOT_FOUND= 404,
    INTERNAL_SERVER_ERROR= 500,
}
