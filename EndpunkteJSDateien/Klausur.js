import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Klausur.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { klausuren: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { klausuren: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.klausuren);
});

router.post("", async (req, res) => {
    await db.read();
    const klausurData = req.body;

    if (!klausurData.klausurId || !klausurData.kursId || !klausurData.titel || !klausurData.dauer ) {
        return res.status(400).json({ message: "klausurId, kursId, titel und dauer sind erforderlich!" });
    }

    const newAssignment = {
        klausurId: klausurData.klausurId,
        kursId: klausurData.kursId,
        titel: klausurData.titel,
        dauer: klausurData.dauer,
    };

    db.data.klausuren.push(newKlausur);
    await db.write();
    res.json(newKlausur);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const klausurenID = parseInt(req.params.id);
    const itemToUpdate = db.data.klausuren.findIndex(klausur => klausur.id === KlausurID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Klausur nicht gefunden" });
    }

    db.data.klausuren[itemToUpdate] = { ...db.data.klausuren[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.klausuren[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const klausurenID = parseInt(req.params.id);
    const initialLength = db.data.klausuren.length;
    
    db.data.klausuren = db.data.klausuren.filter(klausur => klausur.klausurId !== klausurenID);

    if (db.data.klausuren.length === initialLength) {
        return res.status(404).json({ message: "Klausur nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;