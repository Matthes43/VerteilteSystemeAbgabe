import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import express from "express";

const swaggerDocument = YAML.load("./openapi.yaml");

const router = express.Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;