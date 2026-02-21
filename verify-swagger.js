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
        url: "https://lovealarm-be.onrender.com",
        description: "Online server",
      },
      {
        url: "http://localhost:3800",
        description: "Local server",
      },
    ],
  },
  // Ensure paths match what we set in swagger.config.js, but absolute or relative to where we run this script
  apis: ["./routers/*.js", "./routers/api/*.js"],
};

try {
  const spec = swaggerJsdoc(options);
  console.log("Swagger Spec generated successfully!");
  console.log("OpenAPI Version:", spec.openapi);
  console.log("Paths found:", Object.keys(spec.paths).length);
  console.log("Paths:", Object.keys(spec.paths));
} catch (error) {
  console.error("Error generating swagger spec:", error);
  process.exit(1);
}
