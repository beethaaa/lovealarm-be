const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Love Alarm API",
      version: "1.0.0",
      description: "Backend API documentation",
    },
    servers: [
      {
        url: "http://localhost:3800",
        description: "Local server",
      },
    ],
  },
  apis: ["./routers/*.js", "./routers/api/*.js"], // nơi bạn viết API
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
