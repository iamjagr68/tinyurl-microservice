const {
    NODE_ENV,
    HOST,
    PORT,
    LOG_DIR,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASS,
    MONGO_DB,
    HASH_SALT
} = process.env;

export const environment = NODE_ENV || "development";
export const host = HOST || "localhost";
export const port = PORT || "8080";
export const logDirectory = LOG_DIR || "logs";
export const mongoHost = MONGO_HOST || "localhost";
export const mongoPort = MONGO_PORT || "";
export const mongoUser = MONGO_USER || "";
export const mongoPass = MONGO_PASS || "";
export const mongoDb   = MONGO_DB || "izea";
export const hashSalt = HASH_SALT || "so savory";
export const mongodbUri = (includeEnvDb: boolean = true): string => {
    const protocol = "mongodb://";

    let auth = "";
    if (mongoUser && mongoPass) {
        auth = mongoUser+":"+mongoPass+"@";
    }

    let host = mongoHost;
    if (mongoPort) {
        host += ":"+mongoPort;
    }

    let database = "";
    if (includeEnvDb && mongoDb) {
        database = "/"+mongoDb;
    }

    return protocol + auth + host + database;
};