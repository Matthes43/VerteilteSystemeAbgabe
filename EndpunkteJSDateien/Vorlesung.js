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
    const vorlesungData = req.body;

    if (!vorlesungData.vorlesungId || !vorlesungData.kursId || !vorlesungData.titel || !vorlesungData.inhalt || !vorlesungData.dauer) {
        return res.status(400).json({ message: "vorlesungId, kursId, titel, inhalt und dauer sind erforderlich!" });
    }

    const newVorlesung = {
        vorlesungId: vorlesungData.vorlesungId,
        kursId: vorlesungData.kursId,
        titel: vorlesungData.titel,
        inhalt: vorlesungData.inhalt,
        dauer: vorlesungData.dauer
    };

    db.data.vorlesungen.push(newVorlesung);
    await db.write();
    res.json(newVorlesung);
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

    db.data.vorlesungen = db.data.vorlesungen.filter(vorlesung => vorlesung.vorlesungId !== vorlesungId);

    if (db.data.vorlesungen.length === initialLength) {
        return res.status(404).json({ message: "Vorlesung nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;