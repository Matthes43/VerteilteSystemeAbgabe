import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Assignment.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { assignments: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { assignments: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Assignments erstellen
createCRUDRoutes(router, db, "assignments");

export default router;