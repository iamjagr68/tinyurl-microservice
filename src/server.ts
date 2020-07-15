import "dotenv/config";
import Logger from "./core/Logger";
import app from "./app";
import { initMongo } from "./config/mongo";

// Connect to MongoDB
initMongo()
    .then(() => {
        return new Promise((res, rej) => {
            // Start Express server.
            app
                .listen(app.get("port"), () => {
                    Logger.info(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
                    Logger.info("Press CTRL-C to stop");
                    res();
                })
                .on("error", rej);
        });
    })
    .catch(Logger.error);