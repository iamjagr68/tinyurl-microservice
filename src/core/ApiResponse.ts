import { Response } from "express";
import {
    OK,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    NOT_FOUND
} from "http-status";

// Helper code for the API consumer to understand the error and handle is accordingly
enum StatusCode {
    SUCCESS = "10000",
    FAILURE = "10001",
}

abstract class ApiResponse {

    constructor(
        protected statusCode: StatusCode,
        protected status: number,
        protected message: string
    ) {}

    protected prepare<T extends ApiResponse>(res: Response, response: T): Response {
        return res.status(this.status).json(ApiResponse.sanitize(response));
    }

    public send(res: Response, onlyRawData: boolean = false): Response {
        return this.prepare<ApiResponse>(res, this);
    }

    private static sanitize<T extends ApiResponse>(response: T): T {
        const clone: T = {} as T;
        Object.assign(clone, response);
        // delete {some_field}
        delete clone.status;
        for (const i in clone) {
            if (typeof clone[i] === "undefined") delete clone[i];
        }
        return clone;
    }

}

export class NotFoundResponse extends ApiResponse {
    private url: string;

    constructor(message = "Not Found") {
        super(StatusCode.FAILURE, NOT_FOUND, message);
    }

    public send(res: Response, onlyRawData: boolean = false): Response {
        this.url = res.req.originalUrl;
        return super.prepare<NotFoundResponse>(res, this);
    }
}

export class BadRequestResponse extends ApiResponse {
    constructor(message = "Bad Parameters") {
        super(StatusCode.FAILURE, BAD_REQUEST, message);
    }
}

export class InternalErrorResponse extends ApiResponse {
    constructor(message = "Internal Error") {
        super(StatusCode.FAILURE, INTERNAL_SERVER_ERROR, message);
    }
}

export class SuccessMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.SUCCESS, OK, message);
    }
}

export class FailureMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.FAILURE, OK, message);
    }
}

export class SuccessResponse<T> extends ApiResponse {
    constructor(message: string, private data: T) {
        super(StatusCode.SUCCESS, OK, message);
    }

    public send(res: Response): Response {
        return super.prepare<SuccessResponse<T>>(res, this);
    }

    public sendRaw(res: Response): Response {
        return res.status(this.status).json(this.data);
    }
}