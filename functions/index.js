const path = require("path");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const databaseMiddleware = require("./middleware/databaseMiddleware");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
const connectMongoDb = require("./db/db");
const configureSocket = require("./utils/socket");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const functions = require("firebase-functions");
require("dotenv").config();

// Middleware
app.use(logger("dev"));

// Set up CORS for your Express app
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));

app.use(bodyParser.json());
app.use(databaseMiddleware);

// Create a Socket.IO server with CORS settings
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket connection
configureSocket(io);

// API Documentation
const openApiPath = "api-docs.yaml";
const readApiFile = fs.readFileSync(openApiPath, "utf8");
const swaggerDocs = yaml.parse(readApiFile);

// Import router
const indexRouter = require("./routes/indexRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const roomRouter = require("./routes/roomRoutes");
const participantRouter = require("./routes/participantRoutes");

// Use router
app.use("/", indexRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/participants", participantRouter);

// Check connection to the database
async function connectDatabase() {
  try {
    await connectMongoDb();
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
connectDatabase();

app.use(errorHandlerMiddleware);

// App listeners
const PORT = process.env.SERVER_PORT || 8080;
server.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

exports.week_17_avicena = functions.https.onRequest(app);
