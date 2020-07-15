// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supertest from "supertest";
import * as Joi from "@hapi/joi";
import { NOT_FOUND, BAD_REQUEST, OK, FOUND } from "http-status";
import app from "../src/app";

const request = supertest(app);

import { TinyUrl } from "../src/models/TinyUrl";
import { setupDB } from "../test-setup";

setupDB("tinyurl_controller_test", true);

describe("The TinyUrl Controller", () => {
    describe("GET /[a-zA-Z0-9]{9}", () => {
        describe("if invalid hash is sent", () => {
            it("should return 404 NOT FOUND", async done => {
                const res = await request.get("/abcdefghi");
                expect(res.status).toEqual(NOT_FOUND);
                done();
            });
        });

        describe("if valid hash is sent", () => {
            it("should redirect to target_url", async done => {
                const tinyUrl = await TinyUrl.findOne({});
                expect(tinyUrl).toBeTruthy();

                const res = await request.get(`/${tinyUrl.id}`);
                expect(res.status).toEqual(FOUND);
                expect(res.header.location).toEqual(tinyUrl.target_url);

                done();
            });
        });
    });

    describe("POST /api/v1/tinyurls", () => {
        describe("if no target_url is sent", () => {
            it("should return 400 BAD REQUEST", async done => {
                const res = await request.post("/api/v1/tinyurls");
                expect(res.status).toEqual(BAD_REQUEST);
                done();
            });
        });

        describe("if an invalid target_url is sent", () => {
            it("should return 400 BAD REQUEST", async done => {
                const res = await request.post("/api/v1/tinyurls").send({ target_url: "bleh" });
                expect(res.status).toEqual(BAD_REQUEST);
                done();
            });
        });

        describe("if a valid target_url is sent", () => {
            it("should return 200 OK", async done => {
                const res = await request.post("/api/v1/tinyurls").send({ target_url: "https://auth0.com/" });
                expect(res.status).toEqual(OK);
                done();
            });

            it("should return expected response body", async done => {
                const schema = Joi.object({
                    id: Joi.string()
                        .alphanum()
                        .length(9)
                        .required(),

                    tiny_url: Joi.string()
                        .uri({
                            scheme: ["http","https"],
                            allowRelative: false,
                        })
                        .required(),

                    target_url: Joi.string()
                        .uri({
                            scheme: ["http","https","ftp"],
                            allowRelative: false,
                        })
                        .required()
                });
                const res = await request.post("/api/v1/tinyurls").send({ target_url: "https://auth1.com/" });
                const { error } = await schema.validateAsync(
                    res.body,
                    {
                        abortEarly: true,
                        allowUnknown: false
                    }
                );
                expect(error).toBeUndefined();
                done();
            });
        });
    });

    describe("GET /api/v1/tinyurls", () => {
        describe("when requesting", () => {
            it("should return 200 OK", async done => {
                const res = await request.get("/api/v1/tinyurls");
                expect(res.status).toEqual(OK);
                done();
            });

            it("should return expected response body", async done => {
                const schema = Joi.array().items(Joi.object({
                    id: Joi.string()
                        .alphanum()
                        .length(9)
                        .required(),

                    tiny_url: Joi.string()
                        .uri({
                            scheme: ["http","https"],
                            allowRelative: false,
                        }).required(),

                    target_url: Joi.string()
                        .uri({
                            scheme: ["http","https","ftp"],
                            allowRelative: false,
                        })
                        .required(),

                    clicks: Joi.number()
                        .integer()
                        .min(0)
                        .required(),

                    modified: Joi.date()
                        .required(),

                    created: Joi.date()
                        .required()
                }).required());
                const res = await request.get("/api/v1/tinyurls");
                const { error } = await schema.validateAsync(
                    res.body,
                    {
                        abortEarly: true,
                        allowUnknown: false
                    }
                );
                expect(error).toBeUndefined();
                done();
            });
        });
    });

    describe("GET /api/v1/tinyurls/:id", () => {
        describe("if passed a bad id", () => {
            it("should return 404 NOT_FOUND", async done => {
                const res = await request.get("/api/v1/tinyurls/xxxxxx");
                expect(res.status).toEqual(NOT_FOUND);
                done();
            });
        });

        describe("if passed a good id", () => {
            it ("should return 200 OK", async done => {
                const tinyUrl = await TinyUrl.findOne({});
                const res = await request.get(`/api/v1/tinyurls/${tinyUrl.id}`);
                expect(res.status).toEqual(OK);
                done();
            });

            it("should return expected response body", async done => {
                const tinyUrl = await TinyUrl.findOne({});
                const schema = Joi.object({
                    id: Joi.string()
                        .alphanum()
                        .length(9)
                        .required(),

                    tiny_url: Joi.string()
                        .uri({
                            scheme: ["http","https"],
                            allowRelative: false,
                        }).required(),

                    target_url: Joi.string()
                        .uri({
                            scheme: ["http","https","ftp"],
                            allowRelative: false,
                        })
                        .required(),

                    clicks: Joi.number()
                        .integer()
                        .min(0)
                        .required(),

                    modified: Joi.date()
                        .required(),

                    created: Joi.date()
                        .required()
                });
                const res = await request.get(`/api/v1/tinyurls/${tinyUrl.id}`);
                const { error } = await schema.validateAsync(
                    res.body,
                    {
                        abortEarly: true,
                        allowUnknown: false
                    }
                );
                expect(error).toBeUndefined();
                done();
            });
        });
    });
});