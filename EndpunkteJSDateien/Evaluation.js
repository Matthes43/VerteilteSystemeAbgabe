import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Evaluation.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { Evaluation: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { Evaluation: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.evaluationen);
});

router.post("", async (req, res) => {
    await db.read();
    const newEvaluation = req.body;

    if (!newEvaluation.studentId || !newEvaluation.kurse) {
        return res.status(400).json({ message: "StudentId und Kurse sind erforderlich!" });
    }

    const newEntry = {
        id: db.data.evaluationen.length + 1,
        ...newEvaluation
    };

    db.data.evaluationen.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const evaluationId = parseInt(req.params.id);
    const itemToUpdate = db.data.evaluationen.findIndex(evaluation => evaluation.evaluationId === evaluationId);

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Evaluation nicht gefunden" });
    }

    db.data.Evaluation[itemToUpdate] = {
        ...db.data.evaluationen[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.evaluationen[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const evaluationId = parseInt(req.params.id);
    const initialLength = db.data.evaluationen.length;

    db.data.evaluationen = db.data.evaluationen.filter(evaluation => evaluation.evaluationId !== evaluationId);

    if (db.data.evaluationen.length === initialLength) {
        return res.status(404).json({ message: "Evaluation nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;