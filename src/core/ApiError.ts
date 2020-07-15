import { Response } from "express";
import { NotFoundResponse, BadRequestResponse, InternalErrorResponse } from "./ApiResponse";
import {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    NOT_FOUND
} from "http-status";
import { environment } from "../config";

export abstract class ApiError extends Error {

    constructor(public type: number = INTERNAL_SERVER_ERROR, public message: string = "error") {
        super(message);
    }

    public static handle(err: ApiError, res: Response): Response {
        switch (err.type) {
            case NOT_FOUND:
                return new NotFoundResponse(err.message).send(res);
            case BAD_REQUEST:
                return new BadRequestResponse(err.message).send(res);
            case INTERNAL_SERVER_ERROR:
                return new InternalErrorResponse(err.message).send(res);
            default:
                let message = err.message;
                // Do not send failure message in production as it may send sensitive data
                if (environment === "production") message = "Something went wrong.";
                return new InternalErrorResponse(message).send(res);
        }
    }
}

export class InternalError extends ApiError {
    constructor(message = "Internal Error") {
        super(INTERNAL_SERVER_ERROR, message);
    }
}

export class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(BAD_REQUEST, message);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(NOT_FOUND, message);
    }
}