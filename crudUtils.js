export function createCRUDRoutes(router, db, entityName) {
    // GET: Alle Einträge abrufen
    router.get("", async (req, res) => {
        await db.read();
        res.json(db.data[entityName]);
    });

    // GET: Ein Eintrag nach ID abrufen
    router.get("/:id", async (req, res) => {
        await db.read();
        const itemId = parseInt(req.params.id);
        const item = db.data[entityName].find(item => item.Id === itemId);

        if (!item) {
            return res.status(404).json({ message: `${entityName.slice(0, -1)} mit der ID ${itemId} nicht gefunden` });
        }

        res.json(item);
    });

    // POST: Einen neuen Eintrag hinzufügen
    router.post("", async (req, res) => {
        await db.read();
        const newItem = req.body;

        if (!newItem.Id) {
            newItem.Id = db.data[entityName].length + 1; // Automatische ID-Zuweisung
        }

        // Neues Objekt erstellen, um die Reihenfolge der Eigenschaften zu garantieren
        const orderedItem = { Id: newItem.Id, ...newItem };

        db.data[entityName].push(orderedItem);
        await db.write();
        res.status(201).json(orderedItem);
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