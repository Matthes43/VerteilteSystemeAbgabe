import express from "express";
import studentRoutes from "./EndpunkteJSDateien/Student.js";
<<<<<<< Updated upstream
import dozentRoutes from "./EndpunkteJSDateien/Dozent.js";
import benutzerRoutes from "./EndpunkteJSDateien/Benutzer.js";
import systemadminRoutes from "./EndpunkteJSDateien/Systemadmin.js";
=======
import assignmentRoutes from "./EndpunkteJSDateien/Assignment.js";
import aufgabenRoutes from "./EndpunkteJSDateien/Aufgabe.js";
import bewertungenRoutes from "./EndpunkteJSDateien/Bewertung.js";
import klausurenRoutes from "./EndpunkteJSDateien/Klausur.js";
>>>>>>> Stashed changes

const server = express();
server.use(express.json());

server.use("/studenten", studentRoutes);
<<<<<<< Updated upstream
server.use("/dozenten", dozentRoutes);
server.use("/benutzer", benutzerRoutes);
server.use("/systemadmins", systemadminRoutes);
=======
server.use("/assignments", assignmentRoutes);
server.use("/aufgaben", aufgabenRoutes);
server.use("/bewertungen", bewertungenRoutes);
server.use("/klausuren", klausurenRoutes);
>>>>>>> Stashed changes

server.listen(3000, () => {
    console.log("Server listening...");
})