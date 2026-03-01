const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const verifyJwt = require("./middlewares/authMiddleware");
const credentials = require("./middlewares/credentials");
const corOptions = require("./config/allowedOrigins");
const express = require("express");
const app = express();
require("dotenv").config();
const { initSocket } = require("./socket/socket.js");
const connectDB = require("./config/connectDB.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const PORT = 3800;
app.use(cors(corOptions));

// Connect database
connectDB();

const server = http.createServer(app);
initSocket(server);

app.use(credentials);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hello World 2!");
});
//no verify jwt
app.use("/auth", require("./routers/auth.route.js"));
app.use("/otp", require("./routers/otp.route.js"));

// verify jwt
app.use(verifyJwt);
app.use("/api/admin", require("./routers/api/admin.route.js"));
app.use("/api/ble-session", require("./routers/api/bleSession.route.js"));
app.use("/api/blocks", require("./routers/api/blockUser.route.js"));
app.use(
  "/api/suggest-friends",
  require("./routers/api/suggestFriend.route.js"),
);
app.use("/api/users", require("./routers/api/user.route.js"));
app.use("/api/couples", require("./routers/api/couple.route.js"));
app.use(
  "/api/couple-milestones",
  require("./routers/api/coupleMilestone.route.js"),
);
app.use("/api/challenges", require("./routers/api/challenge.router.js"));
app.use(
  "/api/suggest-friends",
  require("./routers/api/suggestFriend.route.js"),
);
app.use("/api/love-request", require("./routers/api/loveRequest.route.js"));
app.use("/api/statistics", require("./routers/api/statistic.route.js"));

app.use((req, res, next) => {
  res
    .status(404)
    .json({ message: `Method ${req.method} at ${req.url} is not supported!` });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
  console.log(`Swagger at http://localhost:${PORT}/api-docs`);
});
