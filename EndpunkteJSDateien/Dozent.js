import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Dozent.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { dozenten: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { dozenten: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Dozenten erstellen
createCRUDRoutes(router, db, "dozenten");

export default router;