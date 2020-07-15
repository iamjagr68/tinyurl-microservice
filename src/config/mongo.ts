import mongoose from "mongoose";
import { mongodbUri } from "./index";

export async function initMongo() {
    return mongoose.connect(mongodbUri(), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        autoIndex: true,
        poolSize: 10,            // Maintain up to 10 socket connections
        bufferMaxEntries: 0,     // If not connected, return errors immediately rather than waiting for reconnect
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
    });
}