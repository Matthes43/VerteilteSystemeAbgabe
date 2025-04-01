import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Benachrichtigung.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { benachrichtigungen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { benachrichtigungen: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.benachrichtigungen);
});

router.post("", async (req, res) => {
    await db.read();
    const newBenachrichtigung = req.body;

    if (!newBenachrichtigung.titel || !newBenachrichtigung.nachricht) {
        return res.status(400).json({ message: "Titel und Nachricht sind erforderlich!" });
    }

    const newEntry = {
        id: db.data.benachrichtigungen.length + 1,
        titel: newBenachrichtigung.titel,
        nachricht: newBenachrichtigung.nachricht,
        datum: new Date().toISOString(),
        gelesen: false
    };

    db.data.benachrichtigungen.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const benachrichtigungId = parseInt(req.params.id);
    const itemToUpdate = db.data.benachrichtigungen.findIndex(
        benachrichtigung => benachrichtigung.benachrichtigungId === benachrichtigungId
    );

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Benachrichtigung nicht gefunden" });
    }

    db.data.benachrichtigungen[itemToUpdate] = {
        ...db.data.benachrichtigungen[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.benachrichtigungen[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const benachrichtigungId = parseInt(req.params.id);
    const initialLength = db.data.benachrichtigungen.length;

    db.data.benachrichtigungen = db.data.benachrichtigungen.filter(
        benachrichtigung => benachrichtigung.benachrichtigungId !== benachrichtigungId
    );

    if (db.data.benachrichtigungen.length === initialLength) {
        return res.status(404).json({ message: "Benachrichtigung nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;