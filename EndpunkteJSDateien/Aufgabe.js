import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Aufgabe.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { aufgaben: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { aufgaben: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.aufgaben);
});

router.post("", async (req, res) => {
    await db.read();
    const senData = req.body;

    if (!senData.task) {
        return res.status(400).json({ message: "Task ist erforderlich!" });
    }

    const newAufgabe = {
        id: db.data.aufgaben.length + 1,
        task: senData.task,
        completed: false
    };

    db.data.assignments.push(newAufgabe);
    await db.write();
    res.json(newAufgabe);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const aufgabenID = parseInt(req.params.id);
    const itemToUpdate = db.data.aufgaben.findIndex(aufgabe => aufgabe.aufgabenId === aufgabenID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Aufgabe nicht gefunden" });
    }

    db.data.aufgaben[itemToUpdate] = { ...db.data.aufgaben[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.aufgaben[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const aufgabenID = parseInt(req.params.id);
    const initialLength = db.data.aufgaben.length;
    
    db.data.aufgaben = db.data.aufgaben.filter(aufgabe => aufgabe.aufgabenId !== aufgabenID);

    if (db.data.aufgaben.length === initialLength) {
        return res.status(404).json({ message: "Aufgabe nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;