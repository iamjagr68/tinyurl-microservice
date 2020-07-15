import { Request, Response, NextFunction } from "express";
import { ApiError, InternalError } from "../core/ApiError";
import Logger from "../core/Logger";
import { environment } from "../config";

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApiError) {
        ApiError.handle(err, res);
    } else {
        if (environment === "development") {
            Logger.error(err);
            return res.status(500).send(err.message);
        }
        ApiError.handle(new InternalError(), res);
    }
}

export default errorHandler;