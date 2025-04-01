import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Einschreibung.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { einschreibungen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { einschreibungen: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.einschreibungen);
});

router.post("", async (req, res) => {
    await db.read();
    const newEinschreibung = req.body;

    if (!newEinschreibung.studentId || !newEinschreibung.kursId) {
        return res.status(400).json({ message: "StudentId und KursId sind erforderlich!" });
    }

    const newEntry = {
        id: db.data.einschreibungen.length + 1,
        ...newEinschreibung,
        eingeschriebenAm: new Date().toISOString()
    };

    db.data.einschreibungen.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const einschreibungID = parseInt(req.params.id);
    const itemToUpdate = db.data.einschreibungen.findIndex(einschreibung => einschreibung.id === einschreibungID);

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Einschreibung nicht gefunden" });
    }

    db.data.einschreibungen[itemToUpdate] = {
        ...db.data.einschreibungen[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.einschreibungen[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const einschreibungID = parseInt(req.params.id);
    const initialLength = db.data.einschreibungen.length;

    db.data.einschreibungen = db.data.einschreibungen.filter(einschreibung => einschreibung.einschreibungsId !== einschreibungID);

    if (db.data.einschreibungen.length === initialLength) {
        return res.status(404).json({ message: "Einschreibung nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;