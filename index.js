import express from "express";
import studentRoutes from "./EndpunkteJSDateien/Student.js";
import dozentRoutes from "./EndpunkteJSDateien/Dozent.js";
import benutzerRoutes from "./EndpunkteJSDateien/Benutzer.js";
import systemadminRoutes from "./EndpunkteJSDateien/Systemadmin.js";
import assignmentRoutes from "./EndpunkteJSDateien/Assignment.js";
import aufgabenRoutes from "./EndpunkteJSDateien/Aufgabe.js";
import bewertungenRoutes from "./EndpunkteJSDateien/Bewertung.js";
import klausurenRoutes from "./EndpunkteJSDateien/Klausur.js";
import modulRoutes from "./EndpunkteJSDateien/Modul.js";
import kursRoutes from "./EndpunkteJSDateien/Kurs.js";
import kursmaterialienRoutes from "./EndpunkteJSDateien/Kursmaterialien.js";
import evaluationRoutes from "./EndpunkteJSDateien/Evaluation.js";
import benachrichtigungRoutes from "./EndpunkteJSDateien/Benachrichtigung.js";
import zertifikatRoutes from "./EndpunkteJSDateien/Zertifikat.js";
import vorlesungRoutes from "./EndpunkteJSDateien/Vorlesung.js";
import modulRoutes from "./EndpunkteJSDateien/Modul.js";
import einschreibungRoutes from "./EndpunkteJSDateien/Einschreibung.js";

const server = express();
server.use(express.json());

server.use("/studenten", studentRoutes);
server.use("/dozenten", dozentRoutes);
server.use("/benutzer", benutzerRoutes);
server.use("/systemadmins", systemadminRoutes);
server.use("/assignments", assignmentRoutes);
server.use("/aufgaben", aufgabenRoutes);
server.use("/bewertungen", bewertungenRoutes);
server.use("/klausuren", klausurenRoutes);
server.use("/module", modulRoutes);
server.use("/kurse", kursRoutes);
server.use("/kursmaterialien", kursmaterialienRoutes);
server.use("/evaluationen", evaluationRoutes);
server.use("/benachrichtigungen", benachrichtigungRoutes);
server.use("/zertifikate", zertifikatRoutes);
server.use("/vorlesungen", vorlesungRoutes);
server.use("/module", modulRoutes);
server.use("/einschreibungen", einschreibungRoutes);

server.listen(3000, () => {
    console.log("Server listening...");
})