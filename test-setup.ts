// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mongoose from "mongoose";
import { seedDatabase } from "./seeds";
import { mongodbUri } from "./src/config";

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany({});
    }
}

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (err) {
            // Sometimes this error happens, but you can safely ignore it
            if (err.message === "ns not found") return;
            // This error occurs when you use it
            // You can safely ignore this error too
            if (err.message.includes("a background operation is currently running")) return;
            console.log(err.message);
        }
    }
}

async function dropDatabase() {
    try {
        await mongoose.connection.db.dropDatabase();
    } catch (err) {
        console.log(err.message);
    }
}

export function setupDB (databaseName: string, runSaveMiddleware: boolean = false) {
    // Connect to Mongoose
    beforeAll(async () => {
        const url = `${mongodbUri(false)}/${databaseName}`;
        await mongoose.connect(url, {
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
    });

    // Seed Data
    beforeEach(async () => {
        await seedDatabase(runSaveMiddleware);
    });

    // Cleans up database between each test
    afterEach(async () => {
        await removeAllCollections();
    });

    // Disconnect Mongoose
    afterAll(async () => {
        await dropAllCollections();
        await dropDatabase();
        await mongoose.connection.close();
    });
}