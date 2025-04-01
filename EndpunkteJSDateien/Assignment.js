import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Assignment.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { assignments: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { assignments: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.assignments);
});

router.post("", async (req, res) => {
    await db.read();
    const senData = req.body;

    if (!senData.task) {
        return res.status(400).json({ message: "Task ist erforderlich!" });
    }

    const newAssignment = {
        id: db.data.assignments.length + 1,
        task: senData.task,
        completed: false
    };

    db.data.assignments.push(newAssignment);
    await db.write();
    res.json(newAssignment);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const assignmentID = parseInt(req.params.id);
    const itemToUpdate = db.data.assignments.findIndex(assignment => assignment.assignmentId === assignmentID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Assignment nicht gefunden" });
    }

    db.data.assignments[itemToUpdate] = { ...db.data.assignments[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.assignments[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const assignmentID = parseInt(req.params.id);
    const initialLength = db.data.assignments.length;
    
    db.data.assignments = db.data.assignments.filter(assignment => assignment.assignmentId !== assignmentID);

    if (db.data.assignments.length === initialLength) {
        return res.status(404).json({ message: "Assignment nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;