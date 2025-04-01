import express from "express";
import studentRoutes from "./EndpunkteJSDateien/Student.js";

const server = express();
server.use(express.json());

server.use("/studenten", studentRoutes);

server.listen(3000, () => {
    console.log("Server listening...");
})