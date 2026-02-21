const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoHeaders: false,
});

const doc = {
  info: {
    title: "Love Alarm API",
    description: "Backend API documentation",
  },
  servers: [
    {
      url: "https://lovealarm-be.onrender.com",
      description: "Online server",
    },
    {
      url: "https://lovealarm-be.onrender.com",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"]; // Point to the entry file or route files

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
