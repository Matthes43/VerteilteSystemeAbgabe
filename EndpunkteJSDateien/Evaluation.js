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
    res.json(db.data.Evaluation);
});

router.post("", async (req, res) => {
    await db.read();
    const newEvaluation = req.body;

    if (!newEvaluation.studentId || !newEvaluation.kurse) {
        return res.status(400).json({ message: "StudentId und Kurse sind erforderlich!" });
    }

    const newEntry = {
        id: db.data.Evaluation.length + 1,
        ...newEvaluation
    };

    db.data.Evaluation.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const evaluationId = parseInt(req.params.id);
    const itemToUpdate = db.data.Evaluation.findIndex(evaluation => evaluation.id === evaluationId);

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Evaluation nicht gefunden" });
    }

    db.data.Evaluation[itemToUpdate] = {
        ...db.data.Evaluation[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.Evaluation[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const evaluationId = parseInt(req.params.id);
    const initialLength = db.data.Evaluation.length;

    db.data.Evaluation = db.data.Evaluation.filter(evaluation => evaluation.id !== evaluationId);

    if (db.data.Evaluation.length === initialLength) {
        return res.status(404).json({ message: "Evaluation nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;