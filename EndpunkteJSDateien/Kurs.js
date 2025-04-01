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
    const kursData = req.body;

    if (!kursData.kursId || !kursData.modulId || !kursData.name || !kursData.startdatum || !kursData.enddatum || !kursData.schluessel || !kursData.status || kursData.anzahl === undefined) {
        return res.status(400).json({ message: "kursId, modulId, name, startdatum, enddatum, schluessel, status und anzahl sind erforderlich!" });
    }

    const newKurs = {
        kursId: kursData.kursId,
        modulId: kursData.modulId,
        name: kursData.name,
        startdatum: kursData.startdatum,
        enddatum: kursData.enddatum,
        schluessel: kursData.schluessel,
        status: kursData.status,
        anzahl: kursData.anzahl
    };

    db.data.kurse.push(newKurs);
    await db.write();
    res.json(newKurs);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const kursID = parseInt(req.params.id);
    const itemToUpdate = db.data.kurse.findIndex(kurs => kurs.id === kursID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Kurs nicht gefunden" });
    }

    db.data.kurse[itemToUpdate] = { ...db.data.kurse[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.kurse[itemToUpdate]);
    const kursId = parseInt(req.params.id);
    const kursToUpdate = db.data.kurse.findIndex(kurs => kurs.id === kursId);

    if (kursToUpdate === -1) {
        return res.status(404).json({ message: "Kurs nicht gefunden" });
    }

    db.data.kurse[kursToUpdate] = { ...db.data.kurse[kursToUpdate], ...req.body };
    await db.write();
    res.json(db.data.kurse[kursToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const kursID = parseInt(req.params.id);
    const initialLength = db.data.kurse.length;
    
    db.data.kurse = db.data.kurse.filter(kurs => kurs.kursId !== kursID);

    if (db.data.kurse.length === initialLength) {
        return res.status(404).json({ message: "Modul nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;