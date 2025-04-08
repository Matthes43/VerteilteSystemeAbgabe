import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Benachrichtigung.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { benachrichtigungen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { benachrichtigungen: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Benachrichtigungen erstellen
createCRUDRoutes(router, db, "benachrichtigungen");

export default router;