import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Kurs.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { kurse: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { kurse: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Kurse erstellen
createCRUDRoutes(router, db, "kurse");

export default router;