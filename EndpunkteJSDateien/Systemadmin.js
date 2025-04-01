import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const filePath = "./Json_Entities/Systemadmin.json";

const router = express.Router();
const adapter = new JSONFile(filePath);
const db = new Low(adapter, { systemadmins: [] });

async function initDB() {
    await db.read();
    if (!db.data) {
        db.data = { systemadmins: [] };
    }
    await db.write();
}

await initDB();

router.get("", async (req, res) => {
    await db.read();
    res.json(db.data.systemadmins);
});

router.post("", async (req, res) => {
    await db.read();
    const senData = req.body;

    if (!senData.task) {
        return res.status(400).json({ message: "Task ist erforderlich!" });
    }

    const newSystemadmin = {
        id: db.data.systemadmins.length + 1,
        task: senData.task,
        completed: false
    };

    db.data.systemadmins.push(newSystemadmin);
    await db.write();
    res.json(newSystemadmin);
});

router.put("/:id", async (req, res) => {
    await db.read();
    const systemadminID = parseInt(req.params.id);
    const itemToUpdate = db.data.systemadmins.findIndex(systemadmin => systemadmin.id === systemadminID);
    
    if (itemToUpdate === -1) {
        return res.status(404).json({ message: "Systemadmin nicht gefunden" });
    }

    db.data.systemadmins[itemToUpdate] = { ...db.data.systemadmins[itemToUpdate], ...req.body };
    await db.write();
    res.json(db.data.systemadmins[itemToUpdate]);
});

router.delete("/:id", async (req, res) => {
    await db.read();
    const systemadminID = parseInt(req.params.id);
    const initialLength = db.data.systemadmins.length;
    
    db.data.systemadmins = db.data.systemadmins.filter(systemadmin => systemadmin.id !== systemadminID);

    if (db.data.systemadmins.length === initialLength) {
        return res.status(404).json({ message: "Systemadmin nicht gefunden" });
    }

    await db.write();
    res.status(204).send();
});

export default router;