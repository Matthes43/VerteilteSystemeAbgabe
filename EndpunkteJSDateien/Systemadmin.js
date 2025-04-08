import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Systemadmin.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { systemadmins: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { systemadmins: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Systemadministratoren erstellen
createCRUDRoutes(router, db, "systemadmins");

export default router;