import mongoose from "mongoose";
import validator from "validator";
import Hashids from "hashids/cjs";
import { host, port, hashSalt } from "../config";

export type TinyUrlDocument = mongoose.Document & {
    _id: string,
    tiny_url: string,
    target_url: string,
    clicks: number
};

const tinyUrlSchema = new mongoose.Schema({
    _id: {
        type: String,
        match: /^[a-zA-Z0-9]{9}$/,
        required: true
    },
    target_url: {
        type: String,
        required: "Please supply a valid url",
        validate: [ validator.isURL, "Invalid URL" ]
    },
    clicks: {
        type: Number,
        min: 0,
        default: 0
    }
},{
    toJSON: {
        transform: (doc) => {
            return {
                id: doc._id,
                tiny_url: doc.tiny_url,
                target_url: doc.target_url,
                clicks: doc.clicks,
                modified: doc.modified,
                created: doc.created
            };
        }
    },
    toObject: {
        transform: (doc) => {
            return {
                id: doc._id,
                tiny_url: doc.tiny_url,
                target_url: doc.target_url,
                clicks: doc.clicks,
                modified: doc.modified,
                created: doc.created
            };
        }
    },
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    }
});

// Create a virtual property for the tiny_url
tinyUrlSchema.virtual("tiny_url").get(function() {
    const hostname = `${host}:${port}`.replace(/:80$/,"");
    return `http://${hostname}/${this._id}`;
});

// Generates an _id before validation if one isn't already set
tinyUrlSchema.pre("validate", function(next) {
    const tinyUrl = this as TinyUrlDocument;
    if (!tinyUrl._id) {
        const timestamp = Date.now();
        const hashIds = new Hashids(hashSalt + tinyUrl.target_url);
        tinyUrl._id = hashIds.encode(timestamp);
    }
    next();
});

export const TinyUrl = mongoose.model<TinyUrlDocument>("TinyUrl", tinyUrlSchema);