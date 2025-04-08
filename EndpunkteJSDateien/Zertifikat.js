import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Zertifikat.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { zertifikate: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { zertifikate: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Zertifikate erstellen
createCRUDRoutes(router, db, "zertifikate");

export default router;