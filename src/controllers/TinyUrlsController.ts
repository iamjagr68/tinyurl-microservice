"use strict";

import { Response, Request, NextFunction } from "express";
import { TinyUrl } from "../models/TinyUrl";
import { body, validationResult } from "express-validator";
import { SuccessResponse, BadRequestResponse, NotFoundResponse } from "../core/ApiResponse";

/**
 * GET /[a-zA-Z0-9]{9}
 * Follow TinyUrl to target url
 */
export const follow = async (req: Request, res: Response, next: NextFunction) => {
    // Parse url id from path
    const tinyUrlId = req.path.replace(/\//g, "");

    // Attempt to find TinyUrl and increment it's click count by 1
    const tinyUrl = await TinyUrl.findOneAndUpdate(
        { _id: tinyUrlId },
        { $inc: { clicks: 1 } }
    );

    // TinyUrl was found, route user to target_url
    if (tinyUrl) {
        return res.redirect(tinyUrl.target_url);
    }

    // TinyUrl not found so return 404
    return new NotFoundResponse().send(res);
};

/**
 * POST /tinyurls
 * Create a new TinyUrl
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
    // Validate request
    await body("target_url", "Target URL is not valid").isURL({
        protocols: ["http", "https"],
        require_protocol: true
    }).run(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const { msg } = errors.array()[0];
        return new BadRequestResponse(msg).send(res);
    }

    // Get target_url from request body
    const url = new TinyUrl({ target_url: req.body.target_url });

    // Attempt to save new tinyurl
    await url.save();
    return new SuccessResponse("TinyUrl Created", {
        id: url._id,
        tiny_url: url.tiny_url,
        target_url: url.target_url
    }).sendRaw(res);
};

/**
 * GET /tinyurls
 * List of TinyUrls
 */
export const getAll = async (req: Request, res: Response) => {
    const urls = await TinyUrl.find();
    return new SuccessResponse("", urls).sendRaw(res);
};

/**
 * GET /tinyurls/:id
 * Get a single TinyUrl
 */
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const url = await TinyUrl.findOne({ _id: id });

    if (url) {
        return new SuccessResponse("", url).sendRaw(res);
    }

    return new NotFoundResponse("TinyUrl Not Found").send(res);
};