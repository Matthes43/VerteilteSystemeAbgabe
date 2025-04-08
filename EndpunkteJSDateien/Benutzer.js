import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Benutzer.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { benutzer: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { benutzer: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Benutzer erstellen
createCRUDRoutes(router, db, "benutzer");

export default router;