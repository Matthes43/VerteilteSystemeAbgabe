import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Kursmaterialien.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { kursmaterialien: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { kursmaterialien: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.kursmaterialien);
});

router.post("", async (req, res) => {
    await db.read();
    const newMaterial = req.body;

    if (!newMaterial.name || !newMaterial.typ || !newMaterial.kursId) {
        return res.status(400).json({ message: "Name, Typ und KursId sind erforderlich!" });
    }

    const newEntry = {
        id: db.data.kursmaterialien.length + 1,
        ...newMaterial,
        uploadDatum: new Date().toISOString()
    };

    db.data.kursmaterialien.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const materialId = parseInt(req.params.id);
    const itemToUpdate = db.data.kursmaterialien.findIndex(material => material.id === materialId);

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Kursmaterial nicht gefunden" });
    }

    db.data.kursmaterialien[itemToUpdate] = {
        ...db.data.kursmaterialien[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.kursmaterialien[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const materialId = parseInt(req.params.id);
    const initialLength = db.data.kursmaterialien.length;

    db.data.kursmaterialien = db.data.kursmaterialien.filter(material => material.id !== materialId);

    if (db.data.kursmaterialien.length === initialLength) {
        return res.status(404).json({ message: "Kursmaterial nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;