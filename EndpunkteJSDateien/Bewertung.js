import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Bewertung.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { bewertungen: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { bewertungen: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.bewertungen);
});

router.post("", async (req, res) => {
    await db.read();
    const senData = req.body;

    if (!senData.task) {
        return res.status(400).json({ message: "Task ist erforderlich!" });
    }

    const newAufgabe = {
        id: db.data.bewertungen.length + 1,
        task: senData.task,
        completed: false
    };

    db.data.bewertungen.push(newBewertung);
    await db.write();
    res.json(newBewertung);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const bewertungenID = parseInt(req.params.id);
    const itemToUpdate = db.data.bewertungen.findIndex(bewertung => bewertung.id === bewertungenID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Bewertung nicht gefunden" });
    }

    db.data.bewertungen[itemToUpdate] = { ...db.data.bewertungen[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.bewertungen[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const bewertungenID = parseInt(req.params.id);
    const initialLength = db.data.bewertungen.length;
    
    db.data.bewertungen = db.data.bewertungen.filter(bewertung => bewertung.id !== bewertungenID);

    if (db.data.bewertungen.length === initialLength) {
        return res.status(404).json({ message: "Bewertung nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;