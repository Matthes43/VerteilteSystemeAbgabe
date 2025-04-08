import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Einschreibung.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { einschreibungen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { einschreibungen: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Einschreibungen erstellen
createCRUDRoutes(router, db, "einschreibungen");

export default router;