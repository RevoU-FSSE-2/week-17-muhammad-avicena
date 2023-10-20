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
const socketIo = require("socket.io");

require("dotenv").config();

// WebClient from Public
// Monolith Website
// app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(logger("dev"));
app.use(cors({ origin: "*" }));

app.use(bodyParser.json());
app.use(databaseMiddleware);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});
configureSocket(io);

// APi Documentation
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

// Check connection to database
async function connectDatabase() {
  try {
    await connectMongoDb();
    console.log("Succesfully connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
connectDatabase();

app.use(errorHandlerMiddleware);

// App listeners
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

module.exports = app;
