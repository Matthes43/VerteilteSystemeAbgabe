import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Bewertung.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { bewertungen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { bewertungen: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Bewertungen erstellen
createCRUDRoutes(router, db, "bewertungen");

export default router;