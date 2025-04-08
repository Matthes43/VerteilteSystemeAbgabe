import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { createCRUDRoutes } from "../crudUtils.js";

const filePath = "./Json_Entities/Evaluation.json";
const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { evaluationen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { evaluationen: [] };
    }
    await db.write();
}

await initDB();

// CRUD-Routen für Evaluationen erstellen
createCRUDRoutes(router, db, "evaluationen");

export default router;