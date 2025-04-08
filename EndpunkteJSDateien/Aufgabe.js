import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Aufgabe.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { aufgaben: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { aufgaben: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Aufgaben erstellen
createCRUDRoutes(router, db, "aufgaben");

export default router;