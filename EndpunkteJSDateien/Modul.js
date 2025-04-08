import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Modul.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { module: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { module: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Module erstellen
createCRUDRoutes(router, db, "module");

export default router;