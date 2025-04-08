import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Kursmaterialien.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { kursmaterialien: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { kursmaterialien: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Kursmaterialien erstellen
createCRUDRoutes(router, db, "kursmaterialien");

export default router;