import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Vorlesung.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { vorlesungen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { vorlesungen: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.vorlesungen);
});

router.post("", async (req, res) => {
    await db.read();
    const newVorlesung = req.body;

    if (!newVorlesung.name || !newVorlesung.dozentId || !newVorlesung.kursId) {
        return res.status(400).json({ message: "Name, DozentId und KursId sind erforderlich!" });
    }

    const newEntry = {
        id: db.data.vorlesungen.length + 1,
        ...newVorlesung,
        erstelltAm: new Date().toISOString()
    };

    db.data.vorlesungen.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const vorlesungId = parseInt(req.params.id);
    const itemToUpdate = db.data.vorlesungen.findIndex(vorlesung => vorlesung.id === vorlesungId);

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Vorlesung nicht gefunden" });
    }

    db.data.vorlesungen[itemToUpdate] = {
        ...db.data.vorlesungen[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.vorlesungen[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const vorlesungId = parseInt(req.params.id);
    const initialLength = db.data.vorlesungen.length;

    db.data.vorlesungen = db.data.vorlesungen.filter(vorlesung => vorlesung.id !== vorlesungId);

    if (db.data.vorlesungen.length === initialLength) {
        return res.status(404).json({ message: "Vorlesung nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;