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
<<<<<<< HEAD
    const senData = req.body;

    if (!senData.task) {
        return res.status(400).json({ message: "Task ist erforderlich!" });
    }

    const newKurs = {
        id: db.data.kurse.length + 1,
        task: senData.task,
        completed: false
    };

    db.data.kurse.push(newKurs);
    await db.write();
    res.json(newKurs);
=======
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
>>>>>>> 6b3818270fb89ed6ddb79f18874265c6cbbfc8bd
});

router.put("/:id", async (req, res) => {
    await db.read();
<<<<<<< HEAD
    const kursID = parseInt(req.params.id);
    const itemToUpdate = db.data.kurse.findIndex(kurs => kurs.id === kursID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Kurs nicht gefunden" });
    }

    db.data.kurse[itemToUpdate] = { ...db.data.kurse[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.kurse[itemToUpdate]);
=======
    const kursId = parseInt(req.params.id);
    const kursToUpdate = db.data.kurse.findIndex(kurs => kurs.id === kursId);

    if (kursToUpdate === -1) {
        return res.status(404).json({ message: "Kurs nicht gefunden" });
    }

    db.data.kurse[kursToUpdate] = { ...db.data.kurse[kursToUpdate], ...req.body };
    await db.write();
    res.json(db.data.kurse[kursToUpdate]);
>>>>>>> 6b3818270fb89ed6ddb79f18874265c6cbbfc8bd
});

router.delete("/:id", async (req, res) => {
    await db.read();
<<<<<<< HEAD
    const kursID = parseInt(req.params.id);
    const initialLength = db.data.kurse.length;
    
    db.data.kurse = db.data.kurse.filter(kurs => kurs.id !== kursID);
=======
    const kursId = parseInt(req.params.id);
    const initialLength = db.data.kurse.length;

    db.data.kurse = db.data.kurse.filter(kurs => kurs.id !== kursId);
>>>>>>> 6b3818270fb89ed6ddb79f18874265c6cbbfc8bd

    if (db.data.kurse.length === initialLength) {
        return res.status(404).json({ message: "Kurs nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;