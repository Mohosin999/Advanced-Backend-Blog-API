require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const OpenApiValidator = require("express-openapi-validator");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
// Middleware for OpenAPI validation
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./swagger.yaml",
  })
);

app.use((req, _res, next) => {
  req.user = {
    id: "12345",
    name: "John Doe",
  };
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    health: "OK",
  });
});

// Database connection
let connectionURL = process.env.DB_CONNECTION_URL;
connectionURL = connectionURL.replace("<db_password>", process.env.DB_PASSWORD);

mongoose.connect(connectionURL).then(() => {
  console.log("Database Connected");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
