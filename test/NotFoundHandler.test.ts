// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supertest from "supertest";
import { NOT_FOUND } from "http-status";
import app from "../src/app";

const request = supertest(app);

describe("The Not Found Handler", () => {
    describe("when sent an invalid route", () => {
        it("should throw a 404 BAD REQUEST", async done => {
            const res = await request.get("/non-existent-url");
            expect(res.status).toEqual(NOT_FOUND);
            expect(res.body.message).toEqual("Not Found");
            done();
        });
    });
});
