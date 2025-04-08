import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Klausur.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { klausuren: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { klausuren: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Klausuren erstellen
createCRUDRoutes(router, db, "klausuren");

export default router;