import { createLogger, transports, format } from "winston";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";
import { environment, logDirectory } from "../config";

// Create log directory if it isn't present
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create logger with
const Logger = createLogger({
    exceptionHandlers: [
        new DailyRotateFile({
            level: "warn",
            dirname: logDirectory,
            filename: "%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            handleExceptions: true,
            json: true,
            maxSize: "20m",
            maxFiles: "14d"
        })
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// Use Console for logging ONLY in development
if (environment === "development") {
    Logger.add(new transports.Console({
        level: "debug",
        handleExceptions: true,
        format: format.combine(
            format.errors({ stack: true }),
            format.simple()
        )
    }));
}

export default Logger;