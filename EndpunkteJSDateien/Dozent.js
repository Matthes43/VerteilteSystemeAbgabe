import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Dozent.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { dozenten: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { dozenten: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.dozenten);
});

router.post("", async (req, res) => {
    await db.read();
    const senData = req.body;

    if (!senData.task) {
        return res.status(400).json({ message: "Task ist erforderlich!" });
    }

    const newDozent = {
        id: db.data.dozenten.length + 1,
        task: senData.task,
        completed: false
    };

    db.data.dozenten.push(newDozent);
    await db.write();
    res.json(newDozent);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const dozentID = parseInt(req.params.id);
    const itemToUpdate = db.data.dozenten.findIndex(dozent => dozent.dozentId === dozentID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Dozent nicht gefunden" });
    }

    db.data.dozenten[itemToUpdate] = { ...db.data.dozenten[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.dozenten[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const dozentID = parseInt(req.params.id);
    const initialLength = db.data.dozenten.length;
    
    db.data.dozenten = db.data.dozenten.filter(dozent => dozent.dozentId !== dozentID);

    if (db.data.dozenten.length === initialLength) {
        return res.status(404).json({ message: "Student nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;