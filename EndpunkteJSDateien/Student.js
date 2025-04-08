import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Student.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { studenten: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { studenten: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Studenten erstellen
createCRUDRoutes(router, db, "studenten");

export default router;