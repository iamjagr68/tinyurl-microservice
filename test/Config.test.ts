import {
    environment,
    host,
    port,
    logDirectory,
    mongoHost,
    mongoPort,
    mongoUser,
    mongoPass,
    mongoDb,
    hashSalt
} from "../src/config";

describe("The config file", () => {
    describe("should provide some default values", () => {
        expect(environment);
    });
});