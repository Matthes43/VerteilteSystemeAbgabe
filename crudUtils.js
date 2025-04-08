export function createCRUDRoutes(router, db, entityName) {
    // GET: Alle Einträge abrufen
    router.get("", async (req, res) => {
        await db.read();
        res.json(db.data[entityName]);
    });

    // POST: Einen neuen Eintrag hinzufügen
    router.post("", async (req, res) => {
        await db.read();
        const newItem = req.body;

        if (!newItem.Id) {
            newItem.Id = db.data[entityName].length + 1; // Automatische ID-Zuweisung
        }

        db.data[entityName].push(newItem);
        await db.write();
        res.status(201).json(newItem);
    });

    // PUT: Einen bestehenden Eintrag aktualisieren
    router.put("/:id", async (req, res) => {
        await db.read();
        const itemId = parseInt(req.params.id);
        const itemIndex = db.data[entityName].findIndex(item => item.Id === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: `${entityName.slice(0, -1)} nicht gefunden` });
        }

        db.data[entityName][itemIndex] = {
            ...db.data[entityName][itemIndex],
            ...req.body
        };
        await db.write();
        res.json(db.data[entityName][itemIndex]);
    });

    // DELETE: Einen Eintrag löschen
    router.delete("/:id", async (req, res) => {
        await db.read();
        const itemId = parseInt(req.params.id); 
        const initialLength = db.data[entityName].length;

        db.data[entityName] = db.data[entityName].filter(item => item.Id !== itemId);

        if (db.data[entityName].length === initialLength) {
            return res.status(404).json({ message: `${entityName.slice(0, -1)} nicht gefunden` });
        }

        await db.write();
        res.status(204).send();
    });
}