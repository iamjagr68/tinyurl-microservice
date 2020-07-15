import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import helmet from "helmet";
import notFoundHandler from "./middleware/NotFoundHandler";
import errorHandler from "./middleware/ErrorHandler";
import { port } from "./config";

// Controllers (route handlers)
import * as tinyUrlsController from "./controllers/TinyUrlsController";

// Create Express server
const app = express();

// Express configuration
app.set("port", port);
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Primary app routes.
app.get("/[a-zA-Z0-9]{9}", tinyUrlsController.follow);

// API routes.
app.post("/api/v1/tinyurls", tinyUrlsController.create);
app.get("/api/v1/tinyurls", tinyUrlsController.getAll);
app.get("/api/v1/tinyurls/:id", tinyUrlsController.getOne);

// 404 handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

export default app;