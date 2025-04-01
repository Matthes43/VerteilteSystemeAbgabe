import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Benutzer.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { benutzer: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { benutzer: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.benutzer);
});

router.post("", async (req, res) => {
    await db.read();
    const senData = req.body;

    if (!senData.task) {
        return res.status(400).json({ message: "Task ist erforderlich!" });
    }

    const newBenutzer = {
        id: db.data.studenten.length + 1,
        task: senData.task,
        completed: false
    };

    db.data.benutzer.push(newBenutzer);
    await db.write();
    res.json(newBenutzer);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const benutzerID = parseInt(req.params.id);
    const itemToUpdate = db.data.benutzer.findIndex(benutzer => benutzer.benutzerId === benutzerID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    db.data.benutzer[itemToUpdate] = { ...db.data.benutzer[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.benutzer[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const benutzerID = parseInt(req.params.id);
    const initialLength = db.data.benutzer.length;
    
    db.data.benutzer = db.data.benutzer.filter(benutzer => benutzer.benutzerId !== benutzerID);

    if (db.data.benutzer.length === initialLength) {
        return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;