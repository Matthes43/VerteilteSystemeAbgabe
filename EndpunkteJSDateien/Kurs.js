import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Kurs.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { kurse: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { kurse: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.kurse);
});

router.post("", async (req, res) => {
    await db.read();
    const newKurs = req.body;

    if (!newKurs.name) {
        return res.status(400).json({ message: "Name ist erforderlich!" });
    }

    const newEntry = {
        id: db.data.kurse.length + 1,
        ...newKurs
    };

    db.data.kurse.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const kursId = parseInt(req.params.id);
    const kursToUpdate = db.data.kurse.findIndex(kurs => kurs.id === kursId);

    if (kursToUpdate === -1) {
        return res.status(404).json({ message: "Kurs nicht gefunden" });
    }

    db.data.kurse[kursToUpdate] = { ...db.data.kurse[kursToUpdate], ...req.body };
    await db.write();
    res.json(db.data.kurse[kursToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const kursId = parseInt(req.params.id);
    const initialLength = db.data.kurse.length;

    db.data.kurse = db.data.kurse.filter(kurs => kurs.id !== kursId);

    if (db.data.kurse.length === initialLength) {
        return res.status(404).json({ message: "Kurs nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;