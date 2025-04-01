import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Modul.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { module: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { module: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.module);
});

router.post("", async (req, res) => {
    await db.read();
    const moduleData = req.body;

    if (!moduleData.modulId || !moduleData.name || moduleData.reihenfolge === undefined) {
        return res.status(400).json({ message: "modulId, name und reihenfolge sind erforderlich!" });
    }

    const newModul = {
        modulId: moduleData.modulId,
        name: moduleData.name,
        reihenfolge: moduleData.reihenfolge
    };

    db.data.module.push(newModul);
    await db.write();
    res.json(newModul);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const modulId = parseInt(req.params.id);
    const itemToUpdate = db.data.module.findIndex(modul => modul.modulId === modulId);

    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Modul nicht gefunden" });
    }

    db.data.module[itemToUpdate] = {
        ...db.data.module[itemToUpdate],
        ...req.body
    };
    await db.write();
    res.json(db.data.module[itemToUpdate]);
});


router.delete("/:id", async (req, res) => {
    await db.read();
    const modulID = parseInt(req.params.id);

    const initialLength = db.data.module.length;
    
    db.data.module = db.data.module.filter(modul => modul.modulId !== modulID);

    if (db.data.module.length === initialLength) {
        return res.status(404).json({ message: "Modul nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;