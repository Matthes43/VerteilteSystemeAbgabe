import express from "express";
import studentRoutes from "./EndpunkteJSDateien/Student.js";
import dozentRoutes from "./EndpunkteJSDateien/Dozent.js";
import benutzerRoutes from "./EndpunkteJSDateien/Benutzer.js";
import systemadminRoutes from "./EndpunkteJSDateien/Systemadmin.js";

const server = express();
server.use(express.json());

server.use("/studenten", studentRoutes);
server.use("/dozenten", dozentRoutes);
server.use("/benutzer", benutzerRoutes);
server.use("/systemadmins", systemadminRoutes);

server.listen(3000, () => {
    console.log("Server listening...");
})