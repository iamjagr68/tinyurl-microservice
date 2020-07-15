import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../core/ApiError";

function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    next(new NotFoundError());
}

export default notFoundHandler;