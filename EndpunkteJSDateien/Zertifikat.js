import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Zertifikat.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { zertifikate: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { zertifikate: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.zertifikate);
});

router.post("", async (req, res) => {
    await db.read();
    const newZertifikat = req.body;

    if (!newZertifikat.kursId) {
        return res.status(400).json({ message: "KursId ist erforderlich!" });
    }

    const newEntry = {
        id: db.data.zertifikate.length + 1,
        ...newZertifikat
    };

    db.data.zertifikate.push(newEntry);
    await db.write();
    res.json(newEntry);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const zertifikatId = parseInt(req.params.id);
    const itemToUpdate = db.data.zertifikate.findIndex(zertifikat => zertifikat.id === zertifikatId);

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Zertifikat nicht gefunden" });
    }

    db.data.zertifikate[itemToUpdate] = {
        ...db.data.zertifikate[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.zertifikate[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const zertifikatId = parseInt(req.params.id);
    const initialLength = db.data.zertifikate.length;

    db.data.zertifikate = db.data.zertifikate.filter(zertifikate => zertifikate.id !== zertifikatId);

    if (db.data.zertifikate.length === initialLength) {
        return res.status(404).json({ message: "Zertifikat nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;