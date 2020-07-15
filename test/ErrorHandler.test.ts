// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import express from "express";
import { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } from "http-status";
import { InternalError, BadRequestError, NotFoundError} from "../src/core/ApiError";
import errorHandler from "../src/middleware/ErrorHandler";

const app = express();
app.use(errorHandler);

describe("Error Handler", () => {
    let req: any;                // Mocked Express Request object.
    let res: any;                // Mocked Express Response object.
    const next: any = jest.fn(); // Mocked Express Next function.

    beforeEach(() => {
        req = {
            originalUrl: "https://notfound.org",
            params: {},
            body: {}
        };

        res = {
            req: req,
            data: null,
            code: null,
            status(status: any) {
                this.code = status;
                return this;
            },
            json(payload: any) {
                this.data = payload;
            },
            send(payload: any) {
                this.data = payload;
            }
        };

        next.mockClear();
    });

    describe("should handle BadRequestError", () => {
        it("should produce a 400", () => {
            errorHandler(new BadRequestError(), req, res, next);
            expect(res.code).toBeDefined();
            expect(res.code).toEqual(BAD_REQUEST);
            expect(res.data.message).toEqual("Bad Request");
        });
    });

    describe("should handle NotFoundError", () => {
        it("should produce a 404", () => {
            errorHandler(new NotFoundError(), req, res, next);
            expect(res.code).toBeDefined();
            expect(res.code).toEqual(NOT_FOUND);
            expect(res.data.message).toEqual("Not Found");
        });
    });

    describe("should handle InternalError", () => {
        it("should produce a 500", () => {
            errorHandler(new InternalError(), req, res, next);
            expect(res.code).toBeDefined();
            expect(res.code).toEqual(INTERNAL_SERVER_ERROR);
            expect(res.data.message).toEqual("Internal Error");
        });
    });

    describe("should handle Error", () => {
        it("should produce a 500", () => {
            errorHandler(new Error(), req, res, next);
            expect(res.code).toBeDefined();
            expect(res.code).toEqual(INTERNAL_SERVER_ERROR);
            expect(res.data.message).toEqual("Internal Error");
        });
    });
});