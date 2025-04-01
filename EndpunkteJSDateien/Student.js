import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Student.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { studenten: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { studenten: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.studenten);
});

router.post("", async (req, res) => {
    await db.read();
    const senData = req.body;

    if (!senData.task) {
        return res.status(400).json({ message: "Task ist erforderlich!" });
    }

    const newStudent = {
        id: db.data.studenten.length + 1,
        task: senData.task,
    };

    db.data.studenten.push(newStudent);
    await db.write();
    res.json(newStudent);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const studentID = parseInt(req.params.id);
    const itemToUpdate = db.data.studenten.findIndex(student => student.id === studentID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Student nicht gefunden" });
    }

    db.data.studenten[itemToUpdate] = { ...db.data.studenten[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.studenten[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const studentID = parseInt(req.params.id);
    const initialLength = db.data.studenten.length;
    
    db.data.studenten = db.data.studenten.filter(student => student.studentId !== studentID);

    if (db.data.studenten.length === initialLength) {
        return res.status(404).json({ message: "Student nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;