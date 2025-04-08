import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Vorlesung.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { vorlesungen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { vorlesungen: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Vorlesungen erstellen
createCRUDRoutes(router, db, "vorlesungen");

export default router;