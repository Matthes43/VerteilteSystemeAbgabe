import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Zertifikat.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { Zertifikat: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { Zertifikat: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.Zertifikat);
});

router.post("", async (req, res) => {
    await db.read();
    const newZertifikat = req.body;

    if (!newZertifikat.kursId) {
        return res.status(400).json({ message: "KursId ist erforderlich!" });
    }

    const newEntry = {
        id: db.data.Zertifikat.length + 1,
        ...newZertifikat
    };

    db.data.Zertifikat.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const zertifikatId = parseInt(req.params.id);
    const itemToUpdate = db.data.Zertifikat.findIndex(zertifikat => zertifikat.id === zertifikatId);

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Zertifikat nicht gefunden" });
    }

    db.data.Zertifikat[itemToUpdate] = {
        ...db.data.Zertifikat[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.Zertifikat[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const zertifikatId = parseInt(req.params.id);
    const initialLength = db.data.Zertifikat.length;

    db.data.Zertifikat = db.data.Zertifikat.filter(zertifikat => zertifikat.id !== zertifikatId);

    if (db.data.Zertifikat.length === initialLength) {
        return res.status(404).json({ message: "Zertifikat nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;